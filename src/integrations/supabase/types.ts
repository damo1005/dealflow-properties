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
      api_usage: {
        Row: {
          cost_credits: number | null
          created_at: string
          endpoint: string
          error_message: string | null
          id: string
          request_count: number | null
          response_time_ms: number | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          cost_credits?: number | null
          created_at?: string
          endpoint: string
          error_message?: string | null
          id?: string
          request_count?: number | null
          response_time_ms?: number | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          cost_credits?: number | null
          created_at?: string
          endpoint?: string
          error_message?: string | null
          id?: string
          request_count?: number | null
          response_time_ms?: number | null
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      area_statistics_cache: {
        Row: {
          area_type: string | null
          cached_at: string
          data: Json
          expires_at: string
          id: string
          postcode: string
        }
        Insert: {
          area_type?: string | null
          cached_at?: string
          data: Json
          expires_at?: string
          id?: string
          postcode: string
        }
        Update: {
          area_type?: string | null
          cached_at?: string
          data?: Json
          expires_at?: string
          id?: string
          postcode?: string
        }
        Relationships: []
      }
      cached_properties: {
        Row: {
          address: string
          bathrooms: number | null
          bedrooms: number | null
          cached_at: string
          county: string | null
          created_at: string
          days_on_market: number | null
          description: string | null
          estimated_yield: number | null
          expires_at: string
          external_id: string
          features: string[] | null
          id: string
          images: string[] | null
          latitude: number | null
          longitude: number | null
          original_price: number | null
          postcode: string | null
          price: number
          price_reduced: boolean | null
          property_type: string | null
          raw_data: Json | null
          region: string | null
          roi_potential: number | null
        }
        Insert: {
          address: string
          bathrooms?: number | null
          bedrooms?: number | null
          cached_at?: string
          county?: string | null
          created_at?: string
          days_on_market?: number | null
          description?: string | null
          estimated_yield?: number | null
          expires_at?: string
          external_id: string
          features?: string[] | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          original_price?: number | null
          postcode?: string | null
          price: number
          price_reduced?: boolean | null
          property_type?: string | null
          raw_data?: Json | null
          region?: string | null
          roi_potential?: number | null
        }
        Update: {
          address?: string
          bathrooms?: number | null
          bedrooms?: number | null
          cached_at?: string
          county?: string | null
          created_at?: string
          days_on_market?: number | null
          description?: string | null
          estimated_yield?: number | null
          expires_at?: string
          external_id?: string
          features?: string[] | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          original_price?: number | null
          postcode?: string | null
          price?: number
          price_reduced?: boolean | null
          property_type?: string | null
          raw_data?: Json | null
          region?: string | null
          roi_potential?: number | null
        }
        Relationships: []
      }
      comparables_cache: {
        Row: {
          cached_at: string
          data: Json
          expires_at: string
          id: string
          postcode: string
          property_type: string | null
          radius_miles: number | null
        }
        Insert: {
          cached_at?: string
          data: Json
          expires_at?: string
          id?: string
          postcode: string
          property_type?: string | null
          radius_miles?: number | null
        }
        Update: {
          cached_at?: string
          data?: Json
          expires_at?: string
          id?: string
          postcode?: string
          property_type?: string | null
          radius_miles?: number | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          clicked_at: string | null
          email_type: string
          id: string
          opened_at: string | null
          property_ids: string[] | null
          saved_search_id: string | null
          sent_at: string
          user_id: string
        }
        Insert: {
          clicked_at?: string | null
          email_type: string
          id?: string
          opened_at?: string | null
          property_ids?: string[] | null
          saved_search_id?: string | null
          sent_at?: string
          user_id: string
        }
        Update: {
          clicked_at?: string | null
          email_type?: string
          id?: string
          opened_at?: string | null
          property_ids?: string[] | null
          saved_search_id?: string | null
          sent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_saved_search_id_fkey"
            columns: ["saved_search_id"]
            isOneToOne: false
            referencedRelation: "saved_searches"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          clicked: boolean | null
          created_at: string
          id: string
          message: string | null
          property_address: string | null
          property_id: string | null
          property_image: string | null
          property_price: number | null
          read: boolean | null
          saved_search_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          clicked?: boolean | null
          created_at?: string
          id?: string
          message?: string | null
          property_address?: string | null
          property_id?: string | null
          property_image?: string | null
          property_price?: number | null
          read?: boolean | null
          saved_search_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          clicked?: boolean | null
          created_at?: string
          id?: string
          message?: string | null
          property_address?: string | null
          property_id?: string | null
          property_image?: string | null
          property_price?: number | null
          read?: boolean | null
          saved_search_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_saved_search_id_fkey"
            columns: ["saved_search_id"]
            isOneToOne: false
            referencedRelation: "saved_searches"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_properties: {
        Row: {
          address: string
          created_at: string
          external_property_id: string | null
          id: string
          notes: string | null
          position: number | null
          price: number | null
          property_id: string | null
          stage: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          external_property_id?: string | null
          id?: string
          notes?: string | null
          position?: number | null
          price?: number | null
          property_id?: string | null
          stage?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          external_property_id?: string | null
          id?: string
          notes?: string | null
          position?: number | null
          price?: number | null
          property_id?: string | null
          stage?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "cached_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_estimates_cache: {
        Row: {
          bedrooms: number | null
          cached_at: string
          data: Json
          expires_at: string
          id: string
          postcode: string
          property_type: string | null
        }
        Insert: {
          bedrooms?: number | null
          cached_at?: string
          data: Json
          expires_at?: string
          id?: string
          postcode: string
          property_type?: string | null
        }
        Update: {
          bedrooms?: number | null
          cached_at?: string
          data?: Json
          expires_at?: string
          id?: string
          postcode?: string
          property_type?: string | null
        }
        Relationships: []
      }
      saved_properties: {
        Row: {
          created_at: string
          external_property_id: string | null
          id: string
          notes: string | null
          property_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          external_property_id?: string | null
          id?: string
          notes?: string | null
          property_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          external_property_id?: string | null
          id?: string
          notes?: string | null
          property_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "cached_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          alerts_enabled: boolean | null
          created_at: string
          description: string | null
          digest_time: string | null
          filters: Json
          id: string
          last_alert_at: string | null
          max_properties_per_email: number | null
          name: string
          new_matches_count: number | null
          notification_frequency: string | null
          paused: boolean | null
          total_matches_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alerts_enabled?: boolean | null
          created_at?: string
          description?: string | null
          digest_time?: string | null
          filters?: Json
          id?: string
          last_alert_at?: string | null
          max_properties_per_email?: number | null
          name: string
          new_matches_count?: number | null
          notification_frequency?: string | null
          paused?: boolean | null
          total_matches_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alerts_enabled?: boolean | null
          created_at?: string
          description?: string | null
          digest_time?: string | null
          filters?: Json
          id?: string
          last_alert_at?: string | null
          max_properties_per_email?: number | null
          name?: string
          new_matches_count?: number | null
          notification_frequency?: string | null
          paused?: boolean | null
          total_matches_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notification_preferences: {
        Row: {
          created_at: string
          default_digest_time: string | null
          email_notifications_enabled: boolean | null
          global_notifications_enabled: boolean | null
          id: string
          in_app_notifications_enabled: boolean | null
          max_emails_per_day: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_digest_time?: string | null
          email_notifications_enabled?: boolean | null
          global_notifications_enabled?: boolean | null
          id?: string
          in_app_notifications_enabled?: boolean | null
          max_emails_per_day?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_digest_time?: string | null
          email_notifications_enabled?: boolean | null
          global_notifications_enabled?: boolean | null
          id?: string
          in_app_notifications_enabled?: boolean | null
          max_emails_per_day?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      voice_notes: {
        Row: {
          audio_url: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          property_address: string
          property_id: string | null
          recording_date: string
          structured_analysis: Json | null
          transcript: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          property_address: string
          property_id?: string | null
          recording_date?: string
          structured_analysis?: Json | null
          transcript?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          property_address?: string
          property_id?: string | null
          recording_date?: string
          structured_analysis?: Json | null
          transcript?: string | null
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
      clean_all_expired_caches: { Args: never; Returns: undefined }
      clean_expired_cache: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
