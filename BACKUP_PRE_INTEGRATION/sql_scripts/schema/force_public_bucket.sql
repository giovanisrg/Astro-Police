-- Force the astro_assets bucket to be public
-- This removes the need to find the button in the UI

UPDATE storage.buckets
SET public = true
WHERE id = 'astro_assets';

-- Ensure policies are correct again just in case
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'astro_assets' );
