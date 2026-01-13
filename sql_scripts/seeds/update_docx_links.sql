-- Script to update Course PDF links to the new Word Documents (.docx)
-- Run this in Supabase SQL Editor

-- 1. Curso Básico de Formação (CBF)
UPDATE public.courses
SET pdf_url = '/pdfs/CURSO%20DE%20FORMA%C3%87%C3%83O%20CBF.docx'
WHERE id = 'cbf';

-- 2. Curso de Aperfeiçoamento (CAPE)
UPDATE public.courses
SET pdf_url = '/pdfs/CURSO%20DE%20APERFEI%C3%87OAMENTO%20CAPE.docx'
WHERE id = 'cape';

-- 3. Curso de Liderança
UPDATE public.courses
SET pdf_url = '/pdfs/Curso%20de%20Lideran%C3%A7a%20CDL.docx'
WHERE id = 'lideranca';

-- 4. Curso de Oficial
UPDATE public.courses
SET pdf_url = '/pdfs/Curso%20de%20Oficial%20-%20CDO.docx'
WHERE id = 'oficial';

-- 5. Alto Comando
UPDATE public.courses
SET pdf_url = '/pdfs/Curso%20de%20Alto%20Comando%20-%20CDAC.docx'
WHERE id = 'alto_comando';

-- 6. SWAT (Existing Update)
UPDATE public.courses
SET pdf_url = '/pdfs/Curso%20de%20A%C3%A7%C3%B5es%20T%C3%A1ticas%20e%20CQB%20%E2%80%93%20SWAT.docx'
WHERE id = 'swat';

-- 7. Manual de Estudo (Recruta) - Atualizando tabela study_materials se existir
UPDATE public.study_materials
SET pdf_url = '/pdfs/MANUAL%20DE%20ESTUDO%20POLICIA%20ASTRO.docx'
WHERE titulo ILIKE '%Recruta%';

-- 8. Código Penal (Confirming link is PDF or Docx)
-- Assuming the file "Código Penal Astro Roleplay (1).pdf" is the target
UPDATE public.study_materials
SET pdf_url = '/pdfs/C%C3%B3digo%20Penal%20Astro%20Roleplay%20(1).pdf'
WHERE titulo ILIKE '%Penal%';
