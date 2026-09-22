import { useQuery } from '@tanstack/react-query'
import { format, startOfWeek } from 'date-fns'
import { supabase } from '../../lib/supabase/client'
import { useSession } from '../auth/useSession'

// Semaine ISO (lundi..dimanche), même convention que date_trunc('week', ...) côté SQL.
export function currentWeekStartKey(): string {
  return format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

export function useWeekLogs() {
  const { session } = useSession()
  const userId = session?.user.id
  const weekStartKey = currentWeekStartKey()

  return useQuery({
    queryKey: ['habit_logs_week', userId, weekStartKey],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('habit_logs')
        .select('habit_id, log_date')
        .gte('log_date', weekStartKey)

      if (error) throw error
      return data
    },
  })
}
