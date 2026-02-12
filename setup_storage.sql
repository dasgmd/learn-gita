-- CLEAN SETUP SCRIPT FOR LEERNGITA STORAGE AND DATABASE
-- Run this in your Supabase SQL Editor

-- 1. STORAGE BUCKET SETUP
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('course-assets', 'course-assets', true, 52428800, '{"application/pdf"}')
ON CONFLICT (id) DO NOTHING;

-- 2. STORAGE POLICIES
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Deletes" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'course-assets' );
CREATE POLICY "Authenticated Uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'course-assets' );
CREATE POLICY "Authenticated Deletes" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'course-assets' );

-- 3. DATABASE TABLE SETUP
-- We drop and recreate to ensure a clean state
DROP TABLE IF EXISTS public.sopanas;

-- 3. Create or Update the Sopanas table
CREATE TABLE IF NOT EXISTS public.sopanas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_name TEXT NOT NULL DEFAULT 'Uncategorized',
    book_order INTEGER DEFAULT 0,
    title TEXT NOT NULL,
    reading_text TEXT NOT NULL,
    revision_notes TEXT[] DEFAULT '{}',
    quiz JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure columns exist if table was created in an older version
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sopanas' AND column_name='book_name') THEN
        ALTER TABLE public.sopanas ADD COLUMN book_name TEXT NOT NULL DEFAULT 'Uncategorized';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sopanas' AND column_name='book_order') THEN
        ALTER TABLE public.sopanas ADD COLUMN book_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- 4. PERMISSIONS & SECURITY
-- Explicitly grant access to the table
GRANT ALL ON TABLE public.sopanas TO postgres, anon, authenticated, service_role;

ALTER TABLE public.sopanas ENABLE ROW LEVEL SECURITY;

-- 5. TABLE POLICIES
CREATE POLICY "Public Read" ON public.sopanas FOR SELECT USING ( true );
CREATE POLICY "Authenticated Insert" ON public.sopanas FOR INSERT TO authenticated WITH CHECK ( true );
CREATE POLICY "Authenticated Manage" ON public.sopanas FOR ALL TO authenticated USING ( true );

-- 6. FORCE SCHEMA REFRESH (Crucial for fixing PGRST205)
NOTIFY pgrst, 'reload schema';
