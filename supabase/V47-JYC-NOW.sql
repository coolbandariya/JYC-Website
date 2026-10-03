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
