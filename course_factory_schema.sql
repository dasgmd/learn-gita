-- Sopanas (Lessons) Table for Course Factory
create table if not exists public.sopanas (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  reading_text text not null,
  revision_notes jsonb not null, -- Array of strings
  quiz jsonb not null, -- Array of QuizQuestion objects
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for Sopanas
alter table public.sopanas enable row level security;

-- Allow everyone to read (for students)
create policy "Sopanas are viewable by everyone" on public.sopanas
  for select using (true);

-- Only authenticated admins should be able to insert/update/delete
-- Since we don't have a complex role system yet, we'll allow authenticated users for now, 
-- but in production, this should be restricted to admin roles.
create policy "Authenticated users can manage sopanas" on public.sopanas
  for all using (auth.role() = 'authenticated');

-- Storage Bucket for Course Assets (PDFs)
insert into storage.buckets (id, name, public) 
values ('course-assets', 'course-assets', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Public Access" on storage.objects for select using (bucket_id = 'course-assets');
create policy "Authenticated Uploads" on storage.objects for insert with check (bucket_id = 'course-assets' AND auth.role() = 'authenticated');
