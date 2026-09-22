import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase/client'
import { useSession } from '../auth/useSession'

interface CreateCategoryInput {
  name: string
  color: string
}

export function useCreateCategory() {
  const { session } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      const { data, error } = await supabase
        .from('categories')
        .insert({ user_id: session!.user.id, name: input.name, color: input.color })
        .select('id, name, icon, color, xp_total, level, sort_order, archived')
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
