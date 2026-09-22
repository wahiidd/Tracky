import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase/client'

function invalidateAfterCompletion(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['habits'] })
  queryClient.invalidateQueries({ queryKey: ['habit_logs_week'] })
  queryClient.invalidateQueries({ queryKey: ['categories'] })
  queryClient.invalidateQueries({ queryKey: ['profile'] })
}

export function useCompleteHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { habitId: string; logDate: string }) => {
      const { data, error } = await supabase.rpc('complete_habit', {
        p_habit_id: input.habitId,
        p_log_date: input.logDate,
      })
      if (error) throw error
      return data?.[0]
    },
    onSuccess: () => invalidateAfterCompletion(queryClient),
  })
}
