-- 🚨 FIX BANNER IMAGE SCRIPT 🚨
-- Updates the banner configuration to include the correct image URL.

UPDATE public.app_settings
SET value = jsonb_set(
    value,
    '{gifUrl}',
    '"/img/banner_terrestre.png"'
)
WHERE key = 'banner_home';
