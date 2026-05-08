import { createClient } from './client'
import type { Business, Lead, Conversation, FaqItem, Service, Profile } from './types'

// ============================================
// Helper — get Supabase client
// ============================================
function supabase() {
  return createClient()
}

// ============================================
// PROFILE
// ============================================
export async function getCurrentProfile(): Promise<Profile | null> {
  const sb = supabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null

  const { data } = await sb.from('profiles').select('*').eq('id', user.id).single()
  return data
}

// ============================================
// BUSINESSES
// ============================================
export async function getBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase().from('businesses').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getBusiness(id: string): Promise<Business | null> {
  const { data, error } = await supabase().from('businesses').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function createBusiness(business: Partial<Business>): Promise<Business> {
  const { data, error } = await supabase().from('businesses').insert(business).select().single()
  if (error) throw error
  return data
}

export async function updateBusiness(id: string, updates: Partial<Business>): Promise<Business> {
  const { data, error } = await supabase().from('businesses').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteBusiness(id: string): Promise<void> {
  const { error } = await supabase().from('businesses').delete().eq('id', id)
  if (error) throw error
}

// ============================================
// LEADS
// ============================================
export async function getLeads(businessId?: string): Promise<Lead[]> {
  let query = supabase().from('leads').select('*').order('created_at', { ascending: false })
  if (businessId) query = query.eq('business_id', businessId)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createLead(lead: Partial<Lead>): Promise<Lead> {
  const { data, error } = await supabase().from('leads').insert(lead).select().single()
  if (error) throw error
  return data
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
  const { data, error } = await supabase().from('leads').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase().from('leads').delete().eq('id', id)
  if (error) throw error
}

// ============================================
// CONVERSATIONS
// ============================================
export async function getConversations(businessId?: string): Promise<Conversation[]> {
  let query = supabase().from('conversations').select('*').order('updated_at', { ascending: false })
  if (businessId) query = query.eq('business_id', businessId)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getConversation(id: string): Promise<Conversation | null> {
  const { data, error } = await supabase().from('conversations').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation> {
  const { data, error } = await supabase().from('conversations').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

// ============================================
// FAQ ITEMS
// ============================================
export async function getFaqItems(businessId?: string): Promise<FaqItem[]> {
  let query = supabase().from('faq_items').select('*').order('usage_count', { ascending: false })
  if (businessId) query = query.eq('business_id', businessId)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createFaqItem(faq: Partial<FaqItem>): Promise<FaqItem> {
  const { data, error } = await supabase().from('faq_items').insert(faq).select().single()
  if (error) throw error
  return data
}

export async function updateFaqItem(id: string, updates: Partial<FaqItem>): Promise<FaqItem> {
  const { data, error } = await supabase().from('faq_items').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteFaqItem(id: string): Promise<void> {
  const { error } = await supabase().from('faq_items').delete().eq('id', id)
  if (error) throw error
}

// ============================================
// SERVICES
// ============================================
export async function getServices(businessId?: string): Promise<Service[]> {
  let query = supabase().from('services').select('*').order('name')
  if (businessId) query = query.eq('business_id', businessId)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createService(service: Partial<Service>): Promise<Service> {
  const { data, error } = await supabase().from('services').insert(service).select().single()
  if (error) throw error
  return data
}

export async function updateService(id: string, updates: Partial<Service>): Promise<Service> {
  const { data, error } = await supabase().from('services').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase().from('services').delete().eq('id', id)
  if (error) throw error
}
