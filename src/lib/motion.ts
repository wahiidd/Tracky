import type { Transition } from 'framer-motion'

// Presets partagés pour garder des animations cohérentes et fluides dans toute l'app.
export const springPop: Transition = { type: 'spring', stiffness: 380, damping: 26 }
export const springSnappy: Transition = { type: 'spring', stiffness: 500, damping: 30 }
export const springSmooth: Transition = { type: 'spring', stiffness: 220, damping: 24 }
export const fadeFast: Transition = { duration: 0.15, ease: 'easeOut' }
