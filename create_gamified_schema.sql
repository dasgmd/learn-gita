-- Courses Table
-- Courses Table (Ensure columns exist individually)
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='courses' and column_name='title') then
    alter table public.courses add column title text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name='courses' and column_name='slug') then
    alter table public.courses add column slug text unique;
  end if;

  if not exists (select 1 from information_schema.columns where table_name='courses' and column_name='description') then
    alter table public.courses add column description text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name='courses' and column_name='level') then
    alter table public.courses add column level text default 'Beginner';
  end if;

  if not exists (select 1 from information_schema.columns where table_name='courses' and column_name='duration') then
    alter table public.courses add column duration text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name='courses' and column_name='cover_image') then
    alter table public.courses add column cover_image text;
  end if;
end $$;

-- Enrollments Table
create table if not exists public.enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

-- User Sopana Progress Table
create table if not exists public.user_sopana_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  sopana_id uuid references public.sopanas(id) on delete cascade not null,
  status text check (status in ('locked', 'unlocked', 'completed')) default 'unlocked',
  score integer default 0, -- Percentage score from quiz
  completed_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, sopana_id)
);

-- RLS Policies
alter table public.courses enable row level security;
create policy "Courses are viewable by everyone" on public.courses for select using (true);
create policy "Admins can manage courses" on public.courses for all using (auth.role() = 'authenticated'); -- Ideally restricted to admin

alter table public.enrollments enable row level security;
create policy "Users can view their own enrollments" on public.enrollments for select using (auth.uid() = user_id);
create policy "Users can enroll themselves" on public.enrollments for insert with check (auth.uid() = user_id);

alter table public.user_sopana_progress enable row level security;
create policy "Users can view their own progress" on public.user_sopana_progress for select using (auth.uid() = user_id);
create policy "Users can update their own progress" on public.user_sopana_progress for all using (auth.uid() = user_id);

-- Seed 'Message of Godhead' Course
insert into public.courses (title, slug, description, level, duration, cover_image)
values (
  'Message of Godhead',
  'Message of Godhead',
  'Embark on a divine journey to understand the essence of Vedic wisdom. This course breaks down deep philosophical concepts into bite-sized, interactive lessons.',
  'Beginner',
  '4 Hours',
  'https://m.media-amazon.com/images/I/71w8e+kDkRL._AC_UF1000,1000_QL80_.jpg' -- Placeholder or actual URL
)
on conflict (slug) do nothing;
