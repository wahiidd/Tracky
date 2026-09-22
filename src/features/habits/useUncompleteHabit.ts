import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase/client'

export function useUncompleteHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { habitId: string; logDate: string }) => {
      const { data, error } = await supabase.rpc('uncomplete_habit', {
        p_habit_id: input.habitId,
        p_log_date: input.logDate,
      })
      if (error) throw error
      return data?.[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      queryClient.invalidateQueries({ queryKey: ['habit_logs_week'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
