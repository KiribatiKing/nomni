export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          contact_id: string
          created_at: string
          date: string
          description: string | null
          due_date: string | null
          id: string
          location: string | null
          time: string
          title: string
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          date: string
          description?: string | null
          due_date?: string | null
          id?: string
          location?: string | null
          time: string
          title: string
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          date?: string
          description?: string | null
          due_date?: string | null
          id?: string
          location?: string | null
          time?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone: string
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          meta_data: Json | null
          name: string
          profile_picture: string | null
          role: Database["public"]["Enums"]["user_role"]
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          meta_data?: Json | null
          name: string
          profile_picture?: string | null
          role: Database["public"]["Enums"]["user_role"]
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          meta_data?: Json | null
          name?: string
          profile_picture?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_providers: {
        Row: {
          created_at: string | null
          id: string
          minimum_hours: number | null
          name: string | null
          overtime_rate: number | null
          public_holiday_rate: number | null
          saturday_rate: number | null
          sunday_rate: number | null
          user_id: string | null
          weekday_rate: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          minimum_hours?: number | null
          name?: string | null
          overtime_rate?: number | null
          public_holiday_rate?: number | null
          saturday_rate?: number | null
          sunday_rate?: number | null
          user_id?: string | null
          weekday_rate?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          minimum_hours?: number | null
          name?: string | null
          overtime_rate?: number | null
          public_holiday_rate?: number | null
          saturday_rate?: number | null
          sunday_rate?: number | null
          user_id?: string | null
          weekday_rate?: number | null
        }
        Relationships: []
      }
      shifts: {
        Row: {
          created_at: string | null
          id: string
          provider_id: string
          reason_if_early: string
          shift_date: string
          shift_end_time: string
          shift_start_time: string
          status: string | null
          support_worker_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          provider_id: string
          reason_if_early: string
          shift_date: string
          shift_end_time: string
          shift_start_time: string
          status?: string | null
          support_worker_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          provider_id?: string
          reason_if_early?: string
          shift_date?: string
          shift_end_time?: string
          shift_start_time?: string
          status?: string | null
          support_worker_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shifts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_support_worker_id_fkey"
            columns: ["support_worker_id"]
            isOneToOne: false
            referencedRelation: "support_workers"
            referencedColumns: ["id"]
          },
        ]
      }
      support_workers: {
        Row: {
          availability: string | null
          contact: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string | null
          phone_number: string | null
          support_provider_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability?: string | null
          contact: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name?: string | null
          phone_number?: string | null
          support_provider_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability?: string | null
          contact?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string | null
          phone_number?: string | null
          support_provider_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          due_date: string
          id: string
          priority: string | null
          status: string
          task_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          priority?: string | null
          status: string
          task_name: string
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          priority?: string | null
          status?: string
          task_name?: string
          updated_at?: string
          user_id?: string
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
      user_role: "admin" | "editor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "editor", "viewer"],
    },
  },
} as const
