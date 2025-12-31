-- 1. Create the table for banner settings
CREATE TABLE IF NOT EXISTS banner_settings (
  id bigint PRIMARY KEY DEFAULT 1,
  status text NOT NULL DEFAULT 'aberto',
  titulo text NOT NULL DEFAULT 'RECRUTAMENTO ABERTO',
  subtitulo text NOT NULL DEFAULT 'Junte-se à elite da segurança espacial.',
  image_url text DEFAULT 'https://media.discordapp.net/attachments/1321268686230421545/1324706509494976583/astro_banner.gif?ex=677876a3&is=67772523&hm=6a8ec215d5d8985af2c27b0c345339f4039867946917688c221199a07153da6c&',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT banner_settings_id_check CHECK (id = 1) -- Ensure only one row exists
);

-- 2. Insert the initial default row (singleton)
INSERT INTO banner_settings (id, status, titulo, subtitulo, image_url)
VALUES (1, 'aberto', 'RECRUTAMENTO ABERTO', 'Junte-se à elite da segurança espacial.', 'https://media.discordapp.net/attachments/1321268686230421545/1324706509494976583/astro_banner.gif?ex=677876a3&is=67772523&hm=6a8ec215d5d8985af2c27b0c345339f4039867946917688c221199a07153da6c&')
ON CONFLICT (id) DO NOTHING;

-- 3. Enable RLS (Security)
ALTER TABLE banner_settings ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies

-- Policy: Everyone can READ the banner settings (Public)
CREATE POLICY "Public Read Banner"
ON banner_settings FOR SELECT
TO anon, authenticated
USING (true);

-- Policy: Only Authenticated users can UPDATE (Ideally restricted to Admins, but frontend handles UI)
CREATE POLICY "Authenticated Update Banner"
ON banner_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Enable Realtime for this table (Critical for sync)
alter publication supabase_realtime add table banner_settings;
