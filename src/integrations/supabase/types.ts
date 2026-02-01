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
      accommodation_requests: {
        Row: {
          budget_max: number
          budget_min: number | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          duration_months: number | null
          enquiry_count: number | null
          expires_at: string | null
          furnished: boolean | null
          has_children: boolean | null
          has_pets: boolean | null
          id: string
          is_public: boolean | null
          location: string
          move_in_date: string | null
          move_out_date: string | null
          no_sharing: boolean | null
          number_of_guests: number | null
          parking_required: boolean | null
          postcode_area: string | null
          preferred_contact_method: string | null
          property_type: string[] | null
          request_type: string
          self_contained: boolean | null
          show_contact_details: boolean | null
          special_requirements: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
          view_count: number | null
          whatsapp_number: string | null
        }
        Insert: {
          budget_max: number
          budget_min?: number | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          duration_months?: number | null
          enquiry_count?: number | null
          expires_at?: string | null
          furnished?: boolean | null
          has_children?: boolean | null
          has_pets?: boolean | null
          id?: string
          is_public?: boolean | null
          location: string
          move_in_date?: string | null
          move_out_date?: string | null
          no_sharing?: boolean | null
          number_of_guests?: number | null
          parking_required?: boolean | null
          postcode_area?: string | null
          preferred_contact_method?: string | null
          property_type?: string[] | null
          request_type: string
          self_contained?: boolean | null
          show_contact_details?: boolean | null
          special_requirements?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          view_count?: number | null
          whatsapp_number?: string | null
        }
        Update: {
          budget_max?: number
          budget_min?: number | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          duration_months?: number | null
          enquiry_count?: number | null
          expires_at?: string | null
          furnished?: boolean | null
          has_children?: boolean | null
          has_pets?: boolean | null
          id?: string
          is_public?: boolean | null
          location?: string
          move_in_date?: string | null
          move_out_date?: string | null
          no_sharing?: boolean | null
          number_of_guests?: number | null
          parking_required?: boolean | null
          postcode_area?: string | null
          preferred_contact_method?: string | null
          property_type?: string[] | null
          request_type?: string
          self_contained?: boolean | null
          show_contact_details?: boolean | null
          special_requirements?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      admin_announcements: {
        Row: {
          announcement_type: string | null
          created_at: string | null
          created_by: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          message: string
          show_banner: boolean | null
          show_modal: boolean | null
          starts_at: string | null
          target_users: string | null
          title: string
        }
        Insert: {
          announcement_type?: string | null
          created_at?: string | null
          created_by?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          show_banner?: boolean | null
          show_modal?: boolean | null
          starts_at?: string | null
          target_users?: string | null
          title: string
        }
        Update: {
          announcement_type?: string | null
          created_at?: string | null
          created_by?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          show_banner?: boolean | null
          show_modal?: boolean | null
          starts_at?: string | null
          target_users?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          admin_email: string
          admin_role: string | null
          can_manage_affiliates: boolean | null
          can_manage_content: boolean | null
          can_manage_settings: boolean | null
          can_manage_users: boolean | null
          can_view_financials: boolean | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          login_count: number | null
          user_id: string
        }
        Insert: {
          admin_email: string
          admin_role?: string | null
          can_manage_affiliates?: boolean | null
          can_manage_content?: boolean | null
          can_manage_settings?: boolean | null
          can_manage_users?: boolean | null
          can_view_financials?: boolean | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          login_count?: number | null
          user_id: string
        }
        Update: {
          admin_email?: string
          admin_role?: string | null
          can_manage_affiliates?: boolean | null
          can_manage_content?: boolean | null
          can_manage_settings?: boolean | null
          can_manage_users?: boolean | null
          can_view_financials?: boolean | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          login_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      affiliate_commissions: {
        Row: {
          advertiser: string | null
          affiliate_network: string | null
          click_date: string | null
          commission_amount: number | null
          commission_status: string | null
          conversion_date: string | null
          created_at: string | null
          id: string
          mortgage_amount: number | null
          notes: string | null
          property_address: string | null
          tracking_id: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          advertiser?: string | null
          affiliate_network?: string | null
          click_date?: string | null
          commission_amount?: number | null
          commission_status?: string | null
          conversion_date?: string | null
          created_at?: string | null
          id?: string
          mortgage_amount?: number | null
          notes?: string | null
          property_address?: string | null
          tracking_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          advertiser?: string | null
          affiliate_network?: string | null
          click_date?: string | null
          commission_amount?: number | null
          commission_status?: string | null
          conversion_date?: string | null
          created_at?: string | null
          id?: string
          mortgage_amount?: number | null
          notes?: string | null
          property_address?: string | null
          tracking_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      affiliates: {
        Row: {
          active_referrals: number | null
          affiliate_code: string
          application_date: string | null
          approved_by: string | null
          approved_date: string | null
          audience_description: string | null
          audience_size: number | null
          auto_payout: boolean | null
          bank_details: Json | null
          click_count: number | null
          commission_rate: number | null
          commission_tier: string | null
          company_name: string | null
          conversion_rate: number | null
          created_at: string | null
          id: string
          is_vat_registered: boolean | null
          minimum_payout: number | null
          notes: string | null
          paid_out: number | null
          payment_email: string | null
          payment_method: string | null
          payout_frequency: string | null
          paypal_email: string | null
          pending_payout: number | null
          promotion_methods: string[] | null
          recurring_commission: boolean | null
          recurring_months: number | null
          referral_source: string | null
          social_media: Json | null
          status: string | null
          stripe_account_id: string | null
          tax_country: string | null
          tax_id: string | null
          terms_accepted: boolean | null
          terms_accepted_date: string | null
          total_earnings: number | null
          total_referrals: number | null
          updated_at: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          active_referrals?: number | null
          affiliate_code: string
          application_date?: string | null
          approved_by?: string | null
          approved_date?: string | null
          audience_description?: string | null
          audience_size?: number | null
          auto_payout?: boolean | null
          bank_details?: Json | null
          click_count?: number | null
          commission_rate?: number | null
          commission_tier?: string | null
          company_name?: string | null
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          is_vat_registered?: boolean | null
          minimum_payout?: number | null
          notes?: string | null
          paid_out?: number | null
          payment_email?: string | null
          payment_method?: string | null
          payout_frequency?: string | null
          paypal_email?: string | null
          pending_payout?: number | null
          promotion_methods?: string[] | null
          recurring_commission?: boolean | null
          recurring_months?: number | null
          referral_source?: string | null
          social_media?: Json | null
          status?: string | null
          stripe_account_id?: string | null
          tax_country?: string | null
          tax_id?: string | null
          terms_accepted?: boolean | null
          terms_accepted_date?: string | null
          total_earnings?: number | null
          total_referrals?: number | null
          updated_at?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          active_referrals?: number | null
          affiliate_code?: string
          application_date?: string | null
          approved_by?: string | null
          approved_date?: string | null
          audience_description?: string | null
          audience_size?: number | null
          auto_payout?: boolean | null
          bank_details?: Json | null
          click_count?: number | null
          commission_rate?: number | null
          commission_tier?: string | null
          company_name?: string | null
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          is_vat_registered?: boolean | null
          minimum_payout?: number | null
          notes?: string | null
          paid_out?: number | null
          payment_email?: string | null
          payment_method?: string | null
          payout_frequency?: string | null
          paypal_email?: string | null
          pending_payout?: number | null
          promotion_methods?: string[] | null
          recurring_commission?: boolean | null
          recurring_months?: number | null
          referral_source?: string | null
          social_media?: Json | null
          status?: string | null
          stripe_account_id?: string | null
          tax_country?: string | null
          tax_id?: string | null
          terms_accepted?: boolean | null
          terms_accepted_date?: string | null
          total_earnings?: number | null
          total_referrals?: number | null
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      agent_clients: {
        Row: {
          access_level: string | null
          agent_id: string
          client_email: string
          client_name: string
          client_phone: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string | null
          fee_type: string | null
          id: string
          management_fee_percent: number | null
          property_count: number | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_level?: string | null
          agent_id: string
          client_email: string
          client_name: string
          client_phone?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          fee_type?: string | null
          id?: string
          management_fee_percent?: number | null
          property_count?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_level?: string | null
          agent_id?: string
          client_email?: string
          client_name?: string
          client_phone?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          fee_type?: string | null
          id?: string
          management_fee_percent?: number | null
          property_count?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      agent_property_assignments: {
        Row: {
          agent_client_id: string
          created_at: string | null
          end_date: string | null
          fee_fixed: number | null
          fee_percent: number | null
          id: string
          is_active: boolean | null
          management_type: string | null
          portfolio_property_id: string
          start_date: string | null
        }
        Insert: {
          agent_client_id: string
          created_at?: string | null
          end_date?: string | null
          fee_fixed?: number | null
          fee_percent?: number | null
          id?: string
          is_active?: boolean | null
          management_type?: string | null
          portfolio_property_id: string
          start_date?: string | null
        }
        Update: {
          agent_client_id?: string
          created_at?: string | null
          end_date?: string | null
          fee_fixed?: number | null
          fee_percent?: number | null
          id?: string
          is_active?: boolean | null
          management_type?: string | null
          portfolio_property_id?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_property_assignments_agent_client_id_fkey"
            columns: ["agent_client_id"]
            isOneToOne: false
            referencedRelation: "agent_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_property_assignments_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_actions_log: {
        Row: {
          action_details: Json | null
          action_type: string | null
          conversation_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_actions_log_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_engagement: {
        Row: {
          alert_id: string | null
          id: string
          metadata: Json | null
          metric: string
          timestamp: string | null
        }
        Insert: {
          alert_id?: string | null
          id?: string
          metadata?: Json | null
          metric: string
          timestamp?: string | null
        }
        Update: {
          alert_id?: string | null
          id?: string
          metadata?: Json | null
          metric?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_engagement_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "request_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_matches: {
        Row: {
          alert_id: string | null
          clicked_at: string | null
          delivery_method: string | null
          enquired_at: string | null
          id: string
          match_score: number | null
          request_id: string | null
          sent_at: string | null
          was_clicked: boolean | null
          was_enquired: boolean | null
        }
        Insert: {
          alert_id?: string | null
          clicked_at?: string | null
          delivery_method?: string | null
          enquired_at?: string | null
          id?: string
          match_score?: number | null
          request_id?: string | null
          sent_at?: string | null
          was_clicked?: boolean | null
          was_enquired?: boolean | null
        }
        Update: {
          alert_id?: string | null
          clicked_at?: string | null
          delivery_method?: string | null
          enquired_at?: string | null
          id?: string
          match_score?: number | null
          request_id?: string | null
          sent_at?: string | null
          was_clicked?: boolean | null
          was_enquired?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_matches_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "request_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_matches_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "accommodation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      api_integrations: {
        Row: {
          auth_url: string | null
          avg_rating: number | null
          category: string | null
          created_at: string | null
          description: string | null
          developer_name: string | null
          developer_url: string | null
          docs_url: string | null
          icon_url: string | null
          id: string
          install_count: number | null
          is_free: boolean | null
          long_description: string | null
          monthly_price: number | null
          name: string
          review_count: number | null
          screenshots: string[] | null
          slug: string
          status: string | null
          webhook_url: string | null
        }
        Insert: {
          auth_url?: string | null
          avg_rating?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          developer_name?: string | null
          developer_url?: string | null
          docs_url?: string | null
          icon_url?: string | null
          id?: string
          install_count?: number | null
          is_free?: boolean | null
          long_description?: string | null
          monthly_price?: number | null
          name: string
          review_count?: number | null
          screenshots?: string[] | null
          slug: string
          status?: string | null
          webhook_url?: string | null
        }
        Update: {
          auth_url?: string | null
          avg_rating?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          developer_name?: string | null
          developer_url?: string | null
          docs_url?: string | null
          icon_url?: string | null
          id?: string
          install_count?: number | null
          is_free?: boolean | null
          long_description?: string | null
          monthly_price?: number | null
          name?: string
          review_count?: number | null
          screenshots?: string[] | null
          slug?: string
          status?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          permissions: string[] | null
          rate_limit: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          permissions?: string[] | null
          rate_limit?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          permissions?: string[] | null
          rate_limit?: number | null
          user_id?: string
        }
        Relationships: []
      }
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
      area_yield_data: {
        Row: {
          avg_gross_yield: number | null
          avg_property_price: number | null
          avg_rent_pcm: number | null
          created_at: string | null
          data_date: string | null
          id: string
          latitude: number | null
          longitude: number | null
          postcode_district: string
          price_change_1y: number | null
          sample_size: number | null
          yield_change_1y: number | null
        }
        Insert: {
          avg_gross_yield?: number | null
          avg_property_price?: number | null
          avg_rent_pcm?: number | null
          created_at?: string | null
          data_date?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          postcode_district: string
          price_change_1y?: number | null
          sample_size?: number | null
          yield_change_1y?: number | null
        }
        Update: {
          avg_gross_yield?: number | null
          avg_property_price?: number | null
          avg_rent_pcm?: number | null
          created_at?: string | null
          data_date?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          postcode_district?: string
          price_change_1y?: number | null
          sample_size?: number | null
          yield_change_1y?: number | null
        }
        Relationships: []
      }
      auction_alerts: {
        Row: {
          auction_houses: string[] | null
          created_at: string | null
          id: string
          is_active: boolean | null
          max_guide_price: number | null
          min_yield: number | null
          notify_auction_reminder: boolean | null
          notify_new_lots: boolean | null
          notify_price_changes: boolean | null
          postcodes: string[] | null
          property_types: string[] | null
          reminder_days_before: number | null
          user_id: string
        }
        Insert: {
          auction_houses?: string[] | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_guide_price?: number | null
          min_yield?: number | null
          notify_auction_reminder?: boolean | null
          notify_new_lots?: boolean | null
          notify_price_changes?: boolean | null
          postcodes?: string[] | null
          property_types?: string[] | null
          reminder_days_before?: number | null
          user_id: string
        }
        Update: {
          auction_houses?: string[] | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_guide_price?: number | null
          min_yield?: number | null
          notify_auction_reminder?: boolean | null
          notify_new_lots?: boolean | null
          notify_price_changes?: boolean | null
          postcodes?: string[] | null
          property_types?: string[] | null
          reminder_days_before?: number | null
          user_id?: string
        }
        Relationships: []
      }
      auction_houses: {
        Row: {
          buyer_premium_pct: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          logo_url: string | null
          name: string
          regions: string[] | null
          website: string | null
        }
        Insert: {
          buyer_premium_pct?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          logo_url?: string | null
          name: string
          regions?: string[] | null
          website?: string | null
        }
        Update: {
          buyer_premium_pct?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          logo_url?: string | null
          name?: string
          regions?: string[] | null
          website?: string | null
        }
        Relationships: []
      }
      auction_lots: {
        Row: {
          address: string
          ai_score: number | null
          auction_id: string | null
          bedrooms: number | null
          buyer_premium: number | null
          created_at: string | null
          description: string | null
          estimated_value: number | null
          guide_price: number | null
          has_issues: boolean | null
          has_tenants: boolean | null
          id: string
          images: string[] | null
          issues_summary: string | null
          legal_pack_url: string | null
          lot_number: string
          opportunity_flags: Json | null
          postcode: string | null
          property_type: string | null
          reserve_price: number | null
          risk_flags: Json | null
          sale_price: number | null
          sold: boolean | null
          status: string | null
          tenure: string | null
          total_price: number | null
        }
        Insert: {
          address: string
          ai_score?: number | null
          auction_id?: string | null
          bedrooms?: number | null
          buyer_premium?: number | null
          created_at?: string | null
          description?: string | null
          estimated_value?: number | null
          guide_price?: number | null
          has_issues?: boolean | null
          has_tenants?: boolean | null
          id?: string
          images?: string[] | null
          issues_summary?: string | null
          legal_pack_url?: string | null
          lot_number: string
          opportunity_flags?: Json | null
          postcode?: string | null
          property_type?: string | null
          reserve_price?: number | null
          risk_flags?: Json | null
          sale_price?: number | null
          sold?: boolean | null
          status?: string | null
          tenure?: string | null
          total_price?: number | null
        }
        Update: {
          address?: string
          ai_score?: number | null
          auction_id?: string | null
          bedrooms?: number | null
          buyer_premium?: number | null
          created_at?: string | null
          description?: string | null
          estimated_value?: number | null
          guide_price?: number | null
          has_issues?: boolean | null
          has_tenants?: boolean | null
          id?: string
          images?: string[] | null
          issues_summary?: string | null
          legal_pack_url?: string | null
          lot_number?: string
          opportunity_flags?: Json | null
          postcode?: string | null
          property_type?: string | null
          reserve_price?: number | null
          risk_flags?: Json | null
          sale_price?: number | null
          sold?: boolean | null
          status?: string | null
          tenure?: string | null
          total_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_lots_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_watches: {
        Row: {
          bid_rationale: string | null
          created_at: string | null
          id: string
          lot_id: string | null
          max_bid: number | null
          notes: string | null
          remind_before_hours: number | null
          reminded: boolean | null
          user_id: string
        }
        Insert: {
          bid_rationale?: string | null
          created_at?: string | null
          id?: string
          lot_id?: string | null
          max_bid?: number | null
          notes?: string | null
          remind_before_hours?: number | null
          reminded?: boolean | null
          user_id: string
        }
        Update: {
          bid_rationale?: string | null
          created_at?: string | null
          id?: string
          lot_id?: string | null
          max_bid?: number | null
          notes?: string | null
          remind_before_hours?: number | null
          reminded?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_watches_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "auction_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      auctions: {
        Row: {
          auction_date: string
          auction_house_id: string | null
          auction_type: string | null
          avg_sale_vs_guide: number | null
          catalogue_url: string | null
          created_at: string | null
          id: string
          lots_sold: number | null
          name: string
          status: string | null
          total_lots: number | null
        }
        Insert: {
          auction_date: string
          auction_house_id?: string | null
          auction_type?: string | null
          avg_sale_vs_guide?: number | null
          catalogue_url?: string | null
          created_at?: string | null
          id?: string
          lots_sold?: number | null
          name: string
          status?: string | null
          total_lots?: number | null
        }
        Update: {
          auction_date?: string
          auction_house_id?: string | null
          auction_type?: string | null
          avg_sale_vs_guide?: number | null
          catalogue_url?: string | null
          created_at?: string | null
          id?: string
          lots_sold?: number | null
          name?: string
          status?: string | null
          total_lots?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auctions_auction_house_id_fkey"
            columns: ["auction_house_id"]
            isOneToOne: false
            referencedRelation: "auction_houses"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_workflows: {
        Row: {
          actions: Json
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          last_run_at: string | null
          name: string
          run_count: number | null
          trigger_config: Json | null
          trigger_type: string
          user_id: string
        }
        Insert: {
          actions: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          name: string
          run_count?: number | null
          trigger_config?: Json | null
          trigger_type: string
          user_id: string
        }
        Update: {
          actions?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          name?: string
          run_count?: number | null
          trigger_config?: Json | null
          trigger_type?: string
          user_id?: string
        }
        Relationships: []
      }
      bank_connections: {
        Row: {
          access_token_encrypted: string | null
          account_id: string | null
          account_name: string | null
          account_type: string | null
          created_at: string | null
          currency: string | null
          id: string
          institution_id: string | null
          institution_name: string | null
          last_synced_at: string | null
          provider: string | null
          refresh_token_encrypted: string | null
          status: string | null
          sync_enabled: boolean | null
          token_expires_at: string | null
          user_id: string
        }
        Insert: {
          access_token_encrypted?: string | null
          account_id?: string | null
          account_name?: string | null
          account_type?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          last_synced_at?: string | null
          provider?: string | null
          refresh_token_encrypted?: string | null
          status?: string | null
          sync_enabled?: boolean | null
          token_expires_at?: string | null
          user_id: string
        }
        Update: {
          access_token_encrypted?: string | null
          account_id?: string | null
          account_name?: string | null
          account_type?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          last_synced_at?: string | null
          provider?: string | null
          refresh_token_encrypted?: string | null
          status?: string | null
          sync_enabled?: boolean | null
          token_expires_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bank_rules: {
        Row: {
          assign_category: string | null
          assign_property_id: string | null
          auto_create: boolean | null
          created_at: string | null
          id: string
          is_active: boolean | null
          match_type: string | null
          match_value: string
          rule_name: string | null
          user_id: string
        }
        Insert: {
          assign_category?: string | null
          assign_property_id?: string | null
          auto_create?: boolean | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          match_type?: string | null
          match_value: string
          rule_name?: string | null
          user_id: string
        }
        Update: {
          assign_category?: string | null
          assign_property_id?: string | null
          auto_create?: boolean | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          match_type?: string | null
          match_value?: string
          rule_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_rules_assign_property_id_fkey"
            columns: ["assign_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_transactions: {
        Row: {
          amount: number
          bank_connection_id: string | null
          category_auto: string | null
          category_confirmed: string | null
          created_at: string | null
          description: string | null
          external_id: string | null
          id: string
          matched_transaction_id: string | null
          merchant_name: string | null
          notes: string | null
          property_id_confirmed: string | null
          property_id_suggested: string | null
          status: string | null
          transaction_date: string
          transaction_type: string | null
          user_id: string
        }
        Insert: {
          amount: number
          bank_connection_id?: string | null
          category_auto?: string | null
          category_confirmed?: string | null
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          matched_transaction_id?: string | null
          merchant_name?: string | null
          notes?: string | null
          property_id_confirmed?: string | null
          property_id_suggested?: string | null
          status?: string | null
          transaction_date: string
          transaction_type?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          bank_connection_id?: string | null
          category_auto?: string | null
          category_confirmed?: string | null
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          matched_transaction_id?: string | null
          merchant_name?: string | null
          notes?: string | null
          property_id_confirmed?: string | null
          property_id_suggested?: string | null
          status?: string | null
          transaction_date?: string
          transaction_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_bank_connection_id_fkey"
            columns: ["bank_connection_id"]
            isOneToOne: false
            referencedRelation: "bank_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_property_id_confirmed_fkey"
            columns: ["property_id_confirmed"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_property_id_suggested_fkey"
            columns: ["property_id_suggested"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      benchmark_data: {
        Row: {
          avg_capital_growth_1y: number | null
          avg_expense_ratio: number | null
          avg_gross_yield: number | null
          avg_net_yield: number | null
          avg_rent_growth_1y: number | null
          avg_roi: number | null
          avg_void_rate: number | null
          created_at: string | null
          data_date: string | null
          data_period: string | null
          id: string
          property_type: string | null
          region: string | null
        }
        Insert: {
          avg_capital_growth_1y?: number | null
          avg_expense_ratio?: number | null
          avg_gross_yield?: number | null
          avg_net_yield?: number | null
          avg_rent_growth_1y?: number | null
          avg_roi?: number | null
          avg_void_rate?: number | null
          created_at?: string | null
          data_date?: string | null
          data_period?: string | null
          id?: string
          property_type?: string | null
          region?: string | null
        }
        Update: {
          avg_capital_growth_1y?: number | null
          avg_expense_ratio?: number | null
          avg_gross_yield?: number | null
          avg_net_yield?: number | null
          avg_rent_growth_1y?: number | null
          avg_roi?: number | null
          avg_void_rate?: number | null
          created_at?: string | null
          data_date?: string | null
          data_period?: string | null
          id?: string
          property_type?: string | null
          region?: string | null
        }
        Relationships: []
      }
      bid_calculations: {
        Row: {
          created_at: string | null
          id: string
          lot_id: string | null
          max_bid: number | null
          purchase_costs: Json | null
          recommended_bid: number | null
          refurb_costs: number | null
          strategy: string | null
          target_profit: number | null
          target_yield: number | null
          user_id: string
          walk_away_price: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lot_id?: string | null
          max_bid?: number | null
          purchase_costs?: Json | null
          recommended_bid?: number | null
          refurb_costs?: number | null
          strategy?: string | null
          target_profit?: number | null
          target_yield?: number | null
          user_id: string
          walk_away_price?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lot_id?: string | null
          max_bid?: number | null
          purchase_costs?: Json | null
          recommended_bid?: number | null
          refurb_costs?: number | null
          strategy?: string | null
          target_profit?: number | null
          target_yield?: number | null
          user_id?: string
          walk_away_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_calculations_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "auction_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_profiles: {
        Row: {
          address: string | null
          company_name: string
          company_number: string | null
          created_at: string | null
          email: string | null
          font_family: string | null
          id: string
          instagram_handle: string | null
          is_default: boolean | null
          linkedin_url: string | null
          logo_url: string | null
          phone: string | null
          primary_color: string | null
          secondary_color: string | null
          tagline: string | null
          twitter_handle: string | null
          updated_at: string | null
          user_id: string
          vat_number: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          company_name: string
          company_number?: string | null
          created_at?: string | null
          email?: string | null
          font_family?: string | null
          id?: string
          instagram_handle?: string | null
          is_default?: boolean | null
          linkedin_url?: string | null
          logo_url?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tagline?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
          user_id: string
          vat_number?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string
          company_number?: string | null
          created_at?: string | null
          email?: string | null
          font_family?: string | null
          id?: string
          instagram_handle?: string | null
          is_default?: boolean | null
          linkedin_url?: string | null
          logo_url?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tagline?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
          user_id?: string
          vat_number?: string | null
          website?: string | null
        }
        Relationships: []
      }
      bridging_calculations: {
        Row: {
          arrangement_fee: number | null
          arrangement_fee_percent: number | null
          created_at: string | null
          exit_fee: number | null
          exit_fee_percent: number | null
          exit_strategy: string | null
          gross_interest: number | null
          id: string
          interest_rate_monthly: number | null
          legal_fee: number | null
          loan_amount: number | null
          loan_purpose: string | null
          ltv: number | null
          property_value: number | null
          purchase_price: number | null
          term_months: number | null
          total_cost: number | null
          total_repayable: number | null
          user_id: string
          valuation_fee: number | null
        }
        Insert: {
          arrangement_fee?: number | null
          arrangement_fee_percent?: number | null
          created_at?: string | null
          exit_fee?: number | null
          exit_fee_percent?: number | null
          exit_strategy?: string | null
          gross_interest?: number | null
          id?: string
          interest_rate_monthly?: number | null
          legal_fee?: number | null
          loan_amount?: number | null
          loan_purpose?: string | null
          ltv?: number | null
          property_value?: number | null
          purchase_price?: number | null
          term_months?: number | null
          total_cost?: number | null
          total_repayable?: number | null
          user_id: string
          valuation_fee?: number | null
        }
        Update: {
          arrangement_fee?: number | null
          arrangement_fee_percent?: number | null
          created_at?: string | null
          exit_fee?: number | null
          exit_fee_percent?: number | null
          exit_strategy?: string | null
          gross_interest?: number | null
          id?: string
          interest_rate_monthly?: number | null
          legal_fee?: number | null
          loan_amount?: number | null
          loan_purpose?: string | null
          ltv?: number | null
          property_value?: number | null
          purchase_price?: number | null
          term_months?: number | null
          total_cost?: number | null
          total_repayable?: number | null
          user_id?: string
          valuation_fee?: number | null
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
      calculations: {
        Row: {
          calculator_type: string | null
          created_at: string | null
          id: string
          inputs: Json | null
          property_id: string | null
          results: Json | null
          user_id: string
        }
        Insert: {
          calculator_type?: string | null
          created_at?: string | null
          id?: string
          inputs?: Json | null
          property_id?: string | null
          results?: Json | null
          user_id: string
        }
        Update: {
          calculator_type?: string | null
          created_at?: string | null
          id?: string
          inputs?: Json | null
          property_id?: string | null
          results?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_blocks: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          notes: string | null
          reason: string | null
          source_platform: string | null
          start_date: string
          str_property_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          notes?: string | null
          reason?: string | null
          source_platform?: string | null
          start_date: string
          str_property_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          notes?: string | null
          reason?: string | null
          source_platform?: string | null
          start_date?: string
          str_property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_blocks_str_property_id_fkey"
            columns: ["str_property_id"]
            isOneToOne: false
            referencedRelation: "str_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_documents: {
        Row: {
          claim_id: string
          document_name: string | null
          document_type: string | null
          document_url: string
          id: string
          uploaded_at: string | null
        }
        Insert: {
          claim_id: string
          document_name?: string | null
          document_type?: string | null
          document_url: string
          id?: string
          uploaded_at?: string | null
        }
        Update: {
          claim_id?: string
          document_name?: string | null
          document_type?: string | null
          document_url?: string
          id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_documents_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "insurance_claims"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_timeline: {
        Row: {
          claim_id: string
          created_by: string | null
          event_date: string | null
          event_description: string | null
          event_type: string
          id: string
        }
        Insert: {
          claim_id: string
          created_by?: string | null
          event_date?: string | null
          event_description?: string | null
          event_type: string
          id?: string
        }
        Update: {
          claim_id?: string
          created_by?: string | null
          event_date?: string | null
          event_description?: string | null
          event_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_timeline_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "insurance_claims"
            referencedColumns: ["id"]
          },
        ]
      }
      cma_reports: {
        Row: {
          active_comparables: Json | null
          confidence_level: number | null
          created_at: string | null
          estimated_rent: number | null
          estimated_yield: number | null
          id: string
          market_value_estimate: number | null
          price_vs_market_pct: number | null
          property_id: string | null
          rental_comparables: Json | null
          sold_comparables: Json | null
          subject_address: string
          subject_postcode: string
          subject_price: number | null
          user_id: string
        }
        Insert: {
          active_comparables?: Json | null
          confidence_level?: number | null
          created_at?: string | null
          estimated_rent?: number | null
          estimated_yield?: number | null
          id?: string
          market_value_estimate?: number | null
          price_vs_market_pct?: number | null
          property_id?: string | null
          rental_comparables?: Json | null
          sold_comparables?: Json | null
          subject_address: string
          subject_postcode: string
          subject_price?: number | null
          user_id: string
        }
        Update: {
          active_comparables?: Json | null
          confidence_level?: number | null
          created_at?: string | null
          estimated_rent?: number | null
          estimated_yield?: number | null
          id?: string
          market_value_estimate?: number | null
          price_vs_market_pct?: number | null
          property_id?: string | null
          rental_comparables?: Json | null
          sold_comparables?: Json | null
          subject_address?: string
          subject_postcode?: string
          subject_price?: number | null
          user_id?: string
        }
        Relationships: []
      }
      commission_tiers: {
        Row: {
          created_at: string | null
          enterprise_rate: number | null
          id: string
          is_active: boolean | null
          min_referrals: number | null
          monthly_bonus_amount: number | null
          monthly_bonus_threshold: number | null
          name: string
          perks: Json | null
          pro_rate: number | null
          recurring_months: number | null
          signup_commission: number | null
          starter_rate: number | null
        }
        Insert: {
          created_at?: string | null
          enterprise_rate?: number | null
          id?: string
          is_active?: boolean | null
          min_referrals?: number | null
          monthly_bonus_amount?: number | null
          monthly_bonus_threshold?: number | null
          name: string
          perks?: Json | null
          pro_rate?: number | null
          recurring_months?: number | null
          signup_commission?: number | null
          starter_rate?: number | null
        }
        Update: {
          created_at?: string | null
          enterprise_rate?: number | null
          id?: string
          is_active?: boolean | null
          min_referrals?: number | null
          monthly_bonus_amount?: number | null
          monthly_bonus_threshold?: number | null
          name?: string
          perks?: Json | null
          pro_rate?: number | null
          recurring_months?: number | null
          signup_commission?: number | null
          starter_rate?: number | null
        }
        Relationships: []
      }
      commissions: {
        Row: {
          affiliate_id: string | null
          amount: number
          commission_amount: number
          commission_rate: number
          created_at: string | null
          customer_amount: number | null
          description: string | null
          id: string
          paid_at: string | null
          payout_id: string | null
          referral_id: string | null
          status: string | null
          stripe_payment_id: string | null
          type: string
        }
        Insert: {
          affiliate_id?: string | null
          amount: number
          commission_amount: number
          commission_rate: number
          created_at?: string | null
          customer_amount?: number | null
          description?: string | null
          id?: string
          paid_at?: string | null
          payout_id?: string | null
          referral_id?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          type: string
        }
        Update: {
          affiliate_id?: string | null
          amount?: number
          commission_amount?: number
          commission_rate?: number
          created_at?: string | null
          customer_amount?: number | null
          description?: string | null
          id?: string
          paid_at?: string | null
          payout_id?: string | null
          referral_id?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "payouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
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
      comparison_shares: {
        Row: {
          access_level: string | null
          comments: Json | null
          comparison_id: string
          created_at: string
          id: string
          shared_by: string
          shared_with_email: string
          viewed_at: string | null
        }
        Insert: {
          access_level?: string | null
          comments?: Json | null
          comparison_id: string
          created_at?: string
          id?: string
          shared_by: string
          shared_with_email: string
          viewed_at?: string | null
        }
        Update: {
          access_level?: string | null
          comments?: Json | null
          comparison_id?: string
          created_at?: string
          id?: string
          shared_by?: string
          shared_with_email?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comparison_shares_comparison_id_fkey"
            columns: ["comparison_id"]
            isOneToOne: false
            referencedRelation: "comparisons"
            referencedColumns: ["id"]
          },
        ]
      }
      comparison_snapshots: {
        Row: {
          comparison_id: string
          id: string
          market_conditions: Json | null
          property_data: Json
          snapshot_date: string
        }
        Insert: {
          comparison_id: string
          id?: string
          market_conditions?: Json | null
          property_data: Json
          snapshot_date?: string
        }
        Update: {
          comparison_id?: string
          id?: string
          market_conditions?: Json | null
          property_data?: Json
          snapshot_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "comparison_snapshots_comparison_id_fkey"
            columns: ["comparison_id"]
            isOneToOne: false
            referencedRelation: "comparisons"
            referencedColumns: ["id"]
          },
        ]
      }
      comparison_watches: {
        Row: {
          alert_frequency: string | null
          alert_on_price_change: boolean | null
          alert_on_status_change: boolean | null
          comparison_id: string
          created_at: string
          id: string
          is_active: boolean | null
          last_alert_sent: string | null
          price_threshold: number | null
          user_id: string
        }
        Insert: {
          alert_frequency?: string | null
          alert_on_price_change?: boolean | null
          alert_on_status_change?: boolean | null
          comparison_id: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_alert_sent?: string | null
          price_threshold?: number | null
          user_id: string
        }
        Update: {
          alert_frequency?: string | null
          alert_on_price_change?: boolean | null
          alert_on_status_change?: boolean | null
          comparison_id?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_alert_sent?: string | null
          price_threshold?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comparison_watches_comparison_id_fkey"
            columns: ["comparison_id"]
            isOneToOne: false
            referencedRelation: "comparisons"
            referencedColumns: ["id"]
          },
        ]
      }
      comparisons: {
        Row: {
          ai_recommendation: Json | null
          calculator_inputs: Json | null
          chosen_property_id: string | null
          created_at: string
          decision_date: string | null
          decision_made: boolean | null
          decision_notes: string | null
          decision_reasons: Json | null
          description: string | null
          id: string
          name: string
          notes: string | null
          property_data: Json | null
          property_ids: string[]
          updated_at: string
          user_id: string
          user_ranking: Json | null
        }
        Insert: {
          ai_recommendation?: Json | null
          calculator_inputs?: Json | null
          chosen_property_id?: string | null
          created_at?: string
          decision_date?: string | null
          decision_made?: boolean | null
          decision_notes?: string | null
          decision_reasons?: Json | null
          description?: string | null
          id?: string
          name: string
          notes?: string | null
          property_data?: Json | null
          property_ids?: string[]
          updated_at?: string
          user_id: string
          user_ranking?: Json | null
        }
        Update: {
          ai_recommendation?: Json | null
          calculator_inputs?: Json | null
          chosen_property_id?: string | null
          created_at?: string
          decision_date?: string | null
          decision_made?: boolean | null
          decision_notes?: string | null
          decision_reasons?: Json | null
          description?: string | null
          id?: string
          name?: string
          notes?: string | null
          property_data?: Json | null
          property_ids?: string[]
          updated_at?: string
          user_id?: string
          user_ranking?: Json | null
        }
        Relationships: []
      }
      compliance_alerts: {
        Row: {
          alert_type: string | null
          compliance_item_id: string | null
          email_opened: boolean | null
          email_sent: boolean | null
          id: string
          sent_at: string | null
        }
        Insert: {
          alert_type?: string | null
          compliance_item_id?: string | null
          email_opened?: boolean | null
          email_sent?: boolean | null
          id?: string
          sent_at?: string | null
        }
        Update: {
          alert_type?: string | null
          compliance_item_id?: string | null
          email_opened?: boolean | null
          email_sent?: boolean | null
          id?: string
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_alerts_compliance_item_id_fkey"
            columns: ["compliance_item_id"]
            isOneToOne: false
            referencedRelation: "compliance_items"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_items: {
        Row: {
          auto_renew: boolean | null
          certificate_number: string | null
          certificate_url: string | null
          compliance_type: string
          contractor_name: string | null
          contractor_phone: string | null
          cost: number | null
          created_at: string | null
          document_url: string | null
          expiry_date: string
          id: string
          issued_date: string | null
          portfolio_property_id: string | null
          reminder_days_before: number | null
          reminder_sent: boolean | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          certificate_number?: string | null
          certificate_url?: string | null
          compliance_type: string
          contractor_name?: string | null
          contractor_phone?: string | null
          cost?: number | null
          created_at?: string | null
          document_url?: string | null
          expiry_date: string
          id?: string
          issued_date?: string | null
          portfolio_property_id?: string | null
          reminder_days_before?: number | null
          reminder_sent?: boolean | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          certificate_number?: string | null
          certificate_url?: string | null
          compliance_type?: string
          contractor_name?: string | null
          contractor_phone?: string | null
          cost?: number | null
          created_at?: string | null
          document_url?: string | null
          expiry_date?: string
          id?: string
          issued_date?: string | null
          portfolio_property_id?: string | null
          reminder_days_before?: number | null
          reminder_sent?: boolean | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_items_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_templates: {
        Row: {
          applies_to: string[] | null
          compliance_type: string
          created_at: string | null
          default_reminder_days: number | null
          description: string | null
          display_name: string
          id: string
          is_mandatory: boolean | null
          legal_requirement: string | null
          more_info_url: string | null
          penalty_for_non_compliance: string | null
          validity_months: number | null
        }
        Insert: {
          applies_to?: string[] | null
          compliance_type: string
          created_at?: string | null
          default_reminder_days?: number | null
          description?: string | null
          display_name: string
          id?: string
          is_mandatory?: boolean | null
          legal_requirement?: string | null
          more_info_url?: string | null
          penalty_for_non_compliance?: string | null
          validity_months?: number | null
        }
        Update: {
          applies_to?: string[] | null
          compliance_type?: string
          created_at?: string | null
          default_reminder_days?: number | null
          description?: string | null
          display_name?: string
          id?: string
          is_mandatory?: boolean | null
          legal_requirement?: string | null
          more_info_url?: string | null
          penalty_for_non_compliance?: string | null
          validity_months?: number | null
        }
        Relationships: []
      }
      contractor_categories: {
        Row: {
          category_name: string
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          slug: string
          typical_callout_fee: number | null
          typical_hourly_rate_max: number | null
          typical_hourly_rate_min: number | null
        }
        Insert: {
          category_name: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          slug: string
          typical_callout_fee?: number | null
          typical_hourly_rate_max?: number | null
          typical_hourly_rate_min?: number | null
        }
        Update: {
          category_name?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          slug?: string
          typical_callout_fee?: number | null
          typical_hourly_rate_max?: number | null
          typical_hourly_rate_min?: number | null
        }
        Relationships: []
      }
      contractor_reviews: {
        Row: {
          communication_rating: number | null
          contractor_id: string | null
          contractor_response: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          is_verified: boolean | null
          overall_rating: number
          punctuality_rating: number | null
          quality_rating: number | null
          review_text: string | null
          user_id: string
          value_rating: number | null
        }
        Insert: {
          communication_rating?: number | null
          contractor_id?: string | null
          contractor_response?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_verified?: boolean | null
          overall_rating: number
          punctuality_rating?: number | null
          quality_rating?: number | null
          review_text?: string | null
          user_id: string
          value_rating?: number | null
        }
        Update: {
          communication_rating?: number | null
          contractor_id?: string | null
          contractor_response?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_verified?: boolean | null
          overall_rating?: number
          punctuality_rating?: number | null
          quality_rating?: number | null
          review_text?: string | null
          user_id?: string
          value_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_reviews_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractors: {
        Row: {
          avg_rating: number | null
          bio: string | null
          business_name: string
          callout_fee: number | null
          commission_rate: number | null
          coverage_areas: string[] | null
          coverage_radius_miles: number | null
          created_at: string | null
          day_rate: number | null
          dbs_checked: boolean | null
          email: string
          emergency_callout: boolean | null
          free_quotes: boolean | null
          gas_safe_number: string | null
          half_day_rate: number | null
          has_public_liability: boolean | null
          home_postcode: string | null
          hourly_rate: number | null
          id: string
          insurance_expiry_date: string | null
          is_active: boolean | null
          is_featured: boolean | null
          is_gas_safe_registered: boolean | null
          is_niceic_registered: boolean | null
          is_vetted: boolean | null
          logo_url: string | null
          niceic_number: string | null
          other_certifications: string[] | null
          phone: string | null
          public_liability_amount: number | null
          references_checked: boolean | null
          total_jobs_completed: number | null
          total_reviews: number | null
          trading_as: string | null
          updated_at: string | null
          vetted_at: string | null
          website_url: string | null
        }
        Insert: {
          avg_rating?: number | null
          bio?: string | null
          business_name: string
          callout_fee?: number | null
          commission_rate?: number | null
          coverage_areas?: string[] | null
          coverage_radius_miles?: number | null
          created_at?: string | null
          day_rate?: number | null
          dbs_checked?: boolean | null
          email: string
          emergency_callout?: boolean | null
          free_quotes?: boolean | null
          gas_safe_number?: string | null
          half_day_rate?: number | null
          has_public_liability?: boolean | null
          home_postcode?: string | null
          hourly_rate?: number | null
          id?: string
          insurance_expiry_date?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_gas_safe_registered?: boolean | null
          is_niceic_registered?: boolean | null
          is_vetted?: boolean | null
          logo_url?: string | null
          niceic_number?: string | null
          other_certifications?: string[] | null
          phone?: string | null
          public_liability_amount?: number | null
          references_checked?: boolean | null
          total_jobs_completed?: number | null
          total_reviews?: number | null
          trading_as?: string | null
          updated_at?: string | null
          vetted_at?: string | null
          website_url?: string | null
        }
        Update: {
          avg_rating?: number | null
          bio?: string | null
          business_name?: string
          callout_fee?: number | null
          commission_rate?: number | null
          coverage_areas?: string[] | null
          coverage_radius_miles?: number | null
          created_at?: string | null
          day_rate?: number | null
          dbs_checked?: boolean | null
          email?: string
          emergency_callout?: boolean | null
          free_quotes?: boolean | null
          gas_safe_number?: string | null
          half_day_rate?: number | null
          has_public_liability?: boolean | null
          home_postcode?: string | null
          hourly_rate?: number | null
          id?: string
          insurance_expiry_date?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_gas_safe_registered?: boolean | null
          is_niceic_registered?: boolean | null
          is_vetted?: boolean | null
          logo_url?: string | null
          niceic_number?: string | null
          other_certifications?: string[] | null
          phone?: string | null
          public_liability_amount?: number | null
          references_checked?: boolean | null
          total_jobs_completed?: number | null
          total_reviews?: number | null
          trading_as?: string | null
          updated_at?: string | null
          vetted_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      conveyancing_firms: {
        Row: {
          avg_completion_days: number | null
          commission_amount: number | null
          commission_type: string | null
          coverage_areas: string[] | null
          cqs_accredited: boolean | null
          created_at: string | null
          dedicated_conveyancer: boolean | null
          display_order: number | null
          firm_name: string
          handles_btl: boolean | null
          handles_leasehold: boolean | null
          handles_ltd_company: boolean | null
          handles_new_build: boolean | null
          handles_purchases: boolean | null
          handles_remortgage: boolean | null
          handles_sales: boolean | null
          handles_transfer_equity: boolean | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          offers_fixed_fee: boolean | null
          offers_no_sale_no_fee: boolean | null
          offers_online_tracking: boolean | null
          purchase_fee_from: number | null
          referral_link: string | null
          referral_partner: string | null
          remortgage_fee_from: number | null
          reviews_count: number | null
          sale_fee_from: number | null
          sra_number: string | null
          trustpilot_rating: number | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          avg_completion_days?: number | null
          commission_amount?: number | null
          commission_type?: string | null
          coverage_areas?: string[] | null
          cqs_accredited?: boolean | null
          created_at?: string | null
          dedicated_conveyancer?: boolean | null
          display_order?: number | null
          firm_name: string
          handles_btl?: boolean | null
          handles_leasehold?: boolean | null
          handles_ltd_company?: boolean | null
          handles_new_build?: boolean | null
          handles_purchases?: boolean | null
          handles_remortgage?: boolean | null
          handles_sales?: boolean | null
          handles_transfer_equity?: boolean | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          offers_fixed_fee?: boolean | null
          offers_no_sale_no_fee?: boolean | null
          offers_online_tracking?: boolean | null
          purchase_fee_from?: number | null
          referral_link?: string | null
          referral_partner?: string | null
          remortgage_fee_from?: number | null
          reviews_count?: number | null
          sale_fee_from?: number | null
          sra_number?: string | null
          trustpilot_rating?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          avg_completion_days?: number | null
          commission_amount?: number | null
          commission_type?: string | null
          coverage_areas?: string[] | null
          cqs_accredited?: boolean | null
          created_at?: string | null
          dedicated_conveyancer?: boolean | null
          display_order?: number | null
          firm_name?: string
          handles_btl?: boolean | null
          handles_leasehold?: boolean | null
          handles_ltd_company?: boolean | null
          handles_new_build?: boolean | null
          handles_purchases?: boolean | null
          handles_remortgage?: boolean | null
          handles_sales?: boolean | null
          handles_transfer_equity?: boolean | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          offers_fixed_fee?: boolean | null
          offers_no_sale_no_fee?: boolean | null
          offers_online_tracking?: boolean | null
          purchase_fee_from?: number | null
          referral_link?: string | null
          referral_partner?: string | null
          remortgage_fee_from?: number | null
          reviews_count?: number | null
          sale_fee_from?: number | null
          sra_number?: string | null
          trustpilot_rating?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      conveyancing_instructions: {
        Row: {
          actual_completion_date: string | null
          commission_amount: number | null
          commission_date: string | null
          commission_status: string | null
          completion_statement_url: string | null
          contract_pdf_url: string | null
          created_at: string | null
          disbursements: number | null
          expected_completion_date: string | null
          firm_id: string | null
          firm_name: string | null
          id: string
          instructed_date: string | null
          legal_fee: number | null
          property_address: string | null
          quote_id: string | null
          referral_click_id: string | null
          status: string | null
          total_cost: number | null
          transaction_type: string | null
          transaction_value: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_completion_date?: string | null
          commission_amount?: number | null
          commission_date?: string | null
          commission_status?: string | null
          completion_statement_url?: string | null
          contract_pdf_url?: string | null
          created_at?: string | null
          disbursements?: number | null
          expected_completion_date?: string | null
          firm_id?: string | null
          firm_name?: string | null
          id?: string
          instructed_date?: string | null
          legal_fee?: number | null
          property_address?: string | null
          quote_id?: string | null
          referral_click_id?: string | null
          status?: string | null
          total_cost?: number | null
          transaction_type?: string | null
          transaction_value?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_completion_date?: string | null
          commission_amount?: number | null
          commission_date?: string | null
          commission_status?: string | null
          completion_statement_url?: string | null
          contract_pdf_url?: string | null
          created_at?: string | null
          disbursements?: number | null
          expected_completion_date?: string | null
          firm_id?: string | null
          firm_name?: string | null
          id?: string
          instructed_date?: string | null
          legal_fee?: number | null
          property_address?: string | null
          quote_id?: string | null
          referral_click_id?: string | null
          status?: string | null
          total_cost?: number | null
          transaction_type?: string | null
          transaction_value?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conveyancing_instructions_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "conveyancing_firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conveyancing_instructions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "conveyancing_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      conveyancing_quotes: {
        Row: {
          chain_position: string | null
          created_at: string | null
          expires_at: string | null
          has_outstanding_mortgage: boolean | null
          has_survey: boolean | null
          id: string
          is_btl: boolean | null
          is_cash_buyer: boolean | null
          is_first_time_buyer: boolean | null
          is_help_to_buy: boolean | null
          is_ltd_company: boolean | null
          is_shared_ownership: boolean | null
          needs_mortgage: boolean | null
          purchase_postcode: string | null
          purchase_price: number | null
          purchase_property_type: string | null
          quotes: Json | null
          remortgage_postcode: string | null
          remortgage_value: number | null
          sale_postcode: string | null
          sale_price: number | null
          sale_property_type: string | null
          status: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          chain_position?: string | null
          created_at?: string | null
          expires_at?: string | null
          has_outstanding_mortgage?: boolean | null
          has_survey?: boolean | null
          id?: string
          is_btl?: boolean | null
          is_cash_buyer?: boolean | null
          is_first_time_buyer?: boolean | null
          is_help_to_buy?: boolean | null
          is_ltd_company?: boolean | null
          is_shared_ownership?: boolean | null
          needs_mortgage?: boolean | null
          purchase_postcode?: string | null
          purchase_price?: number | null
          purchase_property_type?: string | null
          quotes?: Json | null
          remortgage_postcode?: string | null
          remortgage_value?: number | null
          sale_postcode?: string | null
          sale_price?: number | null
          sale_property_type?: string | null
          status?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          chain_position?: string | null
          created_at?: string | null
          expires_at?: string | null
          has_outstanding_mortgage?: boolean | null
          has_survey?: boolean | null
          id?: string
          is_btl?: boolean | null
          is_cash_buyer?: boolean | null
          is_first_time_buyer?: boolean | null
          is_help_to_buy?: boolean | null
          is_ltd_company?: boolean | null
          is_shared_ownership?: boolean | null
          needs_mortgage?: boolean | null
          purchase_postcode?: string | null
          purchase_price?: number | null
          purchase_property_type?: string | null
          quotes?: Json | null
          remortgage_postcode?: string | null
          remortgage_value?: number | null
          sale_postcode?: string | null
          sale_price?: number | null
          sale_property_type?: string | null
          status?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      copilot_conversations: {
        Row: {
          context_property_id: string | null
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context_property_id?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context_property_id?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      copilot_knowledge: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          keywords: string[] | null
          source_url: string | null
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          source_url?: string | null
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      copilot_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          feedback: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "copilot_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "copilot_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_checks: {
        Row: {
          affordability_pass: boolean | null
          application_id: string
          bankruptcies: number | null
          ccjs: number | null
          checked_at: string | null
          credit_score: number | null
          external_reference: string | null
          id: string
          provider: string | null
          recommendation: string | null
          rent_to_income_ratio: number | null
          report_url: string | null
          score_band: string | null
        }
        Insert: {
          affordability_pass?: boolean | null
          application_id: string
          bankruptcies?: number | null
          ccjs?: number | null
          checked_at?: string | null
          credit_score?: number | null
          external_reference?: string | null
          id?: string
          provider?: string | null
          recommendation?: string | null
          rent_to_income_ratio?: number | null
          report_url?: string | null
          score_band?: string | null
        }
        Update: {
          affordability_pass?: boolean | null
          application_id?: string
          bankruptcies?: number | null
          ccjs?: number | null
          checked_at?: string | null
          credit_score?: number | null
          external_reference?: string | null
          id?: string
          provider?: string | null
          recommendation?: string | null
          rent_to_income_ratio?: number | null
          report_url?: string | null
          score_band?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_checks_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "tenant_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      crime_incidents: {
        Row: {
          category: string
          context: string | null
          created_at: string | null
          crime_id: string | null
          id: string
          latitude: number | null
          longitude: number | null
          month: string
          outcome_category: string | null
          outcome_date: string | null
          outcome_status: string | null
          police_force: string | null
          street_name: string | null
        }
        Insert: {
          category: string
          context?: string | null
          created_at?: string | null
          crime_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          month: string
          outcome_category?: string | null
          outcome_date?: string | null
          outcome_status?: string | null
          police_force?: string | null
          street_name?: string | null
        }
        Update: {
          category?: string
          context?: string | null
          created_at?: string | null
          crime_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          month?: string
          outcome_category?: string | null
          outcome_date?: string | null
          outcome_status?: string | null
          police_force?: string | null
          street_name?: string | null
        }
        Relationships: []
      }
      crime_statistics: {
        Row: {
          antisocial_behaviour: number | null
          bicycle_theft: number | null
          burglary: number | null
          created_at: string | null
          crime_trend: string | null
          crimes_per_1000_people: number | null
          criminal_damage: number | null
          data_period_end: string | null
          data_period_start: string | null
          drugs: number | null
          id: string
          last_updated_at: string | null
          latitude: number | null
          longitude: number | null
          monthly_data: Json | null
          neighbourhood_id: string | null
          neighbourhood_name: string | null
          other_crime: number | null
          other_theft: number | null
          police_force: string | null
          possession_weapons: number | null
          postcode: string
          property_address: string
          public_order: number | null
          robbery: number | null
          safety_rating: string | null
          safety_score: number | null
          shoplifting: number | null
          theft_from_person: number | null
          total_crimes: number | null
          trend_percentage: number | null
          vehicle_crime: number | null
          violence_sexual_offences: number | null
          vs_force_average: string | null
          vs_national_average: string | null
        }
        Insert: {
          antisocial_behaviour?: number | null
          bicycle_theft?: number | null
          burglary?: number | null
          created_at?: string | null
          crime_trend?: string | null
          crimes_per_1000_people?: number | null
          criminal_damage?: number | null
          data_period_end?: string | null
          data_period_start?: string | null
          drugs?: number | null
          id?: string
          last_updated_at?: string | null
          latitude?: number | null
          longitude?: number | null
          monthly_data?: Json | null
          neighbourhood_id?: string | null
          neighbourhood_name?: string | null
          other_crime?: number | null
          other_theft?: number | null
          police_force?: string | null
          possession_weapons?: number | null
          postcode: string
          property_address: string
          public_order?: number | null
          robbery?: number | null
          safety_rating?: string | null
          safety_score?: number | null
          shoplifting?: number | null
          theft_from_person?: number | null
          total_crimes?: number | null
          trend_percentage?: number | null
          vehicle_crime?: number | null
          violence_sexual_offences?: number | null
          vs_force_average?: string | null
          vs_national_average?: string | null
        }
        Update: {
          antisocial_behaviour?: number | null
          bicycle_theft?: number | null
          burglary?: number | null
          created_at?: string | null
          crime_trend?: string | null
          crimes_per_1000_people?: number | null
          criminal_damage?: number | null
          data_period_end?: string | null
          data_period_start?: string | null
          drugs?: number | null
          id?: string
          last_updated_at?: string | null
          latitude?: number | null
          longitude?: number | null
          monthly_data?: Json | null
          neighbourhood_id?: string | null
          neighbourhood_name?: string | null
          other_crime?: number | null
          other_theft?: number | null
          police_force?: string | null
          possession_weapons?: number | null
          postcode?: string
          property_address?: string
          public_order?: number | null
          robbery?: number | null
          safety_rating?: string | null
          safety_score?: number | null
          shoplifting?: number | null
          theft_from_person?: number | null
          total_crimes?: number | null
          trend_percentage?: number | null
          vehicle_crime?: number | null
          violence_sexual_offences?: number | null
          vs_force_average?: string | null
          vs_national_average?: string | null
        }
        Relationships: []
      }
      currency_settings: {
        Row: {
          auto_convert: boolean | null
          created_at: string | null
          display_currency: string | null
          home_currency: string | null
          id: string
          user_id: string
        }
        Insert: {
          auto_convert?: boolean | null
          created_at?: string | null
          display_currency?: string | null
          home_currency?: string | null
          id?: string
          user_id: string
        }
        Update: {
          auto_convert?: boolean | null
          created_at?: string | null
          display_currency?: string | null
          home_currency?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      dashboard_widgets: {
        Row: {
          created_at: string | null
          height: number | null
          id: string
          is_visible: boolean | null
          position_x: number | null
          position_y: number | null
          user_id: string
          widget_config: Json | null
          widget_type: string
          width: number | null
        }
        Insert: {
          created_at?: string | null
          height?: number | null
          id?: string
          is_visible?: boolean | null
          position_x?: number | null
          position_y?: number | null
          user_id: string
          widget_config?: Json | null
          widget_type: string
          width?: number | null
        }
        Update: {
          created_at?: string | null
          height?: number | null
          id?: string
          is_visible?: boolean | null
          position_x?: number | null
          position_y?: number | null
          user_id?: string
          widget_config?: Json | null
          widget_type?: string
          width?: number | null
        }
        Relationships: []
      }
      deal_analyses: {
        Row: {
          annual_cash_flow: number | null
          area_data: Json | null
          arv: number | null
          asking_price: number | null
          bathrooms: number | null
          bedrooms: number | null
          cash_on_cash: number | null
          costs_breakdown: Json | null
          created_at: string | null
          deal_score: number | null
          finance_type: string | null
          five_year_projection: Json | null
          gross_yield: number | null
          id: string
          interest_only: boolean | null
          interest_rate: number | null
          ltv: number | null
          monthly_cash_flow: number | null
          mortgage_term: number | null
          net_yield: number | null
          notes: string | null
          offer_price: number | null
          postcode: string | null
          property_address: string | null
          property_type: string | null
          purchase_type: string | null
          refurb_heavy: number | null
          refurb_light: number | null
          refurb_medium: number | null
          rental_comparables: Json | null
          risk_assessment: Json | null
          roi_year_1: number | null
          score_breakdown: Json | null
          sold_comparables: Json | null
          source_platform: string | null
          source_url: string | null
          square_footage: number | null
          status: string | null
          strategy: string | null
          strategy_inputs: Json | null
          stress_test: Json | null
          tax_implications: Json | null
          total_cash_required: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          annual_cash_flow?: number | null
          area_data?: Json | null
          arv?: number | null
          asking_price?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          cash_on_cash?: number | null
          costs_breakdown?: Json | null
          created_at?: string | null
          deal_score?: number | null
          finance_type?: string | null
          five_year_projection?: Json | null
          gross_yield?: number | null
          id?: string
          interest_only?: boolean | null
          interest_rate?: number | null
          ltv?: number | null
          monthly_cash_flow?: number | null
          mortgage_term?: number | null
          net_yield?: number | null
          notes?: string | null
          offer_price?: number | null
          postcode?: string | null
          property_address?: string | null
          property_type?: string | null
          purchase_type?: string | null
          refurb_heavy?: number | null
          refurb_light?: number | null
          refurb_medium?: number | null
          rental_comparables?: Json | null
          risk_assessment?: Json | null
          roi_year_1?: number | null
          score_breakdown?: Json | null
          sold_comparables?: Json | null
          source_platform?: string | null
          source_url?: string | null
          square_footage?: number | null
          status?: string | null
          strategy?: string | null
          strategy_inputs?: Json | null
          stress_test?: Json | null
          tax_implications?: Json | null
          total_cash_required?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          annual_cash_flow?: number | null
          area_data?: Json | null
          arv?: number | null
          asking_price?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          cash_on_cash?: number | null
          costs_breakdown?: Json | null
          created_at?: string | null
          deal_score?: number | null
          finance_type?: string | null
          five_year_projection?: Json | null
          gross_yield?: number | null
          id?: string
          interest_only?: boolean | null
          interest_rate?: number | null
          ltv?: number | null
          monthly_cash_flow?: number | null
          mortgage_term?: number | null
          net_yield?: number | null
          notes?: string | null
          offer_price?: number | null
          postcode?: string | null
          property_address?: string | null
          property_type?: string | null
          purchase_type?: string | null
          refurb_heavy?: number | null
          refurb_light?: number | null
          refurb_medium?: number | null
          rental_comparables?: Json | null
          risk_assessment?: Json | null
          roi_year_1?: number | null
          score_breakdown?: Json | null
          sold_comparables?: Json | null
          source_platform?: string | null
          source_url?: string | null
          square_footage?: number | null
          status?: string | null
          strategy?: string | null
          strategy_inputs?: Json | null
          stress_test?: Json | null
          tax_implications?: Json | null
          total_cash_required?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_pack_comments: {
        Row: {
          comment_text: string
          commenter_email: string
          commenter_name: string
          created_at: string | null
          deal_pack_id: string | null
          id: string
          is_resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          section_id: string | null
        }
        Insert: {
          comment_text: string
          commenter_email: string
          commenter_name: string
          created_at?: string | null
          deal_pack_id?: string | null
          id?: string
          is_resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          section_id?: string | null
        }
        Update: {
          comment_text?: string
          commenter_email?: string
          commenter_name?: string
          created_at?: string | null
          deal_pack_id?: string | null
          id?: string
          is_resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          section_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_pack_comments_deal_pack_id_fkey"
            columns: ["deal_pack_id"]
            isOneToOne: false
            referencedRelation: "deal_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_pack_section_library: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_default: boolean | null
          section_type: string
          title: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          section_type: string
          title: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          section_type?: string
          title?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      deal_pack_templates: {
        Row: {
          color_scheme: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          font_family: string | null
          id: string
          include_area_analysis: boolean | null
          include_comparables: boolean | null
          include_floor_plan: boolean | null
          include_photos: boolean | null
          include_risk_assessment: boolean | null
          is_default: boolean | null
          is_system_template: boolean | null
          name: string
          primary_color: string | null
          sections: Json
          template_type: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          color_scheme?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          font_family?: string | null
          id?: string
          include_area_analysis?: boolean | null
          include_comparables?: boolean | null
          include_floor_plan?: boolean | null
          include_photos?: boolean | null
          include_risk_assessment?: boolean | null
          is_default?: boolean | null
          is_system_template?: boolean | null
          name: string
          primary_color?: string | null
          sections?: Json
          template_type: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          color_scheme?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          font_family?: string | null
          id?: string
          include_area_analysis?: boolean | null
          include_comparables?: boolean | null
          include_floor_plan?: boolean | null
          include_photos?: boolean | null
          include_risk_assessment?: boolean | null
          is_default?: boolean | null
          is_system_template?: boolean | null
          name?: string
          primary_color?: string | null
          sections?: Json
          template_type?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      deal_pack_views: {
        Row: {
          clicked_links: string[] | null
          deal_pack_id: string | null
          downloaded: boolean | null
          duration_seconds: number | null
          id: string
          pages_viewed: number | null
          sections_viewed: string[] | null
          viewed_at: string | null
          viewer_email: string | null
          viewer_ip: unknown
          viewer_name: string | null
        }
        Insert: {
          clicked_links?: string[] | null
          deal_pack_id?: string | null
          downloaded?: boolean | null
          duration_seconds?: number | null
          id?: string
          pages_viewed?: number | null
          sections_viewed?: string[] | null
          viewed_at?: string | null
          viewer_email?: string | null
          viewer_ip?: unknown
          viewer_name?: string | null
        }
        Update: {
          clicked_links?: string[] | null
          deal_pack_id?: string | null
          downloaded?: boolean | null
          duration_seconds?: number | null
          id?: string
          pages_viewed?: number | null
          sections_viewed?: string[] | null
          viewed_at?: string | null
          viewer_email?: string | null
          viewer_ip?: unknown
          viewer_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_pack_views_deal_pack_id_fkey"
            columns: ["deal_pack_id"]
            isOneToOne: false
            referencedRelation: "deal_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_packs: {
        Row: {
          calculations: Json | null
          color_scheme: string | null
          company_name: string | null
          contact_details: Json | null
          content: Json | null
          created_at: string | null
          custom_content: Json | null
          download_count: number | null
          expires_at: string | null
          id: string
          is_public: boolean | null
          last_viewed_at: string | null
          logo_url: string | null
          pack_type: string | null
          parent_pack_id: string | null
          password_hash: string | null
          pdf_url: string | null
          powerpoint_url: string | null
          property_data: Json | null
          property_id: string | null
          sections: Json | null
          share_link: string | null
          status: string | null
          subtitle: string | null
          template_name: string | null
          title: string | null
          updated_at: string | null
          user_id: string
          version: number | null
          view_count: number | null
          views: number | null
          word_doc_url: string | null
        }
        Insert: {
          calculations?: Json | null
          color_scheme?: string | null
          company_name?: string | null
          contact_details?: Json | null
          content?: Json | null
          created_at?: string | null
          custom_content?: Json | null
          download_count?: number | null
          expires_at?: string | null
          id?: string
          is_public?: boolean | null
          last_viewed_at?: string | null
          logo_url?: string | null
          pack_type?: string | null
          parent_pack_id?: string | null
          password_hash?: string | null
          pdf_url?: string | null
          powerpoint_url?: string | null
          property_data?: Json | null
          property_id?: string | null
          sections?: Json | null
          share_link?: string | null
          status?: string | null
          subtitle?: string | null
          template_name?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
          version?: number | null
          view_count?: number | null
          views?: number | null
          word_doc_url?: string | null
        }
        Update: {
          calculations?: Json | null
          color_scheme?: string | null
          company_name?: string | null
          contact_details?: Json | null
          content?: Json | null
          created_at?: string | null
          custom_content?: Json | null
          download_count?: number | null
          expires_at?: string | null
          id?: string
          is_public?: boolean | null
          last_viewed_at?: string | null
          logo_url?: string | null
          pack_type?: string | null
          parent_pack_id?: string | null
          password_hash?: string | null
          pdf_url?: string | null
          powerpoint_url?: string | null
          property_data?: Json | null
          property_id?: string | null
          sections?: Json | null
          share_link?: string | null
          status?: string | null
          subtitle?: string | null
          template_name?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
          version?: number | null
          view_count?: number | null
          views?: number | null
          word_doc_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_packs_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_scouts: {
        Row: {
          alert_frequency: string | null
          alert_methods: Json | null
          alert_score_threshold: number | null
          avg_score: number | null
          bedrooms_max: number | null
          bedrooms_min: number | null
          bmv_min: number | null
          cash_flow_min: number | null
          created_at: string | null
          exclude_auction: boolean | null
          exclude_leasehold: boolean | null
          exclude_new_build: boolean | null
          exclude_shared_ownership: boolean | null
          id: string
          investment_strategy: string | null
          is_active: boolean | null
          last_scan_at: string | null
          location_areas: string[] | null
          location_center_lat: number | null
          location_center_lng: number | null
          location_radius_miles: number | null
          max_chain_length: number | null
          ml_preferences: Json | null
          name: string
          next_scan_at: string | null
          price_max: number | null
          price_min: number | null
          prioritize_below_market: boolean | null
          prioritize_capital_growth: boolean | null
          prioritize_cash_flow: boolean | null
          prioritize_yield: boolean | null
          properties_found: number | null
          properties_saved: number | null
          properties_viewed: number | null
          property_types: string[] | null
          require_garden: boolean | null
          require_parking: boolean | null
          updated_at: string | null
          user_id: string
          yield_min: number | null
        }
        Insert: {
          alert_frequency?: string | null
          alert_methods?: Json | null
          alert_score_threshold?: number | null
          avg_score?: number | null
          bedrooms_max?: number | null
          bedrooms_min?: number | null
          bmv_min?: number | null
          cash_flow_min?: number | null
          created_at?: string | null
          exclude_auction?: boolean | null
          exclude_leasehold?: boolean | null
          exclude_new_build?: boolean | null
          exclude_shared_ownership?: boolean | null
          id?: string
          investment_strategy?: string | null
          is_active?: boolean | null
          last_scan_at?: string | null
          location_areas?: string[] | null
          location_center_lat?: number | null
          location_center_lng?: number | null
          location_radius_miles?: number | null
          max_chain_length?: number | null
          ml_preferences?: Json | null
          name: string
          next_scan_at?: string | null
          price_max?: number | null
          price_min?: number | null
          prioritize_below_market?: boolean | null
          prioritize_capital_growth?: boolean | null
          prioritize_cash_flow?: boolean | null
          prioritize_yield?: boolean | null
          properties_found?: number | null
          properties_saved?: number | null
          properties_viewed?: number | null
          property_types?: string[] | null
          require_garden?: boolean | null
          require_parking?: boolean | null
          updated_at?: string | null
          user_id: string
          yield_min?: number | null
        }
        Update: {
          alert_frequency?: string | null
          alert_methods?: Json | null
          alert_score_threshold?: number | null
          avg_score?: number | null
          bedrooms_max?: number | null
          bedrooms_min?: number | null
          bmv_min?: number | null
          cash_flow_min?: number | null
          created_at?: string | null
          exclude_auction?: boolean | null
          exclude_leasehold?: boolean | null
          exclude_new_build?: boolean | null
          exclude_shared_ownership?: boolean | null
          id?: string
          investment_strategy?: string | null
          is_active?: boolean | null
          last_scan_at?: string | null
          location_areas?: string[] | null
          location_center_lat?: number | null
          location_center_lng?: number | null
          location_radius_miles?: number | null
          max_chain_length?: number | null
          ml_preferences?: Json | null
          name?: string
          next_scan_at?: string | null
          price_max?: number | null
          price_min?: number | null
          prioritize_below_market?: boolean | null
          prioritize_capital_growth?: boolean | null
          prioritize_cash_flow?: boolean | null
          prioritize_yield?: boolean | null
          properties_found?: number | null
          properties_saved?: number | null
          properties_viewed?: number | null
          property_types?: string[] | null
          require_garden?: boolean | null
          require_parking?: boolean | null
          updated_at?: string | null
          user_id?: string
          yield_min?: number | null
        }
        Relationships: []
      }
      deposit_protections: {
        Row: {
          amount: number
          amount_returned: number | null
          certificate_issued_date: string | null
          certificate_url: string | null
          created_at: string | null
          deductions: Json | null
          deposit_type: string | null
          dispute_date: string | null
          dispute_outcome: string | null
          dispute_raised: boolean | null
          id: string
          portfolio_property_id: string | null
          prescribed_info_date: string | null
          prescribed_info_served: boolean | null
          protected_date: string | null
          protection_deadline: string | null
          received_date: string
          return_date: string | null
          scheme: string
          scheme_reference: string | null
          status: string | null
          tenant_email: string | null
          tenant_name: string
          user_id: string
        }
        Insert: {
          amount: number
          amount_returned?: number | null
          certificate_issued_date?: string | null
          certificate_url?: string | null
          created_at?: string | null
          deductions?: Json | null
          deposit_type?: string | null
          dispute_date?: string | null
          dispute_outcome?: string | null
          dispute_raised?: boolean | null
          id?: string
          portfolio_property_id?: string | null
          prescribed_info_date?: string | null
          prescribed_info_served?: boolean | null
          protected_date?: string | null
          protection_deadline?: string | null
          received_date: string
          return_date?: string | null
          scheme: string
          scheme_reference?: string | null
          status?: string | null
          tenant_email?: string | null
          tenant_name: string
          user_id: string
        }
        Update: {
          amount?: number
          amount_returned?: number | null
          certificate_issued_date?: string | null
          certificate_url?: string | null
          created_at?: string | null
          deductions?: Json | null
          deposit_type?: string | null
          dispute_date?: string | null
          dispute_outcome?: string | null
          dispute_raised?: boolean | null
          id?: string
          portfolio_property_id?: string | null
          prescribed_info_date?: string | null
          prescribed_info_served?: boolean | null
          protected_date?: string | null
          protection_deadline?: string | null
          received_date?: string
          return_date?: string | null
          scheme?: string
          scheme_reference?: string | null
          status?: string | null
          tenant_email?: string | null
          tenant_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deposit_protections_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deposit_protections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      development_appraisals: {
        Row: {
          address: string | null
          arrangement_fee: number | null
          build_months: number | null
          construction_cost: number | null
          contingency_percent: number | null
          created_at: string | null
          estimated_rent_pcm: number | null
          estimated_yield: number | null
          existing_units: number | null
          exit_strategy: string | null
          finance_type: string | null
          gdv: number | null
          gross_profit: number | null
          id: string
          interest_rate: number | null
          loan_amount: number | null
          loan_term_months: number | null
          net_profit: number | null
          postcode: string | null
          professional_fees: number | null
          profit_on_cost: number | null
          project_name: string
          project_type: string | null
          proposed_units: number | null
          purchase_costs: number | null
          purchase_price: number | null
          roi: number | null
          sales_costs: number | null
          status: string | null
          total_costs: number | null
          unit_breakdown: Json | null
          user_id: string
        }
        Insert: {
          address?: string | null
          arrangement_fee?: number | null
          build_months?: number | null
          construction_cost?: number | null
          contingency_percent?: number | null
          created_at?: string | null
          estimated_rent_pcm?: number | null
          estimated_yield?: number | null
          existing_units?: number | null
          exit_strategy?: string | null
          finance_type?: string | null
          gdv?: number | null
          gross_profit?: number | null
          id?: string
          interest_rate?: number | null
          loan_amount?: number | null
          loan_term_months?: number | null
          net_profit?: number | null
          postcode?: string | null
          professional_fees?: number | null
          profit_on_cost?: number | null
          project_name: string
          project_type?: string | null
          proposed_units?: number | null
          purchase_costs?: number | null
          purchase_price?: number | null
          roi?: number | null
          sales_costs?: number | null
          status?: string | null
          total_costs?: number | null
          unit_breakdown?: Json | null
          user_id: string
        }
        Update: {
          address?: string | null
          arrangement_fee?: number | null
          build_months?: number | null
          construction_cost?: number | null
          contingency_percent?: number | null
          created_at?: string | null
          estimated_rent_pcm?: number | null
          estimated_yield?: number | null
          existing_units?: number | null
          exit_strategy?: string | null
          finance_type?: string | null
          gdv?: number | null
          gross_profit?: number | null
          id?: string
          interest_rate?: number | null
          loan_amount?: number | null
          loan_term_months?: number | null
          net_profit?: number | null
          postcode?: string | null
          professional_fees?: number | null
          profit_on_cost?: number | null
          project_name?: string
          project_type?: string | null
          proposed_units?: number | null
          purchase_costs?: number | null
          purchase_price?: number | null
          roi?: number | null
          sales_costs?: number | null
          status?: string | null
          total_costs?: number | null
          unit_breakdown?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      distressed_properties: {
        Row: {
          address: string
          current_price: number | null
          days_on_market: number | null
          detected_at: string | null
          distress_score: number | null
          distress_type: string[] | null
          epc_rating: string | null
          estimated_value: number | null
          id: string
          is_active: boolean | null
          last_reduction_pct: number | null
          postcode: string
          potential_discount_pct: number | null
          price_reductions: number | null
          property_id: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          current_price?: number | null
          days_on_market?: number | null
          detected_at?: string | null
          distress_score?: number | null
          distress_type?: string[] | null
          epc_rating?: string | null
          estimated_value?: number | null
          id?: string
          is_active?: boolean | null
          last_reduction_pct?: number | null
          postcode: string
          potential_discount_pct?: number | null
          price_reductions?: number | null
          property_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          current_price?: number | null
          days_on_market?: number | null
          detected_at?: string | null
          distress_score?: number | null
          distress_type?: string[] | null
          epc_rating?: string | null
          estimated_value?: number | null
          id?: string
          is_active?: boolean | null
          last_reduction_pct?: number | null
          postcode?: string
          potential_discount_pct?: number | null
          price_reductions?: number | null
          property_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      distressed_watches: {
        Row: {
          alert_frequency: string | null
          created_at: string | null
          email_alerts: boolean | null
          id: string
          max_price: number | null
          min_discount_pct: number | null
          postcodes: string[] | null
          property_types: string[] | null
          user_id: string
        }
        Insert: {
          alert_frequency?: string | null
          created_at?: string | null
          email_alerts?: boolean | null
          id?: string
          max_price?: number | null
          min_discount_pct?: number | null
          postcodes?: string[] | null
          property_types?: string[] | null
          user_id: string
        }
        Update: {
          alert_frequency?: string | null
          created_at?: string | null
          email_alerts?: boolean | null
          id?: string
          max_price?: number | null
          min_discount_pct?: number | null
          postcodes?: string[] | null
          property_types?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      document_folder_items: {
        Row: {
          added_at: string | null
          document_id: string
          folder_id: string
        }
        Insert: {
          added_at?: string | null
          document_id: string
          folder_id: string
        }
        Update: {
          added_at?: string | null
          document_id?: string
          folder_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_folder_items_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_folder_items_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "document_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      document_folders: {
        Row: {
          color: string | null
          created_at: string | null
          folder_name: string
          icon: string | null
          id: string
          parent_folder_id: string | null
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          folder_name: string
          icon?: string | null
          id?: string
          parent_folder_id?: string | null
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          folder_name?: string
          icon?: string | null
          id?: string
          parent_folder_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_folders_parent_folder_id_fkey"
            columns: ["parent_folder_id"]
            isOneToOne: false
            referencedRelation: "document_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          jurisdiction: string | null
          last_updated: string | null
          name: string
          placeholders: Json | null
          template_content: string
          version: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          jurisdiction?: string | null
          last_updated?: string | null
          name: string
          placeholders?: Json | null
          template_content: string
          version?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          jurisdiction?: string | null
          last_updated?: string | null
          name?: string
          placeholders?: Json | null
          template_content?: string
          version?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          compliance_item_id: string | null
          description: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_favorite: boolean | null
          is_shared: boolean | null
          portfolio_property_id: string | null
          share_expires_at: string | null
          share_token: string | null
          tags: string[] | null
          tenancy_id: string | null
          title: string | null
          updated_at: string | null
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          compliance_item_id?: string | null
          description?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_favorite?: boolean | null
          is_shared?: boolean | null
          portfolio_property_id?: string | null
          share_expires_at?: string | null
          share_token?: string | null
          tags?: string[] | null
          tenancy_id?: string | null
          title?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          compliance_item_id?: string | null
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_favorite?: boolean | null
          is_shared?: boolean | null
          portfolio_property_id?: string | null
          share_expires_at?: string | null
          share_token?: string | null
          tags?: string[] | null
          tenancy_id?: string | null
          title?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_compliance_item_id_fkey"
            columns: ["compliance_item_id"]
            isOneToOne: false
            referencedRelation: "compliance_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
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
      email_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          template_key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          template_key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          template_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      epc_assessments: {
        Row: {
          certificate_date: string | null
          certificate_expiry: string | null
          created_at: string | null
          current_rating: string | null
          current_score: number | null
          id: string
          planned_improvements: Json | null
          portfolio_property_id: string | null
          projected_rating: string | null
          projected_score: number | null
          recommendations: Json | null
          status: string | null
          target_deadline: string | null
          target_rating: string | null
          total_estimated_cost: number | null
          user_id: string | null
        }
        Insert: {
          certificate_date?: string | null
          certificate_expiry?: string | null
          created_at?: string | null
          current_rating?: string | null
          current_score?: number | null
          id?: string
          planned_improvements?: Json | null
          portfolio_property_id?: string | null
          projected_rating?: string | null
          projected_score?: number | null
          recommendations?: Json | null
          status?: string | null
          target_deadline?: string | null
          target_rating?: string | null
          total_estimated_cost?: number | null
          user_id?: string | null
        }
        Update: {
          certificate_date?: string | null
          certificate_expiry?: string | null
          created_at?: string | null
          current_rating?: string | null
          current_score?: number | null
          id?: string
          planned_improvements?: Json | null
          portfolio_property_id?: string | null
          projected_rating?: string | null
          projected_score?: number | null
          recommendations?: Json | null
          status?: string | null
          target_deadline?: string | null
          target_rating?: string | null
          total_estimated_cost?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "epc_assessments_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "epc_assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      epc_certificates: {
        Row: {
          api_response: Json | null
          assessor_company: string | null
          assessor_name: string | null
          building_reference_number: string | null
          built_form: string | null
          certificate_hash: string
          constituency: string | null
          county: string | null
          created_at: string | null
          current_co2_emissions: number | null
          current_co2_emissions_rating: string | null
          current_energy_cost: number | null
          current_energy_efficiency: number | null
          current_energy_rating: string | null
          epc_local_authority: string | null
          floor_description: string | null
          floor_energy_efficiency: string | null
          heating_cost_current: number | null
          heating_cost_potential: number | null
          hot_water_cost_current: number | null
          hot_water_cost_potential: number | null
          hot_water_description: string | null
          hot_water_energy_efficiency: string | null
          id: string
          improvements: Json | null
          inspection_date: string | null
          lighting_cost_current: number | null
          lighting_cost_potential: number | null
          lighting_description: string | null
          lighting_energy_efficiency: string | null
          lodgement_date: string
          lodgement_datetime: string | null
          main_fuel: string | null
          main_heating_description: string | null
          main_heating_energy_efficiency: string | null
          number_habitable_rooms: number | null
          number_heated_rooms: number | null
          postcode: string
          potential_co2_emissions: number | null
          potential_co2_emissions_rating: string | null
          potential_energy_cost: number | null
          potential_energy_efficiency: number | null
          potential_energy_rating: string | null
          property_address: string
          property_type: string | null
          roof_description: string | null
          roof_energy_efficiency: string | null
          tenure: string | null
          total_floor_area: number | null
          transaction_type: string | null
          updated_at: string | null
          walls_description: string | null
          walls_energy_efficiency: string | null
          windows_description: string | null
          windows_energy_efficiency: string | null
        }
        Insert: {
          api_response?: Json | null
          assessor_company?: string | null
          assessor_name?: string | null
          building_reference_number?: string | null
          built_form?: string | null
          certificate_hash: string
          constituency?: string | null
          county?: string | null
          created_at?: string | null
          current_co2_emissions?: number | null
          current_co2_emissions_rating?: string | null
          current_energy_cost?: number | null
          current_energy_efficiency?: number | null
          current_energy_rating?: string | null
          epc_local_authority?: string | null
          floor_description?: string | null
          floor_energy_efficiency?: string | null
          heating_cost_current?: number | null
          heating_cost_potential?: number | null
          hot_water_cost_current?: number | null
          hot_water_cost_potential?: number | null
          hot_water_description?: string | null
          hot_water_energy_efficiency?: string | null
          id?: string
          improvements?: Json | null
          inspection_date?: string | null
          lighting_cost_current?: number | null
          lighting_cost_potential?: number | null
          lighting_description?: string | null
          lighting_energy_efficiency?: string | null
          lodgement_date: string
          lodgement_datetime?: string | null
          main_fuel?: string | null
          main_heating_description?: string | null
          main_heating_energy_efficiency?: string | null
          number_habitable_rooms?: number | null
          number_heated_rooms?: number | null
          postcode: string
          potential_co2_emissions?: number | null
          potential_co2_emissions_rating?: string | null
          potential_energy_cost?: number | null
          potential_energy_efficiency?: number | null
          potential_energy_rating?: string | null
          property_address: string
          property_type?: string | null
          roof_description?: string | null
          roof_energy_efficiency?: string | null
          tenure?: string | null
          total_floor_area?: number | null
          transaction_type?: string | null
          updated_at?: string | null
          walls_description?: string | null
          walls_energy_efficiency?: string | null
          windows_description?: string | null
          windows_energy_efficiency?: string | null
        }
        Update: {
          api_response?: Json | null
          assessor_company?: string | null
          assessor_name?: string | null
          building_reference_number?: string | null
          built_form?: string | null
          certificate_hash?: string
          constituency?: string | null
          county?: string | null
          created_at?: string | null
          current_co2_emissions?: number | null
          current_co2_emissions_rating?: string | null
          current_energy_cost?: number | null
          current_energy_efficiency?: number | null
          current_energy_rating?: string | null
          epc_local_authority?: string | null
          floor_description?: string | null
          floor_energy_efficiency?: string | null
          heating_cost_current?: number | null
          heating_cost_potential?: number | null
          hot_water_cost_current?: number | null
          hot_water_cost_potential?: number | null
          hot_water_description?: string | null
          hot_water_energy_efficiency?: string | null
          id?: string
          improvements?: Json | null
          inspection_date?: string | null
          lighting_cost_current?: number | null
          lighting_cost_potential?: number | null
          lighting_description?: string | null
          lighting_energy_efficiency?: string | null
          lodgement_date?: string
          lodgement_datetime?: string | null
          main_fuel?: string | null
          main_heating_description?: string | null
          main_heating_energy_efficiency?: string | null
          number_habitable_rooms?: number | null
          number_heated_rooms?: number | null
          postcode?: string
          potential_co2_emissions?: number | null
          potential_co2_emissions_rating?: string | null
          potential_energy_cost?: number | null
          potential_energy_efficiency?: number | null
          potential_energy_rating?: string | null
          property_address?: string
          property_type?: string | null
          roof_description?: string | null
          roof_energy_efficiency?: string | null
          tenure?: string | null
          total_floor_area?: number | null
          transaction_type?: string | null
          updated_at?: string | null
          walls_description?: string | null
          walls_energy_efficiency?: string | null
          windows_description?: string | null
          windows_energy_efficiency?: string | null
        }
        Relationships: []
      }
      epc_improvements: {
        Row: {
          actual_cost: number | null
          annual_savings: number | null
          assessment_id: string | null
          completed_date: string | null
          cost_high: number | null
          cost_low: number | null
          created_at: string | null
          description: string | null
          grant_amount: number | null
          grant_eligible: boolean | null
          grant_name: string | null
          id: string
          measure_type: string
          score_improvement: number | null
          status: string | null
        }
        Insert: {
          actual_cost?: number | null
          annual_savings?: number | null
          assessment_id?: string | null
          completed_date?: string | null
          cost_high?: number | null
          cost_low?: number | null
          created_at?: string | null
          description?: string | null
          grant_amount?: number | null
          grant_eligible?: boolean | null
          grant_name?: string | null
          id?: string
          measure_type: string
          score_improvement?: number | null
          status?: string | null
        }
        Update: {
          actual_cost?: number | null
          annual_savings?: number | null
          assessment_id?: string | null
          completed_date?: string | null
          cost_high?: number | null
          cost_low?: number | null
          created_at?: string | null
          description?: string | null
          grant_amount?: number | null
          grant_eligible?: boolean | null
          grant_name?: string | null
          id?: string
          measure_type?: string
          score_improvement?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "epc_improvements_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "epc_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      event_connections: {
        Row: {
          connected_user_id: string
          created_at: string | null
          event_id: string | null
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          connected_user_id: string
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          connected_user_id?: string
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_connections_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "networking_events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          amount_paid: number | null
          checked_in_at: string | null
          created_at: string | null
          event_id: string | null
          id: string
          status: string | null
          ticket_type: string | null
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          checked_in_at?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          ticket_type?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          checked_in_at?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          ticket_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "networking_events"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_rates: {
        Row: {
          base_currency: string | null
          created_at: string | null
          id: string
          rate: number
          rate_date: string
          source: string | null
          target_currency: string
        }
        Insert: {
          base_currency?: string | null
          created_at?: string | null
          id?: string
          rate: number
          rate_date: string
          source?: string | null
          target_currency: string
        }
        Update: {
          base_currency?: string | null
          created_at?: string | null
          id?: string
          rate?: number
          rate_date?: string
          source?: string | null
          target_currency?: string
        }
        Relationships: []
      }
      expense_receipts: {
        Row: {
          amount: number | null
          category: string | null
          created_at: string | null
          id: string
          merchant: string | null
          ocr_data: Json | null
          portfolio_property_id: string | null
          receipt_date: string | null
          receipt_url: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          category?: string | null
          created_at?: string | null
          id?: string
          merchant?: string | null
          ocr_data?: Json | null
          portfolio_property_id?: string | null
          receipt_date?: string | null
          receipt_url: string
          user_id: string
        }
        Update: {
          amount?: number | null
          category?: string | null
          created_at?: string | null
          id?: string
          merchant?: string | null
          ocr_data?: Json | null
          portfolio_property_id?: string | null
          receipt_date?: string | null
          receipt_url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_receipts_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_usage: {
        Row: {
          date: string
          feature_name: string
          id: string
          unique_users: number | null
          usage_count: number | null
        }
        Insert: {
          date: string
          feature_name: string
          id?: string
          unique_users?: number | null
          usage_count?: number | null
        }
        Update: {
          date?: string
          feature_name?: string
          id?: string
          unique_users?: number | null
          usage_count?: number | null
        }
        Relationships: []
      }
      flood_risk_data: {
        Row: {
          api_response: Json | null
          created_at: string | null
          current_alerts: Json | null
          current_warnings: Json | null
          defense_standard: string | null
          easting: number | null
          flood_defenses_present: boolean | null
          id: string
          in_flood_zone_2: boolean | null
          in_flood_zone_3: boolean | null
          insurance_implications: string | null
          last_checked_at: string | null
          last_flood_event_date: string | null
          last_warning_check_at: string | null
          latitude: number | null
          longitude: number | null
          northing: number | null
          overall_flood_risk: string | null
          postcode: string
          property_address: string
          recommendations: Json | null
          recorded_flood_events: Json | null
          reservoir_risk: boolean | null
          reservoir_risk_details: string | null
          rivers_and_sea_annual_chance: number | null
          rivers_and_sea_risk: string | null
          surface_water_annual_chance: number | null
          surface_water_risk: string | null
          updated_at: string | null
        }
        Insert: {
          api_response?: Json | null
          created_at?: string | null
          current_alerts?: Json | null
          current_warnings?: Json | null
          defense_standard?: string | null
          easting?: number | null
          flood_defenses_present?: boolean | null
          id?: string
          in_flood_zone_2?: boolean | null
          in_flood_zone_3?: boolean | null
          insurance_implications?: string | null
          last_checked_at?: string | null
          last_flood_event_date?: string | null
          last_warning_check_at?: string | null
          latitude?: number | null
          longitude?: number | null
          northing?: number | null
          overall_flood_risk?: string | null
          postcode: string
          property_address: string
          recommendations?: Json | null
          recorded_flood_events?: Json | null
          reservoir_risk?: boolean | null
          reservoir_risk_details?: string | null
          rivers_and_sea_annual_chance?: number | null
          rivers_and_sea_risk?: string | null
          surface_water_annual_chance?: number | null
          surface_water_risk?: string | null
          updated_at?: string | null
        }
        Update: {
          api_response?: Json | null
          created_at?: string | null
          current_alerts?: Json | null
          current_warnings?: Json | null
          defense_standard?: string | null
          easting?: number | null
          flood_defenses_present?: boolean | null
          id?: string
          in_flood_zone_2?: boolean | null
          in_flood_zone_3?: boolean | null
          insurance_implications?: string | null
          last_checked_at?: string | null
          last_flood_event_date?: string | null
          last_warning_check_at?: string | null
          latitude?: number | null
          longitude?: number | null
          northing?: number | null
          overall_flood_risk?: string | null
          postcode?: string
          property_address?: string
          recommendations?: Json | null
          recorded_flood_events?: Json | null
          reservoir_risk?: boolean | null
          reservoir_risk_details?: string | null
          rivers_and_sea_annual_chance?: number | null
          rivers_and_sea_risk?: string | null
          surface_water_annual_chance?: number | null
          surface_water_risk?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      flood_warnings: {
        Row: {
          area_description: string | null
          area_name: string
          county: string | null
          created_at: string | null
          easting: number | null
          id: string
          is_active: boolean | null
          message: string | null
          northing: number | null
          severity: string | null
          severity_level: number | null
          time_changed: string | null
          time_raised: string | null
          time_removed: string | null
          updated_at: string | null
          warning_id: string | null
        }
        Insert: {
          area_description?: string | null
          area_name: string
          county?: string | null
          created_at?: string | null
          easting?: number | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          northing?: number | null
          severity?: string | null
          severity_level?: number | null
          time_changed?: string | null
          time_raised?: string | null
          time_removed?: string | null
          updated_at?: string | null
          warning_id?: string | null
        }
        Update: {
          area_description?: string | null
          area_name?: string
          county?: string | null
          created_at?: string | null
          easting?: number | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          northing?: number | null
          severity?: string | null
          severity_level?: number | null
          time_changed?: string | null
          time_raised?: string | null
          time_removed?: string | null
          updated_at?: string | null
          warning_id?: string | null
        }
        Relationships: []
      }
      foreign_income: {
        Row: {
          conversion_date: string | null
          created_at: string | null
          description: string | null
          exchange_rate: number | null
          gbp_amount: number | null
          id: string
          original_amount: number
          original_currency: string
          portfolio_property_id: string | null
          user_id: string
        }
        Insert: {
          conversion_date?: string | null
          created_at?: string | null
          description?: string | null
          exchange_rate?: number | null
          gbp_amount?: number | null
          id?: string
          original_amount: number
          original_currency: string
          portfolio_property_id?: string | null
          user_id: string
        }
        Update: {
          conversion_date?: string | null
          created_at?: string | null
          description?: string | null
          exchange_rate?: number | null
          gbp_amount?: number | null
          id?: string
          original_amount?: number
          original_currency?: string
          portfolio_property_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "foreign_income_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_documents: {
        Row: {
          created_at: string | null
          document_name: string
          filled_content: string
          filled_values: Json | null
          id: string
          pdf_url: string | null
          portfolio_property_id: string | null
          sent_for_signing_at: string | null
          signed_at: string | null
          signed_document_url: string | null
          status: string | null
          template_id: string | null
          tenancy_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          document_name: string
          filled_content: string
          filled_values?: Json | null
          id?: string
          pdf_url?: string | null
          portfolio_property_id?: string | null
          sent_for_signing_at?: string | null
          signed_at?: string | null
          signed_document_url?: string | null
          status?: string | null
          template_id?: string | null
          tenancy_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          document_name?: string
          filled_content?: string
          filled_values?: Json | null
          id?: string
          pdf_url?: string | null
          portfolio_property_id?: string | null
          sent_for_signing_at?: string | null
          signed_at?: string | null
          signed_document_url?: string | null
          status?: string | null
          template_id?: string | null
          tenancy_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_documents_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "document_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_documents_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_reports: {
        Row: {
          created_at: string | null
          download_count: number | null
          file_size: number | null
          file_url: string | null
          generated_at: string | null
          generation_time_ms: number | null
          id: string
          last_downloaded_at: string | null
          net_profit: number | null
          period_end: string | null
          period_start: string | null
          properties_count: number | null
          report_name: string
          report_type: string | null
          scheduled_report_id: string | null
          sent_at: string | null
          sent_to: Json | null
          template_id: string | null
          total_expenses: number | null
          total_income: number | null
          user_id: string | null
          was_sent: boolean | null
        }
        Insert: {
          created_at?: string | null
          download_count?: number | null
          file_size?: number | null
          file_url?: string | null
          generated_at?: string | null
          generation_time_ms?: number | null
          id?: string
          last_downloaded_at?: string | null
          net_profit?: number | null
          period_end?: string | null
          period_start?: string | null
          properties_count?: number | null
          report_name: string
          report_type?: string | null
          scheduled_report_id?: string | null
          sent_at?: string | null
          sent_to?: Json | null
          template_id?: string | null
          total_expenses?: number | null
          total_income?: number | null
          user_id?: string | null
          was_sent?: boolean | null
        }
        Update: {
          created_at?: string | null
          download_count?: number | null
          file_size?: number | null
          file_url?: string | null
          generated_at?: string | null
          generation_time_ms?: number | null
          id?: string
          last_downloaded_at?: string | null
          net_profit?: number | null
          period_end?: string | null
          period_start?: string | null
          properties_count?: number | null
          report_name?: string
          report_type?: string | null
          scheduled_report_id?: string | null
          sent_at?: string | null
          sent_to?: Json | null
          template_id?: string | null
          total_expenses?: number | null
          total_income?: number | null
          user_id?: string | null
          was_sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_reports_scheduled_report_id_fkey"
            columns: ["scheduled_report_id"]
            isOneToOne: false
            referencedRelation: "scheduled_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_seek_results: {
        Row: {
          adjust_variable: string
          alternative_solutions: Json | null
          calculated_value: number | null
          created_at: string | null
          id: string
          is_achievable: boolean | null
          property_id: string | null
          target_metric: string
          target_value: number
          user_id: string
        }
        Insert: {
          adjust_variable: string
          alternative_solutions?: Json | null
          calculated_value?: number | null
          created_at?: string | null
          id?: string
          is_achievable?: boolean | null
          property_id?: string | null
          target_metric: string
          target_value: number
          user_id: string
        }
        Update: {
          adjust_variable?: string
          alternative_solutions?: Json | null
          calculated_value?: number | null
          created_at?: string | null
          id?: string
          is_achievable?: boolean | null
          property_id?: string | null
          target_metric?: string
          target_value?: number
          user_id?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "network_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_claims: {
        Row: {
          acknowledged_date: string | null
          claim_amount: number | null
          claim_reference: string | null
          claim_type: string
          created_at: string | null
          decision_date: string | null
          estimated_loss: number | null
          excess_amount: number | null
          handler_email: string | null
          handler_name: string | null
          handler_phone: string | null
          id: string
          incident_date: string
          incident_description: string | null
          insurance_policy_id: string | null
          notes: string | null
          portfolio_property_id: string | null
          rejection_reason: string | null
          settlement_amount: number | null
          settlement_date: string | null
          status: string | null
          submitted_date: string | null
          user_id: string
        }
        Insert: {
          acknowledged_date?: string | null
          claim_amount?: number | null
          claim_reference?: string | null
          claim_type: string
          created_at?: string | null
          decision_date?: string | null
          estimated_loss?: number | null
          excess_amount?: number | null
          handler_email?: string | null
          handler_name?: string | null
          handler_phone?: string | null
          id?: string
          incident_date: string
          incident_description?: string | null
          insurance_policy_id?: string | null
          notes?: string | null
          portfolio_property_id?: string | null
          rejection_reason?: string | null
          settlement_amount?: number | null
          settlement_date?: string | null
          status?: string | null
          submitted_date?: string | null
          user_id: string
        }
        Update: {
          acknowledged_date?: string | null
          claim_amount?: number | null
          claim_reference?: string | null
          claim_type?: string
          created_at?: string | null
          decision_date?: string | null
          estimated_loss?: number | null
          excess_amount?: number | null
          handler_email?: string | null
          handler_name?: string | null
          handler_phone?: string | null
          id?: string
          incident_date?: string
          incident_description?: string | null
          insurance_policy_id?: string | null
          notes?: string | null
          portfolio_property_id?: string | null
          rejection_reason?: string | null
          settlement_amount?: number | null
          settlement_date?: string | null
          status?: string | null
          submitted_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_claims_insurance_policy_id_fkey"
            columns: ["insurance_policy_id"]
            isOneToOne: false
            referencedRelation: "insurance_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_claims_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_claims_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_policies: {
        Row: {
          annual_premium: number | null
          auto_renew: boolean | null
          buildings_cover: number | null
          contents_cover: number | null
          created_at: string | null
          end_date: string | null
          excess_amount: number | null
          id: string
          legal_expenses_cover: number | null
          liability_cover: number | null
          monthly_premium: number | null
          payment_frequency: string | null
          policy_document_url: string | null
          policy_number: string | null
          policy_type: string
          portfolio_property_id: string | null
          provider: string
          rent_guarantee_months: number | null
          start_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          annual_premium?: number | null
          auto_renew?: boolean | null
          buildings_cover?: number | null
          contents_cover?: number | null
          created_at?: string | null
          end_date?: string | null
          excess_amount?: number | null
          id?: string
          legal_expenses_cover?: number | null
          liability_cover?: number | null
          monthly_premium?: number | null
          payment_frequency?: string | null
          policy_document_url?: string | null
          policy_number?: string | null
          policy_type: string
          portfolio_property_id?: string | null
          provider: string
          rent_guarantee_months?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          annual_premium?: number | null
          auto_renew?: boolean | null
          buildings_cover?: number | null
          contents_cover?: number | null
          created_at?: string | null
          end_date?: string | null
          excess_amount?: number | null
          id?: string
          legal_expenses_cover?: number | null
          liability_cover?: number | null
          monthly_premium?: number | null
          payment_frequency?: string | null
          policy_document_url?: string | null
          policy_number?: string | null
          policy_type?: string
          portfolio_property_id?: string | null
          provider?: string
          rent_guarantee_months?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_policies_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_providers: {
        Row: {
          affiliate_link: string | null
          affiliate_network: string | null
          avg_buildings_premium: number | null
          avg_combined_premium: number | null
          avg_contents_premium: number | null
          commission_amount: number | null
          commission_type: string | null
          cookie_duration_days: number | null
          created_at: string | null
          defaqto_rating: number | null
          display_order: number | null
          excess_options: string[] | null
          id: string
          is_active: boolean | null
          key_features: string[] | null
          logo_url: string | null
          offers_buildings: boolean | null
          offers_contents: boolean | null
          offers_emergency_assistance: boolean | null
          offers_legal_expenses: boolean | null
          offers_liability: boolean | null
          offers_rent_guarantee: boolean | null
          provider_name: string
          trustpilot_rating: number | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          affiliate_link?: string | null
          affiliate_network?: string | null
          avg_buildings_premium?: number | null
          avg_combined_premium?: number | null
          avg_contents_premium?: number | null
          commission_amount?: number | null
          commission_type?: string | null
          cookie_duration_days?: number | null
          created_at?: string | null
          defaqto_rating?: number | null
          display_order?: number | null
          excess_options?: string[] | null
          id?: string
          is_active?: boolean | null
          key_features?: string[] | null
          logo_url?: string | null
          offers_buildings?: boolean | null
          offers_contents?: boolean | null
          offers_emergency_assistance?: boolean | null
          offers_legal_expenses?: boolean | null
          offers_liability?: boolean | null
          offers_rent_guarantee?: boolean | null
          provider_name: string
          trustpilot_rating?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          affiliate_link?: string | null
          affiliate_network?: string | null
          avg_buildings_premium?: number | null
          avg_combined_premium?: number | null
          avg_contents_premium?: number | null
          commission_amount?: number | null
          commission_type?: string | null
          cookie_duration_days?: number | null
          created_at?: string | null
          defaqto_rating?: number | null
          display_order?: number | null
          excess_options?: string[] | null
          id?: string
          is_active?: boolean | null
          key_features?: string[] | null
          logo_url?: string | null
          offers_buildings?: boolean | null
          offers_contents?: boolean | null
          offers_emergency_assistance?: boolean | null
          offers_legal_expenses?: boolean | null
          offers_liability?: boolean | null
          offers_rent_guarantee?: boolean | null
          provider_name?: string
          trustpilot_rating?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      insurance_purchases: {
        Row: {
          affiliate_click_id: string | null
          annual_premium: number | null
          commission_amount: number | null
          commission_date: string | null
          commission_status: string | null
          coverage_type: string | null
          created_at: string | null
          end_date: string | null
          excess: number | null
          id: string
          policy_number: string | null
          provider_id: string | null
          provider_name: string | null
          quote_id: string | null
          start_date: string | null
          user_id: string
        }
        Insert: {
          affiliate_click_id?: string | null
          annual_premium?: number | null
          commission_amount?: number | null
          commission_date?: string | null
          commission_status?: string | null
          coverage_type?: string | null
          created_at?: string | null
          end_date?: string | null
          excess?: number | null
          id?: string
          policy_number?: string | null
          provider_id?: string | null
          provider_name?: string | null
          quote_id?: string | null
          start_date?: string | null
          user_id: string
        }
        Update: {
          affiliate_click_id?: string | null
          annual_premium?: number | null
          commission_amount?: number | null
          commission_date?: string | null
          commission_status?: string | null
          coverage_type?: string | null
          created_at?: string | null
          end_date?: string | null
          excess?: number | null
          id?: string
          policy_number?: string | null
          provider_id?: string | null
          provider_name?: string | null
          quote_id?: string | null
          start_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_purchases_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_purchases_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "insurance_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_quotes: {
        Row: {
          bedrooms: number | null
          buildings_cover_amount: number | null
          contents_cover_amount: number | null
          coverage_type: string | null
          created_at: string | null
          expires_at: string | null
          has_flat_roof: boolean | null
          has_tenants: boolean | null
          id: string
          is_furnished: boolean | null
          is_hmo: boolean | null
          is_listed_building: boolean | null
          needs_emergency_cover: boolean | null
          needs_legal_expenses: boolean | null
          needs_rent_guarantee: boolean | null
          portfolio_property_id: string | null
          postcode: string | null
          property_address: string | null
          property_type: string | null
          property_value: number | null
          quotes: Json | null
          rebuild_cost: number | null
          status: string | null
          user_id: string
          year_built: number | null
        }
        Insert: {
          bedrooms?: number | null
          buildings_cover_amount?: number | null
          contents_cover_amount?: number | null
          coverage_type?: string | null
          created_at?: string | null
          expires_at?: string | null
          has_flat_roof?: boolean | null
          has_tenants?: boolean | null
          id?: string
          is_furnished?: boolean | null
          is_hmo?: boolean | null
          is_listed_building?: boolean | null
          needs_emergency_cover?: boolean | null
          needs_legal_expenses?: boolean | null
          needs_rent_guarantee?: boolean | null
          portfolio_property_id?: string | null
          postcode?: string | null
          property_address?: string | null
          property_type?: string | null
          property_value?: number | null
          quotes?: Json | null
          rebuild_cost?: number | null
          status?: string | null
          user_id: string
          year_built?: number | null
        }
        Update: {
          bedrooms?: number | null
          buildings_cover_amount?: number | null
          contents_cover_amount?: number | null
          coverage_type?: string | null
          created_at?: string | null
          expires_at?: string | null
          has_flat_roof?: boolean | null
          has_tenants?: boolean | null
          id?: string
          is_furnished?: boolean | null
          is_hmo?: boolean | null
          is_listed_building?: boolean | null
          needs_emergency_cover?: boolean | null
          needs_legal_expenses?: boolean | null
          needs_rent_guarantee?: boolean | null
          portfolio_property_id?: string | null
          postcode?: string | null
          property_address?: string | null
          property_type?: string | null
          property_value?: number | null
          quotes?: Json | null
          rebuild_cost?: number | null
          status?: string | null
          user_id?: string
          year_built?: number | null
        }
        Relationships: []
      }
      insurance_renewals: {
        Row: {
          created_at: string | null
          id: string
          purchase_id: string | null
          reminder_sent_30_days: boolean | null
          reminder_sent_60_days: boolean | null
          reminder_sent_7_days: boolean | null
          renewal_date: string
          renewed: boolean | null
          renewed_with_provider_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          purchase_id?: string | null
          reminder_sent_30_days?: boolean | null
          reminder_sent_60_days?: boolean | null
          reminder_sent_7_days?: boolean | null
          renewal_date: string
          renewed?: boolean | null
          renewed_with_provider_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          purchase_id?: string | null
          reminder_sent_30_days?: boolean | null
          reminder_sent_60_days?: boolean | null
          reminder_sent_7_days?: boolean | null
          renewal_date?: string
          renewed?: boolean | null
          renewed_with_provider_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_renewals_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "insurance_purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_renewals_renewed_with_provider_id_fkey"
            columns: ["renewed_with_provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_catalog: {
        Row: {
          available_in_tiers: string[] | null
          category: string | null
          created_at: string | null
          description: string | null
          features: string[] | null
          id: string
          integration_key: string
          is_active: boolean | null
          is_beta: boolean | null
          logo_url: string | null
          name: string
          requires_api_key: boolean | null
          requires_oauth: boolean | null
          total_connections: number | null
          website_url: string | null
        }
        Insert: {
          available_in_tiers?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          integration_key: string
          is_active?: boolean | null
          is_beta?: boolean | null
          logo_url?: string | null
          name: string
          requires_api_key?: boolean | null
          requires_oauth?: boolean | null
          total_connections?: number | null
          website_url?: string | null
        }
        Update: {
          available_in_tiers?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          integration_key?: string
          is_active?: boolean | null
          is_beta?: boolean | null
          logo_url?: string | null
          name?: string
          requires_api_key?: boolean | null
          requires_oauth?: boolean | null
          total_connections?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      integration_reviews: {
        Row: {
          created_at: string | null
          id: string
          integration_id: string | null
          rating: number | null
          review_text: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          integration_id?: string | null
          rating?: number | null
          review_text?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          integration_id?: string | null
          rating?: number | null
          review_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_reviews_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "api_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_syncs: {
        Row: {
          completed_at: string | null
          direction: string | null
          error_message: string | null
          id: string
          records_failed: number | null
          records_processed: number | null
          records_successful: number | null
          started_at: string | null
          status: string | null
          sync_type: string | null
          user_integration_id: string | null
        }
        Insert: {
          completed_at?: string | null
          direction?: string | null
          error_message?: string | null
          id?: string
          records_failed?: number | null
          records_processed?: number | null
          records_successful?: number | null
          started_at?: string | null
          status?: string | null
          sync_type?: string | null
          user_integration_id?: string | null
        }
        Update: {
          completed_at?: string | null
          direction?: string | null
          error_message?: string | null
          id?: string
          records_failed?: number | null
          records_processed?: number | null
          records_successful?: number | null
          started_at?: string | null
          status?: string | null
          sync_type?: string | null
          user_integration_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_syncs_user_integration_id_fkey"
            columns: ["user_integration_id"]
            isOneToOne: false
            referencedRelation: "user_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          category: string
          connection_count: number | null
          created_at: string | null
          description: string | null
          id: string
          integration_type: string | null
          is_active: boolean | null
          is_beta: boolean | null
          is_free: boolean | null
          logo_url: string | null
          name: string
          requires_plan: string | null
          slug: string
          supports_export: boolean | null
          supports_import: boolean | null
          supports_sync: boolean | null
          website: string | null
        }
        Insert: {
          category: string
          connection_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          integration_type?: string | null
          is_active?: boolean | null
          is_beta?: boolean | null
          is_free?: boolean | null
          logo_url?: string | null
          name: string
          requires_plan?: string | null
          slug: string
          supports_export?: boolean | null
          supports_import?: boolean | null
          supports_sync?: boolean | null
          website?: string | null
        }
        Update: {
          category?: string
          connection_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          integration_type?: string | null
          is_active?: boolean | null
          is_beta?: boolean | null
          is_free?: boolean | null
          logo_url?: string | null
          name?: string
          requires_plan?: string | null
          slug?: string
          supports_export?: boolean | null
          supports_import?: boolean | null
          supports_sync?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      investment_hotspots: {
        Row: {
          area_name: string
          avg_price: number | null
          avg_yield: number | null
          calculated_at: string | null
          demographic_trends: Json | null
          entry_price_range: string | null
          forecast_growth_12m: number | null
          hotspot_type: string | null
          id: string
          infrastructure_projects: string[] | null
          is_active: boolean | null
          opportunity_score: number | null
          postcode_district: string
          price_growth_12m: number | null
          rank: number | null
          reasons: string[] | null
          risk_level: string | null
          suitable_strategies: string[] | null
        }
        Insert: {
          area_name: string
          avg_price?: number | null
          avg_yield?: number | null
          calculated_at?: string | null
          demographic_trends?: Json | null
          entry_price_range?: string | null
          forecast_growth_12m?: number | null
          hotspot_type?: string | null
          id?: string
          infrastructure_projects?: string[] | null
          is_active?: boolean | null
          opportunity_score?: number | null
          postcode_district: string
          price_growth_12m?: number | null
          rank?: number | null
          reasons?: string[] | null
          risk_level?: string | null
          suitable_strategies?: string[] | null
        }
        Update: {
          area_name?: string
          avg_price?: number | null
          avg_yield?: number | null
          calculated_at?: string | null
          demographic_trends?: Json | null
          entry_price_range?: string | null
          forecast_growth_12m?: number | null
          hotspot_type?: string | null
          id?: string
          infrastructure_projects?: string[] | null
          is_active?: boolean | null
          opportunity_score?: number | null
          postcode_district?: string
          price_growth_12m?: number | null
          rank?: number | null
          reasons?: string[] | null
          risk_level?: string | null
          suitable_strategies?: string[] | null
        }
        Relationships: []
      }
      investment_milestones: {
        Row: {
          created_at: string | null
          id: string
          milestone_date: string
          milestone_type: string
          milestone_value: number | null
          notes: string | null
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          milestone_date: string
          milestone_type: string
          milestone_value?: number | null
          notes?: string | null
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          milestone_date?: string
          milestone_type?: string
          milestone_value?: number | null
          notes?: string | null
          property_id?: string
          user_id?: string
        }
        Relationships: []
      }
      investment_targets: {
        Row: {
          created_at: string | null
          id: string
          property_id: string
          target_annual_appreciation: number | null
          target_annual_cash_flow: number | null
          target_avg_void_days: number | null
          target_exit_value: number | null
          target_exit_year: number | null
          target_gross_yield: number | null
          target_maintenance_percentage: number | null
          target_management_percentage: number | null
          target_monthly_cash_flow: number | null
          target_net_yield: number | null
          target_occupancy_rate: number | null
          target_roi_percentage: number | null
          target_roi_years: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id: string
          target_annual_appreciation?: number | null
          target_annual_cash_flow?: number | null
          target_avg_void_days?: number | null
          target_exit_value?: number | null
          target_exit_year?: number | null
          target_gross_yield?: number | null
          target_maintenance_percentage?: number | null
          target_management_percentage?: number | null
          target_monthly_cash_flow?: number | null
          target_net_yield?: number | null
          target_occupancy_rate?: number | null
          target_roi_percentage?: number | null
          target_roi_years?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string
          target_annual_appreciation?: number | null
          target_annual_cash_flow?: number | null
          target_avg_void_days?: number | null
          target_exit_value?: number | null
          target_exit_year?: number | null
          target_gross_yield?: number | null
          target_maintenance_percentage?: number | null
          target_management_percentage?: number | null
          target_monthly_cash_flow?: number | null
          target_net_yield?: number | null
          target_occupancy_rate?: number | null
          target_roi_percentage?: number | null
          target_roi_years?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      job_quotes: {
        Row: {
          contractor_id: string | null
          created_at: string | null
          earliest_start_date: string | null
          estimated_duration: string | null
          id: string
          job_request_id: string | null
          labour_cost: number | null
          materials_cost: number | null
          other_costs: number | null
          quote_amount: number
          quote_description: string | null
          status: string | null
          valid_until: string | null
        }
        Insert: {
          contractor_id?: string | null
          created_at?: string | null
          earliest_start_date?: string | null
          estimated_duration?: string | null
          id?: string
          job_request_id?: string | null
          labour_cost?: number | null
          materials_cost?: number | null
          other_costs?: number | null
          quote_amount: number
          quote_description?: string | null
          status?: string | null
          valid_until?: string | null
        }
        Update: {
          contractor_id?: string | null
          created_at?: string | null
          earliest_start_date?: string | null
          estimated_duration?: string | null
          id?: string
          job_request_id?: string | null
          labour_cost?: number | null
          materials_cost?: number | null
          other_costs?: number | null
          quote_amount?: number
          quote_description?: string | null
          status?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_quotes_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_quotes_job_request_id_fkey"
            columns: ["job_request_id"]
            isOneToOne: false
            referencedRelation: "job_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      job_requests: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          category_id: string | null
          created_at: string | null
          description: string
          expires_at: string | null
          id: string
          photo_urls: string[] | null
          preferred_date: string | null
          preferred_time: string | null
          property_address: string | null
          property_postcode: string | null
          selected_contractor_id: string | null
          status: string | null
          title: string
          urgency: string | null
          user_id: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          category_id?: string | null
          created_at?: string | null
          description: string
          expires_at?: string | null
          id?: string
          photo_urls?: string[] | null
          preferred_date?: string | null
          preferred_time?: string | null
          property_address?: string | null
          property_postcode?: string | null
          selected_contractor_id?: string | null
          status?: string | null
          title: string
          urgency?: string | null
          user_id: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          photo_urls?: string[] | null
          preferred_date?: string | null
          preferred_time?: string | null
          property_address?: string | null
          property_postcode?: string | null
          selected_contractor_id?: string | null
          status?: string | null
          title?: string
          urgency?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "contractor_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_requests_selected_contractor_id_fkey"
            columns: ["selected_contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      jv_deals: {
        Row: {
          created_at: string | null
          deal_name: string | null
          deal_start_date: string | null
          deal_type: string | null
          exit_date: string | null
          exit_price: number | null
          id: string
          net_proceeds: number | null
          notes: string | null
          portfolio_property_id: string | null
          projected_exit_date: string | null
          status: string | null
          total_investment: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          deal_name?: string | null
          deal_start_date?: string | null
          deal_type?: string | null
          exit_date?: string | null
          exit_price?: number | null
          id?: string
          net_proceeds?: number | null
          notes?: string | null
          portfolio_property_id?: string | null
          projected_exit_date?: string | null
          status?: string | null
          total_investment?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          deal_name?: string | null
          deal_start_date?: string | null
          deal_type?: string | null
          exit_date?: string | null
          exit_price?: number | null
          id?: string
          net_proceeds?: number | null
          notes?: string | null
          portfolio_property_id?: string | null
          projected_exit_date?: string | null
          status?: string | null
          total_investment?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jv_deals_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jv_deals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jv_partners: {
        Row: {
          additional_investments: number | null
          created_at: string | null
          distributions_received: number | null
          equity_percentage: number
          exit_proceeds: number | null
          id: string
          initial_investment: number
          is_self: boolean | null
          jv_deal_id: string | null
          partner_email: string | null
          partner_name: string
          profit_percentage: number | null
          team_member_id: string | null
        }
        Insert: {
          additional_investments?: number | null
          created_at?: string | null
          distributions_received?: number | null
          equity_percentage: number
          exit_proceeds?: number | null
          id?: string
          initial_investment: number
          is_self?: boolean | null
          jv_deal_id?: string | null
          partner_email?: string | null
          partner_name: string
          profit_percentage?: number | null
          team_member_id?: string | null
        }
        Update: {
          additional_investments?: number | null
          created_at?: string | null
          distributions_received?: number | null
          equity_percentage?: number
          exit_proceeds?: number | null
          id?: string
          initial_investment?: number
          is_self?: boolean | null
          jv_deal_id?: string | null
          partner_email?: string | null
          partner_name?: string
          profit_percentage?: number | null
          team_member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jv_partners_jv_deal_id_fkey"
            columns: ["jv_deal_id"]
            isOneToOne: false
            referencedRelation: "jv_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jv_partners_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      jv_preferences: {
        Row: {
          capital_available: number | null
          created_at: string | null
          id: string
          looking_for_capital: boolean | null
          looking_for_skills: string[] | null
          max_deal_size: number | null
          min_deal_size: number | null
          preferred_locations: string[] | null
          preferred_strategies: string[] | null
          skills: string[] | null
          user_id: string
        }
        Insert: {
          capital_available?: number | null
          created_at?: string | null
          id?: string
          looking_for_capital?: boolean | null
          looking_for_skills?: string[] | null
          max_deal_size?: number | null
          min_deal_size?: number | null
          preferred_locations?: string[] | null
          preferred_strategies?: string[] | null
          skills?: string[] | null
          user_id: string
        }
        Update: {
          capital_available?: number | null
          created_at?: string | null
          id?: string
          looking_for_capital?: boolean | null
          looking_for_skills?: string[] | null
          max_deal_size?: number | null
          min_deal_size?: number | null
          preferred_locations?: string[] | null
          preferred_strategies?: string[] | null
          skills?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      jv_transactions: {
        Row: {
          created_at: string | null
          custom_splits: Json | null
          description: string | null
          id: string
          jv_deal_id: string | null
          split_type: string | null
          total_amount: number
          transaction_date: string
          transaction_type: string
        }
        Insert: {
          created_at?: string | null
          custom_splits?: Json | null
          description?: string | null
          id?: string
          jv_deal_id?: string | null
          split_type?: string | null
          total_amount: number
          transaction_date: string
          transaction_type: string
        }
        Update: {
          created_at?: string | null
          custom_splits?: Json | null
          description?: string | null
          id?: string
          jv_deal_id?: string | null
          split_type?: string | null
          total_amount?: number
          transaction_date?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "jv_transactions_jv_deal_id_fkey"
            columns: ["jv_deal_id"]
            isOneToOne: false
            referencedRelation: "jv_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      land_registry_data: {
        Row: {
          api_response: Json | null
          boundary_polygon: Json | null
          charge_count: number | null
          charges: Json | null
          company_registration_number: string | null
          created_at: string | null
          data_quality: string | null
          date_proprietor_added: string | null
          ground_rent: number | null
          has_charges: boolean | null
          has_restrictions: boolean | null
          id: string
          last_refreshed_at: string | null
          last_sale_date: string | null
          last_sale_price: number | null
          last_sale_type: string | null
          lease_expiry_date: string | null
          lease_start_date: string | null
          lease_term_years: number | null
          postcode: string
          property_address: string
          proprietor_address: string | null
          proprietor_name: string | null
          proprietorship_category: string | null
          restrictions: Json | null
          tenure: string | null
          title_number: string | null
          title_plan_url: string | null
          updated_at: string | null
          uprn: string | null
        }
        Insert: {
          api_response?: Json | null
          boundary_polygon?: Json | null
          charge_count?: number | null
          charges?: Json | null
          company_registration_number?: string | null
          created_at?: string | null
          data_quality?: string | null
          date_proprietor_added?: string | null
          ground_rent?: number | null
          has_charges?: boolean | null
          has_restrictions?: boolean | null
          id?: string
          last_refreshed_at?: string | null
          last_sale_date?: string | null
          last_sale_price?: number | null
          last_sale_type?: string | null
          lease_expiry_date?: string | null
          lease_start_date?: string | null
          lease_term_years?: number | null
          postcode: string
          property_address: string
          proprietor_address?: string | null
          proprietor_name?: string | null
          proprietorship_category?: string | null
          restrictions?: Json | null
          tenure?: string | null
          title_number?: string | null
          title_plan_url?: string | null
          updated_at?: string | null
          uprn?: string | null
        }
        Update: {
          api_response?: Json | null
          boundary_polygon?: Json | null
          charge_count?: number | null
          charges?: Json | null
          company_registration_number?: string | null
          created_at?: string | null
          data_quality?: string | null
          date_proprietor_added?: string | null
          ground_rent?: number | null
          has_charges?: boolean | null
          has_restrictions?: boolean | null
          id?: string
          last_refreshed_at?: string | null
          last_sale_date?: string | null
          last_sale_price?: number | null
          last_sale_type?: string | null
          lease_expiry_date?: string | null
          lease_start_date?: string | null
          lease_term_years?: number | null
          postcode?: string
          property_address?: string
          proprietor_address?: string | null
          proprietor_name?: string | null
          proprietorship_category?: string | null
          restrictions?: Json | null
          tenure?: string | null
          title_number?: string | null
          title_plan_url?: string | null
          updated_at?: string | null
          uprn?: string | null
        }
        Relationships: []
      }
      listing_generations: {
        Row: {
          applied_to_listing: boolean | null
          checkin_instructions: string | null
          created_at: string | null
          descriptions: Json
          house_rules: string | null
          id: string
          input_data: Json | null
          selected_description_index: number | null
          selected_title_index: number | null
          str_property_id: string
          titles: Json
          user_id: string
        }
        Insert: {
          applied_to_listing?: boolean | null
          checkin_instructions?: string | null
          created_at?: string | null
          descriptions: Json
          house_rules?: string | null
          id?: string
          input_data?: Json | null
          selected_description_index?: number | null
          selected_title_index?: number | null
          str_property_id: string
          titles: Json
          user_id: string
        }
        Update: {
          applied_to_listing?: boolean | null
          checkin_instructions?: string | null
          created_at?: string | null
          descriptions?: Json
          house_rules?: string | null
          id?: string
          input_data?: Json | null
          selected_description_index?: number | null
          selected_title_index?: number | null
          str_property_id?: string
          titles?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_generations_str_property_id_fkey"
            columns: ["str_property_id"]
            isOneToOne: false
            referencedRelation: "str_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_jobs: {
        Row: {
          actual_cost: number | null
          category: string | null
          completed_date: string | null
          contractor_name: string | null
          contractor_phone: string | null
          created_at: string | null
          description: string | null
          estimated_cost: number | null
          id: string
          portfolio_property_id: string | null
          priority: string | null
          reported_date: string
          scheduled_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          category?: string | null
          completed_date?: string | null
          contractor_name?: string | null
          contractor_phone?: string | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          portfolio_property_id?: string | null
          priority?: string | null
          reported_date: string
          scheduled_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          category?: string | null
          completed_date?: string | null
          contractor_name?: string | null
          contractor_phone?: string | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          portfolio_property_id?: string | null
          priority?: string | null
          reported_date?: string
          scheduled_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_jobs_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          category: string | null
          contractor_name: string | null
          contractor_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          landlord_notes: string | null
          location: string | null
          photo_urls: string[] | null
          portfolio_property_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          scheduled_date: string | null
          status: string | null
          tenant_feedback: string | null
          tenant_id: string | null
          tenant_rating: number | null
          title: string
          urgency: string | null
        }
        Insert: {
          category?: string | null
          contractor_name?: string | null
          contractor_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          landlord_notes?: string | null
          location?: string | null
          photo_urls?: string[] | null
          portfolio_property_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          scheduled_date?: string | null
          status?: string | null
          tenant_feedback?: string | null
          tenant_id?: string | null
          tenant_rating?: number | null
          title: string
          urgency?: string | null
        }
        Update: {
          category?: string | null
          contractor_name?: string | null
          contractor_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          landlord_notes?: string | null
          location?: string | null
          photo_urls?: string[] | null
          portfolio_property_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          scheduled_date?: string | null
          status?: string | null
          tenant_feedback?: string | null
          tenant_id?: string | null
          tenant_rating?: number | null
          title?: string
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      map_heat_data: {
        Row: {
          avg_price: number | null
          avg_yield: number | null
          color: string | null
          heat_type: string | null
          id: string
          intensity: number | null
          postcode_area: string | null
          property_count: number | null
          updated_at: string | null
        }
        Insert: {
          avg_price?: number | null
          avg_yield?: number | null
          color?: string | null
          heat_type?: string | null
          id?: string
          intensity?: number | null
          postcode_area?: string | null
          property_count?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_price?: number | null
          avg_yield?: number | null
          color?: string | null
          heat_type?: string | null
          id?: string
          intensity?: number | null
          postcode_area?: string | null
          property_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      market_conditions: {
        Row: {
          avg_mortgage_rate: number | null
          avg_yields_by_area: Json | null
          boe_base_rate: number | null
          created_at: string | null
          data_source: string | null
          id: string
          inflation_rate: number | null
          snapshot_date: string | null
        }
        Insert: {
          avg_mortgage_rate?: number | null
          avg_yields_by_area?: Json | null
          boe_base_rate?: number | null
          created_at?: string | null
          data_source?: string | null
          id?: string
          inflation_rate?: number | null
          snapshot_date?: string | null
        }
        Update: {
          avg_mortgage_rate?: number | null
          avg_yields_by_area?: Json | null
          boe_base_rate?: number | null
          created_at?: string | null
          data_source?: string | null
          id?: string
          inflation_rate?: number | null
          snapshot_date?: string | null
        }
        Relationships: []
      }
      market_data: {
        Row: {
          average_days_to_sell: number | null
          average_gross_yield: number | null
          average_price: number | null
          average_rent: number | null
          created_at: string | null
          data_date: string
          data_source: string | null
          demand_score: number | null
          id: string
          lower_quartile_price: number | null
          median_price: number | null
          median_rent: number | null
          new_listings: number | null
          period_type: string | null
          postcode_area: string
          postcode_district: string | null
          price_change_mom: number | null
          price_change_yoy: number | null
          price_per_sqft: number | null
          property_types: Json | null
          region: string | null
          sales_volume: number | null
          stock_for_sale: number | null
          stock_to_rent: number | null
          upper_quartile_price: number | null
        }
        Insert: {
          average_days_to_sell?: number | null
          average_gross_yield?: number | null
          average_price?: number | null
          average_rent?: number | null
          created_at?: string | null
          data_date: string
          data_source?: string | null
          demand_score?: number | null
          id?: string
          lower_quartile_price?: number | null
          median_price?: number | null
          median_rent?: number | null
          new_listings?: number | null
          period_type?: string | null
          postcode_area: string
          postcode_district?: string | null
          price_change_mom?: number | null
          price_change_yoy?: number | null
          price_per_sqft?: number | null
          property_types?: Json | null
          region?: string | null
          sales_volume?: number | null
          stock_for_sale?: number | null
          stock_to_rent?: number | null
          upper_quartile_price?: number | null
        }
        Update: {
          average_days_to_sell?: number | null
          average_gross_yield?: number | null
          average_price?: number | null
          average_rent?: number | null
          created_at?: string | null
          data_date?: string
          data_source?: string | null
          demand_score?: number | null
          id?: string
          lower_quartile_price?: number | null
          median_price?: number | null
          median_rent?: number | null
          new_listings?: number | null
          period_type?: string | null
          postcode_area?: string
          postcode_district?: string | null
          price_change_mom?: number | null
          price_change_yoy?: number | null
          price_per_sqft?: number | null
          property_types?: Json | null
          region?: string | null
          sales_volume?: number | null
          stock_for_sale?: number | null
          stock_to_rent?: number | null
          upper_quartile_price?: number | null
        }
        Relationships: []
      }
      market_intelligence: {
        Row: {
          area: string
          avg_days_to_sell: number | null
          avg_price: number | null
          avg_rent: number | null
          avg_sale_vs_asking: number | null
          avg_void_period_days: number | null
          avg_yield: number | null
          cash_flow_potential: string | null
          data_date: string | null
          growth_potential: string | null
          id: string
          investment_score: number | null
          median_price: number | null
          median_rent: number | null
          new_listings_30d: number | null
          price_per_sqft: number | null
          price_trend_12mo: number | null
          price_trend_3mo: number | null
          properties_for_sale: number | null
          properties_sold_30d: number | null
          rental_demand: string | null
          updated_at: string | null
        }
        Insert: {
          area: string
          avg_days_to_sell?: number | null
          avg_price?: number | null
          avg_rent?: number | null
          avg_sale_vs_asking?: number | null
          avg_void_period_days?: number | null
          avg_yield?: number | null
          cash_flow_potential?: string | null
          data_date?: string | null
          growth_potential?: string | null
          id?: string
          investment_score?: number | null
          median_price?: number | null
          median_rent?: number | null
          new_listings_30d?: number | null
          price_per_sqft?: number | null
          price_trend_12mo?: number | null
          price_trend_3mo?: number | null
          properties_for_sale?: number | null
          properties_sold_30d?: number | null
          rental_demand?: string | null
          updated_at?: string | null
        }
        Update: {
          area?: string
          avg_days_to_sell?: number | null
          avg_price?: number | null
          avg_rent?: number | null
          avg_sale_vs_asking?: number | null
          avg_void_period_days?: number | null
          avg_yield?: number | null
          cash_flow_potential?: string | null
          data_date?: string | null
          growth_potential?: string | null
          id?: string
          investment_score?: number | null
          median_price?: number | null
          median_rent?: number | null
          new_listings_30d?: number | null
          price_per_sqft?: number | null
          price_trend_12mo?: number | null
          price_trend_3mo?: number | null
          properties_for_sale?: number | null
          properties_sold_30d?: number | null
          rental_demand?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mileage_logs: {
        Row: {
          created_at: string | null
          from_location: string
          id: string
          journey_date: string
          miles: number
          notes: string | null
          portfolio_property_id: string | null
          purpose: string
          rate_per_mile: number | null
          to_location: string
          user_id: string
          vehicle: string | null
        }
        Insert: {
          created_at?: string | null
          from_location: string
          id?: string
          journey_date: string
          miles: number
          notes?: string | null
          portfolio_property_id?: string | null
          purpose: string
          rate_per_mile?: number | null
          to_location: string
          user_id: string
          vehicle?: string | null
        }
        Update: {
          created_at?: string | null
          from_location?: string
          id?: string
          journey_date?: string
          miles?: number
          notes?: string | null
          portfolio_property_id?: string | null
          purpose?: string
          rate_per_mile?: number | null
          to_location?: string
          user_id?: string
          vehicle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mileage_logs_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_queue: {
        Row: {
          content_id: string
          content_type: string | null
          created_at: string | null
          id: string
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          report_reason: string | null
          reported_by: string | null
          status: string | null
        }
        Insert: {
          content_id: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          report_reason?: string | null
          reported_by?: string | null
          status?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          report_reason?: string | null
          reported_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_queue_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      mortgage_comparisons: {
        Row: {
          best_rate: number | null
          created_at: string | null
          id: string
          loan_amount: number
          ltv: number | null
          mortgage_type: string | null
          property_id: string | null
          property_value: number
          results: Json | null
          term_years: number | null
          user_id: string
        }
        Insert: {
          best_rate?: number | null
          created_at?: string | null
          id?: string
          loan_amount: number
          ltv?: number | null
          mortgage_type?: string | null
          property_id?: string | null
          property_value: number
          results?: Json | null
          term_years?: number | null
          user_id: string
        }
        Update: {
          best_rate?: number | null
          created_at?: string | null
          id?: string
          loan_amount?: number
          ltv?: number | null
          mortgage_type?: string | null
          property_id?: string | null
          property_value?: number
          results?: Json | null
          term_years?: number | null
          user_id?: string
        }
        Relationships: []
      }
      mortgage_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          interest: number | null
          is_overpayment: boolean | null
          mortgage_id: string
          payment_date: string
          principal: number | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          interest?: number | null
          is_overpayment?: boolean | null
          mortgage_id: string
          payment_date: string
          principal?: number | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          interest?: number | null
          is_overpayment?: boolean | null
          mortgage_id?: string
          payment_date?: string
          principal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mortgage_payments_mortgage_id_fkey"
            columns: ["mortgage_id"]
            isOneToOne: false
            referencedRelation: "mortgages"
            referencedColumns: ["id"]
          },
        ]
      }
      mortgage_products: {
        Row: {
          cashback: number | null
          early_repayment_charges: Json | null
          eligibility_criteria: Json | null
          id: string
          initial_rate_period: number | null
          is_active: boolean | null
          last_updated: string | null
          lender: string
          max_loan: number | null
          max_ltv: number | null
          min_loan: number | null
          mortgage_type: string | null
          product_fee: number | null
          product_name: string | null
          rate: number
          rate_type: string | null
        }
        Insert: {
          cashback?: number | null
          early_repayment_charges?: Json | null
          eligibility_criteria?: Json | null
          id?: string
          initial_rate_period?: number | null
          is_active?: boolean | null
          last_updated?: string | null
          lender: string
          max_loan?: number | null
          max_ltv?: number | null
          min_loan?: number | null
          mortgage_type?: string | null
          product_fee?: number | null
          product_name?: string | null
          rate: number
          rate_type?: string | null
        }
        Update: {
          cashback?: number | null
          early_repayment_charges?: Json | null
          eligibility_criteria?: Json | null
          id?: string
          initial_rate_period?: number | null
          is_active?: boolean | null
          last_updated?: string | null
          lender?: string
          max_loan?: number | null
          max_ltv?: number | null
          min_loan?: number | null
          mortgage_type?: string | null
          product_fee?: number | null
          product_name?: string | null
          rate?: number
          rate_type?: string | null
        }
        Relationships: []
      }
      mortgage_referrals: {
        Row: {
          click_id: string | null
          commission_amount: number | null
          commission_paid: boolean | null
          commission_paid_at: string | null
          comparison_id: string | null
          created_at: string | null
          id: string
          lender_name: string | null
          loan_amount: number | null
          partner: string
          product_id: string | null
          rate: number | null
          referral_code: string | null
          referral_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          click_id?: string | null
          commission_amount?: number | null
          commission_paid?: boolean | null
          commission_paid_at?: string | null
          comparison_id?: string | null
          created_at?: string | null
          id?: string
          lender_name?: string | null
          loan_amount?: number | null
          partner: string
          product_id?: string | null
          rate?: number | null
          referral_code?: string | null
          referral_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          click_id?: string | null
          commission_amount?: number | null
          commission_paid?: boolean | null
          commission_paid_at?: string | null
          comparison_id?: string | null
          created_at?: string | null
          id?: string
          lender_name?: string | null
          loan_amount?: number | null
          partner?: string
          product_id?: string | null
          rate?: number | null
          referral_code?: string | null
          referral_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mortgage_referrals_comparison_id_fkey"
            columns: ["comparison_id"]
            isOneToOne: false
            referencedRelation: "mortgage_comparisons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mortgage_referrals_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "mortgage_products"
            referencedColumns: ["id"]
          },
        ]
      }
      mortgages: {
        Row: {
          account_number: string | null
          created_at: string | null
          current_balance: number
          current_rate: number
          deal_end_date: string | null
          deal_start_date: string | null
          erc_end_date: string | null
          erc_percent: number | null
          id: string
          is_portable: boolean | null
          lender_name: string
          monthly_payment: number | null
          mortgage_type: string | null
          original_amount: number
          overpayment_allowance: number | null
          portfolio_property_id: string | null
          rate_type: string | null
          repayment_type: string | null
          status: string | null
          svr_rate: number | null
          term_years: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_number?: string | null
          created_at?: string | null
          current_balance: number
          current_rate: number
          deal_end_date?: string | null
          deal_start_date?: string | null
          erc_end_date?: string | null
          erc_percent?: number | null
          id?: string
          is_portable?: boolean | null
          lender_name: string
          monthly_payment?: number | null
          mortgage_type?: string | null
          original_amount: number
          overpayment_allowance?: number | null
          portfolio_property_id?: string | null
          rate_type?: string | null
          repayment_type?: string | null
          status?: string | null
          svr_rate?: number | null
          term_years?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_number?: string | null
          created_at?: string | null
          current_balance?: number
          current_rate?: number
          deal_end_date?: string | null
          deal_start_date?: string | null
          erc_end_date?: string | null
          erc_percent?: number | null
          id?: string
          is_portable?: boolean | null
          lender_name?: string
          monthly_payment?: number | null
          mortgage_type?: string | null
          original_amount?: number
          overpayment_allowance?: number | null
          portfolio_property_id?: string | null
          rate_type?: string | null
          repayment_type?: string | null
          status?: string | null
          svr_rate?: number | null
          term_years?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mortgages_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      mtd_obligations: {
        Row: {
          created_at: string | null
          due_date: string
          hmrc_reference: string | null
          id: string
          period_end: string
          period_start: string
          quarter: number
          status: string | null
          submitted_at: string | null
          tax_year: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          due_date: string
          hmrc_reference?: string | null
          id?: string
          period_end: string
          period_start: string
          quarter: number
          status?: string | null
          submitted_at?: string | null
          tax_year: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          due_date?: string
          hmrc_reference?: string | null
          id?: string
          period_end?: string
          period_start?: string
          quarter?: number
          status?: string | null
          submitted_at?: string | null
          tax_year?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mtd_obligations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mtd_settings: {
        Row: {
          accounting_type: string | null
          auto_categorise: boolean | null
          business_name: string | null
          created_at: string | null
          hmrc_connected: boolean | null
          id: string
          nino_encrypted: string | null
          reminder_days_before: number | null
          user_id: string | null
          utr_encrypted: string | null
        }
        Insert: {
          accounting_type?: string | null
          auto_categorise?: boolean | null
          business_name?: string | null
          created_at?: string | null
          hmrc_connected?: boolean | null
          id?: string
          nino_encrypted?: string | null
          reminder_days_before?: number | null
          user_id?: string | null
          utr_encrypted?: string | null
        }
        Update: {
          accounting_type?: string | null
          auto_categorise?: boolean | null
          business_name?: string | null
          created_at?: string | null
          hmrc_connected?: boolean | null
          id?: string
          nino_encrypted?: string | null
          reminder_days_before?: number | null
          user_id?: string | null
          utr_encrypted?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mtd_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mtd_submissions: {
        Row: {
          created_at: string | null
          expense_breakdown: Json | null
          hmrc_response: Json | null
          id: string
          income_breakdown: Json | null
          net_profit: number | null
          obligation_id: string | null
          status: string | null
          submission_id: string | null
          total_expenses: number | null
          total_income: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expense_breakdown?: Json | null
          hmrc_response?: Json | null
          id?: string
          income_breakdown?: Json | null
          net_profit?: number | null
          obligation_id?: string | null
          status?: string | null
          submission_id?: string | null
          total_expenses?: number | null
          total_income?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expense_breakdown?: Json | null
          hmrc_response?: Json | null
          id?: string
          income_breakdown?: Json | null
          net_profit?: number | null
          obligation_id?: string | null
          status?: string | null
          submission_id?: string | null
          total_expenses?: number | null
          total_income?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mtd_submissions_obligation_id_fkey"
            columns: ["obligation_id"]
            isOneToOne: false
            referencedRelation: "mtd_obligations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mtd_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      network_groups: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          created_by: string
          description: string | null
          group_type: string | null
          id: string
          location_area: string | null
          member_count: number | null
          name: string
          visibility: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          group_type?: string | null
          id?: string
          location_area?: string | null
          member_count?: number | null
          name: string
          visibility?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          group_type?: string | null
          id?: string
          location_area?: string | null
          member_count?: number | null
          name?: string
          visibility?: string | null
        }
        Relationships: []
      }
      network_posts: {
        Row: {
          asking_price: number | null
          comment_count: number | null
          content: string
          created_at: string | null
          deal_type: string | null
          id: string
          images: Json | null
          jv_equity_split: string | null
          jv_investment_required: number | null
          jv_structure: string | null
          like_count: number | null
          location_area: string | null
          post_type: string
          share_count: number | null
          title: string | null
          updated_at: string | null
          user_id: string
          view_count: number | null
          visibility: string | null
        }
        Insert: {
          asking_price?: number | null
          comment_count?: number | null
          content: string
          created_at?: string | null
          deal_type?: string | null
          id?: string
          images?: Json | null
          jv_equity_split?: string | null
          jv_investment_required?: number | null
          jv_structure?: string | null
          like_count?: number | null
          location_area?: string | null
          post_type: string
          share_count?: number | null
          title?: string | null
          updated_at?: string | null
          user_id: string
          view_count?: number | null
          visibility?: string | null
        }
        Update: {
          asking_price?: number | null
          comment_count?: number | null
          content?: string
          created_at?: string | null
          deal_type?: string | null
          id?: string
          images?: Json | null
          jv_equity_split?: string | null
          jv_investment_required?: number | null
          jv_structure?: string | null
          like_count?: number | null
          location_area?: string | null
          post_type?: string
          share_count?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
          visibility?: string | null
        }
        Relationships: []
      }
      networking_events: {
        Row: {
          city: string | null
          created_at: string | null
          current_attendees: number | null
          description: string | null
          end_datetime: string | null
          event_type: string | null
          id: string
          image_url: string | null
          is_free: boolean | null
          is_virtual: boolean | null
          max_attendees: number | null
          member_price: number | null
          organiser_id: string | null
          organiser_name: string | null
          postcode: string | null
          start_datetime: string
          status: string | null
          ticket_price: number | null
          timezone: string | null
          title: string
          venue_address: string | null
          venue_name: string | null
          virtual_link: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          current_attendees?: number | null
          description?: string | null
          end_datetime?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_free?: boolean | null
          is_virtual?: boolean | null
          max_attendees?: number | null
          member_price?: number | null
          organiser_id?: string | null
          organiser_name?: string | null
          postcode?: string | null
          start_datetime: string
          status?: string | null
          ticket_price?: number | null
          timezone?: string | null
          title: string
          venue_address?: string | null
          venue_name?: string | null
          virtual_link?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          current_attendees?: number | null
          description?: string | null
          end_datetime?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_free?: boolean | null
          is_virtual?: boolean | null
          max_attendees?: number | null
          member_price?: number | null
          organiser_id?: string | null
          organiser_name?: string | null
          postcode?: string | null
          start_datetime?: string
          status?: string | null
          ticket_price?: number | null
          timezone?: string | null
          title?: string
          venue_address?: string | null
          venue_name?: string | null
          virtual_link?: string | null
        }
        Relationships: []
      }
      note_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          note_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          note_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          note_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "note_comments_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          assigned_to: string | null
          content: string
          created_at: string | null
          due_date: string | null
          entity_id: string
          entity_type: string
          id: string
          is_pinned: boolean | null
          is_resolved: boolean | null
          mentioned_users: string[] | null
          note_type: string | null
          team_id: string | null
          updated_at: string | null
          user_id: string | null
          visibility: string | null
        }
        Insert: {
          assigned_to?: string | null
          content: string
          created_at?: string | null
          due_date?: string | null
          entity_id: string
          entity_type: string
          id?: string
          is_pinned?: boolean | null
          is_resolved?: boolean | null
          mentioned_users?: string[] | null
          note_type?: string | null
          team_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Update: {
          assigned_to?: string | null
          content?: string
          created_at?: string | null
          due_date?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          is_pinned?: boolean | null
          is_resolved?: boolean | null
          mentioned_users?: string[] | null
          note_type?: string | null
          team_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      off_market_properties: {
        Row: {
          address: string | null
          available_from: string | null
          bedrooms: number | null
          created_at: string | null
          description: string | null
          documents: Json | null
          expires_at: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          postcode: string | null
          price: number | null
          property_type: string | null
          published_at: string | null
          reason_off_market: string | null
          source_contact: Json | null
          source_name: string | null
          source_type: string | null
        }
        Insert: {
          address?: string | null
          available_from?: string | null
          bedrooms?: number | null
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          expires_at?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          postcode?: string | null
          price?: number | null
          property_type?: string | null
          published_at?: string | null
          reason_off_market?: string | null
          source_contact?: Json | null
          source_name?: string | null
          source_type?: string | null
        }
        Update: {
          address?: string | null
          available_from?: string | null
          bedrooms?: number | null
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          expires_at?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          postcode?: string | null
          price?: number | null
          property_type?: string | null
          published_at?: string | null
          reason_off_market?: string | null
          source_contact?: Json | null
          source_name?: string | null
          source_type?: string | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          affiliate_id: string | null
          amount: number
          bank_reference: string | null
          completed_at: string | null
          currency: string | null
          failure_reason: string | null
          id: string
          invoice_url: string | null
          notes: string | null
          payment_method: string | null
          paypal_transaction_id: string | null
          processed_at: string | null
          requested_at: string | null
          status: string | null
          stripe_payout_id: string | null
        }
        Insert: {
          affiliate_id?: string | null
          amount: number
          bank_reference?: string | null
          completed_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          id?: string
          invoice_url?: string | null
          notes?: string | null
          payment_method?: string | null
          paypal_transaction_id?: string | null
          processed_at?: string | null
          requested_at?: string | null
          status?: string | null
          stripe_payout_id?: string | null
        }
        Update: {
          affiliate_id?: string | null
          amount?: number
          bank_reference?: string | null
          completed_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          id?: string
          invoice_url?: string | null
          notes?: string | null
          payment_method?: string | null
          paypal_transaction_id?: string | null
          processed_at?: string | null
          requested_at?: string | null
          status?: string | null
          stripe_payout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_alerts: {
        Row: {
          actual_value: number | null
          alert_message: string
          alert_type: string
          created_at: string | null
          id: string
          is_resolved: boolean | null
          metric_name: string | null
          property_id: string
          resolved_at: string | null
          severity: string | null
          target_value: number | null
          user_id: string
          variance: number | null
        }
        Insert: {
          actual_value?: number | null
          alert_message: string
          alert_type: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          metric_name?: string | null
          property_id: string
          resolved_at?: string | null
          severity?: string | null
          target_value?: number | null
          user_id: string
          variance?: number | null
        }
        Update: {
          actual_value?: number | null
          alert_message?: string
          alert_type?: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          metric_name?: string | null
          property_id?: string
          resolved_at?: string | null
          severity?: string | null
          target_value?: number | null
          user_id?: string
          variance?: number | null
        }
        Relationships: []
      }
      performance_snapshots: {
        Row: {
          actual_gross_yield: number | null
          actual_monthly_cash_flow: number | null
          actual_net_yield: number | null
          actual_occupancy_rate: number | null
          actual_roi: number | null
          cash_flow_variance: number | null
          created_at: string | null
          current_equity: number | null
          current_mortgage_balance: number | null
          current_property_value: number | null
          id: string
          notes: string | null
          occupancy_variance: number | null
          performance_rating: string | null
          performance_score: number | null
          property_id: string
          roi_variance: number | null
          snapshot_date: string
          user_id: string
          yield_variance: number | null
          ytd_expenses: number | null
          ytd_net_profit: number | null
          ytd_rental_income: number | null
        }
        Insert: {
          actual_gross_yield?: number | null
          actual_monthly_cash_flow?: number | null
          actual_net_yield?: number | null
          actual_occupancy_rate?: number | null
          actual_roi?: number | null
          cash_flow_variance?: number | null
          created_at?: string | null
          current_equity?: number | null
          current_mortgage_balance?: number | null
          current_property_value?: number | null
          id?: string
          notes?: string | null
          occupancy_variance?: number | null
          performance_rating?: string | null
          performance_score?: number | null
          property_id: string
          roi_variance?: number | null
          snapshot_date: string
          user_id: string
          yield_variance?: number | null
          ytd_expenses?: number | null
          ytd_net_profit?: number | null
          ytd_rental_income?: number | null
        }
        Update: {
          actual_gross_yield?: number | null
          actual_monthly_cash_flow?: number | null
          actual_net_yield?: number | null
          actual_occupancy_rate?: number | null
          actual_roi?: number | null
          cash_flow_variance?: number | null
          created_at?: string | null
          current_equity?: number | null
          current_mortgage_balance?: number | null
          current_property_value?: number | null
          id?: string
          notes?: string | null
          occupancy_variance?: number | null
          performance_rating?: string | null
          performance_score?: number | null
          property_id?: string
          roi_variance?: number | null
          snapshot_date?: string
          user_id?: string
          yield_variance?: number | null
          ytd_expenses?: number | null
          ytd_net_profit?: number | null
          ytd_rental_income?: number | null
        }
        Relationships: []
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
      planning_alerts: {
        Row: {
          created_at: string | null
          development_types: string[] | null
          email_frequency: string | null
          id: string
          include_approved: boolean | null
          include_pending: boolean | null
          include_refused: boolean | null
          is_active: boolean | null
          last_notified_at: string | null
          postcode_area: string | null
          radius_miles: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          development_types?: string[] | null
          email_frequency?: string | null
          id?: string
          include_approved?: boolean | null
          include_pending?: boolean | null
          include_refused?: boolean | null
          is_active?: boolean | null
          last_notified_at?: string | null
          postcode_area?: string | null
          radius_miles?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          development_types?: string[] | null
          email_frequency?: string | null
          id?: string
          include_approved?: boolean | null
          include_pending?: boolean | null
          include_refused?: boolean | null
          is_active?: boolean | null
          last_notified_at?: string | null
          postcode_area?: string | null
          radius_miles?: number | null
          user_id?: string
        }
        Relationships: []
      }
      planning_applications: {
        Row: {
          agent_company: string | null
          agent_name: string | null
          appeal_date: string | null
          applicant_name: string | null
          applicant_type: string | null
          application_reference: string
          application_type: string | null
          case_officer: string | null
          conditions: Json | null
          consultation_end_date: string | null
          created_at: string | null
          decision: string | null
          decision_date: string | null
          decision_reason: string | null
          development_type: string | null
          documents: Json | null
          easting: number | null
          existing_use: string | null
          gross_internal_area: number | null
          id: string
          last_checked_at: string | null
          latitude: number | null
          local_authority_name: string
          longitude: number | null
          neighbour_notification_date: string | null
          northing: number | null
          number_of_storeys: number | null
          number_of_units_existing: number | null
          number_of_units_proposed: number | null
          portal_url: string | null
          postcode: string | null
          property_address: string
          proposal_description: string
          proposed_use: string | null
          received_date: string | null
          site_area: number | null
          site_notice_date: string | null
          status: string | null
          updated_at: string | null
          validated_date: string | null
          ward: string | null
        }
        Insert: {
          agent_company?: string | null
          agent_name?: string | null
          appeal_date?: string | null
          applicant_name?: string | null
          applicant_type?: string | null
          application_reference: string
          application_type?: string | null
          case_officer?: string | null
          conditions?: Json | null
          consultation_end_date?: string | null
          created_at?: string | null
          decision?: string | null
          decision_date?: string | null
          decision_reason?: string | null
          development_type?: string | null
          documents?: Json | null
          easting?: number | null
          existing_use?: string | null
          gross_internal_area?: number | null
          id?: string
          last_checked_at?: string | null
          latitude?: number | null
          local_authority_name: string
          longitude?: number | null
          neighbour_notification_date?: string | null
          northing?: number | null
          number_of_storeys?: number | null
          number_of_units_existing?: number | null
          number_of_units_proposed?: number | null
          portal_url?: string | null
          postcode?: string | null
          property_address: string
          proposal_description: string
          proposed_use?: string | null
          received_date?: string | null
          site_area?: number | null
          site_notice_date?: string | null
          status?: string | null
          updated_at?: string | null
          validated_date?: string | null
          ward?: string | null
        }
        Update: {
          agent_company?: string | null
          agent_name?: string | null
          appeal_date?: string | null
          applicant_name?: string | null
          applicant_type?: string | null
          application_reference?: string
          application_type?: string | null
          case_officer?: string | null
          conditions?: Json | null
          consultation_end_date?: string | null
          created_at?: string | null
          decision?: string | null
          decision_date?: string | null
          decision_reason?: string | null
          development_type?: string | null
          documents?: Json | null
          easting?: number | null
          existing_use?: string | null
          gross_internal_area?: number | null
          id?: string
          last_checked_at?: string | null
          latitude?: number | null
          local_authority_name?: string
          longitude?: number | null
          neighbour_notification_date?: string | null
          northing?: number | null
          number_of_storeys?: number | null
          number_of_units_existing?: number | null
          number_of_units_proposed?: number | null
          portal_url?: string | null
          postcode?: string | null
          property_address?: string
          proposal_description?: string
          proposed_use?: string | null
          received_date?: string | null
          site_area?: number | null
          site_notice_date?: string | null
          status?: string | null
          updated_at?: string | null
          validated_date?: string | null
          ward?: string | null
        }
        Relationships: []
      }
      planning_comments: {
        Row: {
          application_id: string | null
          comment_date: string | null
          comment_text: string | null
          comment_type: string | null
          commenter_address: string | null
          commenter_name: string | null
          created_at: string | null
          id: string
        }
        Insert: {
          application_id?: string | null
          comment_date?: string | null
          comment_text?: string | null
          comment_type?: string | null
          commenter_address?: string | null
          commenter_name?: string | null
          created_at?: string | null
          id?: string
        }
        Update: {
          application_id?: string | null
          comment_date?: string | null
          comment_text?: string | null
          comment_type?: string | null
          commenter_address?: string | null
          commenter_name?: string | null
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planning_comments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "planning_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_connections: {
        Row: {
          created_at: string | null
          ical_url: string | null
          id: string
          is_active: boolean | null
          last_error: string | null
          last_synced_at: string | null
          listing_url: string | null
          platform_name: string
          str_property_id: string
          sync_errors: number | null
          sync_frequency: string | null
          total_bookings: number | null
          total_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          ical_url?: string | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_synced_at?: string | null
          listing_url?: string | null
          platform_name: string
          str_property_id: string
          sync_errors?: number | null
          sync_frequency?: string | null
          total_bookings?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          ical_url?: string | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_synced_at?: string | null
          listing_url?: string | null
          platform_name?: string
          str_property_id?: string
          sync_errors?: number | null
          sync_frequency?: string | null
          total_bookings?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_connections_str_property_id_fkey"
            columns: ["str_property_id"]
            isOneToOne: false
            referencedRelation: "str_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_performance: {
        Row: {
          average_nightly_rate: number | null
          bookings_count: number | null
          created_at: string | null
          gross_revenue: number | null
          id: string
          net_revenue: number | null
          nights_booked: number | null
          occupancy_rate: number | null
          period_end: string
          period_start: string
          platform_connection_id: string
          platform_fees: number | null
        }
        Insert: {
          average_nightly_rate?: number | null
          bookings_count?: number | null
          created_at?: string | null
          gross_revenue?: number | null
          id?: string
          net_revenue?: number | null
          nights_booked?: number | null
          occupancy_rate?: number | null
          period_end: string
          period_start: string
          platform_connection_id: string
          platform_fees?: number | null
        }
        Update: {
          average_nightly_rate?: number | null
          bookings_count?: number | null
          created_at?: string | null
          gross_revenue?: number | null
          id?: string
          net_revenue?: number | null
          nights_booked?: number | null
          occupancy_rate?: number | null
          period_end?: string
          period_start?: string
          platform_connection_id?: string
          platform_fees?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_performance_platform_connection_id_fkey"
            columns: ["platform_connection_id"]
            isOneToOne: false
            referencedRelation: "platform_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          category: string | null
          description: string | null
          id: string
          is_sensitive: boolean | null
          setting_key: string
          setting_type: string | null
          setting_value: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          id?: string
          is_sensitive?: boolean | null
          setting_key: string
          setting_type?: string | null
          setting_value?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: string
          is_sensitive?: boolean | null
          setting_key?: string
          setting_type?: string | null
          setting_value?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_metrics: {
        Row: {
          annual_cash_flow: number | null
          annualized_roi: number | null
          arrears_percentage: number | null
          average_gross_yield: number | null
          average_net_yield: number | null
          average_void_days: number | null
          capital_growth: number | null
          capital_growth_percentage: number | null
          compliance_percentage: number | null
          compliant_properties: number | null
          created_at: string | null
          current_value_total: number | null
          gross_income: number | null
          id: string
          monthly_cash_flow: number | null
          net_profit: number | null
          net_profit_margin: number | null
          non_compliant_properties: number | null
          occupancy_rate: number | null
          occupied_units: number | null
          period_end: string
          period_start: string
          period_type: string | null
          properties_by_region: Json | null
          properties_commercial: number | null
          properties_flats: number | null
          properties_hmo: number | null
          properties_houses: number | null
          purchase_price_total: number | null
          roi_percentage: number | null
          total_arrears: number | null
          total_debt: number | null
          total_equity: number | null
          total_expenses: number | null
          total_insurance: number | null
          total_invested: number | null
          total_maintenance: number | null
          total_management_fees: number | null
          total_mortgage_payments: number | null
          total_other_expenses: number | null
          total_other_income: number | null
          total_portfolio_value: number | null
          total_rental_income: number | null
          total_return: number | null
          total_units: number | null
          total_utilities: number | null
          user_id: string
          vacant_units: number | null
        }
        Insert: {
          annual_cash_flow?: number | null
          annualized_roi?: number | null
          arrears_percentage?: number | null
          average_gross_yield?: number | null
          average_net_yield?: number | null
          average_void_days?: number | null
          capital_growth?: number | null
          capital_growth_percentage?: number | null
          compliance_percentage?: number | null
          compliant_properties?: number | null
          created_at?: string | null
          current_value_total?: number | null
          gross_income?: number | null
          id?: string
          monthly_cash_flow?: number | null
          net_profit?: number | null
          net_profit_margin?: number | null
          non_compliant_properties?: number | null
          occupancy_rate?: number | null
          occupied_units?: number | null
          period_end: string
          period_start: string
          period_type?: string | null
          properties_by_region?: Json | null
          properties_commercial?: number | null
          properties_flats?: number | null
          properties_hmo?: number | null
          properties_houses?: number | null
          purchase_price_total?: number | null
          roi_percentage?: number | null
          total_arrears?: number | null
          total_debt?: number | null
          total_equity?: number | null
          total_expenses?: number | null
          total_insurance?: number | null
          total_invested?: number | null
          total_maintenance?: number | null
          total_management_fees?: number | null
          total_mortgage_payments?: number | null
          total_other_expenses?: number | null
          total_other_income?: number | null
          total_portfolio_value?: number | null
          total_rental_income?: number | null
          total_return?: number | null
          total_units?: number | null
          total_utilities?: number | null
          user_id: string
          vacant_units?: number | null
        }
        Update: {
          annual_cash_flow?: number | null
          annualized_roi?: number | null
          arrears_percentage?: number | null
          average_gross_yield?: number | null
          average_net_yield?: number | null
          average_void_days?: number | null
          capital_growth?: number | null
          capital_growth_percentage?: number | null
          compliance_percentage?: number | null
          compliant_properties?: number | null
          created_at?: string | null
          current_value_total?: number | null
          gross_income?: number | null
          id?: string
          monthly_cash_flow?: number | null
          net_profit?: number | null
          net_profit_margin?: number | null
          non_compliant_properties?: number | null
          occupancy_rate?: number | null
          occupied_units?: number | null
          period_end?: string
          period_start?: string
          period_type?: string | null
          properties_by_region?: Json | null
          properties_commercial?: number | null
          properties_flats?: number | null
          properties_hmo?: number | null
          properties_houses?: number | null
          purchase_price_total?: number | null
          roi_percentage?: number | null
          total_arrears?: number | null
          total_debt?: number | null
          total_equity?: number | null
          total_expenses?: number | null
          total_insurance?: number | null
          total_invested?: number | null
          total_maintenance?: number | null
          total_management_fees?: number | null
          total_mortgage_payments?: number | null
          total_other_expenses?: number | null
          total_other_income?: number | null
          total_portfolio_value?: number | null
          total_rental_income?: number | null
          total_return?: number | null
          total_units?: number | null
          total_utilities?: number | null
          user_id?: string
          vacant_units?: number | null
        }
        Relationships: []
      }
      portfolio_properties: {
        Row: {
          address: string
          bedrooms: number | null
          created_at: string | null
          current_value: number | null
          current_yield: number | null
          id: string
          images: string[] | null
          investment_strategy: string | null
          lease_years: number | null
          monthly_payment: number | null
          mortgage_amount: number | null
          mortgage_lender: string | null
          mortgage_rate: number | null
          postcode: string
          property_status: string | null
          property_type: string | null
          purchase_date: string
          purchase_price: number
          tenure: string | null
          total_expenses_ytd: number | null
          total_income_ytd: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          bedrooms?: number | null
          created_at?: string | null
          current_value?: number | null
          current_yield?: number | null
          id?: string
          images?: string[] | null
          investment_strategy?: string | null
          lease_years?: number | null
          monthly_payment?: number | null
          mortgage_amount?: number | null
          mortgage_lender?: string | null
          mortgage_rate?: number | null
          postcode: string
          property_status?: string | null
          property_type?: string | null
          purchase_date: string
          purchase_price: number
          tenure?: string | null
          total_expenses_ytd?: number | null
          total_income_ytd?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          bedrooms?: number | null
          created_at?: string | null
          current_value?: number | null
          current_yield?: number | null
          id?: string
          images?: string[] | null
          investment_strategy?: string | null
          lease_years?: number | null
          monthly_payment?: number | null
          mortgage_amount?: number | null
          mortgage_lender?: string | null
          mortgage_rate?: number | null
          postcode?: string
          property_status?: string | null
          property_type?: string | null
          purchase_date?: string
          purchase_price?: number
          tenure?: string | null
          total_expenses_ytd?: number | null
          total_income_ytd?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      portfolio_shares: {
        Row: {
          created_at: string | null
          custom_message: string | null
          expires_at: string | null
          hide_addresses: boolean | null
          id: string
          include_compliance: boolean | null
          include_financials: boolean | null
          include_properties: boolean | null
          include_tenants: boolean | null
          is_active: boolean | null
          max_views: number | null
          name: string
          password_hash: string | null
          property_ids: string[] | null
          share_token: string
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          created_at?: string | null
          custom_message?: string | null
          expires_at?: string | null
          hide_addresses?: boolean | null
          id?: string
          include_compliance?: boolean | null
          include_financials?: boolean | null
          include_properties?: boolean | null
          include_tenants?: boolean | null
          is_active?: boolean | null
          max_views?: number | null
          name: string
          password_hash?: string | null
          property_ids?: string[] | null
          share_token?: string
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          created_at?: string | null
          custom_message?: string | null
          expires_at?: string | null
          hide_addresses?: boolean | null
          id?: string
          include_compliance?: boolean | null
          include_financials?: boolean | null
          include_properties?: boolean | null
          include_tenants?: boolean | null
          is_active?: boolean | null
          max_views?: number | null
          name?: string
          password_hash?: string | null
          property_ids?: string[] | null
          share_token?: string
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_snapshots: {
        Row: {
          capital_growth: number | null
          cash_on_cash: number | null
          created_at: string | null
          expense_ratio: number | null
          gross_yield: number | null
          id: string
          net_yield: number | null
          rent_collection_rate: number | null
          rent_growth: number | null
          roi: number | null
          snapshot_date: string
          total_debt: number | null
          total_equity: number | null
          total_properties: number | null
          total_value: number | null
          user_id: string
          void_rate: number | null
        }
        Insert: {
          capital_growth?: number | null
          cash_on_cash?: number | null
          created_at?: string | null
          expense_ratio?: number | null
          gross_yield?: number | null
          id?: string
          net_yield?: number | null
          rent_collection_rate?: number | null
          rent_growth?: number | null
          roi?: number | null
          snapshot_date: string
          total_debt?: number | null
          total_equity?: number | null
          total_properties?: number | null
          total_value?: number | null
          user_id: string
          void_rate?: number | null
        }
        Update: {
          capital_growth?: number | null
          cash_on_cash?: number | null
          created_at?: string | null
          expense_ratio?: number | null
          gross_yield?: number | null
          id?: string
          net_yield?: number | null
          rent_collection_rate?: number | null
          rent_growth?: number | null
          roi?: number | null
          snapshot_date?: string
          total_debt?: number | null
          total_equity?: number | null
          total_properties?: number | null
          total_value?: number | null
          user_id?: string
          void_rate?: number | null
        }
        Relationships: []
      }
      portfolio_summary: {
        Row: {
          id: string
          last_updated: string | null
          monthly_cash_flow: number | null
          monthly_expenses: number | null
          monthly_income: number | null
          occupancy_rate: number | null
          portfolio_yield: number | null
          total_equity: number | null
          total_properties: number | null
          total_value: number | null
          user_id: string
        }
        Insert: {
          id?: string
          last_updated?: string | null
          monthly_cash_flow?: number | null
          monthly_expenses?: number | null
          monthly_income?: number | null
          occupancy_rate?: number | null
          portfolio_yield?: number | null
          total_equity?: number | null
          total_properties?: number | null
          total_value?: number | null
          user_id: string
        }
        Update: {
          id?: string
          last_updated?: string | null
          monthly_cash_flow?: number | null
          monthly_expenses?: number | null
          monthly_income?: number | null
          occupancy_rate?: number | null
          portfolio_yield?: number | null
          total_equity?: number | null
          total_properties?: number | null
          total_value?: number | null
          user_id?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_comment_id: string | null
          post_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "network_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          reaction_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "network_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      price_paid_history: {
        Row: {
          created_at: string | null
          duration: string | null
          id: string
          old_new: string | null
          postcode: string
          property_address: string
          property_type: string | null
          record_status: string | null
          sale_date: string
          sale_price: number
          transaction_category: string | null
          transaction_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: string | null
          id?: string
          old_new?: string | null
          postcode: string
          property_address: string
          property_type?: string | null
          record_status?: string | null
          sale_date: string
          sale_price: number
          transaction_category?: string | null
          transaction_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: string | null
          id?: string
          old_new?: string | null
          postcode?: string
          property_address?: string
          property_type?: string | null
          record_status?: string | null
          sale_date?: string
          sale_price?: number
          transaction_category?: string | null
          transaction_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          budget_range: string | null
          company_name: string | null
          completed_onboarding: boolean | null
          created_at: string | null
          display_name: string | null
          email_preferences: Json | null
          email_verified: boolean | null
          full_name: string | null
          id: string
          location: string | null
          onboarding_completed_at: string | null
          primary_strategy: string | null
          secondary_strategies: string[] | null
          stripe_customer_id: string | null
          subscription_tier: string | null
          target_locations: string[] | null
          user_motivation: string | null
        }
        Insert: {
          avatar_url?: string | null
          budget_range?: string | null
          company_name?: string | null
          completed_onboarding?: boolean | null
          created_at?: string | null
          display_name?: string | null
          email_preferences?: Json | null
          email_verified?: boolean | null
          full_name?: string | null
          id: string
          location?: string | null
          onboarding_completed_at?: string | null
          primary_strategy?: string | null
          secondary_strategies?: string[] | null
          stripe_customer_id?: string | null
          subscription_tier?: string | null
          target_locations?: string[] | null
          user_motivation?: string | null
        }
        Update: {
          avatar_url?: string | null
          budget_range?: string | null
          company_name?: string | null
          completed_onboarding?: boolean | null
          created_at?: string | null
          display_name?: string | null
          email_preferences?: Json | null
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          location?: string | null
          onboarding_completed_at?: string | null
          primary_strategy?: string | null
          secondary_strategies?: string[] | null
          stripe_customer_id?: string | null
          subscription_tier?: string | null
          target_locations?: string[] | null
          user_motivation?: string | null
        }
        Relationships: []
      }
      promo_materials: {
        Row: {
          click_count: number | null
          conversion_count: number | null
          copy_text: string | null
          created_at: string | null
          description: string | null
          height: number | null
          html_code: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          thumbnail_url: string | null
          type: string
          usage_count: number | null
          width: number | null
        }
        Insert: {
          click_count?: number | null
          conversion_count?: number | null
          copy_text?: string | null
          created_at?: string | null
          description?: string | null
          height?: number | null
          html_code?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          thumbnail_url?: string | null
          type: string
          usage_count?: number | null
          width?: number | null
        }
        Update: {
          click_count?: number | null
          conversion_count?: number | null
          copy_text?: string | null
          created_at?: string | null
          description?: string | null
          height?: number | null
          html_code?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          thumbnail_url?: string | null
          type?: string
          usage_count?: number | null
          width?: number | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          data: Json | null
          description: string | null
          external_id: string | null
          id: string
          images: Json | null
          last_updated: string | null
          listing_url: string | null
          postcode: string | null
          price: number | null
          property_type: string | null
          tenure: string | null
        }
        Insert: {
          address?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          data?: Json | null
          description?: string | null
          external_id?: string | null
          id?: string
          images?: Json | null
          last_updated?: string | null
          listing_url?: string | null
          postcode?: string | null
          price?: number | null
          property_type?: string | null
          tenure?: string | null
        }
        Update: {
          address?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          data?: Json | null
          description?: string | null
          external_id?: string | null
          id?: string
          images?: Json | null
          last_updated?: string | null
          listing_url?: string | null
          postcode?: string | null
          price?: number | null
          property_type?: string | null
          tenure?: string | null
        }
        Relationships: []
      }
      property_access: {
        Row: {
          access_level: string | null
          can_edit: boolean | null
          can_view_financials: boolean | null
          can_view_tenants: boolean | null
          id: string
          investment_amount: number | null
          ownership_percentage: number | null
          portfolio_property_id: string | null
          team_member_id: string | null
        }
        Insert: {
          access_level?: string | null
          can_edit?: boolean | null
          can_view_financials?: boolean | null
          can_view_tenants?: boolean | null
          id?: string
          investment_amount?: number | null
          ownership_percentage?: number | null
          portfolio_property_id?: string | null
          team_member_id?: string | null
        }
        Update: {
          access_level?: string | null
          can_edit?: boolean | null
          can_view_financials?: boolean | null
          can_view_tenants?: boolean | null
          id?: string
          investment_amount?: number | null
          ownership_percentage?: number | null
          portfolio_property_id?: string | null
          team_member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_access_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_access_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      property_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string
          expense_date: string
          id: string
          is_tax_deductible: boolean | null
          portfolio_property_id: string | null
          receipt_url: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          description: string
          expense_date: string
          id?: string
          is_tax_deductible?: boolean | null
          portfolio_property_id?: string | null
          receipt_url?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string
          expense_date?: string
          id?: string
          is_tax_deductible?: boolean | null
          portfolio_property_id?: string | null
          receipt_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_expenses_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_inspections: {
        Row: {
          created_at: string | null
          id: string
          inspection_date: string
          inspection_type: string
          inspector_name: string | null
          overall_notes: string | null
          overall_rating: number | null
          portfolio_property_id: string
          report_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          inspection_date: string
          inspection_type: string
          inspector_name?: string | null
          overall_notes?: string | null
          overall_rating?: number | null
          portfolio_property_id: string
          report_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          inspection_date?: string
          inspection_type?: string
          inspector_name?: string | null
          overall_notes?: string | null
          overall_rating?: number | null
          portfolio_property_id?: string
          report_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_inspections_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_issues: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          inspection_id: string | null
          photo_urls: string[] | null
          portfolio_property_id: string
          priority: string | null
          reported_by: string | null
          resolution_cost: number | null
          resolved_at: string | null
          room_name: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          inspection_id?: string | null
          photo_urls?: string[] | null
          portfolio_property_id: string
          priority?: string | null
          reported_by?: string | null
          resolution_cost?: number | null
          resolved_at?: string | null
          room_name?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          inspection_id?: string | null
          photo_urls?: string[] | null
          portfolio_property_id?: string
          priority?: string | null
          reported_by?: string | null
          resolution_cost?: number | null
          resolved_at?: string | null
          room_name?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_issues_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "property_inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_issues_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_performance: {
        Row: {
          created_at: string | null
          current_equity: number | null
          id: string
          insurance: number | null
          invested_capital: number | null
          maintenance: number | null
          management_fees: number | null
          mortgage_payment: number | null
          net_profit: number | null
          occupancy_days: number | null
          occupancy_rate: number | null
          other_expenses: number | null
          other_income: number | null
          period_end: string
          period_start: string
          property_id: string
          rental_income: number | null
          roi: number | null
          user_id: string
          utilities: number | null
          void_days: number | null
        }
        Insert: {
          created_at?: string | null
          current_equity?: number | null
          id?: string
          insurance?: number | null
          invested_capital?: number | null
          maintenance?: number | null
          management_fees?: number | null
          mortgage_payment?: number | null
          net_profit?: number | null
          occupancy_days?: number | null
          occupancy_rate?: number | null
          other_expenses?: number | null
          other_income?: number | null
          period_end: string
          period_start: string
          property_id: string
          rental_income?: number | null
          roi?: number | null
          user_id: string
          utilities?: number | null
          void_days?: number | null
        }
        Update: {
          created_at?: string | null
          current_equity?: number | null
          id?: string
          insurance?: number | null
          invested_capital?: number | null
          maintenance?: number | null
          management_fees?: number | null
          mortgage_payment?: number | null
          net_profit?: number | null
          occupancy_days?: number | null
          occupancy_rate?: number | null
          other_expenses?: number | null
          other_income?: number | null
          period_end?: string
          period_start?: string
          property_id?: string
          rental_income?: number | null
          roi?: number | null
          user_id?: string
          utilities?: number | null
          void_days?: number | null
        }
        Relationships: []
      }
      property_tours: {
        Row: {
          created_at: string | null
          embed_code: string | null
          external_id: string | null
          id: string
          is_public: boolean | null
          password_hash: string | null
          password_protected: boolean | null
          portfolio_property_id: string | null
          provider: string | null
          thumbnail_url: string | null
          tour_type: string | null
          tour_url: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          created_at?: string | null
          embed_code?: string | null
          external_id?: string | null
          id?: string
          is_public?: boolean | null
          password_hash?: string | null
          password_protected?: boolean | null
          portfolio_property_id?: string | null
          provider?: string | null
          thumbnail_url?: string | null
          tour_type?: string | null
          tour_url?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          created_at?: string | null
          embed_code?: string | null
          external_id?: string | null
          id?: string
          is_public?: boolean | null
          password_hash?: string | null
          password_protected?: boolean | null
          portfolio_property_id?: string | null
          provider?: string | null
          thumbnail_url?: string | null
          tour_type?: string | null
          tour_url?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "property_tours_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_utilities: {
        Row: {
          account_number: string | null
          annual_cost: number | null
          contract_end_date: string | null
          created_at: string | null
          exit_fee: number | null
          id: string
          meter_type: string | null
          monthly_cost: number | null
          mpan: string | null
          mprn: string | null
          paid_by: string | null
          portfolio_property_id: string | null
          standing_charge: number | null
          status: string | null
          supplier: string | null
          tariff_name: string | null
          unit_rate: number | null
          user_id: string
          utility_type: string
        }
        Insert: {
          account_number?: string | null
          annual_cost?: number | null
          contract_end_date?: string | null
          created_at?: string | null
          exit_fee?: number | null
          id?: string
          meter_type?: string | null
          monthly_cost?: number | null
          mpan?: string | null
          mprn?: string | null
          paid_by?: string | null
          portfolio_property_id?: string | null
          standing_charge?: number | null
          status?: string | null
          supplier?: string | null
          tariff_name?: string | null
          unit_rate?: number | null
          user_id: string
          utility_type: string
        }
        Update: {
          account_number?: string | null
          annual_cost?: number | null
          contract_end_date?: string | null
          created_at?: string | null
          exit_fee?: number | null
          id?: string
          meter_type?: string | null
          monthly_cost?: number | null
          mpan?: string | null
          mprn?: string | null
          paid_by?: string | null
          portfolio_property_id?: string | null
          standing_charge?: number | null
          status?: string | null
          supplier?: string | null
          tariff_name?: string | null
          unit_rate?: number | null
          user_id?: string
          utility_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_utilities_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_valuations: {
        Row: {
          address: string | null
          bathrooms: number | null
          bedrooms: number | null
          comparables: Json | null
          condition: string | null
          confidence_score: number | null
          created_at: string | null
          estimated_rent_pcm: number | null
          estimated_value: number | null
          estimated_yield: number | null
          features: string[] | null
          id: string
          portfolio_property_id: string | null
          postcode: string | null
          property_type: string | null
          rent_range_high: number | null
          rent_range_low: number | null
          square_footage: number | null
          user_id: string
          valuation_factors: Json | null
          value_range_high: number | null
          value_range_low: number | null
        }
        Insert: {
          address?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          comparables?: Json | null
          condition?: string | null
          confidence_score?: number | null
          created_at?: string | null
          estimated_rent_pcm?: number | null
          estimated_value?: number | null
          estimated_yield?: number | null
          features?: string[] | null
          id?: string
          portfolio_property_id?: string | null
          postcode?: string | null
          property_type?: string | null
          rent_range_high?: number | null
          rent_range_low?: number | null
          square_footage?: number | null
          user_id: string
          valuation_factors?: Json | null
          value_range_high?: number | null
          value_range_low?: number | null
        }
        Update: {
          address?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          comparables?: Json | null
          condition?: string | null
          confidence_score?: number | null
          created_at?: string | null
          estimated_rent_pcm?: number | null
          estimated_value?: number | null
          estimated_yield?: number | null
          features?: string[] | null
          id?: string
          portfolio_property_id?: string | null
          postcode?: string | null
          property_type?: string | null
          rent_range_high?: number | null
          rent_range_low?: number | null
          square_footage?: number | null
          user_id?: string
          valuation_factors?: Json | null
          value_range_high?: number | null
          value_range_low?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "property_valuations_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_clicks: {
        Row: {
          affiliate_id: string | null
          city: string | null
          click_id: string | null
          clicked_at: string | null
          converted: boolean | null
          converted_at: string | null
          converted_user_id: string | null
          cookie_expires_at: string | null
          country: string | null
          id: string
          ip_address: unknown
          landing_page: string | null
          referrer_url: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          affiliate_id?: string | null
          city?: string | null
          click_id?: string | null
          clicked_at?: string | null
          converted?: boolean | null
          converted_at?: string | null
          converted_user_id?: string | null
          cookie_expires_at?: string | null
          country?: string | null
          id?: string
          ip_address?: unknown
          landing_page?: string | null
          referrer_url?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          affiliate_id?: string | null
          city?: string | null
          click_id?: string | null
          clicked_at?: string | null
          converted?: boolean | null
          converted_at?: string | null
          converted_user_id?: string | null
          cookie_expires_at?: string | null
          country?: string | null
          id?: string
          ip_address?: unknown
          landing_page?: string | null
          referrer_url?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_clicks_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          affiliate_id: string | null
          click_id: string | null
          converted_at: string | null
          first_payment_date: string | null
          id: string
          referred_email: string | null
          referred_user_id: string | null
          signup_date: string | null
          status: string | null
          subscription_tier: string | null
          total_commission_earned: number | null
          total_spent: number | null
        }
        Insert: {
          affiliate_id?: string | null
          click_id?: string | null
          converted_at?: string | null
          first_payment_date?: string | null
          id?: string
          referred_email?: string | null
          referred_user_id?: string | null
          signup_date?: string | null
          status?: string | null
          subscription_tier?: string | null
          total_commission_earned?: number | null
          total_spent?: number | null
        }
        Update: {
          affiliate_id?: string | null
          click_id?: string | null
          converted_at?: string | null
          first_payment_date?: string | null
          id?: string
          referred_email?: string | null
          referred_user_id?: string | null
          signup_date?: string | null
          status?: string | null
          subscription_tier?: string | null
          total_commission_earned?: number | null
          total_spent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_click_id_fkey"
            columns: ["click_id"]
            isOneToOne: false
            referencedRelation: "referral_clicks"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_guarantee_claims: {
        Row: {
          arrears_start_date: string | null
          claim_reference: string | null
          created_at: string | null
          eviction_date: string | null
          eviction_started: boolean | null
          id: string
          months_claimed: number | null
          payments_received: number | null
          policy_id: string | null
          status: string | null
          total_arrears: number | null
          user_id: string
        }
        Insert: {
          arrears_start_date?: string | null
          claim_reference?: string | null
          created_at?: string | null
          eviction_date?: string | null
          eviction_started?: boolean | null
          id?: string
          months_claimed?: number | null
          payments_received?: number | null
          policy_id?: string | null
          status?: string | null
          total_arrears?: number | null
          user_id: string
        }
        Update: {
          arrears_start_date?: string | null
          claim_reference?: string | null
          created_at?: string | null
          eviction_date?: string | null
          eviction_started?: boolean | null
          id?: string
          months_claimed?: number | null
          payments_received?: number | null
          policy_id?: string | null
          status?: string | null
          total_arrears?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_guarantee_claims_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "rent_guarantee_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_guarantee_policies: {
        Row: {
          annual_premium: number | null
          created_at: string | null
          end_date: string | null
          id: string
          legal_expenses_cover: number | null
          max_claim_amount: number | null
          max_claim_months: number | null
          monthly_rent_covered: number | null
          policy_document_url: string | null
          policy_number: string | null
          portfolio_property_id: string | null
          premium_rate: number | null
          provider: string
          reference_date: string | null
          reference_provider: string | null
          start_date: string | null
          status: string | null
          tenant_id: string | null
          tenant_referenced: boolean | null
          user_id: string
        }
        Insert: {
          annual_premium?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          legal_expenses_cover?: number | null
          max_claim_amount?: number | null
          max_claim_months?: number | null
          monthly_rent_covered?: number | null
          policy_document_url?: string | null
          policy_number?: string | null
          portfolio_property_id?: string | null
          premium_rate?: number | null
          provider: string
          reference_date?: string | null
          reference_provider?: string | null
          start_date?: string | null
          status?: string | null
          tenant_id?: string | null
          tenant_referenced?: boolean | null
          user_id: string
        }
        Update: {
          annual_premium?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          legal_expenses_cover?: number | null
          max_claim_amount?: number | null
          max_claim_months?: number | null
          monthly_rent_covered?: number | null
          policy_document_url?: string | null
          policy_number?: string | null
          portfolio_property_id?: string | null
          premium_rate?: number | null
          provider?: string
          reference_date?: string | null
          reference_provider?: string | null
          start_date?: string | null
          status?: string | null
          tenant_id?: string | null
          tenant_referenced?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_guarantee_policies_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_guarantee_policies_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_ledger: {
        Row: {
          amount_due: number
          amount_paid: number | null
          created_at: string | null
          days_late: number | null
          due_date: string
          id: string
          late_fee: number | null
          notes: string | null
          paid_date: string | null
          payment_method: string | null
          payment_reference: string | null
          period_end: string
          period_start: string
          portfolio_property_id: string
          rent_schedule_id: string | null
          status: string | null
          tenancy_id: string
        }
        Insert: {
          amount_due: number
          amount_paid?: number | null
          created_at?: string | null
          days_late?: number | null
          due_date: string
          id?: string
          late_fee?: number | null
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          period_end: string
          period_start: string
          portfolio_property_id: string
          rent_schedule_id?: string | null
          status?: string | null
          tenancy_id: string
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          created_at?: string | null
          days_late?: number | null
          due_date?: string
          id?: string
          late_fee?: number | null
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          period_end?: string
          period_start?: string
          portfolio_property_id?: string
          rent_schedule_id?: string | null
          status?: string | null
          tenancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_ledger_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_ledger_rent_schedule_id_fkey"
            columns: ["rent_schedule_id"]
            isOneToOne: false
            referencedRelation: "rent_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_ledger_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_payments: {
        Row: {
          actual_amount: number | null
          actual_date: string | null
          amount: number | null
          created_at: string | null
          days_late: number | null
          due_date: string | null
          expected_amount: number
          expected_date: string
          id: string
          late_fee: number | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_reference: string | null
          status: string | null
          tenancy_id: string | null
          user_id: string | null
        }
        Insert: {
          actual_amount?: number | null
          actual_date?: string | null
          amount?: number | null
          created_at?: string | null
          days_late?: number | null
          due_date?: string | null
          expected_amount: number
          expected_date: string
          id?: string
          late_fee?: number | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string | null
          tenancy_id?: string | null
          user_id?: string | null
        }
        Update: {
          actual_amount?: number | null
          actual_date?: string | null
          amount?: number | null
          created_at?: string | null
          days_late?: number | null
          due_date?: string | null
          expected_amount?: number
          expected_date?: string
          id?: string
          late_fee?: number | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string | null
          tenancy_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rent_payments_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_reminders: {
        Row: {
          created_at: string | null
          days_offset: number | null
          email_template: string | null
          id: string
          is_active: boolean | null
          reminder_type: string | null
          send_email: boolean | null
          send_notification: boolean | null
          send_sms: boolean | null
          sms_template: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          days_offset?: number | null
          email_template?: string | null
          id?: string
          is_active?: boolean | null
          reminder_type?: string | null
          send_email?: boolean | null
          send_notification?: boolean | null
          send_sms?: boolean | null
          sms_template?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          days_offset?: number | null
          email_template?: string | null
          id?: string
          is_active?: boolean | null
          reminder_type?: string | null
          send_email?: boolean | null
          send_notification?: boolean | null
          send_sms?: boolean | null
          sms_template?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rent_schedules: {
        Row: {
          amount: number
          auto_detect_enabled: boolean | null
          bank_reference: string | null
          created_at: string | null
          due_day: number | null
          end_date: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          payment_method: string | null
          portfolio_property_id: string
          start_date: string
          tenancy_id: string
        }
        Insert: {
          amount: number
          auto_detect_enabled?: boolean | null
          bank_reference?: string | null
          created_at?: string | null
          due_day?: number | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          payment_method?: string | null
          portfolio_property_id: string
          start_date: string
          tenancy_id: string
        }
        Update: {
          amount?: number
          auto_detect_enabled?: boolean | null
          bank_reference?: string | null
          created_at?: string | null
          due_day?: number | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          payment_method?: string | null
          portfolio_property_id?: string
          start_date?: string
          tenancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_schedules_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_schedules_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
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
      report_sections: {
        Row: {
          available_in_templates: string[] | null
          config_schema: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          section_description: string | null
          section_key: string
          section_name: string
          section_type: string
        }
        Insert: {
          available_in_templates?: string[] | null
          config_schema?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          section_description?: string | null
          section_key: string
          section_name: string
          section_type: string
        }
        Update: {
          available_in_templates?: string[] | null
          config_schema?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          section_description?: string | null
          section_key?: string
          section_name?: string
          section_type?: string
        }
        Relationships: []
      }
      report_templates: {
        Row: {
          company_name: string | null
          created_at: string | null
          default_date_range: string | null
          default_properties: string[] | null
          id: string
          include_logo: boolean | null
          is_active: boolean | null
          is_system_template: boolean | null
          logo_url: string | null
          orientation: string | null
          page_size: string | null
          primary_color: string | null
          sections: Json
          template_name: string
          template_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          default_date_range?: string | null
          default_properties?: string[] | null
          id?: string
          include_logo?: boolean | null
          is_active?: boolean | null
          is_system_template?: boolean | null
          logo_url?: string | null
          orientation?: string | null
          page_size?: string | null
          primary_color?: string | null
          sections?: Json
          template_name: string
          template_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          default_date_range?: string | null
          default_properties?: string[] | null
          id?: string
          include_logo?: boolean | null
          is_active?: boolean | null
          is_system_template?: boolean | null
          logo_url?: string | null
          orientation?: string | null
          page_size?: string | null
          primary_color?: string | null
          sections?: Json
          template_name?: string
          template_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      request_alerts: {
        Row: {
          ai_match_threshold: number | null
          alert_for: string
          alerts_sent_today: number | null
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          delivery_methods: Json | null
          digest_day: number | null
          digest_time: string | null
          duration_max_months: number | null
          duration_min_months: number | null
          email_address: string | null
          exclude_keywords: string[] | null
          frequency: string | null
          furnished_preference: string | null
          id: string
          include_keywords: string[] | null
          is_active: boolean | null
          last_reset_date: string | null
          last_triggered_at: string | null
          location_areas: string[] | null
          location_center_lat: number | null
          location_center_lng: number | null
          location_radius_miles: number | null
          max_alerts_per_day: number | null
          move_in_date_from: string | null
          move_in_date_to: string | null
          must_allow_children: boolean | null
          must_allow_pets: boolean | null
          must_be_self_contained: boolean | null
          must_have_parking: boolean | null
          name: string
          phone_number: string | null
          property_types: string[] | null
          slack_webhook_url: string | null
          total_matches_sent: number | null
          updated_at: string | null
          user_id: string
          webhook_url: string | null
          whatsapp_number: string | null
        }
        Insert: {
          ai_match_threshold?: number | null
          alert_for?: string
          alerts_sent_today?: number | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          delivery_methods?: Json | null
          digest_day?: number | null
          digest_time?: string | null
          duration_max_months?: number | null
          duration_min_months?: number | null
          email_address?: string | null
          exclude_keywords?: string[] | null
          frequency?: string | null
          furnished_preference?: string | null
          id?: string
          include_keywords?: string[] | null
          is_active?: boolean | null
          last_reset_date?: string | null
          last_triggered_at?: string | null
          location_areas?: string[] | null
          location_center_lat?: number | null
          location_center_lng?: number | null
          location_radius_miles?: number | null
          max_alerts_per_day?: number | null
          move_in_date_from?: string | null
          move_in_date_to?: string | null
          must_allow_children?: boolean | null
          must_allow_pets?: boolean | null
          must_be_self_contained?: boolean | null
          must_have_parking?: boolean | null
          name: string
          phone_number?: string | null
          property_types?: string[] | null
          slack_webhook_url?: string | null
          total_matches_sent?: number | null
          updated_at?: string | null
          user_id: string
          webhook_url?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          ai_match_threshold?: number | null
          alert_for?: string
          alerts_sent_today?: number | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          delivery_methods?: Json | null
          digest_day?: number | null
          digest_time?: string | null
          duration_max_months?: number | null
          duration_min_months?: number | null
          email_address?: string | null
          exclude_keywords?: string[] | null
          frequency?: string | null
          furnished_preference?: string | null
          id?: string
          include_keywords?: string[] | null
          is_active?: boolean | null
          last_reset_date?: string | null
          last_triggered_at?: string | null
          location_areas?: string[] | null
          location_center_lat?: number | null
          location_center_lng?: number | null
          location_radius_miles?: number | null
          max_alerts_per_day?: number | null
          move_in_date_from?: string | null
          move_in_date_to?: string | null
          must_allow_children?: boolean | null
          must_allow_pets?: boolean | null
          must_be_self_contained?: boolean | null
          must_have_parking?: boolean | null
          name?: string
          phone_number?: string | null
          property_types?: string[] | null
          slack_webhook_url?: string | null
          total_matches_sent?: number | null
          updated_at?: string | null
          user_id?: string
          webhook_url?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      request_enquiries: {
        Row: {
          available_from: string | null
          contact_details_shared: boolean | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          enquirer_user_id: string
          id: string
          message: string
          offered_price: number | null
          property_id: string | null
          request_id: string
          status: string | null
        }
        Insert: {
          available_from?: string | null
          contact_details_shared?: boolean | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          enquirer_user_id: string
          id?: string
          message: string
          offered_price?: number | null
          property_id?: string | null
          request_id: string
          status?: string | null
        }
        Update: {
          available_from?: string | null
          contact_details_shared?: boolean | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          enquirer_user_id?: string
          id?: string
          message?: string
          offered_price?: number | null
          property_id?: string | null
          request_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_enquiries_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "accommodation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_log: {
        Row: {
          amount: number
          billing_period: string | null
          created_at: string | null
          currency: string | null
          id: string
          payment_method: string | null
          plan_name: string | null
          revenue_type: string | null
          status: string | null
          transaction_date: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          billing_period?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_method?: string | null
          plan_name?: string | null
          revenue_type?: string | null
          status?: string | null
          transaction_date?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          billing_period?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_method?: string | null
          plan_name?: string | null
          revenue_type?: string | null
          status?: string | null
          transaction_date?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      reward_accounts: {
        Row: {
          created_at: string | null
          id: string
          last_login_date: string | null
          login_streak_days: number | null
          points_balance: number | null
          points_earned_total: number | null
          points_redeemed_total: number | null
          tier: string | null
          tier_points: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_login_date?: string | null
          login_streak_days?: number | null
          points_balance?: number | null
          points_earned_total?: number | null
          points_redeemed_total?: number | null
          tier?: string | null
          tier_points?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_login_date?: string | null
          login_streak_days?: number | null
          points_balance?: number | null
          points_earned_total?: number | null
          points_redeemed_total?: number | null
          tier?: string | null
          tier_points?: number | null
          user_id?: string
        }
        Relationships: []
      }
      reward_offers: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          discount_amount: number | null
          discount_percent: number | null
          id: string
          is_active: boolean | null
          min_tier: string | null
          partner_logo_url: string | null
          partner_name: string | null
          points_cost: number
          stock_limit: number | null
          stock_remaining: number | null
          title: string
          valid_from: string | null
          valid_until: string | null
          value_description: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          min_tier?: string | null
          partner_logo_url?: string | null
          partner_name?: string | null
          points_cost: number
          stock_limit?: number | null
          stock_remaining?: number | null
          title: string
          valid_from?: string | null
          valid_until?: string | null
          value_description?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          min_tier?: string | null
          partner_logo_url?: string | null
          partner_name?: string | null
          points_cost?: number
          stock_limit?: number | null
          stock_remaining?: number | null
          title?: string
          valid_from?: string | null
          valid_until?: string | null
          value_description?: string | null
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          offer_id: string | null
          points_spent: number | null
          redemption_code: string | null
          status: string | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          offer_id?: string | null
          points_spent?: number | null
          redemption_code?: string | null
          status?: string | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          offer_id?: string | null
          points_spent?: number | null
          redemption_code?: string | null
          status?: string | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "reward_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_transactions: {
        Row: {
          balance_after: number | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          points: number
          source: string | null
          source_details: Json | null
          transaction_type: string | null
          user_id: string
        }
        Insert: {
          balance_after?: number | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          points: number
          source?: string | null
          source_details?: Json | null
          transaction_type?: string | null
          user_id: string
        }
        Update: {
          balance_after?: number | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          points?: number
          source?: string | null
          source_details?: Json | null
          transaction_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      room_conditions: {
        Row: {
          ceiling_rating: number | null
          fixtures_rating: number | null
          flooring_rating: number | null
          id: string
          inspection_id: string
          notes: string | null
          overall_rating: number | null
          photo_urls: string[] | null
          room_name: string
          walls_rating: number | null
        }
        Insert: {
          ceiling_rating?: number | null
          fixtures_rating?: number | null
          flooring_rating?: number | null
          id?: string
          inspection_id: string
          notes?: string | null
          overall_rating?: number | null
          photo_urls?: string[] | null
          room_name: string
          walls_rating?: number | null
        }
        Update: {
          ceiling_rating?: number | null
          fixtures_rating?: number | null
          flooring_rating?: number | null
          id?: string
          inspection_id?: string
          notes?: string | null
          overall_rating?: number | null
          photo_urls?: string[] | null
          room_name?: string
          walls_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_conditions_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "property_inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_hotspots: {
        Row: {
          created_at: string | null
          hotspot_id: string | null
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hotspot_id?: string | null
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          hotspot_id?: string | null
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_hotspots_hotspot_id_fkey"
            columns: ["hotspot_id"]
            isOneToOne: false
            referencedRelation: "investment_hotspots"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_map_searches: {
        Row: {
          center_lat: number | null
          center_lng: number | null
          created_at: string | null
          enable_alerts: boolean | null
          filters: Json | null
          id: string
          last_used_at: string | null
          search_area: Json | null
          search_name: string
          user_id: string | null
          zoom_level: number | null
        }
        Insert: {
          center_lat?: number | null
          center_lng?: number | null
          created_at?: string | null
          enable_alerts?: boolean | null
          filters?: Json | null
          id?: string
          last_used_at?: string | null
          search_area?: Json | null
          search_name: string
          user_id?: string | null
          zoom_level?: number | null
        }
        Update: {
          center_lat?: number | null
          center_lng?: number | null
          created_at?: string | null
          enable_alerts?: boolean | null
          filters?: Json | null
          id?: string
          last_used_at?: string | null
          search_area?: Json | null
          search_name?: string
          user_id?: string | null
          zoom_level?: number | null
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
      saved_requests: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          request_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_requests_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "accommodation_requests"
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
      scenario_shares: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          last_viewed_at: string | null
          password_hash: string | null
          permissions: string | null
          scenario_id: string
          share_token: string
          shared_by: string
          view_count: number | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_viewed_at?: string | null
          password_hash?: string | null
          permissions?: string | null
          scenario_id: string
          share_token: string
          shared_by: string
          view_count?: number | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_viewed_at?: string | null
          password_hash?: string | null
          permissions?: string | null
          scenario_id?: string
          share_token?: string
          shared_by?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scenario_shares_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scenarios: {
        Row: {
          base_inputs: Json
          created_at: string
          id: string
          name: string
          notes: string | null
          property_id: string | null
          scenario_type: string
          scenario_variations: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          base_inputs?: Json
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          property_id?: string | null
          scenario_type: string
          scenario_variations?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          base_inputs?: Json
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          property_id?: string | null
          scenario_type?: string
          scenario_variations?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduled_reports: {
        Row: {
          created_at: string | null
          custom_date_end: string | null
          custom_date_start: string | null
          date_range_type: string | null
          delivery_method: string | null
          email_message: string | null
          email_subject: string | null
          frequency: string
          id: string
          include_properties: string[] | null
          is_active: boolean | null
          last_sent_at: string | null
          next_send_at: string | null
          recipients: Json
          report_name: string
          schedule_day: number | null
          schedule_time: string | null
          template_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          custom_date_end?: string | null
          custom_date_start?: string | null
          date_range_type?: string | null
          delivery_method?: string | null
          email_message?: string | null
          email_subject?: string | null
          frequency: string
          id?: string
          include_properties?: string[] | null
          is_active?: boolean | null
          last_sent_at?: string | null
          next_send_at?: string | null
          recipients?: Json
          report_name: string
          schedule_day?: number | null
          schedule_time?: string | null
          template_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          custom_date_end?: string | null
          custom_date_start?: string | null
          date_range_type?: string | null
          delivery_method?: string | null
          email_message?: string | null
          email_subject?: string | null
          frequency?: string
          id?: string
          include_properties?: string[] | null
          is_active?: boolean | null
          last_sent_at?: string | null
          next_send_at?: string | null
          recipients?: Json
          report_name?: string
          schedule_day?: number | null
          schedule_time?: string | null
          template_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scout_alerts: {
        Row: {
          action_taken: string | null
          alert_type: string | null
          clicked: boolean | null
          clicked_at: string | null
          delivery_method: string | null
          discovery_id: string | null
          id: string
          opened: boolean | null
          opened_at: string | null
          scout_id: string | null
          sent_at: string | null
          user_id: string
        }
        Insert: {
          action_taken?: string | null
          alert_type?: string | null
          clicked?: boolean | null
          clicked_at?: string | null
          delivery_method?: string | null
          discovery_id?: string | null
          id?: string
          opened?: boolean | null
          opened_at?: string | null
          scout_id?: string | null
          sent_at?: string | null
          user_id: string
        }
        Update: {
          action_taken?: string | null
          alert_type?: string | null
          clicked?: boolean | null
          clicked_at?: string | null
          delivery_method?: string | null
          discovery_id?: string | null
          id?: string
          opened?: boolean | null
          opened_at?: string | null
          scout_id?: string | null
          sent_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_alerts_discovery_id_fkey"
            columns: ["discovery_id"]
            isOneToOne: false
            referencedRelation: "scout_discoveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scout_alerts_scout_id_fkey"
            columns: ["scout_id"]
            isOneToOne: false
            referencedRelation: "deal_scouts"
            referencedColumns: ["id"]
          },
        ]
      }
      scout_discoveries: {
        Row: {
          alert_sent_at: string | null
          below_market_value: number | null
          bmv_percentage: number | null
          days_on_market: number | null
          discovered_at: string | null
          estimated_cash_flow: number | null
          estimated_market_value: number | null
          estimated_roi: number | null
          estimated_yield: number | null
          id: string
          is_price_reduced: boolean | null
          listing_url: string | null
          opportunity_flags: Json | null
          overall_score: number
          price_changes: Json | null
          property_id: string | null
          reduction_percentage: number | null
          risk_flags: Json | null
          saved_at: string | null
          score_breakdown: Json
          score_reasoning: string | null
          scout_id: string | null
          source: string | null
          status: string | null
          status_updated_at: string | null
          total_price_reduction: number | null
          user_feedback: string | null
          viewed_at: string | null
          was_alerted: boolean | null
          was_saved: boolean | null
          was_viewed: boolean | null
        }
        Insert: {
          alert_sent_at?: string | null
          below_market_value?: number | null
          bmv_percentage?: number | null
          days_on_market?: number | null
          discovered_at?: string | null
          estimated_cash_flow?: number | null
          estimated_market_value?: number | null
          estimated_roi?: number | null
          estimated_yield?: number | null
          id?: string
          is_price_reduced?: boolean | null
          listing_url?: string | null
          opportunity_flags?: Json | null
          overall_score: number
          price_changes?: Json | null
          property_id?: string | null
          reduction_percentage?: number | null
          risk_flags?: Json | null
          saved_at?: string | null
          score_breakdown: Json
          score_reasoning?: string | null
          scout_id?: string | null
          source?: string | null
          status?: string | null
          status_updated_at?: string | null
          total_price_reduction?: number | null
          user_feedback?: string | null
          viewed_at?: string | null
          was_alerted?: boolean | null
          was_saved?: boolean | null
          was_viewed?: boolean | null
        }
        Update: {
          alert_sent_at?: string | null
          below_market_value?: number | null
          bmv_percentage?: number | null
          days_on_market?: number | null
          discovered_at?: string | null
          estimated_cash_flow?: number | null
          estimated_market_value?: number | null
          estimated_roi?: number | null
          estimated_yield?: number | null
          id?: string
          is_price_reduced?: boolean | null
          listing_url?: string | null
          opportunity_flags?: Json | null
          overall_score?: number
          price_changes?: Json | null
          property_id?: string | null
          reduction_percentage?: number | null
          risk_flags?: Json | null
          saved_at?: string | null
          score_breakdown?: Json
          score_reasoning?: string | null
          scout_id?: string | null
          source?: string | null
          status?: string | null
          status_updated_at?: string | null
          total_price_reduction?: number | null
          user_feedback?: string | null
          viewed_at?: string | null
          was_alerted?: boolean | null
          was_saved?: boolean | null
          was_viewed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "scout_discoveries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "cached_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scout_discoveries_scout_id_fkey"
            columns: ["scout_id"]
            isOneToOne: false
            referencedRelation: "deal_scouts"
            referencedColumns: ["id"]
          },
        ]
      }
      scout_ml_training: {
        Row: {
          action: string
          action_timestamp: string | null
          days_since_shown: number | null
          id: string
          property_features: Json
          property_id: string | null
          scout_score: number | null
          user_id: string
          user_implicit_score: number | null
          was_shown_in_alert: boolean | null
        }
        Insert: {
          action: string
          action_timestamp?: string | null
          days_since_shown?: number | null
          id?: string
          property_features: Json
          property_id?: string | null
          scout_score?: number | null
          user_id: string
          user_implicit_score?: number | null
          was_shown_in_alert?: boolean | null
        }
        Update: {
          action?: string
          action_timestamp?: string | null
          days_since_shown?: number | null
          id?: string
          property_features?: Json
          property_id?: string | null
          scout_score?: number | null
          user_id?: string
          user_implicit_score?: number | null
          was_shown_in_alert?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "scout_ml_training_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "cached_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      sdlt_rates: {
        Row: {
          additional_property_surcharge: number | null
          buyer_type: string
          created_at: string | null
          effective_from: string
          effective_to: string | null
          id: string
          is_current: boolean | null
          non_uk_resident_surcharge: number | null
          property_type: string
          rate_bands: Json
        }
        Insert: {
          additional_property_surcharge?: number | null
          buyer_type: string
          created_at?: string | null
          effective_from: string
          effective_to?: string | null
          id?: string
          is_current?: boolean | null
          non_uk_resident_surcharge?: number | null
          property_type: string
          rate_bands: Json
        }
        Update: {
          additional_property_surcharge?: number | null
          buyer_type?: string
          created_at?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_current?: boolean | null
          non_uk_resident_surcharge?: number | null
          property_type?: string
          rate_bands?: Json
        }
        Relationships: []
      }
      share_views: {
        Row: {
          id: string
          ip_address: unknown
          portfolio_share_id: string | null
          user_agent: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          ip_address?: unknown
          portfolio_share_id?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          ip_address?: unknown
          portfolio_share_id?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "share_views_portfolio_share_id_fkey"
            columns: ["portfolio_share_id"]
            isOneToOne: false
            referencedRelation: "portfolio_shares"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          request_id: string | null
          signer_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          request_id?: string | null
          signer_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          request_id?: string | null
          signer_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signature_audit_log_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "signature_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signature_audit_log_signer_id_fkey"
            columns: ["signer_id"]
            isOneToOne: false
            referencedRelation: "signature_signers"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_requests: {
        Row: {
          created_at: string | null
          document_id: string | null
          document_name: string
          document_url: string
          expires_at: string | null
          id: string
          portfolio_property_id: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          document_name: string
          document_url: string
          expires_at?: string | null
          id?: string
          portfolio_property_id?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          document_name?: string
          document_url?: string
          expires_at?: string | null
          id?: string
          portfolio_property_id?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "signature_requests_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signature_requests_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signature_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_signers: {
        Row: {
          created_at: string | null
          decline_reason: string | null
          email: string
          id: string
          ip_address: unknown
          name: string
          request_id: string
          role: string | null
          sent_at: string | null
          sign_order: number | null
          signature_data: string | null
          signed_at: string | null
          status: string | null
          user_agent: string | null
          viewed_at: string | null
        }
        Insert: {
          created_at?: string | null
          decline_reason?: string | null
          email: string
          id?: string
          ip_address?: unknown
          name: string
          request_id: string
          role?: string | null
          sent_at?: string | null
          sign_order?: number | null
          signature_data?: string | null
          signed_at?: string | null
          status?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Update: {
          created_at?: string | null
          decline_reason?: string | null
          email?: string
          id?: string
          ip_address?: unknown
          name?: string
          request_id?: string
          role?: string | null
          sent_at?: string | null
          sign_order?: number | null
          signature_data?: string | null
          signed_at?: string | null
          status?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signature_signers_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "signature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      sourced_properties: {
        Row: {
          address: string | null
          alert_id: string | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          deal_score: number | null
          description: string | null
          estimated_rent: number | null
          estimated_yield: number | null
          features: string[] | null
          first_seen_at: string | null
          floorplan_url: string | null
          id: string
          image_urls: string[] | null
          last_checked_at: string | null
          listing_status: string | null
          notes: string | null
          postcode: string | null
          price: number | null
          price_changed_at: string | null
          price_history: Json | null
          price_qualifier: string | null
          property_type: string | null
          saved_at: string | null
          source: string
          source_id: string | null
          source_url: string
          status: string | null
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          address?: string | null
          alert_id?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          deal_score?: number | null
          description?: string | null
          estimated_rent?: number | null
          estimated_yield?: number | null
          features?: string[] | null
          first_seen_at?: string | null
          floorplan_url?: string | null
          id?: string
          image_urls?: string[] | null
          last_checked_at?: string | null
          listing_status?: string | null
          notes?: string | null
          postcode?: string | null
          price?: number | null
          price_changed_at?: string | null
          price_history?: Json | null
          price_qualifier?: string | null
          property_type?: string | null
          saved_at?: string | null
          source: string
          source_id?: string | null
          source_url: string
          status?: string | null
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          address?: string | null
          alert_id?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          deal_score?: number | null
          description?: string | null
          estimated_rent?: number | null
          estimated_yield?: number | null
          features?: string[] | null
          first_seen_at?: string | null
          floorplan_url?: string | null
          id?: string
          image_urls?: string[] | null
          last_checked_at?: string | null
          listing_status?: string | null
          notes?: string | null
          postcode?: string | null
          price?: number | null
          price_changed_at?: string | null
          price_history?: Json | null
          price_qualifier?: string | null
          property_type?: string | null
          saved_at?: string | null
          source?: string
          source_id?: string | null
          source_url?: string
          status?: string | null
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sourced_properties_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "sourcing_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      sourcing_alerts: {
        Row: {
          created_at: string | null
          exclude_keywords: string[] | null
          id: string
          include_auctions: boolean | null
          include_keywords: string[] | null
          is_active: boolean | null
          last_run_at: string | null
          matches_found: number | null
          max_beds: number | null
          max_price: number | null
          max_price_per_sqft: number | null
          min_beds: number | null
          min_price: number | null
          min_yield: number | null
          name: string
          notify_daily: boolean | null
          notify_email: boolean | null
          notify_instant: boolean | null
          notify_push: boolean | null
          postcodes: string[] | null
          property_types: string[] | null
          radius_miles: number | null
          sources: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          exclude_keywords?: string[] | null
          id?: string
          include_auctions?: boolean | null
          include_keywords?: string[] | null
          is_active?: boolean | null
          last_run_at?: string | null
          matches_found?: number | null
          max_beds?: number | null
          max_price?: number | null
          max_price_per_sqft?: number | null
          min_beds?: number | null
          min_price?: number | null
          min_yield?: number | null
          name: string
          notify_daily?: boolean | null
          notify_email?: boolean | null
          notify_instant?: boolean | null
          notify_push?: boolean | null
          postcodes?: string[] | null
          property_types?: string[] | null
          radius_miles?: number | null
          sources?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          exclude_keywords?: string[] | null
          id?: string
          include_auctions?: boolean | null
          include_keywords?: string[] | null
          is_active?: boolean | null
          last_run_at?: string | null
          matches_found?: number | null
          max_beds?: number | null
          max_price?: number | null
          max_price_per_sqft?: number | null
          min_beds?: number | null
          min_price?: number | null
          min_yield?: number | null
          name?: string
          notify_daily?: boolean | null
          notify_email?: boolean | null
          notify_instant?: boolean | null
          notify_push?: boolean | null
          postcodes?: string[] | null
          property_types?: string[] | null
          radius_miles?: number | null
          sources?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      str_bookings: {
        Row: {
          booking_notes: string | null
          checkin_date: string
          checkout_date: string
          cleaning_fee: number | null
          created_at: string | null
          external_booking_id: string | null
          extra_fees: number | null
          guest_count: number | null
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          ical_uid: string | null
          id: string
          last_synced_at: string | null
          nightly_rate: number | null
          nights: number | null
          platform: string | null
          platform_connection_id: string | null
          platform_fee: number | null
          special_requests: string | null
          status: string | null
          str_property_id: string
          synced_from_ical: boolean | null
          total_nights_cost: number | null
          total_payout: number | null
          updated_at: string | null
        }
        Insert: {
          booking_notes?: string | null
          checkin_date: string
          checkout_date: string
          cleaning_fee?: number | null
          created_at?: string | null
          external_booking_id?: string | null
          extra_fees?: number | null
          guest_count?: number | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          ical_uid?: string | null
          id?: string
          last_synced_at?: string | null
          nightly_rate?: number | null
          nights?: number | null
          platform?: string | null
          platform_connection_id?: string | null
          platform_fee?: number | null
          special_requests?: string | null
          status?: string | null
          str_property_id: string
          synced_from_ical?: boolean | null
          total_nights_cost?: number | null
          total_payout?: number | null
          updated_at?: string | null
        }
        Update: {
          booking_notes?: string | null
          checkin_date?: string
          checkout_date?: string
          cleaning_fee?: number | null
          created_at?: string | null
          external_booking_id?: string | null
          extra_fees?: number | null
          guest_count?: number | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          ical_uid?: string | null
          id?: string
          last_synced_at?: string | null
          nightly_rate?: number | null
          nights?: number | null
          platform?: string | null
          platform_connection_id?: string | null
          platform_fee?: number | null
          special_requests?: string | null
          status?: string | null
          str_property_id?: string
          synced_from_ical?: boolean | null
          total_nights_cost?: number | null
          total_payout?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "str_bookings_platform_connection_id_fkey"
            columns: ["platform_connection_id"]
            isOneToOne: false
            referencedRelation: "platform_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "str_bookings_str_property_id_fkey"
            columns: ["str_property_id"]
            isOneToOne: false
            referencedRelation: "str_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      str_calendar_blocks: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          notes: string | null
          reason: string | null
          start_date: string
          str_property_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          notes?: string | null
          reason?: string | null
          start_date: string
          str_property_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          notes?: string | null
          reason?: string | null
          start_date?: string
          str_property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "str_calendar_blocks_str_property_id_fkey"
            columns: ["str_property_id"]
            isOneToOne: false
            referencedRelation: "str_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      str_expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          description: string | null
          expense_date: string
          id: string
          is_recurring: boolean | null
          is_tax_deductible: boolean | null
          receipt_url: string | null
          recurrence_frequency: string | null
          str_property_id: string
          user_id: string
          vendor: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          expense_date: string
          id?: string
          is_recurring?: boolean | null
          is_tax_deductible?: boolean | null
          receipt_url?: string | null
          recurrence_frequency?: string | null
          str_property_id: string
          user_id: string
          vendor?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          is_recurring?: boolean | null
          is_tax_deductible?: boolean | null
          receipt_url?: string | null
          recurrence_frequency?: string | null
          str_property_id?: string
          user_id?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "str_expenses_str_property_id_fkey"
            columns: ["str_property_id"]
            isOneToOne: false
            referencedRelation: "str_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      str_message_templates: {
        Row: {
          body: string
          created_at: string | null
          id: string
          is_default: boolean | null
          language: string | null
          send_timing: string | null
          subject: string | null
          template_name: string
          template_type: string | null
          updated_at: string | null
          user_id: string
          variables: string[] | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          language?: string | null
          send_timing?: string | null
          subject?: string | null
          template_name: string
          template_type?: string | null
          updated_at?: string | null
          user_id: string
          variables?: string[] | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          language?: string | null
          send_timing?: string | null
          subject?: string | null
          template_name?: string
          template_type?: string | null
          updated_at?: string | null
          user_id?: string
          variables?: string[] | null
        }
        Relationships: []
      }
      str_photo_checklists: {
        Row: {
          completed_count: number | null
          created_at: string | null
          id: string
          photo_requirements: Json
          room_name: string
          str_property_id: string
          total_required: number | null
          updated_at: string | null
        }
        Insert: {
          completed_count?: number | null
          created_at?: string | null
          id?: string
          photo_requirements: Json
          room_name: string
          str_property_id: string
          total_required?: number | null
          updated_at?: string | null
        }
        Update: {
          completed_count?: number | null
          created_at?: string | null
          id?: string
          photo_requirements?: Json
          room_name?: string
          str_property_id?: string
          total_required?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "str_photo_checklists_str_property_id_fkey"
            columns: ["str_property_id"]
            isOneToOne: false
            referencedRelation: "str_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      str_properties: {
        Row: {
          address: string | null
          airbnb_ical_url: string | null
          airbnb_url: string | null
          amenities: string[] | null
          amenities_score: number | null
          base_price_per_night: number | null
          bathrooms: number | null
          bedrooms: number | null
          booking_com_ical_url: string | null
          booking_com_url: string | null
          checkin_instructions: string | null
          checkout_instructions: string | null
          cleaning_fee: number | null
          created_at: string | null
          description: string | null
          description_score: number | null
          distance_to_beach_km: number | null
          distance_to_city_center_km: number | null
          extra_guest_fee: number | null
          house_rules: string | null
          id: string
          is_active: boolean | null
          is_listed: boolean | null
          last_minute_discount_pct: number | null
          last_optimized_at: string | null
          listing_score: number | null
          monthly_discount_pct: number | null
          nearby_attractions: string[] | null
          peak_season_rate: number | null
          photo_checklist_completed: boolean | null
          photo_count: number | null
          photo_urls: string[] | null
          photos_score: number | null
          postcode: string | null
          property_name: string
          property_type: string | null
          security_deposit: number | null
          sleeps: number | null
          square_feet: number | null
          summer_rate: number | null
          target_guests: string[] | null
          title: string | null
          title_score: number | null
          unique_features: string | null
          updated_at: string | null
          user_id: string
          vrbo_ical_url: string | null
          vrbo_url: string | null
          weekend_premium_pct: number | null
          weekly_discount_pct: number | null
          winter_rate: number | null
        }
        Insert: {
          address?: string | null
          airbnb_ical_url?: string | null
          airbnb_url?: string | null
          amenities?: string[] | null
          amenities_score?: number | null
          base_price_per_night?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          booking_com_ical_url?: string | null
          booking_com_url?: string | null
          checkin_instructions?: string | null
          checkout_instructions?: string | null
          cleaning_fee?: number | null
          created_at?: string | null
          description?: string | null
          description_score?: number | null
          distance_to_beach_km?: number | null
          distance_to_city_center_km?: number | null
          extra_guest_fee?: number | null
          house_rules?: string | null
          id?: string
          is_active?: boolean | null
          is_listed?: boolean | null
          last_minute_discount_pct?: number | null
          last_optimized_at?: string | null
          listing_score?: number | null
          monthly_discount_pct?: number | null
          nearby_attractions?: string[] | null
          peak_season_rate?: number | null
          photo_checklist_completed?: boolean | null
          photo_count?: number | null
          photo_urls?: string[] | null
          photos_score?: number | null
          postcode?: string | null
          property_name: string
          property_type?: string | null
          security_deposit?: number | null
          sleeps?: number | null
          square_feet?: number | null
          summer_rate?: number | null
          target_guests?: string[] | null
          title?: string | null
          title_score?: number | null
          unique_features?: string | null
          updated_at?: string | null
          user_id: string
          vrbo_ical_url?: string | null
          vrbo_url?: string | null
          weekend_premium_pct?: number | null
          weekly_discount_pct?: number | null
          winter_rate?: number | null
        }
        Update: {
          address?: string | null
          airbnb_ical_url?: string | null
          airbnb_url?: string | null
          amenities?: string[] | null
          amenities_score?: number | null
          base_price_per_night?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          booking_com_ical_url?: string | null
          booking_com_url?: string | null
          checkin_instructions?: string | null
          checkout_instructions?: string | null
          cleaning_fee?: number | null
          created_at?: string | null
          description?: string | null
          description_score?: number | null
          distance_to_beach_km?: number | null
          distance_to_city_center_km?: number | null
          extra_guest_fee?: number | null
          house_rules?: string | null
          id?: string
          is_active?: boolean | null
          is_listed?: boolean | null
          last_minute_discount_pct?: number | null
          last_optimized_at?: string | null
          listing_score?: number | null
          monthly_discount_pct?: number | null
          nearby_attractions?: string[] | null
          peak_season_rate?: number | null
          photo_checklist_completed?: boolean | null
          photo_count?: number | null
          photo_urls?: string[] | null
          photos_score?: number | null
          postcode?: string | null
          property_name?: string
          property_type?: string | null
          security_deposit?: number | null
          sleeps?: number | null
          square_feet?: number | null
          summer_rate?: number | null
          target_guests?: string[] | null
          title?: string | null
          title_score?: number | null
          unique_features?: string | null
          updated_at?: string | null
          user_id?: string
          vrbo_ical_url?: string | null
          vrbo_url?: string | null
          weekend_premium_pct?: number | null
          weekly_discount_pct?: number | null
          winter_rate?: number | null
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          id: string
          message: string
          sender_id: string | null
          sender_type: string | null
          ticket_id: string | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          id?: string
          message: string
          sender_id?: string | null
          sender_type?: string | null
          ticket_id?: string | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          id?: string
          message?: string
          sender_id?: string | null
          sender_type?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          closed_at: string | null
          description: string
          id: string
          opened_at: string | null
          priority: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          ticket_number: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          closed_at?: string | null
          description: string
          id?: string
          opened_at?: string | null
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          ticket_number: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          closed_at?: string | null
          description?: string
          id?: string
          opened_at?: string | null
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          ticket_number?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_calculations: {
        Row: {
          calc_type: string
          calculation_name: string | null
          created_at: string | null
          id: string
          inputs: Json
          notes: string | null
          property_id: string | null
          results: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          calc_type: string
          calculation_name?: string | null
          created_at?: string | null
          id?: string
          inputs: Json
          notes?: string | null
          property_id?: string | null
          results: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          calc_type?: string
          calculation_name?: string | null
          created_at?: string | null
          id?: string
          inputs?: Json
          notes?: string | null
          property_id?: string | null
          results?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      team_activity_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_activity_log_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invitation_token: string
          invited_by: string | null
          property_ids: string[] | null
          role: string
          status: string | null
          team_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invitation_token?: string
          invited_by?: string | null
          property_ids?: string[] | null
          role?: string
          status?: string | null
          team_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invitation_token?: string
          invited_by?: string | null
          property_ids?: string[] | null
          role?: string
          status?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          accepted_at: string | null
          custom_permissions: Json | null
          id: string
          invited_at: string | null
          invited_by: string | null
          role: string
          status: string | null
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          custom_permissions?: Json | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          role?: string
          status?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          custom_permissions?: Json | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          role?: string
          status?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          max_members: number | null
          name: string
          owner_id: string | null
          settings: Json | null
          slug: string | null
          subscription_tier: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_members?: number | null
          name: string
          owner_id?: string | null
          settings?: Json | null
          slug?: string | null
          subscription_tier?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_members?: number | null
          name?: string
          owner_id?: string | null
          settings?: Json | null
          slug?: string | null
          subscription_tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tenancies: {
        Row: {
          created_at: string | null
          deposit_amount: number
          deposit_reference: string | null
          deposit_scheme: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          end_date: string | null
          guarantor_email: string | null
          guarantor_name: string | null
          guarantor_phone: string | null
          id: string
          monthly_rent: number
          notice_period_days: number | null
          portfolio_property_id: string | null
          rent_due_day: number | null
          rent_frequency: string | null
          start_date: string
          status: string | null
          tenancy_type: string | null
          tenant_email: string | null
          tenant_name: string
          tenant_phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          deposit_amount: number
          deposit_reference?: string | null
          deposit_scheme?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          end_date?: string | null
          guarantor_email?: string | null
          guarantor_name?: string | null
          guarantor_phone?: string | null
          id?: string
          monthly_rent: number
          notice_period_days?: number | null
          portfolio_property_id?: string | null
          rent_due_day?: number | null
          rent_frequency?: string | null
          start_date: string
          status?: string | null
          tenancy_type?: string | null
          tenant_email?: string | null
          tenant_name: string
          tenant_phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          deposit_amount?: number
          deposit_reference?: string | null
          deposit_scheme?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          end_date?: string | null
          guarantor_email?: string | null
          guarantor_name?: string | null
          guarantor_phone?: string | null
          id?: string
          monthly_rent?: number
          notice_period_days?: number | null
          portfolio_property_id?: string | null
          rent_due_day?: number | null
          rent_frequency?: string | null
          start_date?: string
          status?: string | null
          tenancy_type?: string | null
          tenant_email?: string | null
          tenant_name?: string
          tenant_phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenancies_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      tenancy_documents: {
        Row: {
          document_name: string
          document_type: string
          document_url: string | null
          id: string
          tenancy_id: string | null
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          document_name: string
          document_type: string
          document_url?: string | null
          id?: string
          tenancy_id?: string | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          document_name?: string
          document_type?: string
          document_url?: string | null
          id?: string
          tenancy_id?: string | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenancy_documents_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_applications: {
        Row: {
          annual_income: number | null
          applicant_email: string
          applicant_name: string
          applicant_phone: string | null
          created_at: string | null
          current_address: string | null
          desired_move_date: string | null
          employer_name: string | null
          employment_status: string | null
          has_pets: boolean | null
          id: string
          job_title: string | null
          notes: string | null
          num_occupants: number | null
          pet_details: string | null
          portfolio_property_id: string | null
          proposed_rent: number | null
          status: string | null
          tenancy_length_months: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          annual_income?: number | null
          applicant_email: string
          applicant_name: string
          applicant_phone?: string | null
          created_at?: string | null
          current_address?: string | null
          desired_move_date?: string | null
          employer_name?: string | null
          employment_status?: string | null
          has_pets?: boolean | null
          id?: string
          job_title?: string | null
          notes?: string | null
          num_occupants?: number | null
          pet_details?: string | null
          portfolio_property_id?: string | null
          proposed_rent?: number | null
          status?: string | null
          tenancy_length_months?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          annual_income?: number | null
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string | null
          created_at?: string | null
          current_address?: string | null
          desired_move_date?: string | null
          employer_name?: string | null
          employment_status?: string | null
          has_pets?: boolean | null
          id?: string
          job_title?: string | null
          notes?: string | null
          num_occupants?: number | null
          pet_details?: string | null
          portfolio_property_id?: string | null
          proposed_rent?: number | null
          status?: string | null
          tenancy_length_months?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_applications_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_communications: {
        Row: {
          attachments: string[] | null
          communication_type: string | null
          created_at: string | null
          direction: string | null
          id: string
          message: string | null
          subject: string | null
          tenancy_id: string | null
          user_id: string | null
        }
        Insert: {
          attachments?: string[] | null
          communication_type?: string | null
          created_at?: string | null
          direction?: string | null
          id?: string
          message?: string | null
          subject?: string | null
          tenancy_id?: string | null
          user_id?: string | null
        }
        Update: {
          attachments?: string[] | null
          communication_type?: string | null
          created_at?: string | null
          direction?: string | null
          id?: string
          message?: string | null
          subject?: string | null
          tenancy_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_communications_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          portfolio_property_id: string | null
          read_at: string | null
          sender_type: string
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          portfolio_property_id?: string | null
          read_at?: string | null
          sender_type: string
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          portfolio_property_id?: string | null
          read_at?: string | null
          sender_type?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_messages_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_portal_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          invite_accepted_at: string | null
          invite_sent_at: string | null
          invite_token: string | null
          is_active: boolean | null
          last_login_at: string | null
          password_hash: string | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          invite_accepted_at?: string | null
          invite_sent_at?: string | null
          invite_token?: string | null
          is_active?: boolean | null
          last_login_at?: string | null
          password_hash?: string | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          invite_accepted_at?: string | null
          invite_sent_at?: string | null
          invite_token?: string | null
          is_active?: boolean | null
          last_login_at?: string | null
          password_hash?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_portal_users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_references: {
        Row: {
          application_id: string
          comments: string | null
          created_at: string | null
          id: string
          rating: number | null
          received_at: string | null
          referee_email: string | null
          referee_name: string | null
          referee_phone: string | null
          referee_relationship: string | null
          reference_type: string
          requested_at: string | null
          response: Json | null
          status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          application_id: string
          comments?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          received_at?: string | null
          referee_email?: string | null
          referee_name?: string | null
          referee_phone?: string | null
          referee_relationship?: string | null
          reference_type: string
          requested_at?: string | null
          response?: Json | null
          status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          application_id?: string
          comments?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          received_at?: string | null
          referee_email?: string | null
          referee_name?: string | null
          referee_phone?: string | null
          referee_relationship?: string | null
          reference_type?: string
          requested_at?: string | null
          response?: Json | null
          status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_references_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "tenant_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          deposit_amount: number | null
          email: string | null
          id: string
          move_in_date: string | null
          move_out_date: string | null
          name: string
          notes: string | null
          payment_day: number | null
          phone: string | null
          portfolio_property_id: string | null
          rent_amount: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deposit_amount?: number | null
          email?: string | null
          id?: string
          move_in_date?: string | null
          move_out_date?: string | null
          name: string
          notes?: string | null
          payment_day?: number | null
          phone?: string | null
          portfolio_property_id?: string | null
          rent_amount?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deposit_amount?: number | null
          email?: string | null
          id?: string
          move_in_date?: string | null
          move_out_date?: string | null
          name?: string
          notes?: string | null
          payment_day?: number | null
          phone?: string | null
          portfolio_property_id?: string | null
          rent_amount?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_logs: {
        Row: {
          action_type: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action_type?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action_type?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          activity_details: Json | null
          activity_type: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          activity_details?: Json | null
          activity_type?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          activity_details?: Json | null
          activity_type?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_connections: {
        Row: {
          connection_type: string | null
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          connection_type?: string | null
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          connection_type?: string | null
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_integrations: {
        Row: {
          access_token: string | null
          api_key: string | null
          auth_type: string | null
          config: Json | null
          created_at: string | null
          expires_at: string | null
          id: string
          integration_id: string | null
          last_error: string | null
          last_sync_at: string | null
          refresh_token: string | null
          status: string | null
          sync_errors: number | null
          sync_frequency: string | null
          total_syncs: number | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          api_key?: string | null
          auth_type?: string | null
          config?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          integration_id?: string | null
          last_error?: string | null
          last_sync_at?: string | null
          refresh_token?: string | null
          status?: string | null
          sync_errors?: number | null
          sync_frequency?: string | null
          total_syncs?: number | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          api_key?: string | null
          auth_type?: string | null
          config?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          integration_id?: string | null
          last_error?: string | null
          last_sync_at?: string | null
          refresh_token?: string | null
          status?: string | null
          sync_errors?: number | null
          sync_frequency?: string | null
          total_syncs?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_integrations_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
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
      user_profiles: {
        Row: {
          bio: string | null
          cover_photo_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          investor_type: string | null
          linkedin_url: string | null
          location_city: string | null
          location_country: string | null
          looking_for: string[] | null
          open_to_jv: boolean | null
          open_to_mentor: boolean | null
          portfolio_value: number | null
          portfolio_yield: number | null
          profile_photo_url: string | null
          profile_visibility: string | null
          properties_count: number | null
          specialties: string[] | null
          twitter_handle: string | null
          updated_at: string | null
          user_id: string
          website: string | null
          years_investing: number | null
        }
        Insert: {
          bio?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          investor_type?: string | null
          linkedin_url?: string | null
          location_city?: string | null
          location_country?: string | null
          looking_for?: string[] | null
          open_to_jv?: boolean | null
          open_to_mentor?: boolean | null
          portfolio_value?: number | null
          portfolio_yield?: number | null
          profile_photo_url?: string | null
          profile_visibility?: string | null
          properties_count?: number | null
          specialties?: string[] | null
          twitter_handle?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
          years_investing?: number | null
        }
        Update: {
          bio?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          investor_type?: string | null
          linkedin_url?: string | null
          location_city?: string | null
          location_country?: string | null
          looking_for?: string[] | null
          open_to_jv?: boolean | null
          open_to_mentor?: boolean | null
          portfolio_value?: number | null
          portfolio_yield?: number | null
          profile_photo_url?: string | null
          profile_visibility?: string | null
          properties_count?: number | null
          specialties?: string[] | null
          twitter_handle?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
          years_investing?: number | null
        }
        Relationships: []
      }
      user_risk_profiles: {
        Row: {
          created_at: string | null
          investment_goals: Json | null
          max_ltv_percentage: number | null
          max_negative_cashflow: number | null
          min_yield_percentage: number | null
          preferred_strategies: string[] | null
          risk_tolerance: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          investment_goals?: Json | null
          max_ltv_percentage?: number | null
          max_negative_cashflow?: number | null
          min_yield_percentage?: number | null
          preferred_strategies?: string[] | null
          risk_tolerance?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          investment_goals?: Json | null
          max_ltv_percentage?: number | null
          max_negative_cashflow?: number | null
          min_yield_percentage?: number | null
          preferred_strategies?: string[] | null
          risk_tolerance?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_viewing_stats: {
        Row: {
          badges_earned: Json | null
          created_at: string
          last_viewing_date: string | null
          most_detailed_note_id: string | null
          streak_days: number | null
          total_minutes_recorded: number | null
          total_viewings: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          badges_earned?: Json | null
          created_at?: string
          last_viewing_date?: string | null
          most_detailed_note_id?: string | null
          streak_days?: number | null
          total_minutes_recorded?: number | null
          total_viewings?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          badges_earned?: Json | null
          created_at?: string
          last_viewing_date?: string | null
          most_detailed_note_id?: string | null
          streak_days?: number | null
          total_minutes_recorded?: number | null
          total_viewings?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_viewing_stats_most_detailed_note_id_fkey"
            columns: ["most_detailed_note_id"]
            isOneToOne: false
            referencedRelation: "voice_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      utility_readings: {
        Row: {
          created_at: string | null
          id: string
          photo_url: string | null
          reading_date: string
          reading_type: string | null
          reading_value: number
          submitted_to_supplier: boolean | null
          utility_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          photo_url?: string | null
          reading_date: string
          reading_type?: string | null
          reading_value: number
          submitted_to_supplier?: boolean | null
          utility_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          photo_url?: string | null
          reading_date?: string
          reading_type?: string | null
          reading_value?: number
          submitted_to_supplier?: boolean | null
          utility_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "utility_readings_utility_id_fkey"
            columns: ["utility_id"]
            isOneToOne: false
            referencedRelation: "property_utilities"
            referencedColumns: ["id"]
          },
        ]
      }
      valuation_history: {
        Row: {
          created_at: string | null
          estimated_value: number | null
          id: string
          portfolio_property_id: string
          source: string | null
          valuation_date: string
        }
        Insert: {
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          portfolio_property_id: string
          source?: string | null
          valuation_date: string
        }
        Update: {
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          portfolio_property_id?: string
          source?: string | null
          valuation_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "valuation_history_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      viewing_availability: {
        Row: {
          day_of_week: number | null
          end_time: string | null
          id: string
          is_active: boolean | null
          portfolio_property_id: string | null
          start_time: string | null
          user_id: string
        }
        Insert: {
          day_of_week?: number | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          portfolio_property_id?: string | null
          start_time?: string | null
          user_id: string
        }
        Update: {
          day_of_week?: number | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          portfolio_property_id?: string | null
          start_time?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewing_availability_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      viewing_requests: {
        Row: {
          confirmed_date: string | null
          created_at: string | null
          feedback: string | null
          id: string
          interest_level: string | null
          notes: string | null
          portfolio_property_id: string | null
          preferred_dates: Json | null
          requester_email: string
          requester_name: string
          requester_phone: string | null
          status: string | null
          user_id: string
          viewing_type: string | null
        }
        Insert: {
          confirmed_date?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          interest_level?: string | null
          notes?: string | null
          portfolio_property_id?: string | null
          preferred_dates?: Json | null
          requester_email: string
          requester_name: string
          requester_phone?: string | null
          status?: string | null
          user_id: string
          viewing_type?: string | null
        }
        Update: {
          confirmed_date?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          interest_level?: string | null
          notes?: string | null
          portfolio_property_id?: string | null
          preferred_dates?: Json | null
          requester_email?: string
          requester_name?: string
          requester_phone?: string | null
          status?: string | null
          user_id?: string
          viewing_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "viewing_requests_portfolio_property_id_fkey"
            columns: ["portfolio_property_id"]
            isOneToOne: false
            referencedRelation: "portfolio_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_note_shares: {
        Row: {
          created_at: string
          id: string
          opened_at: string | null
          shared_by: string
          shared_with_email: string
          voice_note_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          opened_at?: string | null
          shared_by: string
          shared_with_email: string
          voice_note_id: string
        }
        Update: {
          created_at?: string
          id?: string
          opened_at?: string | null
          shared_by?: string
          shared_with_email?: string
          voice_note_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_note_shares_voice_note_id_fkey"
            columns: ["voice_note_id"]
            isOneToOne: false
            referencedRelation: "voice_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_notes: {
        Row: {
          audio_url: string | null
          confidence_score: number | null
          created_at: string
          duration_seconds: number | null
          id: string
          property_address: string
          property_id: string | null
          recording_date: string
          structured_analysis: Json | null
          template_used: string | null
          transcript: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          confidence_score?: number | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          property_address: string
          property_id?: string | null
          recording_date?: string
          structured_analysis?: Json | null
          template_used?: string | null
          transcript?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_url?: string | null
          confidence_score?: number | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          property_address?: string
          property_id?: string | null
          recording_date?: string
          structured_analysis?: Json | null
          template_used?: string | null
          transcript?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_deliveries: {
        Row: {
          attempts: number | null
          created_at: string | null
          event_type: string
          id: string
          payload: Json
          status: string | null
          status_code: number | null
          webhook_id: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          event_type: string
          id?: string
          payload: Json
          status?: string | null
          status_code?: number | null
          webhook_id: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          event_type?: string
          id?: string
          payload?: Json
          status?: string | null
          status_code?: number | null
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string | null
          events: string[]
          failed_deliveries: number | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          name: string
          secret: string
          total_deliveries: number | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          events: string[]
          failed_deliveries?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          name: string
          secret: string
          total_deliveries?: number | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          events?: string[]
          failed_deliveries?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          name?: string
          secret?: string
          total_deliveries?: number | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      white_label_configs: {
        Row: {
          accent_color: string | null
          company_logo_url: string | null
          company_name: string
          company_website: string | null
          created_at: string | null
          custom_domain: string | null
          domain_verified: boolean | null
          features_enabled: Json | null
          id: string
          is_active: boolean | null
          max_clients: number | null
          max_properties_per_client: number | null
          primary_color: string | null
          secondary_color: string | null
          subscription_tier: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accent_color?: string | null
          company_logo_url?: string | null
          company_name: string
          company_website?: string | null
          created_at?: string | null
          custom_domain?: string | null
          domain_verified?: boolean | null
          features_enabled?: Json | null
          id?: string
          is_active?: boolean | null
          max_clients?: number | null
          max_properties_per_client?: number | null
          primary_color?: string | null
          secondary_color?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accent_color?: string | null
          company_logo_url?: string | null
          company_name?: string
          company_website?: string | null
          created_at?: string | null
          custom_domain?: string | null
          domain_verified?: boolean | null
          features_enabled?: Json | null
          id?: string
          is_active?: boolean | null
          max_clients?: number | null
          max_properties_per_client?: number | null
          primary_color?: string | null
          secondary_color?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workflow_runs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          started_at: string | null
          status: string | null
          trigger_data: Json | null
          workflow_id: string | null
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          trigger_data?: Json | null
          workflow_id?: string | null
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          trigger_data?: Json | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_runs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "automation_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clean_all_expired_caches: { Args: never; Returns: undefined }
      clean_expired_cache: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      reset_daily_alert_counts: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role:
        | "owner"
        | "admin"
        | "editor"
        | "viewer"
        | "accountant"
        | "partner"
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
    Enums: {
      app_role: ["owner", "admin", "editor", "viewer", "accountant", "partner"],
    },
  },
} as const
