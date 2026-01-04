-- 🚨 FIX BANNER SCRIPT 🚨
-- Run this to force the banner back to default "Open" state.

DELETE FROM public.app_settings WHERE key = 'banner_home';

INSERT INTO public.app_settings (key, value)
VALUES (
    'banner_home', 
    '{
        "status": "aberto",
        "titulo": "INSCRIÇÕES ABERTAS",
        "subtitulo": "Venha fazer parte da elite da Astro Police. Sua jornada começa aqui.",
        "linkDiscord": "https://discord.gg/seu-servidor",
        "gifUrl": "" 
    }'::jsonb
);
