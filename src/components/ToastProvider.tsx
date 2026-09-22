import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { useCallback, useRef, useState, type ReactNode } from 'react'
import { fadeFast, springSnappy } from '../lib/motion'
import { ToastContext, type ToastInput, type ToastVariant } from './ToastContext'

interface Toast extends Required<ToastInput> {
  id: number
}

const VARIANT_STYLES: Record<ToastVariant, { border: string; icon: typeof CheckCircle2 }> = {
  success: { border: 'border-success/50', icon: CheckCircle2 },
  error: { border: 'border-danger/50', icon: AlertCircle },
  info: { border: 'border-accent/50', icon: Info },
}

const VARIANT_ICON_COLOR: Record<ToastVariant, string> = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-accent',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const showToast = useCallback(({ message, variant = 'info' }: ToastInput) => {
    const id = nextId.current++
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((toast) => {
            const { border, icon: Icon } = VARIANT_STYLES[toast.variant]
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: fadeFast }}
                transition={springSnappy}
                className={`pointer-events-auto flex max-w-sm items-center gap-2 rounded-lg border bg-surface-raised px-4 py-2.5 text-sm text-text-primary shadow-lg ${border}`}
              >
                <Icon size={16} className={`shrink-0 ${VARIANT_ICON_COLOR[toast.variant]}`} />
                {toast.message}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
