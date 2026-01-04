-- 🚨 UPDATE GRA MANUAL LINK 🚨
-- Points the GRA course directly to the new HTML manual.

UPDATE public.courses
SET pdf_url = '/gra_manual.html'
WHERE id = 'gra';
