export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          wedding_id: string
          name: string
          date: string
          end_date: string | null
          location: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          wedding_id: string
          name: string
          date: string
          end_date?: string | null
          location: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          wedding_id?: string
          name?: string
          date?: string
          end_date?: string | null
          location?: string
          description?: string | null
          created_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          wedding_id: string
          name: string
          email: string | null
          phone: string | null
          plus_one_allowed: boolean
          created_at: string
          group_id: string | null
        }
        Insert: {
          id?: string
          wedding_id: string
          name: string
          email?: string | null
          phone?: string | null
          plus_one_allowed?: boolean
          created_at?: string
          group_id?: string | null
        }
        Update: {
          id?: string
          wedding_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          plus_one_allowed?: boolean
          created_at?: string
          group_id?: string | null
        }
      }
      invitation_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          thumbnail_url: string | null
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          thumbnail_url?: string | null
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          thumbnail_url?: string | null
          is_premium?: boolean
          created_at?: string
        }
      }
      invitations: {
        Row: {
          id: string
          wedding_id: string
          template_id: string
          custom_message: string | null
          accent_color: string
          font_choice: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          wedding_id: string
          template_id: string
          custom_message?: string | null
          accent_color?: string
          font_choice?: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          wedding_id?: string
          template_id?: string
          custom_message?: string | null
          accent_color?: string
          font_choice?: string
          slug?: string
          created_at?: string
        }
      }
      rsvps: {
        Row: {
          id: string
          guest_id: string
          attending: boolean | null
          meal_choice: string | null
          plus_one_name: string | null
          plus_one_meal_choice: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guest_id: string
          attending?: boolean | null
          meal_choice?: string | null
          plus_one_name?: string | null
          plus_one_meal_choice?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guest_id?: string
          attending?: boolean | null
          meal_choice?: string | null
          plus_one_name?: string | null
          plus_one_meal_choice?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
        }
      }
      weddings: {
        Row: {
          id: string
          user_id: string
          title: string
          date: string
          location: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          date: string
          location: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          date?: string
          location?: string
          description?: string | null
          created_at?: string
        }
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