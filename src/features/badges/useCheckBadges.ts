import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase/client'
import type { UnlockedBadge } from './BadgeUnlockOverlay'

export function useCheckBadges() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<UnlockedBadge[]> => {
      const { data, error } = await supabase.rpc('check_and_unlock_badges')
      if (error) throw error
      return (data ?? []).map((row) => ({
        badge_id: row.out_badge_id,
        key: row.out_key,
        name: row.out_name,
        description: row.out_description,
        icon: row.out_icon,
      }))
    },
    onSuccess: (newBadges) => {
      if (newBadges.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['user_badges'] })
      }
    },
  })
}
