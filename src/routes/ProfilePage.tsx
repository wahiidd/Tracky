import { AnimatePresence, motion } from 'framer-motion'
import { AppAvatar } from '../components/AppAvatar'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Skeleton } from '../components/Skeleton'
import { useSession } from '../features/auth/useSession'
import { heroRankForLevel, levelFromTotalXp } from '../features/gamification/xp'
import { useProfile } from '../features/gamification/useProfile'
import { fadeFast, springSmooth } from '../lib/motion'
import { supabase } from '../lib/supabase/client'

export function ProfilePage() {
  const { session } = useSession()
  const { data: profile, isLoading, error } = useProfile()

  const progress = profile ? levelFromTotalXp(profile.xp_total) : null
  const rank = progress ? heroRankForLevel(progress.level) : null

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center gap-3">
        <AppAvatar size={44} />
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Profil</h1>
          <p className="text-sm text-text-muted">{session?.user.email}</p>
        </div>
      </header>

      <Card>
        {isLoading && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-2 w-full" />
          </div>
        )}

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
              exit={{ opacity: 0, transition: fadeFast }}
              className="text-sm text-danger"
            >
              Impossible de charger le profil — vérifie que le schéma Supabase est bien installé.
            </motion.p>
          )}
        </AnimatePresence>

        {profile && progress && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <p className="text-sm text-text-muted">{rank}</p>
            <p className="text-2xl font-semibold text-text-primary">Niveau {progress.level}</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(progress.xpIntoLevel / progress.xpForNextLevel) * 100}%` }}
                transition={{ ...springSmooth, delay: 0.1 }}
              />
            </div>
            <p className="text-xs text-text-muted">
              {progress.xpIntoLevel} / {progress.xpForNextLevel} XP
            </p>
          </motion.div>
        )}
      </Card>

      <Card>
        <p className="mb-3 text-sm text-text-muted">Stats par catégorie — bientôt disponible.</p>
      </Card>

      <Button variant="secondary" onClick={() => supabase.auth.signOut()}>
        Se déconnecter
      </Button>
    </div>
  )
}
