import { Card } from '../components/Card'

export function StatsPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-semibold text-text-primary">Historique</h1>
        <p className="text-sm text-text-muted">Vue calendrier et statistiques de régularité.</p>
      </header>

      <Card>
        <p className="text-sm text-text-muted">
          La vue calendrier mensuelle et les graphiques arrivent à une prochaine étape.
        </p>
      </Card>
    </div>
  )
}
