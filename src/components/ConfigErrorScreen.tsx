import { AppAvatar } from './AppAvatar'
import { Card } from './Card'

export function ConfigErrorScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm text-center">
        <div className="mb-4 flex justify-center">
          <AppAvatar size={56} />
        </div>
        <h1 className="mb-2 text-lg font-semibold text-text-primary">Configuration manquante</h1>
        <p className="mb-4 text-sm text-text-muted">
          Les variables <code className="rounded bg-surface-raised px-1 py-0.5 text-xs">VITE_SUPABASE_URL</code> et{' '}
          <code className="rounded bg-surface-raised px-1 py-0.5 text-xs">VITE_SUPABASE_ANON_KEY</code> ne sont pas
          définies pour ce déploiement.
        </p>
        <p className="text-left text-xs text-text-muted">
          Sur Vercel : Project Settings → Environment Variables → ajoute les deux clés (valeurs dans ton{' '}
          <code className="rounded bg-surface-raised px-1 py-0.5">.env.local</code>) → redéploie.
        </p>
      </Card>
    </div>
  )
}
