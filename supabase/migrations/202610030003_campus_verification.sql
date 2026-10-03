-- JYC campus + content verification foundation.
begin;
create table if not exists public.jyc_campuses (
  id text primary key,
  name text not null,
  short_name text not null unique,
  city text not null default 'Noida',
  state text not null default 'Uttar Pradesh',
  country text not null default 'India',
  address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
insert into public.jyc_campuses(id,name,short_name,address)
values
 ('sector-128','JIIT Wish Town Campus','128','Sector-128, Jaypee Wish Town Village, Sultanpur, Noida-201304, Uttar Pradesh, India'),
 ('sector-62','JIIT Sector 62 Campus','62','Sector-62, Noida, Uttar Pradesh, India')
on conflict(id) do update set name=excluded.name,address=excluded.address,updated_at=now();

create table if not exists public.jyc_content_verification (
  id bigint generated always as identity primary key,
  entity_type text not null check (entity_type in ('club','event','person','announcement','gallery','achievement','recruitment')),
  entity_id text not null,
  campus_id text references public.jyc_campuses(id),
  status text not null default 'draft' check (status in ('draft','review','verified','published','archived')),
  source_url text,
  source_type text,
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  expires_at timestamptz,
  last_updated_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  unique(entity_type,entity_id)
);
alter table public.jyc_campuses enable row level security;
alter table public.jyc_content_verification enable row level security;
drop policy if exists "Public can read active campuses" on public.jyc_campuses;
create policy "Public can read active campuses" on public.jyc_campuses for select to anon,authenticated using(is_active=true);
drop policy if exists "Admins can read content verification" on public.jyc_content_verification;
create policy "Admins can read content verification" on public.jyc_content_verification for select to authenticated using(exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true));
drop policy if exists "Admins can write content verification" on public.jyc_content_verification;
create policy "Admins can write content verification" on public.jyc_content_verification for all to authenticated using(exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true)) with check(exists(select 1 from public.jyc_admins a where a.user_id=auth.uid() and a.is_active=true));
create index if not exists jyc_content_verification_status_idx on public.jyc_content_verification(status,entity_type);
create index if not exists jyc_content_verification_campus_idx on public.jyc_content_verification(campus_id);
commit;
select 'JYC campus and verification foundation complete.' as result;
