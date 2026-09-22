-- Moteur de déblocage de badges — évalue le catalogue contre l'état actuel de
-- l'utilisateur courant et débloque tout ce qui est nouvellement atteint.
-- Appelé côté client juste après complete_habit (pas dans la même transaction :
-- un round-trip de plus est négligeable à cette échelle, et ça garde
-- complete_habit simple).

-- Les colonnes de retour sont préfixées out_ : RETURNS TABLE crée des
-- variables du même nom dans tout le corps de la fonction, ce qui rendrait
-- "badge_id" ambigu avec la colonne badge_id des CTE ci-dessous sinon.
create or replace function public.check_and_unlock_badges()
returns table (out_badge_id uuid, out_key text, out_name text, out_description text, out_icon text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_new_ids uuid[] := '{}';
  v_ids uuid[];
begin
  with ins as (
    insert into user_badges (user_id, badge_id)
    select v_user_id, b.id
    from badges b
    where b.unlock_type = 'streak_reached'
      and exists (
        select 1 from habits h
        where h.user_id = v_user_id
          and h.current_streak >= coalesce((b.unlock_config ->> 'days')::int, 0)
      )
    on conflict (user_id, badge_id) do nothing
    returning badge_id
  )
  select array_agg(badge_id) into v_ids from ins;
  v_new_ids := v_new_ids || coalesce(v_ids, '{}');

  with ins as (
    insert into user_badges (user_id, badge_id)
    select v_user_id, b.id
    from badges b
    where b.unlock_type = 'total_completions'
      and (select count(*) from habit_logs hl where hl.user_id = v_user_id)
          >= coalesce((b.unlock_config ->> 'count')::int, 0)
    on conflict (user_id, badge_id) do nothing
    returning badge_id
  )
  select array_agg(badge_id) into v_ids from ins;
  v_new_ids := v_new_ids || coalesce(v_ids, '{}');

  with ins as (
    insert into user_badges (user_id, badge_id)
    select v_user_id, b.id
    from badges b
    where b.unlock_type = 'category_level'
      and exists (
        select 1 from categories c
        where c.user_id = v_user_id
          and c.level >= coalesce((b.unlock_config ->> 'level')::int, 0)
      )
    on conflict (user_id, badge_id) do nothing
    returning badge_id
  )
  select array_agg(badge_id) into v_ids from ins;
  v_new_ids := v_new_ids || coalesce(v_ids, '{}');

  with ins as (
    insert into user_badges (user_id, badge_id)
    select v_user_id, b.id
    from badges b
    where b.unlock_type = 'global_level'
      and (select level from profiles p where p.id = v_user_id)
          >= coalesce((b.unlock_config ->> 'level')::int, 0)
    on conflict (user_id, badge_id) do nothing
    returning badge_id
  )
  select array_agg(badge_id) into v_ids from ins;
  v_new_ids := v_new_ids || coalesce(v_ids, '{}');

  with ins as (
    insert into user_badges (user_id, badge_id)
    select v_user_id, b.id
    from badges b
    where b.unlock_type = 'category_count'
      and (
        select count(distinct h.category_id) from habits h
        where h.user_id = v_user_id and h.active
      ) >= coalesce((b.unlock_config ->> 'count')::int, 0)
    on conflict (user_id, badge_id) do nothing
    returning badge_id
  )
  select array_agg(badge_id) into v_ids from ins;
  v_new_ids := v_new_ids || coalesce(v_ids, '{}');

  return query
    select b.id, b.key, b.name, b.description, b.icon
    from badges b
    where b.id = any(v_new_ids);
end;
$$;

revoke all on function public.check_and_unlock_badges() from public, anon;
grant execute on function public.check_and_unlock_badges() to authenticated;
