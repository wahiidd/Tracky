import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase/client'
import { useSession } from '../auth/useSession'

export function useCategories() {
  const { session } = useSession()
  const userId = session?.user.id

  return useQuery({
    queryKey: ['categories', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, icon, color, xp_total, level, sort_order, archived')
        .eq('archived', false)
        .order('sort_order', { ascending: true })

      if (error) throw error
      return data
    },
  })
}
