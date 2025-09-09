import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sgoyocqvcdrgbnieesnop.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnb3ljcXZjZHJnYm5pZWVzbm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczOTE4MDUsImV4cCI6MjA3Mjk2NzgwNX0.38SyWi49ftr0z7T9-jzJEaJN8en30lnj87_eb3M6z3A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Document {
  id: string
  title: string
  content: string
  original_language: 'english' | 'malayalam' | 'bilingual'
  translated_content?: string
  document_type: 'policy' | 'circular' | 'invoice' | 'report' | 'regulation' | 'other'
  department: 'hr' | 'engineering' | 'finance' | 'regulatory' | 'safety' | 'operations' | 'procurement'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'uploaded' | 'processing' | 'processed' | 'routed' | 'archived'
  source: 'email' | 'sharepoint' | 'whatsapp' | 'maximo' | 'scan' | 'upload'
  file_url?: string
  summary?: string
  key_points?: string[]
  compliance_items?: string[]
  deadlines?: string[]
  created_at: string
  updated_at: string
  created_by: string
}

export interface User {
  id: string
  email: string
  full_name: string
  department: string
  role: 'station_controller' | 'manager' | 'engineer' | 'admin' | 'executive'
  language_preference: 'english' | 'malayalam' | 'both'
  created_at: string
}

export interface DocumentRoute {
  id: string
  document_id: string
  department: string
  user_id?: string
  priority: number
  reason: string
  routed_at: string
  acknowledged_at?: string
  status: 'pending' | 'acknowledged' | 'completed'
}

export interface ComplianceItem {
  id: string
  title: string
  description: string
  due_date: string
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  assigned_department: string
  assigned_user?: string
  document_id?: string
  created_at: string
  updated_at: string
}