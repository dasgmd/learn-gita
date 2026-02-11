-- Festivals Table
create table if not exists public.festivals (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  date date not null,
  description text,
  significance text,
  fast_type text default 'None', -- e.g., 'No Grains', 'Water Only', 'None'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Festival Tasks (Seva) Table
create table if not exists public.festival_tasks (
  id uuid default gen_random_uuid() primary key,
  festival_id uuid references public.festivals(id) on delete cascade not null,
  task_description text not null,
  point_value integer default 10 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Festival Completions Table
create table if not exists public.user_festival_completions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  task_id uuid references public.festival_tasks(id) on delete cascade not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, task_id)
);

-- RLS Policies
alter table public.festivals enable row level security;
create policy "Festivals are viewable by everyone" on public.festivals for select using (true);

alter table public.festival_tasks enable row level security;
create policy "Festival tasks are viewable by everyone" on public.festival_tasks for select using (true);

alter table public.user_festival_completions enable row level security;
create policy "Users can view their own completions" on public.user_festival_completions for select using (auth.uid() = user_id);
create policy "Users can insert their own completions" on public.user_festival_completions for insert with check (auth.uid() = user_id);
