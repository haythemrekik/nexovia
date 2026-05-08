-- ============================================
-- NEXOVIA — Auto-link profil ↔ business
-- Quand un utilisateur s'inscrit avec un email
-- qui correspond à un contact_email d'un business,
-- son profil est automatiquement lié et son rôle
-- passe à 'client'.
-- ============================================

-- Remplacer le trigger handle_new_user pour inclure le lien auto
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  matched_business_id UUID;
BEGIN
  -- Chercher un business dont le contact_email correspond
  SELECT id INTO matched_business_id
  FROM public.businesses
  WHERE LOWER(contact_email) = LOWER(NEW.email)
  LIMIT 1;

  -- Créer le profil avec lien automatique si trouvé
  INSERT INTO public.profiles (id, email, full_name, role, business_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE WHEN matched_business_id IS NOT NULL THEN 'client' ELSE 'client' END,
    matched_business_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: le trigger on_auth_user_created existe déjà (migration 002),
-- il appellera automatiquement cette nouvelle version de la fonction.
