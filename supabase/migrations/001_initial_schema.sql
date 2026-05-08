-- ============================================
-- NEXOVIA — Schéma Supabase
-- Multi-tenant IA Automatisation Esthétique
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BUSINESSES (clients de NEXOVIA)
-- ============================================
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  instagram_id TEXT,
  instagram_username TEXT,
  whatsapp TEXT,
  system_prompt TEXT DEFAULT 'Tu es l''assistante virtuelle d''un institut esthétique premium. Réponds de manière concise, élégante et orientée prise de rendez-vous. Sois chaleureuse, professionnelle et guide vers la réservation.',
  offer_tier TEXT NOT NULL DEFAULT 'starter' CHECK (offer_tier IN ('starter', 'growth', 'premium')),
  status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('active', 'inactive', 'trial')),
  monthly_revenue INTEGER NOT NULL DEFAULT 490,
  setup_fee INTEGER NOT NULL DEFAULT 500,
  contact_name TEXT,
  contact_email TEXT,
  city TEXT,
  logo_url TEXT,
  meta_page_access_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SERVICES (services proposés par chaque business)
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration INTEGER,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEADS (prospects captés par le bot)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  instagram_username TEXT,
  instagram_user_id TEXT,
  phone TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  lead_status TEXT NOT NULL DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'qualified', 'appointment_scheduled', 'converted', 'lost')),
  interested_service TEXT,
  notes TEXT,
  source TEXT DEFAULT 'instagram',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONVERSATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  platform TEXT NOT NULL DEFAULT 'instagram' CHECK (platform IN ('instagram', 'whatsapp')),
  instagram_thread_id TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  is_resolved BOOLEAN DEFAULT false,
  needs_human BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FAQ ITEMS (réponses automatiques)
-- ============================================
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  trigger_keywords TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SEED DATA — Institut Nour (démo)
-- ============================================
INSERT INTO businesses (id, name, slug, instagram_username, whatsapp, offer_tier, status, monthly_revenue, setup_fee, contact_name, contact_email, city, system_prompt)
VALUES (
  'b1234567-0000-0000-0000-000000000001',
  'Institut Nour',
  'institut-nour',
  '@institutnour',
  '+216 99 123 456',
  'premium',
  'active',
  2000,
  2500,
  'Nour Ben Ali',
  'nour@institutnour.tn',
  'Tunis, Les Berges du Lac',
  'Tu es l''assistante virtuelle de l''Institut Nour, un centre de médecine esthétique et bien-être haut de gamme à Tunis. Réponds avec élégance, professionnalisme et chaleur. Guide toujours vers la prise de rendez-vous. Utilise le vouvoiement.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO businesses (id, name, slug, instagram_username, whatsapp, offer_tier, status, monthly_revenue, setup_fee, contact_name, contact_email, city, system_prompt)
VALUES (
  'b2345678-0000-0000-0000-000000000002',
  'Clinique Jasmin',
  'clinique-jasmin',
  '@cliniquejasmin',
  '+216 55 987 654',
  'growth',
  'active',
  990,
  1200,
  'Yasmine Mrad',
  'contact@cliniquejasmin.tn',
  'Sousse',
  'Tu es l''assistante virtuelle de la Clinique Jasmin. Spécialisée en soins du visage et traitements laser. Sois professionnelle et orientée résultats.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO businesses (id, name, slug, instagram_username, whatsapp, offer_tier, status, monthly_revenue, setup_fee, contact_name, contact_email, city)
VALUES (
  'b3456789-0000-0000-0000-000000000003',
  'Spa Elysée',
  'spa-elysee',
  '@spaelysee',
  '+216 22 456 789',
  'starter',
  'trial',
  490,
  500,
  'Amira Karoui',
  'amira@spaelysee.tn',
  'Carthage'
) ON CONFLICT (id) DO NOTHING;

-- Services Institut Nour
INSERT INTO services (business_id, name, price, duration, description) VALUES
  ('b1234567-0000-0000-0000-000000000001', 'Injection Botox', 450, 45, 'Traitement rides front et contour yeux'),
  ('b1234567-0000-0000-0000-000000000001', 'Acide Hyaluronique', 380, 60, 'Comblement des sillons naso-labiaux'),
  ('b1234567-0000-0000-0000-000000000001', 'Peeling Chimique', 220, 60, 'Peeling TCA moyen / superficiel'),
  ('b1234567-0000-0000-0000-000000000001', 'Laser CO2', 600, 90, 'Resurfacing cutané laser fractionné'),
  ('b1234567-0000-0000-0000-000000000001', 'Mésothérapie Visage', 180, 45, 'Cocktail de vitamines et acide hyaluronique');

-- Services Clinique Jasmin
INSERT INTO services (business_id, name, price, duration, description) VALUES
  ('b2345678-0000-0000-0000-000000000002', 'Soin Anti-âge Premium', 280, 90, 'Protocole lifting non chirurgical'),
  ('b2345678-0000-0000-0000-000000000002', 'Laser Épilation Définitive', 150, 60, 'Par zone - visage ou corps'),
  ('b2345678-0000-0000-0000-000000000002', 'Microneedling', 320, 75, 'Stimulation du collagène');

-- FAQ Institut Nour
INSERT INTO faq_items (business_id, question, answer, trigger_keywords) VALUES
  ('b1234567-0000-0000-0000-000000000001', 'Tarifs et prix', 'Nos tarifs varient selon les traitements. Botox à partir de 450 DT, Acide Hyaluronique à partir de 380 DT, Peeling à partir de 220 DT. Consultez notre menu complet lors de votre visite.', ARRAY['prix', 'tarif', 'combien', 'coût']),
  ('b1234567-0000-0000-0000-000000000001', 'Horaires d''ouverture', 'L''Institut Nour est ouvert du lundi au samedi, de 9h à 19h. Fermé le dimanche et les jours fériés.', ARRAY['horaire', 'ouvert', 'heure', 'disponible']),
  ('b1234567-0000-0000-0000-000000000001', 'Adresse et localisation', 'Nous sommes situés aux Berges du Lac 2, Tunis. Parking disponible sur place.', ARRAY['adresse', 'où', 'localisation', 'trouver']),
  ('b1234567-0000-0000-0000-000000000001', 'Prise de rendez-vous', 'Pour prendre rendez-vous, envoyez-nous votre numéro WhatsApp et le traitement souhaité. Notre équipe vous contactera sous 1h pour confirmer votre disponibilité.', ARRAY['rendez-vous', 'rdv', 'réserver', 'booking']);

-- Leads démo Institut Nour
INSERT INTO leads (business_id, instagram_username, first_name, last_name, lead_status, interested_service, phone, source) VALUES
  ('b1234567-0000-0000-0000-000000000001', '@rania.style', 'Rania', 'Hamdi', 'appointment_scheduled', 'Injection Botox', '+216 98 111 222', 'instagram'),
  ('b1234567-0000-0000-0000-000000000001', '@meriem_beauty', 'Meriem', 'Sassi', 'qualified', 'Peeling Chimique', '+216 55 333 444', 'instagram'),
  ('b1234567-0000-0000-0000-000000000001', '@leila.luxe', 'Leïla', 'Chaabane', 'new', 'Acide Hyaluronique', NULL, 'instagram'),
  ('b1234567-0000-0000-0000-000000000001', '@dorra_tn', 'Dorra', 'Belhaj', 'converted', 'Laser CO2', '+216 99 555 666', 'instagram'),
  ('b1234567-0000-0000-0000-000000000001', '@amina.glow', 'Amina', 'Rekik', 'contacted', 'Mésothérapie Visage', NULL, 'instagram');
