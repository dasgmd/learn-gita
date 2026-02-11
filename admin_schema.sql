-- ==========================================
-- ADMIN SCHEMA REPAIR (FINAL VERSION)
-- FIXES INFINITE RECURSION
-- ==========================================

-- 1. Create a Helper Function to check admin status safely (Security Definer)
-- This function runs with the privileges of the creator (bypass RLS) 
-- to check roles without causing recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'email' = 'gmd@learngita.com'
    OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Ensure admin column and constraint
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN 
    ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'user'; 
  END IF; 
END $$;

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));


-- 3. DROP ALL EXISTING POLICIES to start clean
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can update user roles" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Super-admins can view all" ON public.users;
DROP POLICY IF EXISTS "Admins can view all" ON public.users;
DROP POLICY IF EXISTS "Admins can view all sadhna logs" ON public.sadhna_logs;
DROP POLICY IF EXISTS "Admins can manage festivals" ON public.festivals;
DROP POLICY IF EXISTS "Admins can manage festival tasks" ON public.festival_tasks;


-- 4. Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sadhna_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.festival_tasks ENABLE ROW LEVEL SECURITY;


-- === NEW SAFE POLICIES USING is_admin() ===

-- USERS Table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update user roles" ON public.users
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- SADHNA LOGS Table
CREATE POLICY "Admins can view all sadhna logs" ON public.sadhna_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can view own sadhna logs" ON public.sadhna_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sadhna logs" ON public.sadhna_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sadhna logs" ON public.sadhna_logs
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- FESTIVALS Table
CREATE POLICY "Admins can manage festivals" ON public.festivals
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- FESTIVAL TASKS Table
CREATE POLICY "Admins can manage festival tasks" ON public.festival_tasks
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());
