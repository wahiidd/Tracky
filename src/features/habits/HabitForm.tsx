import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../categories/colors'
import { useCategories } from '../categories/useCategories'
import { useCreateCategory } from '../categories/useCreateCategory'
import type { FrequencyConfig, FrequencyType } from '../../lib/supabase/types'
import { WEEKDAY_CHIPS } from './frequency'
import { useCreateHabit } from './useCreateHabit'

const NEW_CATEGORY = '__new__'

export function HabitForm({ onDone }: { onDone: () => void }) {
  const { data: categories } = useCategories()
  const createCategory = useCreateCategory()
  const createHabit = useCreateHabit()

  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState<string>(DEFAULT_CATEGORY_COLOR)
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily')
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [weeklyCount, setWeeklyCount] = useState(3)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const usingNewCategory = categoryId === NEW_CATEGORY

  function toggleDay(day: number) {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Donne un nom à ton habitude.')
      return
    }
    if (!categoryId) {
      setError('Choisis ou crée une catégorie.')
      return
    }
    if (usingNewCategory && !newCategoryName.trim()) {
      setError('Donne un nom à ta nouvelle catégorie.')
      return
    }
    if (frequencyType === 'weekly_days' && selectedDays.length === 0) {
      setError('Choisis au moins un jour.')
      return
    }

    setSubmitting(true)
    try {
      let resolvedCategoryId = categoryId
      if (usingNewCategory) {
        const category = await createCategory.mutateAsync({
          name: newCategoryName.trim(),
          color: newCategoryColor,
        })
        resolvedCategoryId = category.id
      }

      const frequency_config: FrequencyConfig =
        frequencyType === 'weekly_days'
          ? { days: selectedDays }
          : frequencyType === 'weekly_count'
            ? { count: weeklyCount }
            : {}

      await createHabit.mutateAsync({
        name: name.trim(),
        category_id: resolvedCategoryId,
        frequency_type: frequencyType,
        frequency_config,
      })

      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-xs text-text-muted">Nom</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Lire 20 minutes" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-text-muted">Catégorie</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent"
        >
          <option value="" disabled>
            Choisir…
          </option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
          <option value={NEW_CATEGORY}>+ Nouvelle catégorie</option>
        </select>
      </div>

      {usingNewCategory && (
        <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nom de la catégorie"
          />
          <div className="flex gap-2">
            {CATEGORY_COLORS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setNewCategoryColor(c.hex)}
                className="h-7 w-7 rounded-full ring-offset-2 ring-offset-surface"
                style={{
                  backgroundColor: c.hex,
                  boxShadow: newCategoryColor === c.hex ? `0 0 0 2px ${c.hex}` : undefined,
                }}
                aria-label={c.key}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs text-text-muted">Fréquence</label>
        <div className="flex gap-2">
          {(
            [
              { value: 'daily', label: 'Tous les jours' },
              { value: 'weekly_days', label: 'Jours précis' },
              { value: 'weekly_count', label: 'X fois/semaine' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFrequencyType(opt.value)}
              className={`flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                frequencyType === opt.value
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border text-text-muted hover:text-text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {frequencyType === 'weekly_days' && (
        <div className="flex justify-between gap-1">
          {WEEKDAY_CHIPS.map((chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={() => toggleDay(chip.value)}
              className={`h-9 w-9 rounded-full text-xs font-medium transition-colors ${
                selectedDays.includes(chip.value)
                  ? 'bg-accent text-white'
                  : 'bg-surface-raised text-text-muted hover:text-text-primary'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {frequencyType === 'weekly_count' && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setWeeklyCount((n) => Math.max(1, n - 1))}
            className="h-9 w-9 rounded-full bg-surface-raised text-text-primary"
          >
            −
          </button>
          <span className="w-6 text-center text-sm text-text-primary">{weeklyCount}</span>
          <button
            type="button"
            onClick={() => setWeeklyCount((n) => Math.min(7, n + 1))}
            className="h-9 w-9 rounded-full bg-surface-raised text-text-primary"
          >
            +
          </button>
          <span className="text-sm text-text-muted">fois par semaine</span>
        </div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
          transition={{ duration: 0.4 }}
          className="text-sm text-danger"
        >
          {error}
        </motion.p>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Un instant…' : 'Créer l’habitude'}
      </Button>
    </form>
  )
}
