'use client'
import { useState, useEffect, useCallback } from 'react'
import { mockBusinesses, mockLeads, mockConversations, mockFaqItems, mockServices } from './mock-data'
import * as queries from './supabase/queries'
import type { Business, Lead, Conversation, FaqItem, Service } from './supabase/types'

// ============================================
// Détection auto : Supabase configuré ou mock
// ============================================
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key'
  )
}

// ============================================
// Hook générique de chargement
// ============================================
function useSupabaseData<T>(
  fetchFn: () => Promise<T>,
  mockData: T,
  deps: unknown[] = []
): { data: T; loading: boolean; error: string | null; refetch: () => void } {
  const useMock = !isSupabaseConfigured()
  const [data, setData] = useState<T>(useMock ? mockData : mockData)
  const [loading, setLoading] = useState(!useMock)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (useMock) {
      setData(mockData)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const result = await fetchFn()
      setData(result)
      setError(null)
    } catch (err) {
      console.warn('Supabase error, falling back to mock:', err)
      setData(mockData)
      setError(null) // Silently fallback
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useMock, ...deps])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// ============================================
// Hooks spécifiques
// ============================================

export function useBusinesses() {
  return useSupabaseData<Business[]>(
    () => queries.getBusinesses(),
    mockBusinesses
  )
}

export function useBusiness(id: string) {
  return useSupabaseData<Business | null>(
    () => queries.getBusiness(id),
    mockBusinesses.find(b => b.id === id) || null,
    [id]
  )
}

export function useLeads(businessId?: string) {
  const mock = businessId
    ? mockLeads.filter(l => l.business_id === businessId)
    : mockLeads
  return useSupabaseData<Lead[]>(
    () => queries.getLeads(businessId),
    mock,
    [businessId]
  )
}

export function useConversations(businessId?: string) {
  const mock = businessId
    ? mockConversations.filter(c => c.business_id === businessId)
    : mockConversations
  return useSupabaseData<Conversation[]>(
    () => queries.getConversations(businessId),
    mock,
    [businessId]
  )
}

export function useFaqItems(businessId?: string) {
  const mock = businessId
    ? mockFaqItems.filter(f => f.business_id === businessId)
    : mockFaqItems
  return useSupabaseData<FaqItem[]>(
    () => queries.getFaqItems(businessId),
    mock,
    [businessId]
  )
}

export function useServices(businessId?: string) {
  const mock = businessId
    ? mockServices.filter(s => s.business_id === businessId)
    : mockServices
  return useSupabaseData<Service[]>(
    () => queries.getServices(businessId),
    mock,
    [businessId]
  )
}

// ============================================
// Export des mutations (passthrough)
// ============================================
export const mutations = {
  createBusiness: queries.createBusiness,
  updateBusiness: queries.updateBusiness,
  deleteBusiness: queries.deleteBusiness,
  createLead: queries.createLead,
  updateLead: queries.updateLead,
  deleteLead: queries.deleteLead,
  updateConversation: queries.updateConversation,
  createFaqItem: queries.createFaqItem,
  updateFaqItem: queries.updateFaqItem,
  deleteFaqItem: queries.deleteFaqItem,
  createService: queries.createService,
  updateService: queries.updateService,
  deleteService: queries.deleteService,
}

export { isSupabaseConfigured }
