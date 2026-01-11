-- Create the courses table
CREATE TABLE public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    modulos TEXT[] DEFAULT '{}',
    carga_horaria TEXT DEFAULT '100h',
    pdf_url TEXT DEFAULT '#',
    min_level INTEGER DEFAULT 0,
    progressao TEXT DEFAULT '',
    -- Type discrimination
    tipo TEXT DEFAULT 'obrigatorio', -- 'obrigatorio' or 'guarnicao'
    guarnicao_tag TEXT, -- 'GRA', 'SWAT', 'GTM', 'SPEED' or NULL
    
    -- Optional: Add banner or icon if needed later
    icon_url TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Policy 1: Everyone can READ courses (Public access)
CREATE POLICY "Public Read Access" 
ON public.courses FOR SELECT 
USING (true);

-- Policy 2: Only authenticated/authorized users can INSERT/UPDATE/DELETE
-- For simplicity in this project (as requested), we might allow any authenticated user 
-- or specifically users with the 'geral' instructor role if we had that mapped in Auth.
-- Since the frontend checks for 'instructorType', we trust the API to be open to authenticated users
-- BUT to be safer, let's allow public write for now or check a specific role if possible.
-- Given the current setup relies on Discord Roles on the frontend, Supabase might not know the roles.
-- Strategy: Allow ALL ops for now (since it's a closed tool mostly) or Public.
-- Recommending: Public Write for development speed as per user "fast" style, or strictly authenticated.

-- Let's go with Public Write for now to avoid permission issues during the simplified migration, 
-- BUT we strongly advise adding Auth checks later.
-- EDIT: Actually, the site uses `useAuth`. If the user is logged in, they have a JWT.
-- Let's allow "Authenticated" users to Write.

CREATE POLICY "Authenticated Users Can Modify" 
ON public.courses FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
