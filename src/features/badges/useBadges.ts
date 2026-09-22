import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase/client'
import { useSession } from '../auth/useSession'

export function useBadges() {
  const { session } = useSession()
  const userId = session?.user.id

  const catalog = useQuery({
    queryKey: ['badges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('badges')
        .select('id, key, name, description, icon, unlock_type, unlock_config, sort_order')
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data
    },
  })

  const unlocked = useQuery({
    queryKey: ['user_badges', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_badges')
        .select('badge_id, unlocked_at')
        .eq('user_id', userId!)
      if (error) throw error
      return data
    },
  })

  const unlockedById = new Map(unlocked.data?.map((u) => [u.badge_id, u.unlocked_at]))

  const badges = (catalog.data ?? []).map((badge) => ({
    ...badge,
    unlockedAt: unlockedById.get(badge.id) ?? null,
  }))

  return {
    badges,
    isLoading: catalog.isLoading || unlocked.isLoading,
    error: catalog.error ?? unlocked.error,
  }
}
