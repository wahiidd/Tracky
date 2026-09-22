import { AnimatePresence, motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { AppAvatar } from '../../components/AppAvatar'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { supabase } from '../../lib/supabase/client'
import { useSession } from './useSession'

type Mode = 'login' | 'signup'

export function LoginPage() {
  const { session, loading } = useSession()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Une fois connecté (login réussi, ou session déjà active), on quitte /login.
  if (!loading && session) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)

    const { error } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    setSubmitting(false)

    if (error) {
      setError(error.message)
      return
    }

    if (mode === 'signup') {
      setInfo('Compte créé. Si la confirmation par e-mail est activée, vérifie ta boîte mail avant de te connecter.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full max-w-sm"
      >
        <Card>
          <div className="mb-4 flex justify-center">
            <AppAvatar size={56} />
          </div>
          <h1 className="mb-1 text-center text-xl font-semibold text-text-primary">Tracky</h1>
          <p className="mb-6 text-center text-sm text-text-muted">
            {mode === 'login' ? 'Connecte-toi pour continuer ta progression.' : 'Crée ton compte de héros.'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
              required
            />

            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm text-danger"
                >
                  {error}
                </motion.p>
              )}
              {info && (
                <motion.p
                  key="info"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-success"
                >
                  {info}
                </motion.p>
              )}
            </AnimatePresence>

            <Button type="submit" disabled={submitting} className="mt-2">
              {submitting ? 'Un instant…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setError(null)
              setInfo(null)
            }}
            className="mt-4 w-full text-center text-sm text-text-muted hover:text-text-primary"
          >
            {mode === 'login' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </button>
        </Card>
      </motion.div>
    </div>
  )
}
