-- 1. Create the table for banner settings
CREATE TABLE IF NOT EXISTS banner_settings (
  id bigint PRIMARY KEY DEFAULT 1,
  status text NOT NULL DEFAULT 'aberto',
  titulo text NOT NULL DEFAULT 'INSCRIÇÕES ABERTAS',
  subtitulo text NOT NULL DEFAULT 'Venha fazer parte da elite da Astro Police. Sua jornada começa aqui.',
  image_url text DEFAULT 'https://media.discordapp.net/attachments/1321268686230421545/1324706509494976583/astro_banner.gif?ex=677876a3&is=67772523&hm=6a8ec215d5d8985af2c27b0c345339f4039867946917688c221199a07153da6c&',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT banner_settings_id_check CHECK (id = 1)
);

-- 2. Insert the initial default row (singleton)
INSERT INTO banner_settings (id, status, titulo, subtitulo, image_url)
VALUES (1, 'aberto', 'INSCRIÇÕES ABERTAS', 'Venha fazer parte da elite da Astro Police. Sua jornada começa aqui.', 'https://media.discordapp.net/attachments/1321268686230421545/1324706509494976583/astro_banner.gif?ex=677876a3&is=67772523&hm=6a8ec215d5d8985af2c27b0c345339f4039867946917688c221199a07153da6c&')
ON CONFLICT (id) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  subtitulo = EXCLUDED.subtitulo;

-- 3. Enable RLS (Security)
ALTER TABLE banner_settings ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
CREATE POLICY "Public Read Banner" ON banner_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated Update Banner" ON banner_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 5. Enable Realtime
alter publication supabase_realtime add table banner_settings;
