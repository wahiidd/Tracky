-- Catalogue de badges — thème My Hero Academia léger.
-- icon = clé de sprite pixel art (à fournir dans src/assets/pixel), pas un chemin en dur.

insert into public.badges (key, name, description, icon, unlock_type, unlock_config, sort_order) values
  ('first_step', 'Premier Pas', 'Complète ta toute première habitude.', 'badge_first_step', 'total_completions', '{"count": 1}', 10),
  ('quick_habit', 'Premiers Réflexes', 'Atteins un streak de 3 sur une habitude.', 'badge_quick_habit', 'streak_reached', '{"days": 3}', 15),
  ('week_streak', 'Une Semaine de Discipline', 'Atteins un streak de 7 sur une habitude.', 'badge_week_streak', 'streak_reached', '{"days": 7}', 20),
  ('two_weeks', 'Deux Semaines de Rigueur', 'Atteins un streak de 14 sur une habitude.', 'badge_two_weeks', 'streak_reached', '{"days": 14}', 25),
  ('month_streak', 'Plus Ultra !', 'Atteins un streak de 30 sur une habitude.', 'badge_plus_ultra', 'streak_reached', '{"days": 30}', 30),
  ('half_century_streak', 'Endurance', 'Atteins un streak de 50 sur une habitude.', 'badge_endurance', 'streak_reached', '{"days": 50}', 35),
  ('hundred_days', 'Symbole de la Discipline', 'Atteins un streak de 100 sur une habitude.', 'badge_symbol', 'streak_reached', '{"days": 100}', 40),
  ('legend_streak', 'Légende Vivante', 'Atteins un streak de 200 sur une habitude.', 'badge_legend', 'streak_reached', '{"days": 200}', 45),
  ('getting_started', 'Sur la Bonne Voie', 'Complète 10 habitudes au total.', 'badge_getting_started', 'total_completions', '{"count": 10}', 50),
  ('quarter_century', '25 Victoires', 'Complète 25 habitudes au total.', 'badge_quarter_century', 'total_completions', '{"count": 25}', 55),
  ('hundred_wins', '100 Victoires', 'Complète 100 habitudes au total, tous temps confondus.', 'badge_hundred_wins', 'total_completions', '{"count": 100}', 60),
  ('veteran', 'Vétéran', 'Complète 500 habitudes au total.', 'badge_veteran', 'total_completions', '{"count": 500}', 65),
  ('trainee_hero', 'Héros en Formation', 'Atteins le niveau 5 sur ton profil.', 'badge_trainee', 'global_level', '{"level": 5}', 70),
  ('pro_hero', 'Héros Pro', 'Atteins le niveau 10 sur ton profil.', 'badge_pro_hero', 'global_level', '{"level": 10}', 75),
  ('class_s', 'Classe S', 'Atteins le niveau 20 sur ton profil.', 'badge_class_s', 'global_level', '{"level": 20}', 80),
  ('symbol_of_peace', 'Symbole de la Paix', 'Atteins le niveau 30 sur ton profil.', 'badge_symbol_of_peace', 'global_level', '{"level": 30}', 85),
  ('versatile', 'Polyvalent', 'Aie des habitudes actives dans au moins 3 catégories différentes.', 'badge_versatile', 'category_count', '{"count": 3}', 90),
  ('renaissance', 'Esprit Polyvalent', 'Aie des habitudes actives dans au moins 5 catégories différentes.', 'badge_renaissance', 'category_count', '{"count": 5}', 95),
  ('specialist', 'Spécialiste', 'Atteins le niveau 5 sur une catégorie.', 'badge_specialist', 'category_level', '{"level": 5}', 100),
  ('master_of_craft', 'Maître de la Discipline', 'Atteins le niveau 10 sur une catégorie.', 'badge_master_of_craft', 'category_level', '{"level": 10}', 105)
on conflict (key) do nothing;
