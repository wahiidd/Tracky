import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Modal } from '../components/Modal'
import { Skeleton } from '../components/Skeleton'
import { useToast } from '../components/useToast'
import { BadgeUnlockOverlay, type UnlockedBadge } from '../features/badges/BadgeUnlockOverlay'
import { useCheckBadges } from '../features/badges/useCheckBadges'
import { useCategories } from '../features/categories/useCategories'
import { HabitForm } from '../features/habits/HabitForm'
import { HabitListItem } from '../features/habits/HabitListItem'
import { isHabitDueToday } from '../features/habits/frequency'
import { useCompleteHabit } from '../features/habits/useCompleteHabit'
import { useHabits } from '../features/habits/useHabits'
import { useUncompleteHabit } from '../features/habits/useUncompleteHabit'
import { useWeekLogs } from '../features/habits/useWeekLogs'
import type { Database } from '../lib/supabase/types'

type Habit = Pick<
  Database['public']['Tables']['habits']['Row'],
  | 'id'
  | 'category_id'
  | 'name'
  | 'description'
  | 'frequency_type'
  | 'frequency_config'
  | 'xp_value'
  | 'active'
  | 'current_streak'
  | 'longest_streak'
  | 'last_completed_on'
  | 'sort_order'
>

export function DashboardPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [pendingHabitId, setPendingHabitId] = useState<string | null>(null)
  const [badgeQueue, setBadgeQueue] = useState<UnlockedBadge[]>([])
  const { showToast } = useToast()

  const { data: habits, isLoading: habitsLoading } = useHabits()
  const { data: categories } = useCategories()
  const { data: weekLogs } = useWeekLogs()
  const completeHabit = useCompleteHabit()
  const uncompleteHabit = useUncompleteHabit()
  const checkBadges = useCheckBadges()

  const todayKey = format(new Date(), 'yyyy-MM-dd')
  const today = new Date()

  const categoryById = useMemo(() => new Map(categories?.map((c) => [c.id, c])), [categories])

  const logsByHabit = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const log of weekLogs ?? []) {
      const list = map.get(log.habit_id) ?? []
      list.push(log.log_date)
      map.set(log.habit_id, list)
    }
    return map
  }, [weekLogs])

  const todayHabits = (habits ?? []).filter((h) => isHabitDueToday(h.frequency_type, h.frequency_config, today))

  const currentBadge = badgeQueue[0] ?? null

  useEffect(() => {
    if (!currentBadge) return
    const timer = setTimeout(() => setBadgeQueue((q) => q.slice(1)), 3200)
    return () => clearTimeout(timer)
  }, [currentBadge])

  async function handleToggle(habit: Habit, completedToday: boolean) {
    setPendingHabitId(habit.id)
    try {
      if (completedToday) {
        await uncompleteHabit.mutateAsync({ habitId: habit.id, logDate: todayKey })
        showToast({ message: `Décoché : ${habit.name}`, variant: 'info' })
      } else {
        await completeHabit.mutateAsync({ habitId: habit.id, logDate: todayKey })
        showToast({ message: `+${habit.xp_value} XP · ${habit.name}`, variant: 'success' })
        const newBadges = await checkBadges.mutateAsync()
        if (newBadges.length > 0) {
          setBadgeQueue((q) => [...q, ...newBadges])
        }
      }
    } catch (err) {
      showToast({
        message: err instanceof Error ? err.message : 'Une erreur est survenue.',
        variant: 'error',
      })
    } finally {
      setPendingHabitId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Aujourd’hui</h1>
          <p className="text-sm text-text-muted">
            {todayHabits.filter((h) => (logsByHabit.get(h.id) ?? []).includes(todayKey)).length} /{' '}
            {todayHabits.length} complétées
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="px-3!">
          <Plus size={18} />
        </Button>
      </header>

      {habitsLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {!habitsLoading && (habits ?? []).length === 0 && (
        <Card>
          <p className="mb-3 text-sm text-text-muted">
            Tu n’as pas encore d’habitude. Crée la première pour commencer à suivre ta progression.
          </p>
          <Button onClick={() => setFormOpen(true)}>Créer une habitude</Button>
        </Card>
      )}

      {!habitsLoading && (habits ?? []).length > 0 && todayHabits.length === 0 && (
        <Card>
          <p className="text-sm text-text-muted">Rien de prévu aujourd’hui. 🎉</p>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        {todayHabits.map((habit, index) => {
          const logs = logsByHabit.get(habit.id) ?? []
          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25, ease: 'easeOut' }}
            >
              <HabitListItem
                habit={habit}
                category={categoryById.get(habit.category_id)}
                completedToday={logs.includes(todayKey)}
                weekCount={logs.length}
                pending={pendingHabitId === habit.id}
                onToggle={() => handleToggle(habit, logs.includes(todayKey))}
              />
            </motion.div>
          )
        })}
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Nouvelle habitude">
        <HabitForm onDone={() => setFormOpen(false)} />
      </Modal>

      <BadgeUnlockOverlay badge={currentBadge} onDismiss={() => setBadgeQueue((q) => q.slice(1))} />
    </div>
  )
}
