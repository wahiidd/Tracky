import { motion } from 'framer-motion'
import { AppAvatar } from './AppAvatar'

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <AppAvatar size={72} animated />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-sm text-text-muted"
      >
        Chargement…
      </motion.p>
    </div>
  )
}
