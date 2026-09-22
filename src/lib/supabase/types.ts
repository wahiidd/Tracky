// Types écrits à la main pour correspondre à supabase/migrations/0001_init_schema.sql.
// À remplacer par `supabase gen types typescript` une fois le projet Supabase créé.
//
// Important : Row/Insert/Update doivent être des littéraux de type inline (pas des
// interfaces nommées référencées) — avec la combinaison TS 6 + @supabase/postgrest-js
// installée ici, une référence à une interface nommée fait échouer la résolution de
// type de `.from(...).select(...)` (tout retombe sur `never`). C'est d'ailleurs le
// format que produit `supabase gen types typescript`.

export type FrequencyType = 'daily' | 'weekly_days' | 'weekly_count'

export type FrequencyConfig =
  | { days: number[] } // weekly_days — 0=dimanche..6=samedi
  | { count: number } // weekly_count
  | Record<string, never> // daily

export type BadgeUnlockType =
  | 'streak_reached'
  | 'total_completions'
  | 'category_level'
  | 'global_level'
  | 'category_count'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          xp_total: number
          level: number
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          xp_total?: number
          level?: number
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          xp_total?: number
          level?: number
          created_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string | null
          color: string | null
          xp_total: number
          level: number
          sort_order: number
          archived: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          icon?: string | null
          color?: string | null
          xp_total?: number
          level?: number
          sort_order?: number
          archived?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          icon?: string | null
          color?: string | null
          xp_total?: number
          level?: number
          sort_order?: number
          archived?: boolean
          created_at?: string
        }
        Relationships: []
      }
      habits: {
        Row: {
          id: string
          user_id: string
          category_id: string
          name: string
          description: string | null
          frequency_type: FrequencyType
          frequency_config: FrequencyConfig
          xp_value: number
          active: boolean
          archived_at: string | null
          current_streak: number
          longest_streak: number
          last_completed_on: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          name: string
          description?: string | null
          frequency_type: FrequencyType
          frequency_config?: FrequencyConfig
          xp_value?: number
          active?: boolean
          archived_at?: string | null
          current_streak?: number
          longest_streak?: number
          last_completed_on?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          name?: string
          description?: string | null
          frequency_type?: FrequencyType
          frequency_config?: FrequencyConfig
          xp_value?: number
          active?: boolean
          archived_at?: string | null
          current_streak?: number
          longest_streak?: number
          last_completed_on?: string | null
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      // Lecture seule côté client : les écritures passent uniquement par les RPC
      // complete_habit/uncomplete_habit (appliqué par RLS, pas par ces types).
      habit_logs: {
        Row: {
          id: string
          user_id: string
          habit_id: string
          log_date: string
          completed_at: string
          xp_earned: number
        }
        Insert: {
          id?: string
          user_id: string
          habit_id: string
          log_date: string
          completed_at?: string
          xp_earned: number
        }
        Update: {
          id?: string
          user_id?: string
          habit_id?: string
          log_date?: string
          completed_at?: string
          xp_earned?: number
        }
        Relationships: []
      }
      badges: {
        Row: {
          id: string
          key: string
          name: string
          description: string
          icon: string
          unlock_type: BadgeUnlockType
          unlock_config: Record<string, number>
          sort_order: number
        }
        Insert: {
          id?: string
          key: string
          name: string
          description: string
          icon: string
          unlock_type: BadgeUnlockType
          unlock_config?: Record<string, number>
          sort_order?: number
        }
        Update: {
          id?: string
          key?: string
          name?: string
          description?: string
          icon?: string
          unlock_type?: BadgeUnlockType
          unlock_config?: Record<string, number>
          sort_order?: number
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          unlocked_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      complete_habit: {
        Args: { p_habit_id: string; p_log_date: string }
        Returns: {
          out_habit_id: string
          out_current_streak: number
          out_longest_streak: number
          out_category_id: string
          out_category_xp_total: number
          out_category_level: number
          out_profile_xp_total: number
          out_profile_level: number
          out_already_completed: boolean
        }[]
      }
      uncomplete_habit: {
        Args: { p_habit_id: string; p_log_date: string }
        Returns: {
          out_habit_id: string
          out_current_streak: number
          out_longest_streak: number
          out_category_id: string
          out_category_xp_total: number
          out_category_level: number
          out_profile_xp_total: number
          out_profile_level: number
        }[]
      }
    }
  }
}
