import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase/client'
import { useSession } from '../auth/useSession'

export function useHabits() {
  const { session } = useSession()
  const userId = session?.user.id

  return useQuery({
    queryKey: ['habits', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('habits')
        .select(
          'id, category_id, name, description, frequency_type, frequency_config, xp_value, active, current_streak, longest_streak, last_completed_on, sort_order',
        )
        .eq('active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error
      return data
    },
  })
}
