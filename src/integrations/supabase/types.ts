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
      deal_packs: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          pdf_url: string | null
          property_id: string | null
          share_link: string | null
          template_name: string | null
          user_id: string
          views: number | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          property_id?: string | null
          share_link?: string | null
          template_name?: string | null
          user_id: string
          views?: number | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          property_id?: string | null
          share_link?: string | null
          template_name?: string | null
          user_id?: string
          views?: number | null
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
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          full_name: string | null
          id: string
          stripe_customer_id: string | null
          subscription_tier: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          stripe_customer_id?: string | null
          subscription_tier?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscription_tier?: string | null
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
