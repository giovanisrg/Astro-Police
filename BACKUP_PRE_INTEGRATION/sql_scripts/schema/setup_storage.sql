-- 1. Create a public storage bucket named 'astro_assets'
INSERT INTO storage.buckets (id, name, public)
VALUES ('astro_assets', 'astro_assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to ensure clean state (optional but good for re-running)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;

-- 3. Policy: Public can view any file (Images, PDFs)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'astro_assets' );

-- 4. Policy: Logged in users (Instructors) can Upload, Update, Delete
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'astro_assets' AND auth.role() = 'authenticated' );

CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'astro_assets' AND auth.role() = 'authenticated' );

CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'astro_assets' AND auth.role() = 'authenticated' );

-- INSTRUCTIONS:
-- 1. Run this script in Supabase SQL Editor.
-- 2. Go to 'Storage' in the left menu.
-- 3. You will see 'astro_assets'.
-- 4. Create folders like 'fardamentos' and 'pdfs'.
-- 5. Upload your files there.
-- 6. Click 'Get Public URL' on the file and paste it into the Astro Police site.
