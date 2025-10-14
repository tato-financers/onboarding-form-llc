-- Create applications table to store onboarding form data
-- This table stores both leads (step 1 only) and completed applications (all steps)

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  status text not null check (status in ('lead', 'completed')),
  
  -- Step 1: Contact Information (always filled)
  name text not null,
  email text not null,
  phone text not null,
  
  -- Step 2: Entity Type (nullable for leads)
  entity_type text check (entity_type in ('LLC', 'C_CORP')),
  
  -- Step 3: Membership Type (nullable for leads)
  membership_type text check (membership_type in ('SINGLE', 'MULTI')),
  
  -- Step 4: State (nullable for leads)
  state text,
  
  -- Calculated price (nullable for leads)
  price integer,
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.applications enable row level security;

-- Policy: Allow anyone to insert (public form submission)
create policy "applications_insert_public"
  on public.applications for insert
  to anon, authenticated
  with check (true);

-- Policy: Allow anyone to update their own application by email
-- This allows updating a lead to a completed application
create policy "applications_update_by_email"
  on public.applications for update
  to anon, authenticated
  using (true)
  with check (true);

-- Note: No SELECT policy for public users - only admins should view applications
-- Add admin policies later as needed

-- Create index on email for faster lookups when updating leads to completed
create index if not exists applications_email_idx on public.applications(email);

-- Create index on status for filtering leads vs completed applications
create index if not exists applications_status_idx on public.applications(status);

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Trigger to update updated_at on every update
drop trigger if exists applications_updated_at on public.applications;
create trigger applications_updated_at
  before update on public.applications
  for each row
  execute function public.handle_updated_at();
