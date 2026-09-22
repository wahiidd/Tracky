import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useSession() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useSession doit être utilisé à l’intérieur de <AuthProvider>')
  }
  return ctx
}
