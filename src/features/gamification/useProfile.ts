import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase/client'
import { useSession } from '../auth/useSession'

export function useProfile() {
  const { session } = useSession()
  const userId = session?.user.id

  return useQuery({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, xp_total, level')
        .eq('id', userId!)
        .single()

      if (error) throw error
      return data
    },
  })
}
