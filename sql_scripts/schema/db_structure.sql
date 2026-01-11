-- 🚨 FULL SITE MIGRATION SCRIPT 🚨
-- This script creates tables for Study Materials AND App Settings (Banner, Recruitment Info)

-- 1. Study Materials Table
DROP TABLE IF EXISTS public.study_materials;
CREATE TABLE public.study_materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    pdf_url TEXT NOT NULL,
    ordem INTEGER DEFAULT 0
);

ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Materials" ON public.study_materials FOR SELECT USING (true);
CREATE POLICY "Auth Edit Materials" ON public.study_materials FOR ALL USING (auth.role() = 'authenticated');

-- Seed Study Materials
INSERT INTO public.study_materials (titulo, descricao, pdf_url, ordem)
VALUES
('Manual do Recruta v2.0', 'Leitura obrigatória para o exame de admissão.', '/pdfs/manual-recruta.pdf', 1),
('Código Penal de AstroRP', 'Guia de leis e infrações da cidade.', '/pdfs/codigo-penal.pdf', 2);


-- 2. App Settings Table (Key-Value Store for Singleton Data)
DROP TABLE IF EXISTS public.app_settings;
CREATE TABLE public.app_settings (
    key TEXT PRIMARY KEY, -- e.g., 'banner_home', 'recruitment_info'
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Settings" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Auth Edit Settings" ON public.app_settings FOR ALL USING (auth.role() = 'authenticated');

-- Seed Banner Data
INSERT INTO public.app_settings (key, value)
VALUES (
    'banner_home', 
    '{
        "status": "aberto",
        "titulo": "INSCRIÇÕES ABERTAS",
        "subtitulo": "Venha fazer parte da elite da Astro Police. Sua jornada começa aqui.",
        "linkDiscord": "https://discord.gg/seu-servidor"
    }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- Seed Recruitment Info
INSERT INTO public.app_settings (key, value)
VALUES (
    'recrutamento_info',
    '{
        "descricao": "Detalhes sobre o recrutamento presencial",
        "local": "Departamento de Polícia de AstroRP (DP Central)",
        "hora": "Todos os dias às 19:00",
        "fotoMasculino": "https://placehold.co/300x400/1a1a1a/00d9ff?text=Farda+Masc",
        "fotoFeminino": "https://placehold.co/300x400/1a1a1a/ff00d9?text=Farda+Fem",
        "requisitos": [
            "Ter mais de 18 anos",
            "Não possuir antecedentes criminais",
            "Possuir carteira de motorista válida",
            "Comprometimento com a hierarquia e disciplina"
        ]
    }'::jsonb
) ON CONFLICT (key) DO NOTHING;
