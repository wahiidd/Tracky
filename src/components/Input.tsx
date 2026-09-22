import type { InputHTMLAttributes } from 'react'

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-border bg-surface-raised px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent ${className}`}
      {...props}
    />
  )
}
