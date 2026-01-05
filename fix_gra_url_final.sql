-- FORCE UPDATE for GRA Course PDF URL
-- This script updates ANY course containing "GRA" or "Resgate" in the title
-- setting the pdf_url to the new dynamic manual route.

UPDATE public.courses
SET pdf_url = '/manual/gra'
WHERE nome ILIKE '%GRA%' OR nome ILIKE '%Resgate%';

-- Verify the update
SELECT id, nome, pdf_url FROM public.courses WHERE nome ILIKE '%GRA%';
