-- ============================================
-- NEXOVIA — Profils utilisateurs & rôles
-- ============================================

-- Table profils liée à auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur création d'utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- PROFILES : lecture de son propre profil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ADMIN : accès total à businesses
CREATE POLICY "Admins can do everything on businesses"
  ON businesses FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- CLIENT : voir uniquement son business
CREATE POLICY "Clients can view own business"
  ON businesses FOR SELECT
  USING (
    id IN (SELECT business_id FROM profiles WHERE id = auth.uid())
  );

-- SERVICES : admin full access, client lecture seule
CREATE POLICY "Admins full access services"
  ON services FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Clients view own services"
  ON services FOR SELECT
  USING (
    business_id IN (SELECT business_id FROM profiles WHERE id = auth.uid())
  );

-- LEADS : admin full, client par business
CREATE POLICY "Admins full access leads"
  ON leads FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Clients manage own leads"
  ON leads FOR ALL
  USING (
    business_id IN (SELECT business_id FROM profiles WHERE id = auth.uid())
  );

-- CONVERSATIONS : idem
CREATE POLICY "Admins full access conversations"
  ON conversations FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Clients view own conversations"
  ON conversations FOR ALL
  USING (
    business_id IN (SELECT business_id FROM profiles WHERE id = auth.uid())
  );

-- FAQ : idem
CREATE POLICY "Admins full access faq"
  ON faq_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Clients manage own faq"
  ON faq_items FOR ALL
  USING (
    business_id IN (SELECT business_id FROM profiles WHERE id = auth.uid())
  );
