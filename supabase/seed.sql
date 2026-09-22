-- Catalogue de badges — thème My Hero Academia léger.
-- icon = clé de sprite pixel art (à fournir dans src/assets/pixel), pas un chemin en dur.

insert into public.badges (key, name, description, icon, unlock_type, unlock_config, sort_order) values
  ('first_step', 'Premier Pas', 'Complète ta toute première habitude.', 'badge_first_step', 'total_completions', '{"count": 1}', 10),
  ('week_streak', 'Une Semaine de Discipline', 'Atteins un streak de 7 sur une habitude.', 'badge_week_streak', 'streak_reached', '{"days": 7}', 20),
  ('month_streak', 'Plus Ultra !', 'Atteins un streak de 30 sur une habitude.', 'badge_plus_ultra', 'streak_reached', '{"days": 30}', 30),
  ('hundred_days', 'Symbole de la Discipline', 'Atteins un streak de 100 sur une habitude.', 'badge_symbol', 'streak_reached', '{"days": 100}', 40),
  ('trainee_hero', 'Héros en Formation', 'Atteins le niveau 5 sur ton profil.', 'badge_trainee', 'global_level', '{"level": 5}', 50),
  ('pro_hero', 'Héros Pro', 'Atteins le niveau 10 sur ton profil.', 'badge_pro_hero', 'global_level', '{"level": 10}', 60),
  ('class_s', 'Classe S', 'Atteins le niveau 20 sur ton profil.', 'badge_class_s', 'global_level', '{"level": 20}', 70),
  ('versatile', 'Polyvalent', 'Aie des habitudes actives dans au moins 3 catégories différentes.', 'badge_versatile', 'category_count', '{"count": 3}', 80),
  ('specialist', 'Spécialiste', 'Atteins le niveau 5 sur une catégorie.', 'badge_specialist', 'category_level', '{"level": 5}', 90),
  ('hundred_wins', '100 Victoires', 'Complète 100 habitudes au total, tous temps confondus.', 'badge_hundred_wins', 'total_completions', '{"count": 100}', 100)
on conflict (key) do nothing;
