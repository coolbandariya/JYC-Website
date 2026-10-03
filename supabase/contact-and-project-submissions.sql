-- JYC public inbox hardening
-- Apply after the existing JYC production schema.
-- Both tables accept public submissions but never expose submission rows publicly.

create table if not exists public.jyc_contact_submissions(
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  email text not null check (char_length(trim(email)) between 5 and 320),
  message text not null check (char_length(trim(message)) between 5 and 5000),
  source text not null default 'public-contact',
  status text not null default 'new' check (status in ('new','read','resolved','spam')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null
);
alter table public.jyc_contact_submissions enable row level security;

drop policy if exists "Public can submit contact messages" on public.jyc_contact_submissions;
-- Public contact writes are accepted only through the public-submission Edge Function.
revoke insert on public.jyc_contact_submissions from anon, authenticated;

drop policy if exists "Admins can read contact messages" on public.jyc_contact_submissions;
create policy "Admins can read contact messages"
on public.jyc_contact_submissions for select
to authenticated
using (exists(
  select 1 from public.jyc_admins a
  where a.user_id=auth.uid() and a.is_active=true
));

drop policy if exists "Admins can update contact messages" on public.jyc_contact_submissions;
create policy "Admins can update contact messages"
on public.jyc_contact_submissions for update
to authenticated
using (exists(
  select 1 from public.jyc_admins a
  where a.user_id=auth.uid() and a.is_active=true
))
with check (exists(
  select 1 from public.jyc_admins a
  where a.user_id=auth.uid() and a.is_active=true
));

create index if not exists jyc_contact_submissions_created_idx
on public.jyc_contact_submissions(created_at desc);

create table if not exists public.jyc_project_submissions(
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 160),
  description text not null check (char_length(trim(description)) between 10 and 5000),
  link text check (link is null or link ~* '^https?://'),
  submitter_name text not null check (char_length(trim(submitter_name)) between 2 and 120),
  submitter_email text not null check (char_length(trim(submitter_email)) between 5 and 320),
  club_name text,
  status text not null default 'submitted' check (status in ('submitted','under_review','changes_requested','approved','rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null
);
alter table public.jyc_project_submissions enable row level security;

drop policy if exists "Public can submit projects" on public.jyc_project_submissions;
-- Public project writes are accepted only through the public-submission Edge Function.
revoke insert on public.jyc_project_submissions from anon, authenticated;

drop policy if exists "Admins can read project submissions" on public.jyc_project_submissions;
create policy "Admins can read project submissions"
on public.jyc_project_submissions for select
to authenticated
using (exists(
  select 1 from public.jyc_admins a
  where a.user_id=auth.uid() and a.is_active=true
));

drop policy if exists "Admins can update project submissions" on public.jyc_project_submissions;
create policy "Admins can update project submissions"
on public.jyc_project_submissions for update
to authenticated
using (exists(
  select 1 from public.jyc_admins a
  where a.user_id=auth.uid() and a.is_active=true
))
with check (exists(
  select 1 from public.jyc_admins a
  where a.user_id=auth.uid() and a.is_active=true
));

create index if not exists jyc_project_submissions_created_idx
on public.jyc_project_submissions(created_at desc);
