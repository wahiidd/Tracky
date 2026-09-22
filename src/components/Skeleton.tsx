import { motion } from 'framer-motion'

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-md bg-surface-raised ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
