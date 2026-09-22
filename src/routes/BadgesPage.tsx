import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { Card } from '../components/Card'
import { Skeleton } from '../components/Skeleton'
import { iconForBadge } from '../features/badges/icons'
import { useBadges } from '../features/badges/useBadges'

export function BadgesPage() {
  const { badges, isLoading, error } = useBadges()
  const unlockedCount = badges.filter((b) => b.unlockedAt).length

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-semibold text-text-primary">Badges</h1>
        <p className="text-sm text-text-muted">
          {badges.length > 0 ? `${unlockedCount} / ${badges.length} débloqués` : 'Tes accomplissements.'}
        </p>
      </header>

      {isLoading && (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      )}

      {error && (
        <Card>
          <p className="text-sm text-danger">Impossible de charger les badges.</p>
        </Card>
      )}

      {!isLoading && badges.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge, index) => {
            const Icon = iconForBadge(badge.key)
            const unlocked = !!badge.unlockedAt
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                title={badge.description}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center ${
                  unlocked ? 'border-accent/30 bg-surface' : 'border-border bg-surface opacity-50'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    unlocked ? 'bg-accent/15 text-accent' : 'bg-surface-raised text-text-muted'
                  }`}
                >
                  {unlocked ? <Icon size={22} /> : <Lock size={18} />}
                </div>
                <p className={`text-xs font-medium leading-tight ${unlocked ? 'text-text-primary' : 'text-text-muted'}`}>
                  {badge.name}
                </p>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
