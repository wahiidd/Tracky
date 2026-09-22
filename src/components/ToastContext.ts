import { createContext } from 'react'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastInput {
  message: string
  variant?: ToastVariant
}

export interface ToastContextValue {
  showToast: (toast: ToastInput) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)
