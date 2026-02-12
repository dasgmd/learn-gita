-- Create a table for storing temporary course drafts
create table if not exists public.sopana_drafts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  book_name text,
  file_url text,
  sopanas jsonb not null, -- Stores the array of generated Sopanas
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.sopana_drafts enable row level security;

-- Users can only see and manage their own drafts
create policy "Users can manage their own drafts" on public.sopana_drafts
  for all using (auth.uid() = user_id);

-- Function to automatically update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_update_sopana_drafts
  before update on public.sopana_drafts
  for each row execute procedure public.handle_updated_at();
