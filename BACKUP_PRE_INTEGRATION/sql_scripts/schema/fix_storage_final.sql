-- 🔥 SUPER FIX STORAGE PERMISSIONS 🔥
-- Run this in Supabase SQL Editor

-- 1. Force Public Bucket
UPDATE storage.buckets SET public = true WHERE id = 'astro_assets';

-- 2. Drop ALL existing policies for this bucket to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Give me access" ON storage.objects;

-- 3. Create a SIMPLE "Allow All Reads" policy
CREATE POLICY "Public Read All"
ON storage.objects FOR SELECT
USING ( bucket_id = 'astro_assets' );

-- 4. Create a SIMPLE "Allow All Uploads" (Authenticated) policy
CREATE POLICY "Auth Insert"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'astro_assets' AND auth.role() = 'authenticated' );

-- 5. Create a SIMPLE "Allow All Updates" (Authenticated) policy
CREATE POLICY "Auth Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'astro_assets' AND auth.role() = 'authenticated' );

-- 6. Create a SIMPLE "Allow All Deletes" (Authenticated) policy
CREATE POLICY "Auth Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'astro_assets' AND auth.role() = 'authenticated' );
