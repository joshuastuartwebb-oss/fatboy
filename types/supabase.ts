export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            daily_logs: {
                Row: {
                    ate_chips: boolean | null
                    ate_choc: boolean | null
                    created_at: string | null
                    daily_score: number | null
                    date: string
                    drank_beer: boolean | null
                    drank_water: boolean | null
                    felt_hungry: boolean | null
                    id: string
                    note: string | null
                    ran_5k: boolean | null
                    user_id: string
                }
                Insert: {
                    ate_chips?: boolean | null
                    ate_choc?: boolean | null
                    created_at?: string | null
                    daily_score?: number | null
                    date: string
                    drank_beer?: boolean | null
                    drank_water?: boolean | null
                    felt_hungry?: boolean | null
                    id?: string
                    note?: string | null
                    ran_5k?: boolean | null
                    user_id: string
                }
                Update: {
                    ate_chips?: boolean | null
                    ate_choc?: boolean | null
                    created_at?: string | null
                    daily_score?: number | null
                    date?: string
                    drank_beer?: boolean | null
                    drank_water?: boolean | null
                    felt_hungry?: boolean | null
                    id?: string
                    note?: string | null
                    ran_5k?: boolean | null
                    user_id?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    email: string | null
                    goal_weight: number | null
                    id: string
                    start_date: string | null
                    start_weight: number | null
                }
                Insert: {
                    email?: string | null
                    goal_weight?: number | null
                    id: string
                    start_date?: string | null
                    start_weight?: number | null
                }
                Update: {
                    email?: string | null
                    goal_weight?: number | null
                    id?: string
                    start_date?: string | null
                    start_weight?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            weigh_ins: {
                Row: {
                    created_at: string | null
                    date: string
                    id: string
                    user_id: string
                    weight: number
                }
                Insert: {
                    created_at?: string | null
                    date?: string
                    id?: string
                    user_id: string
                    weight: number
                }
                Update: {
                    created_at?: string | null
                    date?: string
                    id?: string
                    user_id?: string
                    weight?: number
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
