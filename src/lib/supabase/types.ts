export type OfferTier = 'starter' | 'growth' | 'premium'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'appointment_scheduled' | 'converted' | 'lost'
export type Platform = 'instagram' | 'whatsapp'
export type BusinessStatus = 'active' | 'inactive' | 'trial'
export type UserRole = 'admin' | 'client'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  business_id: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Business {
  id: string
  name: string
  slug: string
  instagram_id: string | null
  instagram_username: string | null
  whatsapp: string | null
  system_prompt: string | null
  offer_tier: OfferTier
  status: BusinessStatus
  monthly_revenue: number
  setup_fee: number
  contact_name: string | null
  contact_email: string | null
  city: string | null
  logo_url: string | null
  meta_page_access_token: string | null
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  business_id: string
  name: string
  price: number
  duration: number | null
  description: string | null
  is_active: boolean
  created_at: string
}

export interface Lead {
  id: string
  business_id: string
  instagram_username: string | null
  phone: string | null
  email: string | null
  first_name: string | null
  last_name: string | null
  lead_status: LeadStatus
  interested_service: string | null
  notes: string | null
  source: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  platform: Platform
}

export interface Conversation {
  id: string
  business_id: string
  lead_id: string | null
  platform: Platform
  instagram_thread_id: string | null
  messages: Message[]
  is_resolved: boolean
  needs_human: boolean
  created_at: string
  updated_at: string
}

export interface FaqItem {
  id: string
  business_id: string
  question: string
  answer: string
  trigger_keywords: string[]
  is_active: boolean
  usage_count: number
  created_at: string
}

export interface AdminStats {
  total_businesses: number
  active_businesses: number
  total_mrr: number
  total_leads_all: number
  leads_this_month: number
}
