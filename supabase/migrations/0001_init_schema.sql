-- Wido — schéma initial
-- Convention jours de semaine : 0=dimanche .. 6=samedi (comme JS Date.getDay() et Postgres EXTRACT(DOW)).

create extension if not exists pgcrypto;

-- =========================================================================
-- Tables
-- =========================================================================

create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text,
  xp_total      integer not null default 0,
  level         integer not null default 1,
  created_at    timestamptz not null default now()
);

create table public.categories (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  name         text not null,
  icon         text,
  color        text,
  xp_total     integer not null default 0,
  level        integer not null default 1,
  sort_order   integer not null default 0,
  archived     boolean not null default false,
  created_at   timestamptz not null default now(),
  unique (user_id, name)
);

create table public.habits (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users (id) on delete cascade,
  category_id        uuid not null references public.categories (id) on delete cascade,
  name               text not null,
  description        text,
  frequency_type     text not null check (frequency_type in ('daily', 'weekly_days', 'weekly_count')),
  -- weekly_days: {"days": [1,3,5]}  (0=dimanche..6=samedi)
  -- weekly_count: {"count": 3}
  frequency_config   jsonb not null default '{}'::jsonb,
  xp_value           integer not null default 10,
  active             boolean not null default true,
  archived_at        timestamptz,
  current_streak     integer not null default 0,
  longest_streak     integer not null default 0,
  last_completed_on  date,
  sort_order         integer not null default 0,
  created_at         timestamptz not null default now()
);

create table public.habit_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  habit_id      uuid not null references public.habits (id) on delete cascade,
  log_date      date not null,
  completed_at  timestamptz not null default now(),
  xp_earned     integer not null,
  unique (habit_id, log_date)
);

-- Catalogue partagé, non lié à un utilisateur — édité via migration/seed, pas d'UI d'admin en v1.
create table public.badges (
  id             uuid primary key default gen_random_uuid(),
  key            text not null unique,
  name           text not null,
  description    text not null,
  icon           text not null,
  unlock_type    text not null check (
    unlock_type in ('streak_reached', 'total_completions', 'category_level', 'global_level', 'category_count')
  ),
  unlock_config  jsonb not null default '{}'::jsonb,
  sort_order     integer not null default 0
);

create table public.user_badges (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  badge_id     uuid not null references public.badges (id) on delete cascade,
  unlocked_at  timestamptz not null default now(),
  unique (user_id, badge_id)
);

create index habits_user_id_idx on public.habits (user_id);
create index habits_category_id_idx on public.habits (category_id);
create index habit_logs_habit_id_idx on public.habit_logs (habit_id);
create index habit_logs_user_id_log_date_idx on public.habit_logs (user_id, log_date);
create index categories_user_id_idx on public.categories (user_id);
create index user_badges_user_id_idx on public.user_badges (user_id);

-- =========================================================================
-- Row Level Security — isolation simple par propriétaire.
-- Pas de sécurité renforcée demandée pour la v1 : une app personnelle où
-- l'unique utilisateur "malveillant" possible serait soi-même sur ses
-- propres données (ex: modifier son xp_total à la main) — non traité comme
-- un problème pour l'instant.
-- =========================================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
-- Pas de policy insert/delete : la ligne profile est créée par le trigger handle_new_user.

create policy "categories: owner full access" on public.categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "habits: owner full access" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- habit_logs : lecture seule côté client. Les écritures passent uniquement
-- par les fonctions complete_habit/uncomplete_habit (SECURITY DEFINER, donc
-- elles contournent RLS) pour garantir que XP/streaks restent cohérents.
create policy "habit_logs: read own" on public.habit_logs
  for select using (auth.uid() = user_id);

-- badges : catalogue en lecture pour tout utilisateur connecté.
create policy "badges: read all" on public.badges
  for select using (auth.role() = 'authenticated');

create policy "user_badges: read own" on public.user_badges
  for select using (auth.uid() = user_id);

-- =========================================================================
-- Création automatique du profil à l'inscription
-- =========================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- Courbe XP / Niveaux — DOIT rester identique à src/features/gamification/xp.ts
-- (BASE_XP = 50, EXPONENT = 1.4)
-- =========================================================================

create or replace function public.xp_for_level(p_level int)
returns int
language sql
immutable
as $$
  select round(50 * power(p_level, 1.4))::int;
$$;

create or replace function public.level_from_xp(p_total_xp int)
returns int
language plpgsql
immutable
as $$
declare
  v_level int := 1;
  v_remaining int := greatest(p_total_xp, 0);
begin
  while v_remaining >= public.xp_for_level(v_level) loop
    v_remaining := v_remaining - public.xp_for_level(v_level);
    v_level := v_level + 1;
    exit when v_level > 500; -- garde-fou, largement suffisant
  end loop;
  return v_level;
end;
$$;

-- =========================================================================
-- Recalcul de streak — appelé après chaque écriture sur habit_logs.
-- current_streak est dans l'unité naturelle de la cadence de l'habitude :
-- jours pour 'daily'/'weekly_days', semaines pour 'weekly_count'.
-- =========================================================================

create or replace function public.recalc_habit_streak(p_habit_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_freq_type text;
  v_config jsonb;
  v_current int := 0;
  v_longest int := 0;
  v_last date;
  v_last_scheduled_before_today date;
begin
  select frequency_type, frequency_config into v_freq_type, v_config
    from habits where id = p_habit_id;

  if v_freq_type is null then
    return;
  end if;

  if v_freq_type = 'daily' then
    with logs as (
      select log_date,
             (log_date - (row_number() over (order by log_date))::int) as grp
      from habit_logs
      where habit_id = p_habit_id
    ),
    runs as (
      select grp, max(log_date) as end_date, count(*) as len
      from logs
      group by grp
    )
    select
      coalesce((select max(len) from runs), 0),
      coalesce((select len from runs order by end_date desc limit 1), 0),
      (select end_date from runs order by end_date desc limit 1)
    into v_longest, v_current, v_last;

    if v_last is null or v_last < current_date - 1 then
      v_current := 0;
    end if;

  elsif v_freq_type = 'weekly_days' then
    with bounds as (
      select min(log_date) as min_date from habit_logs where habit_id = p_habit_id
    ),
    scheduled as (
      select gs::date as sched_date
      from bounds, generate_series(bounds.min_date, current_date, interval '1 day') as gs
      where bounds.min_date is not null
        and extract(dow from gs)::int = any (
          select jsonb_array_elements_text(coalesce(v_config -> 'days', '[]'::jsonb))::int
        )
    ),
    merged as (
      select s.sched_date,
             (l.log_date is not null) as done,
             row_number() over (order by s.sched_date) as rn
      from scheduled s
      left join habit_logs l on l.habit_id = p_habit_id and l.log_date = s.sched_date
    ),
    grouped as (
      select sched_date, done,
             rn - row_number() over (partition by done order by rn) as grp
      from merged
    ),
    runs as (
      select grp, max(sched_date) as end_date, count(*) as len
      from grouped
      where done
      group by grp
    )
    select
      coalesce((select max(len) from runs), 0),
      coalesce((select len from runs order by end_date desc limit 1), 0),
      (select end_date from runs order by end_date desc limit 1),
      (select max(sched_date) from scheduled where sched_date < current_date)
    into v_longest, v_current, v_last, v_last_scheduled_before_today;

    -- vivant si le dernier jour programmé *passé* (strictement avant aujourd'hui) a été fait ;
    -- le créneau du jour même, s'il n'est pas encore coché, ne casse pas le streak.
    if v_last is null or v_last < v_last_scheduled_before_today then
      v_current := 0;
    end if;

  elsif v_freq_type = 'weekly_count' then
    with bounds as (
      select date_trunc('week', min(log_date))::date as min_week
      from habit_logs where habit_id = p_habit_id
    ),
    weeks as (
      select gs::date as week_start
      from bounds, generate_series(bounds.min_week, date_trunc('week', current_date)::date, interval '7 days') as gs
      where bounds.min_week is not null
    ),
    counts as (
      select w.week_start, count(l.log_date) as done_count
      from weeks w
      left join habit_logs l
        on l.habit_id = p_habit_id
       and date_trunc('week', l.log_date)::date = w.week_start
      group by w.week_start
    ),
    evaluated as (
      select week_start,
             (done_count >= coalesce((v_config ->> 'count')::int, 1)) as met,
             row_number() over (order by week_start) as rn
      from counts
    ),
    grouped as (
      select week_start, met,
             rn - row_number() over (partition by met order by rn) as grp
      from evaluated
    ),
    runs as (
      select grp, max(week_start) as end_week, count(*) as len
      from grouped
      where met
      group by grp
    )
    select
      coalesce((select max(len) from runs), 0),
      coalesce((select len from runs order by end_week desc limit 1), 0),
      (select end_week from runs order by end_week desc limit 1)
    into v_longest, v_current, v_last;

    -- vivant si la dernière semaine réussie est la semaine en cours ou la dernière semaine
    -- complète ; cassé s'il y a une semaine complète manquée entre les deux.
    if v_last is null or v_last < (date_trunc('week', current_date)::date - interval '7 days')::date then
      v_current := 0;
    end if;
  end if;

  update habits
     set current_streak = v_current,
         longest_streak = greatest(longest_streak, v_longest),
         last_completed_on = (select max(log_date) from habit_logs where habit_id = p_habit_id)
   where id = p_habit_id;
end;
$$;

revoke all on function public.recalc_habit_streak(uuid) from public, anon, authenticated;

-- =========================================================================
-- complete_habit / uncomplete_habit — seul chemin d'écriture pour les logs,
-- garantit que log + streak + XP catégorie + XP profil restent cohérents
-- quel que soit l'appareil qui déclenche l'action.
-- =========================================================================

create or replace function public.complete_habit(p_habit_id uuid, p_log_date date)
returns table (
  out_habit_id uuid,
  out_current_streak int,
  out_longest_streak int,
  out_category_id uuid,
  out_category_xp_total int,
  out_category_level int,
  out_profile_xp_total int,
  out_profile_level int,
  out_already_completed boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_category_id uuid;
  v_xp_value int;
  v_was_inserted boolean;
begin
  select h.category_id, h.xp_value into v_category_id, v_xp_value
    from habits h
   where h.id = p_habit_id and h.user_id = v_user_id;

  if not found then
    raise exception 'Habit % introuvable pour cet utilisateur', p_habit_id;
  end if;

  insert into habit_logs (user_id, habit_id, log_date, xp_earned)
  values (v_user_id, p_habit_id, p_log_date, v_xp_value)
  on conflict (habit_id, log_date) do nothing;

  v_was_inserted := found;

  if v_was_inserted then
    update categories
       set xp_total = xp_total + v_xp_value,
           level = public.level_from_xp(xp_total + v_xp_value)
     where id = v_category_id;

    update profiles
       set xp_total = xp_total + v_xp_value,
           level = public.level_from_xp(xp_total + v_xp_value)
     where id = v_user_id;
  end if;

  perform public.recalc_habit_streak(p_habit_id);

  return query
    select h.id, h.current_streak, h.longest_streak, h.category_id,
           c.xp_total, c.level, p.xp_total, p.level, (not v_was_inserted)
      from habits h
      join categories c on c.id = h.category_id
      join profiles p on p.id = h.user_id
     where h.id = p_habit_id;
end;
$$;

create or replace function public.uncomplete_habit(p_habit_id uuid, p_log_date date)
returns table (
  out_habit_id uuid,
  out_current_streak int,
  out_longest_streak int,
  out_category_id uuid,
  out_category_xp_total int,
  out_category_level int,
  out_profile_xp_total int,
  out_profile_level int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_category_id uuid;
  v_xp_earned int;
begin
  select h.category_id into v_category_id
    from habits h
   where h.id = p_habit_id and h.user_id = v_user_id;

  if not found then
    raise exception 'Habit % introuvable pour cet utilisateur', p_habit_id;
  end if;

  delete from habit_logs
   where habit_id = p_habit_id and log_date = p_log_date and user_id = v_user_id
  returning xp_earned into v_xp_earned;

  if v_xp_earned is not null then
    update categories
       set xp_total = greatest(0, xp_total - v_xp_earned),
           level = public.level_from_xp(greatest(0, xp_total - v_xp_earned))
     where id = v_category_id;

    update profiles
       set xp_total = greatest(0, xp_total - v_xp_earned),
           level = public.level_from_xp(greatest(0, xp_total - v_xp_earned))
     where id = v_user_id;
  end if;

  perform public.recalc_habit_streak(p_habit_id);

  return query
    select h.id, h.current_streak, h.longest_streak, h.category_id,
           c.xp_total, c.level, p.xp_total, p.level
      from habits h
      join categories c on c.id = h.category_id
      join profiles p on p.id = h.user_id
     where h.id = p_habit_id;
end;
$$;

revoke all on function public.complete_habit(uuid, date) from public, anon;
grant execute on function public.complete_habit(uuid, date) to authenticated;

revoke all on function public.uncomplete_habit(uuid, date) from public, anon;
grant execute on function public.uncomplete_habit(uuid, date) to authenticated;
