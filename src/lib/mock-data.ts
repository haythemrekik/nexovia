import { Business, Lead, Conversation, FaqItem, Service } from './supabase/types'

// ============================================
// MOCK DATA — Mode démo sans Supabase
// ============================================

export const mockBusinesses: Business[] = [
  {
    id: 'b1234567-0000-0000-0000-000000000001',
    name: 'Institut Nour',
    slug: 'institut-nour',
    instagram_id: '1234567890',
    instagram_username: '@institutnour',
    whatsapp: '+216 99 123 456',
    system_prompt: "Tu es l'assistante virtuelle de l'Institut Nour, centre de médecine esthétique haut de gamme à Tunis. Réponds avec élégance et guide vers la prise de rendez-vous.",
    offer_tier: 'premium',
    status: 'active',
    monthly_revenue: 2000,
    setup_fee: 2500,
    contact_name: 'Nour Ben Ali',
    contact_email: 'nour@institutnour.tn',
    city: 'Tunis, Les Berges du Lac',
    logo_url: null,
    meta_page_access_token: null,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-05-01T10:00:00Z',
  },
  {
    id: 'b2345678-0000-0000-0000-000000000002',
    name: 'Clinique Jasmin',
    slug: 'clinique-jasmin',
    instagram_id: '9876543210',
    instagram_username: '@cliniquejasmin',
    whatsapp: '+216 55 987 654',
    system_prompt: "Tu es l'assistante virtuelle de la Clinique Jasmin. Sois professionnelle et orientée résultats.",
    offer_tier: 'growth',
    status: 'active',
    monthly_revenue: 990,
    setup_fee: 1200,
    contact_name: 'Yasmine Mrad',
    contact_email: 'contact@cliniquejasmin.tn',
    city: 'Sousse',
    logo_url: null,
    meta_page_access_token: null,
    created_at: '2024-02-20T10:00:00Z',
    updated_at: '2024-05-01T10:00:00Z',
  },
  {
    id: 'b3456789-0000-0000-0000-000000000003',
    name: 'Spa Elysée',
    slug: 'spa-elysee',
    instagram_id: null,
    instagram_username: '@spaelysee',
    whatsapp: '+216 22 456 789',
    system_prompt: null,
    offer_tier: 'starter',
    status: 'trial',
    monthly_revenue: 490,
    setup_fee: 500,
    contact_name: 'Amira Karoui',
    contact_email: 'amira@spaelysee.tn',
    city: 'Carthage',
    logo_url: null,
    meta_page_access_token: null,
    created_at: '2024-05-01T10:00:00Z',
    updated_at: '2024-05-01T10:00:00Z',
  },
]

export const mockLeads: Lead[] = [
  {
    id: 'l1', business_id: 'b1234567-0000-0000-0000-000000000001',
    instagram_username: '@rania.style', phone: '+216 98 111 222',
    email: null, first_name: 'Rania', last_name: 'Hamdi',
    lead_status: 'appointment_scheduled', interested_service: 'Injection Botox',
    notes: 'RDV confirmé le 15/05 à 14h', source: 'instagram',
    created_at: '2024-05-06T09:15:00Z', updated_at: '2024-05-07T14:00:00Z',
  },
  {
    id: 'l2', business_id: 'b1234567-0000-0000-0000-000000000001',
    instagram_username: '@meriem_beauty', phone: '+216 55 333 444',
    email: null, first_name: 'Meriem', last_name: 'Sassi',
    lead_status: 'qualified', interested_service: 'Peeling Chimique',
    notes: 'Intéressée par peeling TCA, demande tarifs détaillés', source: 'instagram',
    created_at: '2024-05-07T11:30:00Z', updated_at: '2024-05-07T11:30:00Z',
  },
  {
    id: 'l3', business_id: 'b1234567-0000-0000-0000-000000000001',
    instagram_username: '@leila.luxe', phone: null,
    email: null, first_name: 'Leïla', last_name: 'Chaabane',
    lead_status: 'new', interested_service: 'Acide Hyaluronique',
    notes: null, source: 'instagram',
    created_at: '2024-05-08T08:00:00Z', updated_at: '2024-05-08T08:00:00Z',
  },
  {
    id: 'l4', business_id: 'b1234567-0000-0000-0000-000000000001',
    instagram_username: '@dorra_tn', phone: '+216 99 555 666',
    email: 'dorra@gmail.com', first_name: 'Dorra', last_name: 'Belhaj',
    lead_status: 'converted', interested_service: 'Laser CO2',
    notes: 'Cliente convertie, séance effectuée', source: 'instagram',
    created_at: '2024-04-20T10:00:00Z', updated_at: '2024-05-02T16:00:00Z',
  },
  {
    id: 'l5', business_id: 'b1234567-0000-0000-0000-000000000001',
    instagram_username: '@amina.glow', phone: null,
    email: null, first_name: 'Amina', last_name: 'Rekik',
    lead_status: 'contacted', interested_service: 'Mésothérapie Visage',
    notes: 'Contactée via WhatsApp, en attente de réponse', source: 'instagram',
    created_at: '2024-05-07T16:45:00Z', updated_at: '2024-05-07T17:00:00Z',
  },
]

export const mockConversations: Conversation[] = [
  {
    id: 'c1', business_id: 'b1234567-0000-0000-0000-000000000001',
    lead_id: 'l1', platform: 'instagram', instagram_thread_id: 'thread_001',
    is_resolved: false, needs_human: false,
    messages: [
      { id: 'm1', role: 'user', content: 'Bonjour, je voudrais savoir le prix du botox', timestamp: '2024-05-06T09:15:00Z', platform: 'instagram' },
      { id: 'm2', role: 'assistant', content: 'Bonjour ! Bienvenue à l\'Institut Nour 💫 Nos injections de Botox sont proposées à partir de 450 DT selon les zones traitées. Souhaitez-vous prendre rendez-vous pour une consultation gratuite ?', timestamp: '2024-05-06T09:15:05Z', platform: 'instagram' },
      { id: 'm3', role: 'user', content: 'Oui je veux un rdv svp, mon numéro c\'est +216 98 111 222', timestamp: '2024-05-06T09:17:00Z', platform: 'instagram' },
      { id: 'm4', role: 'assistant', content: 'Parfait Rania ! 🌸 J\'ai bien noté votre numéro. Notre équipe vous contactera dans l\'heure pour confirmer votre créneau. Avez-vous une disponibilité particulière cette semaine ?', timestamp: '2024-05-06T09:17:08Z', platform: 'instagram' },
    ],
    created_at: '2024-05-06T09:15:00Z', updated_at: '2024-05-06T09:17:08Z',
  },
  {
    id: 'c2', business_id: 'b1234567-0000-0000-0000-000000000001',
    lead_id: 'l3', platform: 'instagram', instagram_thread_id: 'thread_002',
    is_resolved: false, needs_human: false,
    messages: [
      { id: 'm5', role: 'user', content: 'Vous êtes ouverts le samedi ?', timestamp: '2024-05-08T08:00:00Z', platform: 'instagram' },
      { id: 'm6', role: 'assistant', content: 'Oui, nous sommes ouverts du lundi au samedi de 9h à 19h ✨ Souhaitez-vous prendre rendez-vous pour un de nos soins ?', timestamp: '2024-05-08T08:00:03Z', platform: 'instagram' },
      { id: 'm7', role: 'user', content: 'Oui j\'aimerais faire de l\'acide hyaluronique', timestamp: '2024-05-08T08:02:00Z', platform: 'instagram' },
    ],
    created_at: '2024-05-08T08:00:00Z', updated_at: '2024-05-08T08:02:00Z',
  },
]

export const mockFaqItems: FaqItem[] = [
  {
    id: 'f1', business_id: 'b1234567-0000-0000-0000-000000000001',
    question: 'Quels sont vos tarifs ?',
    answer: 'Nos tarifs varient selon les traitements : Botox à partir de 450 DT, Acide Hyaluronique à partir de 380 DT, Peeling à partir de 220 DT. Consultation gratuite sur demande.',
    trigger_keywords: ['prix', 'tarif', 'combien', 'coût', 'tarifs'],
    is_active: true, usage_count: 47, created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'f2', business_id: 'b1234567-0000-0000-0000-000000000001',
    question: 'Quels sont vos horaires ?',
    answer: "L'Institut Nour est ouvert du lundi au samedi de 9h à 19h. Fermé le dimanche et jours fériés.",
    trigger_keywords: ['horaire', 'ouvert', 'heure', 'disponible', 'fermé'],
    is_active: true, usage_count: 38, created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'f3', business_id: 'b1234567-0000-0000-0000-000000000001',
    question: 'Où êtes-vous situés ?',
    answer: 'Nous sommes aux Berges du Lac 2, Tunis. Parking gratuit disponible sur place. GPS : Institut Nour Tunis.',
    trigger_keywords: ['adresse', 'où', 'localisation', 'trouver', 'situé'],
    is_active: true, usage_count: 29, created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'f4', business_id: 'b1234567-0000-0000-0000-000000000001',
    question: 'Comment prendre rendez-vous ?',
    answer: "Envoyez-nous votre numéro WhatsApp et le soin souhaité. Notre équipe vous recontacte sous 1h pour confirmer votre créneau 💫",
    trigger_keywords: ['rendez-vous', 'rdv', 'réserver', 'booking', 'appointment'],
    is_active: true, usage_count: 62, created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'f5', business_id: 'b1234567-0000-0000-0000-000000000001',
    question: 'Y a-t-il une consultation obligatoire ?',
    answer: 'Oui, une consultation médicale préalable est obligatoire pour les traitements injectables. Elle est offerte et dure environ 20 minutes.',
    trigger_keywords: ['consultation', 'médecin', 'docteur', 'obligatoire'],
    is_active: true, usage_count: 21, created_at: '2024-02-01T10:00:00Z',
  },
]

export const mockServices: Service[] = [
  { id: 's1', business_id: 'b1234567-0000-0000-0000-000000000001', name: 'Injection Botox', price: 450, duration: 45, description: 'Traitement rides front et contour yeux', is_active: true, created_at: '2024-01-15T10:00:00Z' },
  { id: 's2', business_id: 'b1234567-0000-0000-0000-000000000001', name: 'Acide Hyaluronique', price: 380, duration: 60, description: 'Comblement des sillons naso-labiaux', is_active: true, created_at: '2024-01-15T10:00:00Z' },
  { id: 's3', business_id: 'b1234567-0000-0000-0000-000000000001', name: 'Peeling Chimique', price: 220, duration: 60, description: 'Peeling TCA moyen / superficiel', is_active: true, created_at: '2024-01-15T10:00:00Z' },
  { id: 's4', business_id: 'b1234567-0000-0000-0000-000000000001', name: 'Laser CO2', price: 600, duration: 90, description: 'Resurfacing cutané laser fractionné', is_active: true, created_at: '2024-01-15T10:00:00Z' },
  { id: 's5', business_id: 'b1234567-0000-0000-0000-000000000001', name: 'Mésothérapie Visage', price: 180, duration: 45, description: 'Cocktail vitamines et acide hyaluronique', is_active: true, created_at: '2024-01-15T10:00:00Z' },
]
