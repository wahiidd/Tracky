// Palette d'accent pour les catégories — mêmes tokens que src/index.css (@theme).
export const CATEGORY_COLORS = [
  { key: 'blue', hex: '#3B82F6' },
  { key: 'violet', hex: '#8B5CF6' },
  { key: 'teal', hex: '#14B8A6' },
  { key: 'amber', hex: '#F59E0B' },
  { key: 'rose', hex: '#F43F5E' },
  { key: 'green', hex: '#22C55E' },
] as const

export const DEFAULT_CATEGORY_COLOR = CATEGORY_COLORS[0].hex
