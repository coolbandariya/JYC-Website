-- V47 · JYC NOW content aggregation
-- Apply after the existing production bootstrap. Secrets stay server-side.
create table if not exists public.content_sources (
 id uuid primary key default gen_random_uuid(),
 hub_name text not null,
 platform text not null,
 label text not null,
 url text not null,
 handle text,
 source_type text not null default 'social',
 verified boolean not null default false,
 active boolean not null default true,
 verified_by text,
 verified_at timestamptz,
 last_checked_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique (hub_name, platform, url)
);
create table if not exists public.aggregated_posts (
 id uuid primary key default gen_random_uuid(),
 source_id uuid references public.content_sources(id) on delete set null,
 external_id text not null unique,
 hub_name text not null,
 platform text not null,
 title text not null,
 summary text not null default '',
 caption text not null default '',
 image_url text not null default '',
 thumbnail_url text not null default '',
 post_url text not null,
 published_at timestamptz,
 content_type text not null default 'Update',
 category text,
 verified boolean not null default false,
 published boolean not null default false,
 is_featured boolean not null default false,
 is_editor_pick boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.aggregation_runs (
 id uuid primary key default gen_random_uuid(),
 source_id uuid references public.content_sources(id) on delete set null,
 started_at timestamptz not null default now(),
 completed_at timestamptz,
 status text not null default 'running',
 items_found integer not null default 0,
 error text
);
create index if not exists aggregated_posts_public_feed_idx on public.aggregated_posts(published, published_at desc);
create index if not exists aggregated_posts_hub_idx on public.aggregated_posts(hub_name, published_at desc);
create index if not exists content_sources_active_idx on public.content_sources(active, hub_name);
alter table public.content_sources enable row level security;
alter table public.aggregated_posts enable row level security;
alter table public.aggregation_runs enable row level security;
revoke all on public.content_sources from anon, authenticated;
revoke all on public.aggregated_posts from anon, authenticated;
revoke all on public.aggregation_runs from anon, authenticated;
grant select on public.content_sources to anon, authenticated;
grant select on public.aggregated_posts to anon, authenticated;
grant all on public.content_sources, public.aggregated_posts, public.aggregation_runs to service_role;
drop policy if exists "Public can view active content sources" on public.content_sources;
create policy "Public can view active content sources" on public.content_sources
 for select to anon, authenticated using (active = true and verified = true);
drop policy if exists "Public can view published aggregated posts" on public.aggregated_posts;
create policy "Public can view published aggregated posts" on public.aggregated_posts
 for select to anon, authenticated using (published = true and verified = true);
-- aggregation_runs intentionally has no public policy; service_role is the only intended writer/reader.

-- Seed only sources already verified in the JYC public source registry.
insert into public.content_sources (hub_name, platform, label, url, handle, source_type, verified, active, verified_by, verified_at)
values
 ('JYC','Instagram','JIIT Youth Club · Instagram','https://www.instagram.com/jiityouthclub/','@jiityouthclub','social',true,true,'https://linktr.ee/jiityouthclub','2026-10-03'),
 ('JYC','LinkedIn','JIIT Youth Club · LinkedIn','https://www.linkedin.com/company/jiityouthclub/','','social',true,true,'https://www.linkedin.com/company/jiityouthclub/','2026-10-03'),
 ('VamUnique','Instagram','Vamunique · The Dance Society','https://www.instagram.com/vamunique/','@vamunique','social',true,true,'https://www.linkedin.com/company/vamunique-the-dance-society-jiit-noida/','2026-10-03'),
 ('VamUnique','LinkedIn','Vamunique · LinkedIn','https://www.linkedin.com/company/vamunique-the-dance-society-jiit-noida/','','social',true,true,'https://www.linkedin.com/company/vamunique-the-dance-society-jiit-noida/','2026-10-03'),
 ('RPH','LinkedIn','Rapid Programming Hub · LinkedIn','https://www.linkedin.com/company/rapid-programming-hub-jiit-noida/','','social',true,true,'https://in.linkedin.com/in/rapid-programming-hub-jiit-3188bb385','2026-10-03'),
 ('CICR','Instagram','CICR · Instagram','https://www.instagram.com/cicr_jiit/','@cicr_jiit','social',true,true,'https://www.linkedin.com/company/cicrjiit128/','2026-10-03'),
 ('CICR','LinkedIn','CICR · LinkedIn','https://www.linkedin.com/company/cicrjiit128/','','social',true,true,'https://www.linkedin.com/company/cicrjiit128/','2026-10-03'),
 ('CICR','Website','CICR · Official website','https://www.cicr.in/','','website',true,true,'https://www.cicr.in/','2026-10-03'),
 ('Innovation','LinkedIn','INNOVATION JIIT · LinkedIn','https://www.linkedin.com/company/innovation-jiit/','','social',true,true,'https://www.innovationjiit.in/','2026-10-03'),
 ('Innovation','Website','INNOVATION JIIT · Official website','https://www.innovationjiit.in/','','website',true,true,'https://www.innovationjiit.in/','2026-10-03'),
 ('Zencoders','Instagram','ZENCODERS · Instagram','https://www.instagram.com/zencodersjiit/','@zencodersjiit','social',true,true,'https://www.linkedin.com/company/zencoders/','2026-10-03'),
 ('Zencoders','LinkedIn','ZENCODERS · LinkedIn','https://www.linkedin.com/company/zencoders/','','social',true,true,'https://www.linkedin.com/company/zencoders/','2026-10-03'),
 ('JODC','LinkedIn','JIIT Open-Source Developers Circle','https://www.linkedin.com/company/jiit-open-source-developers-circle/','','social',true,true,'https://www.linkedin.com/company/jodc/','2026-10-03'),
 ('CypherX','Instagram','CypherX · Instagram','https://www.instagram.com/cypherx_jiit/','@cypherx_jiit','social',true,true,'https://www.linkedin.com/company/cypherx-jiit/','2026-10-03'),
 ('CypherX','LinkedIn','CypherX · LinkedIn','https://www.linkedin.com/company/cypherx-jiit/','','social',true,true,'https://www.linkedin.com/company/cypherx-jiit/','2026-10-03'),
 ('Arcadia','Instagram','Arcadia · Instagram','https://www.instagram.com/arcadia_jiit/','@arcadia_jiit','social',true,true,'all hubs 1.pdf','2026-10-04'),
 ('GDG','Instagram','GDG JIIT-128 · Instagram','https://www.instagram.com/gdg_jiit/','@gdg_jiit','social',true,true,'https://www.linkedin.com/company/dsc-jiit/','2026-10-03'),
 ('GDG','LinkedIn','GDG JIIT-128 · LinkedIn','https://www.linkedin.com/company/dsc-jiit/','','social',true,true,'https://www.linkedin.com/company/dsc-jiit/','2026-10-03'),
 ('GDG','Website','GDG JIIT-128 · Official website','https://gdg-jiit.com/','','website',true,true,'https://gdg-jiit.com/','2026-10-03'),
 ('Dronotics','Instagram','Dronotics · Instagram','https://www.instagram.com/dronoticsjiit128/','@dronoticsjiit128','social',true,true,'https://www.dronotics.in/FPV%20rulebook%20DronoWar.pdf','2026-10-03'),
 ('Dronotics','Website','Dronotics · Official website','https://www.dronotics.in/','','website',true,true,'https://www.dronotics.in/FPV%20rulebook%20DronoWar.pdf','2026-10-03'),
 ('Aura','Instagram','Aura Photography · Instagram','https://www.instagram.com/auraphotography.128/','@auraphotography.128','social',true,true,'all hubs 1.pdf','2026-10-04'),
 ('Eloquence','Instagram','Eloquence · Instagram','https://www.instagram.com/eloquencej128/','@eloquencej128','social',true,true,'https://www.linkedin.com/company/eloquence-litsoc/','2026-10-04'),
 ('Eloquence','LinkedIn','Eloquence · LinkedIn','https://www.linkedin.com/company/eloquence-litsoc/','','social',true,true,'https://www.linkedin.com/company/eloquence-litsoc/','2026-10-04')
on conflict (hub_name, platform, url) do update set active=excluded.active, verified=excluded.verified, verified_by=excluded.verified_by, verified_at=excluded.verified_at, updated_at=now();
