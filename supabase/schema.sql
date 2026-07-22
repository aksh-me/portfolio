-- ==========================================
-- AKSH PATEL PORTFOLIO - SUPABASE DATABASE SCHEMA
-- Execute this SQL in the Supabase SQL Editor
-- ==========================================

-- 1. Create content storage table
CREATE TABLE IF NOT EXISTS public.portfolio_content (
    section TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Grant Table Permissions to Supabase Roles
GRANT ALL ON TABLE public.portfolio_content TO authenticated;
GRANT SELECT ON TABLE public.portfolio_content TO anon;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Anyone can read content
DROP POLICY IF EXISTS "Public Read Access" ON public.portfolio_content;
CREATE POLICY "Public Read Access"
    ON public.portfolio_content
    FOR SELECT
    USING (true);

-- 5. RLS Policy: Only authenticated admin users can modify content
DROP POLICY IF EXISTS "Admin Write Access" ON public.portfolio_content;
CREATE POLICY "Admin Write Access"
    ON public.portfolio_content
    FOR ALL
    USING (auth.uid() IS NOT NULL);

-- 6. Trigger for updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_portfolio_content_modtime ON public.portfolio_content;
CREATE TRIGGER update_portfolio_content_modtime
    BEFORE UPDATE ON public.portfolio_content
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- ==========================================
-- STORAGE BUCKET SETUP (For Photo Uploads)
-- ==========================================

-- Create storage bucket for uploaded media
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Public Read Access
DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'portfolio-media');

-- Storage Policy: Authenticated Admin Upload Access
DROP POLICY IF EXISTS "Admin Storage Upload" ON storage.objects;
CREATE POLICY "Admin Storage Upload"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'portfolio-media' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin Storage Update Delete" ON storage.objects;
CREATE POLICY "Admin Storage Update Delete"
    ON storage.objects
    FOR ALL
    USING (bucket_id = 'portfolio-media' AND auth.uid() IS NOT NULL);
