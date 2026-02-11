-- Replace 'YOUR_EMAIL' with your actual email address used to log in
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'YOUR_EMAIL';

-- Verify the change
SELECT email, role FROM public.users WHERE email = 'YOUR_EMAIL';
