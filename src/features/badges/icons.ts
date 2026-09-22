import {
  Crown,
  Flame,
  Footprints,
  GraduationCap,
  Gem,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react'

// En attendant les vrais sprites pixel art (fournis plus tard), chaque badge
// est représenté par une icône lucide le temps que le set d'assets existe.
const BADGE_ICONS: Record<string, LucideIcon> = {
  first_step: Footprints,
  quick_habit: Flame,
  week_streak: Flame,
  two_weeks: Flame,
  month_streak: Flame,
  half_century_streak: Flame,
  hundred_days: Flame,
  legend_streak: Flame,
  getting_started: Target,
  quarter_century: Target,
  hundred_wins: Trophy,
  veteran: Crown,
  trainee_hero: GraduationCap,
  pro_hero: Shield,
  class_s: Star,
  symbol_of_peace: Sparkles,
  versatile: Users,
  renaissance: Users,
  specialist: Gem,
  master_of_craft: Gem,
}

export function iconForBadge(key: string): LucideIcon {
  return BADGE_ICONS[key] ?? Trophy
}
