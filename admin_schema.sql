-- Add role column to users table safety
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name = 'users' and column_name = 'role') then 
    alter table public.users add column role text default 'user'; 
  end if; 
end $$;

-- Drop constraint if exists to avoid 'already exists' errors
alter table public.users drop constraint if exists users_role_check;
-- Add constraint
alter table public.users add constraint users_role_check check (role in ('user', 'admin'));


-- === Drop existing policies to allow clean recreation ===

drop policy if exists "Admins can view all profiles" on public.users;
drop policy if exists "Admins can update user roles" on public.users;
drop policy if exists "Admins can view all sadhna logs" on public.sadhna_logs;
drop policy if exists "Admins can manage festivals" on public.festivals;
drop policy if exists "Admins can manage festival tasks" on public.festival_tasks;


-- === Create Policies ===

-- 1. View Profiles (users table)
create policy "Admins can view all profiles" on public.users
  for select using (
    email = 'gmd@learngita.com' 
    or (select role from public.users where id = auth.uid()) = 'admin'
  );

-- 2. Update Roles (users table)
create policy "Admins can update user roles" on public.users
  for update using (
    email = 'gmd@learngita.com' 
    or (select role from public.users where id = auth.uid()) = 'admin'
  );

-- 3. View Sadhna Logs
create policy "Admins can view all sadhna logs" on public.sadhna_logs
  for select using (
    (select role from public.users where id = auth.uid()) = 'admin'
    or (select email from public.users where id = auth.uid()) = 'gmd@learngita.com'
  );

-- 4. Manage Festivals (festivals table)
create policy "Admins can manage festivals" on public.festivals
  for all using (
    (select role from public.users where id = auth.uid()) = 'admin'
    or (select email from public.users where id = auth.uid()) = 'gmd@learngita.com'
  );

-- 5. Manage Tasks (festival_tasks table)
create policy "Admins can manage festival tasks" on public.festival_tasks
  for all using (
    (select role from public.users where id = auth.uid()) = 'admin'
    or (select email from public.users where id = auth.uid()) = 'gmd@learngita.com'
  );
