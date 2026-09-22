import { describe, expect, it } from 'vitest'
import { heroRankForLevel, levelFromTotalXp, xpForLevel } from './xp'

describe('xpForLevel', () => {
  it('grows with level', () => {
    expect(xpForLevel(1)).toBe(50)
    expect(xpForLevel(2)).toBeGreaterThan(xpForLevel(1))
    expect(xpForLevel(10)).toBeGreaterThan(xpForLevel(5))
  })
})

describe('levelFromTotalXp', () => {
  it('starts at level 1 with 0 xp', () => {
    expect(levelFromTotalXp(0)).toEqual({ level: 1, xpIntoLevel: 0, xpForNextLevel: xpForLevel(1) })
  })

  it('never goes below level 1 for negative xp', () => {
    expect(levelFromTotalXp(-100).level).toBe(1)
  })

  it('advances a level once enough xp is earned', () => {
    const xpToClearLevel1 = xpForLevel(1)
    const result = levelFromTotalXp(xpToClearLevel1)
    expect(result.level).toBe(2)
    expect(result.xpIntoLevel).toBe(0)
  })

  it('accumulates partial progress within a level', () => {
    const result = levelFromTotalXp(30)
    expect(result.level).toBe(1)
    expect(result.xpIntoLevel).toBe(30)
  })
})

describe('heroRankForLevel', () => {
  it('maps low levels to Élève', () => {
    expect(heroRankForLevel(1)).toBe('Élève')
    expect(heroRankForLevel(4)).toBe('Élève')
  })

  it('maps higher levels to the right rank', () => {
    expect(heroRankForLevel(5)).toBe('Héros en Formation')
    expect(heroRankForLevel(10)).toBe('Héros Pro')
    expect(heroRankForLevel(20)).toBe('Classe S')
    expect(heroRankForLevel(30)).toBe('Symbole de la Paix')
    expect(heroRankForLevel(99)).toBe('Symbole de la Paix')
  })
})
