-- ==========================================
-- USER SYNC SETUP & BACKFILL
-- ==========================================

-- 1. Create the function that mirrors auth.users to public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', 'Seeker'),
    CASE WHEN new.email = 'gmd@learngita.com' THEN 'admin' ELSE 'user' END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = CASE 
      WHEN EXCLUDED.email = 'gmd@learngita.com' THEN 'admin' 
      ELSE public.users.role -- Preserve existing role if not super admin
    END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger to automate for future users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. BACKFILL: Sync every existing user right now
INSERT INTO public.users (id, email, name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data ->> 'name', raw_user_meta_data ->> 'full_name', 'Seeker'),
  CASE WHEN email = 'gmd@learngita.com' THEN 'admin' ELSE 'user' END
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = CASE 
    WHEN EXCLUDED.email = 'gmd@learngita.com' THEN 'admin' 
    ELSE public.users.role 
  END;

-- 4. FINAL CHECK (Run this to see if rows exist now)
SELECT count(*) as total_visible_users FROM public.users;
