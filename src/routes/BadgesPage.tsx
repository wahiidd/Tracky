import { Card } from '../components/Card'

export function BadgesPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-semibold text-text-primary">Badges</h1>
        <p className="text-sm text-text-muted">Tes accomplissements débloqués et à débloquer.</p>
      </header>

      <Card>
        <p className="text-sm text-text-muted">La galerie de badges arrive à une prochaine étape.</p>
      </Card>
    </div>
  )
}
