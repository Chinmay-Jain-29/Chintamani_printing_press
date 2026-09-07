-- ============================================================================
-- SUPABASE MIGRATION 001: INITIAL SCHEMA
-- PROJECT: NEW CHINTAMANI PRINTING PRESS (Dongaon)
-- ARCHITECTURE: Vercel Production PostgreSQL Persistence
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. HELPER: Auto-updating updated_at trigger function
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 2. TABLE: services
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_mr TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    desc_en TEXT NOT NULL,
    desc_mr TEXT NOT NULL,
    desc_hi TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL,
    image_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    coming_soon BOOLEAN NOT NULL DEFAULT false,
    visible BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_services_updated_at ON public.services;
CREATE TRIGGER trg_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_services_visible_order ON public.services(visible, sort_order);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);

-- ============================================================================
-- 3. TABLE: portfolio
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.portfolio (
    id TEXT PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_mr TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    desc_en TEXT NOT NULL,
    desc_mr TEXT NOT NULL,
    desc_hi TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    top_work BOOLEAN NOT NULL DEFAULT false,
    visible BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_portfolio_updated_at ON public.portfolio;
CREATE TRIGGER trg_portfolio_updated_at
    BEFORE UPDATE ON public.portfolio
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_portfolio_visible_order ON public.portfolio(visible, sort_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON public.portfolio(category);

-- ============================================================================
-- 4. TABLE: reviews
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    location TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    customer_photo TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_reviews_updated_at ON public.reviews;
CREATE TRIGGER trg_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_reviews_status_featured ON public.reviews(status, featured, created_at DESC);

-- ============================================================================
-- 5. TABLE: quotes
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.quotes (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    service TEXT NOT NULL,
    quantity TEXT,
    size_specification TEXT,
    requirements TEXT NOT NULL,
    preferred_contact TEXT NOT NULL DEFAULT 'WhatsApp',
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Completed', 'Cancelled')),
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_quotes_updated_at ON public.quotes;
CREATE TRIGGER trg_quotes_updated_at
    BEFORE UPDATE ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_quotes_status_created ON public.quotes(status, created_at DESC);

-- ============================================================================
-- 6. TABLE: translations
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.translations (
    key TEXT PRIMARY KEY,
    en TEXT NOT NULL,
    mr TEXT NOT NULL,
    hi TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_translations_updated_at ON public.translations;
CREATE TRIGGER trg_translations_updated_at
    BEFORE UPDATE ON public.translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. TABLE: site_settings
-- Stores business_info, branding, homepage_config, social_links, seo_settings
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trg_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. TABLE: admin_users
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    token_version INTEGER NOT NULL DEFAULT 1,
    reset_token_hash TEXT,
    reset_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER trg_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 9.1 services policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view visible services" ON public.services;
CREATE POLICY "Public can view visible services"
    ON public.services FOR SELECT
    USING (visible = true);

DROP POLICY IF EXISTS "Service role full access on services" ON public.services;
CREATE POLICY "Service role full access on services"
    ON public.services FOR ALL
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 9.2 portfolio policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view visible portfolio" ON public.portfolio;
CREATE POLICY "Public can view visible portfolio"
    ON public.portfolio FOR SELECT
    USING (visible = true);

DROP POLICY IF EXISTS "Service role full access on portfolio" ON public.portfolio;
CREATE POLICY "Service role full access on portfolio"
    ON public.portfolio FOR ALL
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 9.3 reviews policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;
CREATE POLICY "Public can view approved reviews"
    ON public.reviews FOR SELECT
    USING (status = 'approved');

DROP POLICY IF EXISTS "Public can submit pending reviews" ON public.reviews;
CREATE POLICY "Public can submit pending reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "Service role full access on reviews" ON public.reviews;
CREATE POLICY "Service role full access on reviews"
    ON public.reviews FOR ALL
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 9.4 quotes policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can submit new quotes" ON public.quotes;
CREATE POLICY "Public can submit new quotes"
    ON public.quotes FOR INSERT
    WITH CHECK (status = 'New');

DROP POLICY IF EXISTS "Service role full access on quotes" ON public.quotes;
CREATE POLICY "Service role full access on quotes"
    ON public.quotes FOR ALL
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 9.5 translations policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view translations" ON public.translations;
CREATE POLICY "Public can view translations"
    ON public.translations FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Service role full access on translations" ON public.translations;
CREATE POLICY "Service role full access on translations"
    ON public.translations FOR ALL
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 9.6 site_settings policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    USING (key IN ('business_info', 'branding', 'homepage_config', 'social_links', 'seo_settings'));

DROP POLICY IF EXISTS "Service role full access on site_settings" ON public.site_settings;
CREATE POLICY "Service role full access on site_settings"
    ON public.site_settings FOR ALL
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 9.7 admin_users policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Service role full access on admin_users" ON public.admin_users;
CREATE POLICY "Service role full access on admin_users"
    ON public.admin_users FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- 10. STORAGE BUCKET: chintamani_uploads
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('chintamani_uploads', 'chintamani_uploads', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public view on chintamani_uploads" ON storage.objects;
CREATE POLICY "Public view on chintamani_uploads"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'chintamani_uploads');

DROP POLICY IF EXISTS "Service role full access on chintamani_uploads" ON storage.objects;
CREATE POLICY "Service role full access on chintamani_uploads"
    ON storage.objects FOR ALL
    USING (bucket_id = 'chintamani_uploads')
    WITH CHECK (bucket_id = 'chintamani_uploads');
