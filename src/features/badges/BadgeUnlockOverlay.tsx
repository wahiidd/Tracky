import { AnimatePresence, motion } from 'framer-motion'
import { fadeFast, springPop, springSnappy } from '../../lib/motion'
import { iconForBadge } from './icons'

export interface UnlockedBadge {
  badge_id: string
  key: string
  name: string
  description: string
  icon: string
}

interface BadgeUnlockOverlayProps {
  badge: UnlockedBadge | null
  onDismiss: () => void
}

export function BadgeUnlockOverlay({ badge, onDismiss }: BadgeUnlockOverlayProps) {
  const Icon = iconForBadge(badge?.key ?? '')

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/70 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: fadeFast }}
          transition={fadeFast}
          onClick={onDismiss}
        >
          <motion.div
            className="flex max-w-xs flex-col items-center gap-3 rounded-2xl border border-accent/40 bg-surface p-8 text-center"
            initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, transition: fadeFast }}
            transition={springPop}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, ...springSnappy }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 text-accent"
              style={{ boxShadow: '0 0 40px rgba(59,130,246,0.35)' }}
            >
              <Icon size={36} />
            </motion.div>
            <p className="text-xs font-medium uppercase tracking-wide text-accent">Badge débloqué</p>
            <p className="text-lg font-semibold text-text-primary">{badge.name}</p>
            <p className="text-sm text-text-muted">{badge.description}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
