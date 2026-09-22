import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { FrequencyConfig, FrequencyType } from '../../lib/supabase/types'
import { supabase } from '../../lib/supabase/client'
import { useSession } from '../auth/useSession'

interface CreateHabitInput {
  name: string
  category_id: string
  frequency_type: FrequencyType
  frequency_config: FrequencyConfig
}

export function useCreateHabit() {
  const { session } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateHabitInput) => {
      const { error } = await supabase.from('habits').insert({
        user_id: session!.user.id,
        category_id: input.category_id,
        name: input.name,
        frequency_type: input.frequency_type,
        frequency_config: input.frequency_config,
      })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}
