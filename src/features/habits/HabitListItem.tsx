import { AnimatePresence, motion } from 'framer-motion'
import { Check, Flame } from 'lucide-react'
import type { Database } from '../../lib/supabase/types'
import { frequencyLabel } from './frequency'

type Habit = Pick<
  Database['public']['Tables']['habits']['Row'],
  'id' | 'category_id' | 'name' | 'frequency_type' | 'frequency_config' | 'current_streak'
>
type Category = Pick<Database['public']['Tables']['categories']['Row'], 'name' | 'color'>

interface HabitListItemProps {
  habit: Habit
  category: Category | undefined
  completedToday: boolean
  weekCount: number
  pending: boolean
  onToggle: () => void
}

export function HabitListItem({ habit, category, completedToday, weekCount, pending, onToggle }: HabitListItemProps) {
  const color = category?.color ?? '#3B82F6'
  const meta =
    habit.frequency_type === 'weekly_count'
      ? `${weekCount}/${'count' in habit.frequency_config ? habit.frequency_config.count : 1} cette semaine`
      : frequencyLabel(habit.frequency_type, habit.frequency_config)

  return (
    <motion.button
      layout
      type="button"
      onClick={onToggle}
      disabled={pending}
      whileTap={{ scale: 0.98 }}
      className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-colors disabled:opacity-60"
    >
      <motion.span
        animate={{ scale: completedToday ? [1, 1.15, 1] : 1 }}
        transition={{ duration: 0.28 }}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2"
        style={{
          borderColor: color,
          backgroundColor: completedToday ? color : 'transparent',
        }}
      >
        <AnimatePresence>
          {completedToday && (
            <motion.span
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <Check size={16} className="text-white" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>

      <span className="min-w-0 flex-1">
        <span className={`block truncate text-sm font-medium ${completedToday ? 'text-text-muted line-through' : 'text-text-primary'}`}>
          {habit.name}
        </span>
        <span className="block truncate text-xs text-text-muted">
          {category?.name ?? 'Sans catégorie'} · {meta}
        </span>
      </span>

      {habit.current_streak > 0 && (
        <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-warning">
          <Flame size={14} />
          {habit.current_streak}
        </span>
      )}
    </motion.button>
  )
}
