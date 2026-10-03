-- JYC V16: functional campus map + public project submissions
-- Safe to re-run.

create extension if not exists pgcrypto;

create table if not exists public.jyc_project_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 160),
  description text not null check (char_length(trim(description)) between 10 and 4000),
  link text,
  club_name text,
  submitter_name text not null check (char_length(trim(submitter_name)) between 2 and 120),
  submitter_email text not null check (position('@' in submitter_email) > 1),
  status text not null default 'submitted' check (status in ('submitted','under_review','changes_requested','approved','rejected')),
  reviewer_id uuid references auth.users(id) on delete set null,
  review_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists jyc_project_submissions_status_idx on public.jyc_project_submissions(status,created_at desc);
create index if not exists jyc_project_submissions_created_idx on public.jyc_project_submissions(created_at desc);

alter table public.jyc_project_submissions enable row level security;

drop policy if exists "public submit projects" on public.jyc_project_submissions;
-- Public project writes are accepted only through the public-submission Edge Function.
revoke insert on public.jyc_project_submissions from anon, authenticated;

drop policy if exists "admins read project submissions" on public.jyc_project_submissions;
create policy "admins read project submissions"
on public.jyc_project_submissions for select to authenticated
using (exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true));

drop policy if exists "admins update project submissions" on public.jyc_project_submissions;
create policy "admins update project submissions"
on public.jyc_project_submissions for update to authenticated
using (exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true))
with check (exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true));

select 'JYC V16 campus/projects migration applied.' as result;
