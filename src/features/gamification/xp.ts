// Courbe XP/niveaux — DOIT rester identique à xp_for_level/level_from_xp
// dans supabase/migrations/0001_init_schema.sql (le calcul canonique se fait
// côté base, ce module sert à l'affichage optimiste côté client).

export const BASE_XP = 50
export const EXPONENT = 1.4

export function xpForLevel(level: number): number {
  return Math.round(BASE_XP * Math.pow(level, EXPONENT))
}

export interface LevelProgress {
  level: number
  xpIntoLevel: number
  xpForNextLevel: number
}

export function levelFromTotalXp(totalXp: number): LevelProgress {
  let level = 1
  let remaining = Math.max(totalXp, 0)

  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level)
    level += 1
  }

  return { level, xpIntoLevel: remaining, xpForNextLevel: xpForLevel(level) }
}

export interface HeroRank {
  threshold: number
  label: string
}

// Rang cosmétique dérivé du niveau, côté client uniquement (pas stocké en base).
export const HERO_RANKS: HeroRank[] = [
  { threshold: 1, label: 'Élève' },
  { threshold: 5, label: 'Héros en Formation' },
  { threshold: 10, label: 'Héros Pro' },
  { threshold: 20, label: 'Classe S' },
  { threshold: 30, label: 'Symbole de la Paix' },
]

export function heroRankForLevel(level: number): string {
  let rank = HERO_RANKS[0].label
  for (const entry of HERO_RANKS) {
    if (level >= entry.threshold) {
      rank = entry.label
    }
  }
  return rank
}
