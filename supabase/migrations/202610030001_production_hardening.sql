-- JYC production hardening migration: 2026-10-03
-- Apply after the existing bootstrap/repair SQL. Safe to re-run.
-- Goals: enforce write boundaries, isolate backups, constrain public error intake,
-- add registration abuse controls, and establish the first versioned migration.

begin;

-- ---------------------------------------------------------------------------
-- 1. jyc_site_data: clients must use the authorization-aware RPC.
-- RLS policies do not remove SQL grants, so revoke table DML explicitly.
-- ---------------------------------------------------------------------------
drop policy if exists "JYC admins can manage site data" on public.jyc_site_data;
drop policy if exists "Public can read published site data" on public.jyc_site_data;
drop policy if exists "Public can read site data" on public.jyc_site_data;
drop policy if exists "Admins can read site data" on public.jyc_site_data;

alter table public.jyc_site_data enable row level security;

create policy "Admins can read site data"
on public.jyc_site_data
for select to authenticated
using (
  exists (
    select 1
    from public.jyc_admins a
    where a.user_id = auth.uid() and a.is_active = true
  )
);

revoke insert, update, delete on public.jyc_site_data from anon, authenticated;
grant select on public.jyc_site_data to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Backups: never store database snapshots in the public media bucket.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'jyc-backups',
  'jyc-backups',
  false,
  52428800,
  array['application/json']::text[]
)
on conflict (id) do update
set public = false,
    file_size_limit = 52428800,
    allowed_mime_types = array['application/json']::text[];

-- Public media is intentionally public, but the bucket itself should enforce
-- the same basic media constraints as the application.
update storage.buckets
set file_size_limit = 8388608,
    allowed_mime_types = array['image/jpeg','image/png','image/webp']::text[]
where id = 'jyc-media';

-- ---------------------------------------------------------------------------
-- 3. Error intake: browser clients no longer insert directly.
-- The public Edge Function calls this RPC using service-role credentials.
-- ---------------------------------------------------------------------------
create table if not exists public.jyc_error_rate_limits (
  fingerprint text primary key,
  window_started_at timestamptz not null default date_trunc('minute', now()),
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.jyc_error_rate_limits enable row level security;
revoke all on public.jyc_error_rate_limits from anon, authenticated;

drop policy if exists "public submit errors" on public.jyc_error_reports;
revoke insert, update, delete on public.jyc_error_reports from anon, authenticated;

create or replace function public.jyc_ingest_error_report(
  p_fingerprint text,
  p_message text,
  p_stack text default null,
  p_path text default null,
  p_user_agent text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_fingerprint text := left(trim(coalesce(p_fingerprint,'')),128);
  v_window timestamptz := date_trunc('minute', now());
  v_count integer;
begin
  if v_fingerprint = '' then
    raise exception 'Missing error-report fingerprint';
  end if;

  if length(coalesce(p_message,'')) = 0 then
    raise exception 'Missing error-report message';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('jyc:error-report:' || v_fingerprint, 0));

  insert into public.jyc_error_rate_limits(fingerprint, window_started_at, request_count, updated_at)
  values(v_fingerprint, v_window, 1, now())
  on conflict (fingerprint) do update
    set window_started_at = case
      when public.jyc_error_rate_limits.window_started_at < v_window then v_window
      else public.jyc_error_rate_limits.window_started_at
    end,
    request_count = case
      when public.jyc_error_rate_limits.window_started_at < v_window then 1
      else public.jyc_error_rate_limits.request_count + 1
    end,
    updated_at = now();

  select request_count into v_count
  from public.jyc_error_rate_limits
  where fingerprint = v_fingerprint;

  if v_count > 20 then
    return false;
  end if;

  insert into public.jyc_error_reports(message, stack, path, user_agent, metadata)
  values (
    left(p_message, 2000),
    left(coalesce(p_stack,''), 12000),
    left(coalesce(p_path,''), 500),
    left(coalesce(p_user_agent,''), 1000),
    case
      when jsonb_typeof(coalesce(p_metadata,'{}'::jsonb)) = 'object'
        then p_metadata
      else '{}'::jsonb
    end
  );

  return true;
end;
$$;

revoke all on function public.jyc_ingest_error_report(text,text,text,text,text,jsonb) from public;
grant execute on function public.jyc_ingest_error_report(text,text,text,text,text,jsonb) to service_role;

-- ---------------------------------------------------------------------------
-- 4. Native registrations: preserve the existing transactional RPC but add
-- bounded field lengths and per-email abuse protection.
-- ---------------------------------------------------------------------------
create table if not exists public.jyc_registration_rate_limits (
  email text primary key,
  window_started_at timestamptz not null default date_trunc('minute', now()),
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.jyc_registration_rate_limits enable row level security;
revoke all on public.jyc_registration_rate_limits from anon, authenticated;

create or replace function public.jyc_register_for_event(
  p_event_id text,
  p_name text,
  p_email text,
  p_enrollment_no text default null,
  p_phone text default null,
  p_year text default null,
  p_branch text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  ev jsonb;
  existing public.jyc_event_registrations%rowtype;
  v_user_id uuid := auth.uid();
  v_email text := lower(trim(coalesce(p_email,'')));
  v_name text := trim(coalesce(p_name,''));
  v_capacity integer;
  v_waitlist boolean;
  v_deadline timestamptz;
  v_status text := 'registered';
  v_count integer;
  v_id uuid;
  v_window timestamptz := date_trunc('minute', now());
  v_rate integer;
begin
  if p_event_id is null or length(trim(p_event_id)) > 120 then
    raise exception 'Invalid event';
  end if;
  if v_name = '' or length(v_name) > 160 then raise exception 'Enter a valid name'; end if;
  if v_email = '' or length(v_email) > 320 or position('@' in v_email) < 2 then raise exception 'Enter a valid email address'; end if;
  if length(coalesce(p_enrollment_no,'')) > 80 then raise exception 'Enrollment number is too long'; end if;
  if length(coalesce(p_phone,'')) > 40 then raise exception 'Phone number is too long'; end if;
  if length(coalesce(p_year,'')) > 40 then raise exception 'Year is too long'; end if;
  if length(coalesce(p_branch,'')) > 120 then raise exception 'Branch is too long'; end if;

  perform pg_advisory_xact_lock(hashtextextended('jyc:event-registration:' || p_event_id, 0));
  perform pg_advisory_xact_lock(hashtextextended('jyc:registration-email:' || v_email, 0));

  insert into public.jyc_registration_rate_limits(email, window_started_at, request_count, updated_at)
  values(v_email, v_window, 1, now())
  on conflict (email) do update
    set window_started_at = case
      when public.jyc_registration_rate_limits.window_started_at < v_window then v_window
      else public.jyc_registration_rate_limits.window_started_at
    end,
    request_count = case
      when public.jyc_registration_rate_limits.window_started_at < v_window then 1
      else public.jyc_registration_rate_limits.request_count + 1
    end,
    updated_at = now();

  select request_count into v_rate
  from public.jyc_registration_rate_limits
  where email = v_email;

  if v_rate > 5 then
    raise exception 'Too many registration attempts. Please try again shortly.';
  end if;

  select e into ev
  from public.jyc_site_data s,
       jsonb_array_elements(coalesce(s.data->'events','[]'::jsonb)) e
  where s.id='main'
    and e->>'id'=p_event_id
    and coalesce(e->>'published','false')='true'
    and coalesce(e->>'archived','false')<>'true'
    and coalesce(e->>'registrationMode','external')='native'
  limit 1;

  if ev is null then raise exception 'This event is not accepting JYC registrations'; end if;

  if coalesce(ev->>'registrationDeadline','') <> '' then
    begin
      v_deadline := (ev->>'registrationDeadline')::timestamptz;
    exception when others then
      v_deadline := null;
    end;
    if v_deadline is not null and v_deadline <= now() then
      raise exception 'Registrations are closed for this event';
    end if;
  end if;

  select * into existing
  from public.jyc_event_registrations
  where event_id=p_event_id and lower(email)=v_email
  limit 1
  for update;

  if existing.id is not null and coalesce(existing.registration_status,'registered') <> 'cancelled' then
    raise exception 'This email is already registered for this event';
  end if;

  v_capacity := nullif(ev->>'capacity','')::integer;
  v_waitlist := coalesce((ev->>'waitlist')::boolean,false);

  if v_capacity is not null and v_capacity > 0 then
    select count(*) into v_count
    from public.jyc_event_registrations r
    where r.event_id=p_event_id
      and coalesce(r.registration_status,'registered') in ('registered','confirmed','attended');

    if v_count >= v_capacity then
      if v_waitlist then v_status := 'waitlisted';
      else raise exception 'This event has reached capacity'; end if;
    end if;
  end if;

  if existing.id is not null then
    update public.jyc_event_registrations
    set user_id=v_user_id,
        name=v_name,
        email=v_email,
        enrollment_no=nullif(trim(coalesce(p_enrollment_no,'')),''),
        phone=nullif(trim(coalesce(p_phone,'')),''),
        year=nullif(trim(coalesce(p_year,'')),''),
        branch=nullif(trim(coalesce(p_branch,'')),''),
        registration_status=v_status,
        updated_at=now()
    where id=existing.id
    returning id into v_id;
  else
    insert into public.jyc_event_registrations
      (event_id,name,email,enrollment_no,phone,year,branch,user_id,registration_status)
    values
      (p_event_id,v_name,v_email,
       nullif(trim(coalesce(p_enrollment_no,'')),''),
       nullif(trim(coalesce(p_phone,'')),''),
       nullif(trim(coalesce(p_year,'')),''),
       nullif(trim(coalesce(p_branch,'')),''),
       v_user_id,v_status)
    returning id into v_id;
  end if;

  return jsonb_build_object('id',v_id,'status',v_status);
end;
$$;

revoke all on function public.jyc_register_for_event(text,text,text,text,text,text,text) from public;
grant execute on function public.jyc_register_for_event(text,text,text,text,text,text,text) to anon, authenticated;

-- Remove legacy direct-registration policies. The RPC is the only public write path.
drop policy if exists "public register event" on public.jyc_event_registrations;
drop policy if exists "public register published native event" on public.jyc_event_registrations;
revoke insert, delete on public.jyc_event_registrations from anon, authenticated;
grant update on public.jyc_event_registrations to authenticated;

commit;

select 'JYC production hardening migration complete.' as result;
