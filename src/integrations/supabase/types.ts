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
      factory_os_forms: {
        Row: {
          company_name: string | null
          contact_person: string | null
          form_type: string
          id: string
          lead_id: string
          mail_content: string | null
          notes: string | null
          subject: string | null
          submitted_at: string
          submitted_by: string | null
        }
        Insert: {
          company_name?: string | null
          contact_person?: string | null
          form_type: string
          id?: string
          lead_id: string
          mail_content?: string | null
          notes?: string | null
          subject?: string | null
          submitted_at?: string
          submitted_by?: string | null
        }
        Update: {
          company_name?: string | null
          contact_person?: string | null
          form_type?: string
          id?: string
          lead_id?: string
          mail_content?: string | null
          notes?: string | null
          subject?: string | null
          submitted_at?: string
          submitted_by?: string | null
        }
        Relationships: []
      }
      lead_forms: {
        Row: {
          business_potential: string | null
          company_name: string | null
          customer_details: string | null
          date: string
          discussion: string | null
          employee_name: string
          field_observation: string | null
          id: string
          insights: string | null
          lead_id: string
          lead_no: string
          new_company_name: string | null
          place: string
          remarks: string | null
          state: string
          submitted_at: string
          submitted_by: string | null
        }
        Insert: {
          business_potential?: string | null
          company_name?: string | null
          customer_details?: string | null
          date: string
          discussion?: string | null
          employee_name: string
          field_observation?: string | null
          id?: string
          insights?: string | null
          lead_id: string
          lead_no: string
          new_company_name?: string | null
          place: string
          remarks?: string | null
          state: string
          submitted_at?: string
          submitted_by?: string | null
        }
        Update: {
          business_potential?: string | null
          company_name?: string | null
          customer_details?: string | null
          date?: string
          discussion?: string | null
          employee_name?: string
          field_observation?: string | null
          id?: string
          insights?: string | null
          lead_id?: string
          lead_no?: string
          new_company_name?: string | null
          place?: string
          remarks?: string | null
          state?: string
          submitted_at?: string
          submitted_by?: string | null
        }
        Relationships: []
      }
      machine_safety_forms: {
        Row: {
          id: string
          lead_id: string
          safety_notes: string | null
          submitted_at: string
          submitted_by: string | null
        }
        Insert: {
          id?: string
          lead_id: string
          safety_notes?: string | null
          submitted_at?: string
          submitted_by?: string | null
        }
        Update: {
          id?: string
          lead_id?: string
          safety_notes?: string | null
          submitted_at?: string
          submitted_by?: string | null
        }
        Relationships: []
      }
      ux_form_submissions: {
        Row: {
          audit_category: string | null
          form_type: string
          heading: string | null
          height: string | null
          hsn_code: string | null
          id: string
          lead_id: string
          material_code: string | null
          price: string | null
          quantity: string | null
          subheading: string | null
          submitted_at: string | null
          submitted_by: string | null
          total_amount: string | null
          uom: string | null
        }
        Insert: {
          audit_category?: string | null
          form_type: string
          heading?: string | null
          height?: string | null
          hsn_code?: string | null
          id?: string
          lead_id: string
          material_code?: string | null
          price?: string | null
          quantity?: string | null
          subheading?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          total_amount?: string | null
          uom?: string | null
        }
        Update: {
          audit_category?: string | null
          form_type?: string
          heading?: string | null
          height?: string | null
          hsn_code?: string | null
          id?: string
          lead_id?: string
          material_code?: string | null
          price?: string | null
          quantity?: string | null
          subheading?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          total_amount?: string | null
          uom?: string | null
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
    Enums: {},
  },
} as const
