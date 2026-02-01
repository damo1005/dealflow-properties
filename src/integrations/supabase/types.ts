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
      compliance_items: {
        Row: {
          certificate_number: string | null
          certificate_url: string | null
          compliance_type: string
          created_at: string | null
          expiry_date: string
          id: string
          issued_date: string | null
          portfolio_property_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          certificate_number?: string | null
          certificate_url?: string | null
          compliance_type: string
          created_at?: string | null
          expiry_date: string
          id?: string
          issued_date?: string | null
          portfolio_property_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          certificate_number?: string | null
          certificate_url?: string | null
          compliance_type?: string
          created_at?: string | null
          expiry_date?: string
          id?: string
          issued_date?: string | null
          portfolio_property_id?: string | null
          status?: string | null
          updated_at?: string | null
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
          area_type: string | null
          avg_income: number | null
          avg_rent_1bed: number | null
          avg_rent_2bed: number | null
          avg_rent_3bed: number | null
          avg_rent_pcm: number | null
          avg_sold_price: number | null
          avg_sold_price_12m: number | null
          avg_sold_price_3m: number | null
          avg_time_on_market_days: number | null
          btl_score: number | null
          cached_at: string | null
          demand_score: number | null
          employment_rate: number | null
          expires_at: string | null
          gross_yield: number | null
          growth_score: number | null
          hmo_score: number | null
          id: string
          median_age: number | null
          overall_investment_score: number | null
          population: number | null
          postcode: string
          price_growth_pct: number | null
          price_per_sqft: number | null
          properties_for_sale: number | null
          properties_sold_3m: number | null
          raw_data: Json | null
          sale_vs_asking_pct: number | null
          supply_score: number | null
        }
        Insert: {
          area_type?: string | null
          avg_income?: number | null
          avg_rent_1bed?: number | null
          avg_rent_2bed?: number | null
          avg_rent_3bed?: number | null
          avg_rent_pcm?: number | null
          avg_sold_price?: number | null
          avg_sold_price_12m?: number | null
          avg_sold_price_3m?: number | null
          avg_time_on_market_days?: number | null
          btl_score?: number | null
          cached_at?: string | null
          demand_score?: number | null
          employment_rate?: number | null
          expires_at?: string | null
          gross_yield?: number | null
          growth_score?: number | null
          hmo_score?: number | null
          id?: string
          median_age?: number | null
          overall_investment_score?: number | null
          population?: number | null
          postcode: string
          price_growth_pct?: number | null
          price_per_sqft?: number | null
          properties_for_sale?: number | null
          properties_sold_3m?: number | null
          raw_data?: Json | null
          sale_vs_asking_pct?: number | null
          supply_score?: number | null
        }
        Update: {
          area_type?: string | null
          avg_income?: number | null
          avg_rent_1bed?: number | null
          avg_rent_2bed?: number | null
          avg_rent_3bed?: number | null
          avg_rent_pcm?: number | null
          avg_sold_price?: number | null
          avg_sold_price_12m?: number | null
          avg_sold_price_3m?: number | null
          avg_time_on_market_days?: number | null
          btl_score?: number | null
          cached_at?: string | null
          demand_score?: number | null
          employment_rate?: number | null
          expires_at?: string | null
          gross_yield?: number | null
          growth_score?: number | null
          hmo_score?: number | null
          id?: string
          median_age?: number | null
          overall_investment_score?: number | null
          population?: number | null
          postcode?: string
          price_growth_pct?: number | null
          price_per_sqft?: number | null
          properties_for_sale?: number | null
          properties_sold_3m?: number | null
          raw_data?: Json | null
          sale_vs_asking_pct?: number | null
          supply_score?: number | null
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
      planning_alerts: {
        Row: {
          alert_types: string[] | null
          created_at: string | null
          email_alerts: boolean | null
          id: string
          postcodes: string[] | null
          radius_miles: number | null
          user_id: string
        }
        Insert: {
          alert_types?: string[] | null
          created_at?: string | null
          email_alerts?: boolean | null
          id?: string
          postcodes?: string[] | null
          radius_miles?: number | null
          user_id: string
        }
        Update: {
          alert_types?: string[] | null
          created_at?: string | null
          email_alerts?: boolean | null
          id?: string
          postcodes?: string[] | null
          radius_miles?: number | null
          user_id?: string
        }
        Relationships: []
      }
      planning_applications: {
        Row: {
          address: string
          applicant: string | null
          application_type: string | null
          case_officer: string | null
          consultation_end_date: string | null
          created_at: string | null
          decision_date: string | null
          description: string | null
          id: string
          postcode: string
          property_impact: Json | null
          reference: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          applicant?: string | null
          application_type?: string | null
          case_officer?: string | null
          consultation_end_date?: string | null
          created_at?: string | null
          decision_date?: string | null
          description?: string | null
          id?: string
          postcode: string
          property_impact?: Json | null
          reference: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          applicant?: string | null
          application_type?: string | null
          case_officer?: string | null
          consultation_end_date?: string | null
          created_at?: string | null
          decision_date?: string | null
          description?: string | null
          id?: string
          postcode?: string
          property_impact?: Json | null
          reference?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      rent_payments: {
        Row: {
          actual_amount: number | null
          actual_date: string | null
          created_at: string | null
          days_late: number | null
          expected_amount: number
          expected_date: string
          id: string
          status: string | null
          tenancy_id: string | null
        }
        Insert: {
          actual_amount?: number | null
          actual_date?: string | null
          created_at?: string | null
          days_late?: number | null
          expected_amount: number
          expected_date: string
          id?: string
          status?: string | null
          tenancy_id?: string | null
        }
        Update: {
          actual_amount?: number | null
          actual_date?: string | null
          created_at?: string | null
          days_late?: number | null
          expected_amount?: number
          expected_date?: string
          id?: string
          status?: string | null
          tenancy_id?: string | null
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
      tenancies: {
        Row: {
          created_at: string | null
          deposit_amount: number
          deposit_scheme: string | null
          end_date: string | null
          id: string
          monthly_rent: number
          portfolio_property_id: string | null
          start_date: string
          status: string | null
          tenant_email: string | null
          tenant_name: string
          tenant_phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deposit_amount: number
          deposit_scheme?: string | null
          end_date?: string | null
          id?: string
          monthly_rent: number
          portfolio_property_id?: string | null
          start_date: string
          status?: string | null
          tenant_email?: string | null
          tenant_name: string
          tenant_phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deposit_amount?: number
          deposit_scheme?: string | null
          end_date?: string | null
          id?: string
          monthly_rent?: number
          portfolio_property_id?: string | null
          start_date?: string
          status?: string | null
          tenant_email?: string | null
          tenant_name?: string
          tenant_phone?: string | null
          updated_at?: string | null
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
      reset_daily_alert_counts: { Args: never; Returns: undefined }
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
