import type { FrequencyConfig, FrequencyType } from '../../lib/supabase/types'

// 0=dimanche..6=samedi (JS Date.getDay(), même convention que la fonction SQL recalc_habit_streak).
export const WEEKDAY_CHIPS = [
  { label: 'Lun', value: 1 },
  { label: 'Mar', value: 2 },
  { label: 'Mer', value: 3 },
  { label: 'Jeu', value: 4 },
  { label: 'Ven', value: 5 },
  { label: 'Sam', value: 6 },
  { label: 'Dim', value: 0 },
] as const

export function isHabitDueToday(
  frequencyType: FrequencyType,
  config: FrequencyConfig,
  today: Date,
): boolean {
  if (frequencyType === 'daily') return true
  if (frequencyType === 'weekly_days') {
    const days = 'days' in config ? config.days : []
    return days.includes(today.getDay())
  }
  // weekly_count : toujours proposée, l'utilisateur choisit quel(s) jour(s) la faire.
  return true
}

export function frequencyLabel(frequencyType: FrequencyType, config: FrequencyConfig): string {
  if (frequencyType === 'daily') return 'Tous les jours'
  if (frequencyType === 'weekly_days') {
    const days = 'days' in config ? config.days : []
    const labels = WEEKDAY_CHIPS.filter((chip) => days.includes(chip.value)).map((chip) => chip.label)
    return labels.length ? labels.join(', ') : 'Aucun jour choisi'
  }
  const count = 'count' in config ? config.count : 1
  return `${count}x / semaine`
}
