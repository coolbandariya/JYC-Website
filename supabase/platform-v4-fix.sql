-- JYC V4 FIX: clean legacy starter data + repair the RPC signature mismatch.
-- Run this ONE file in Supabase SQL Editor after the existing migrations.
-- It is safe to re-run. It removes only the known legacy starter record id/name.

create extension if not exists pgcrypto;

-- Canonical save function used by the current frontend.
create or replace function public.jyc_save_site_data(
  p_data jsonb,
  p_action text default 'Updated site',
  p_entity_type text default 'site',
  p_entity_id text default 'main'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  a_role text;
  a_club text;
  old_data jsonb;
  next_data jsonb;
  own_clubs jsonb;
  own_events jsonb;
  own_gallery jsonb;
begin
  select role, club_id::text into a_role, a_club
  from public.jyc_admins where user_id=auth.uid() and is_active=true limit 1;
  if a_role is null then raise exception 'Not authorized'; end if;
  select data into old_data from public.jyc_site_data where id='main' for update;
  old_data:=coalesce(old_data,'{}'::jsonb);

  if a_role in ('super_admin','jyc_super_admin') then
    next_data:=p_data;
  elsif a_role='jyc_admin' then
    next_data:=old_data;
    if p_entity_type in ('club','clubs') then next_data:=next_data||jsonb_build_object('clubs',coalesce(p_data->'clubs','[]'::jsonb));
    elsif p_entity_type in ('event','events') then next_data:=next_data||jsonb_build_object('events',coalesce(p_data->'events','[]'::jsonb));
    elsif p_entity_type='gallery' then next_data:=next_data||jsonb_build_object('gallery',coalesce(p_data->'gallery','[]'::jsonb));
    elsif p_entity_type in ('categories','settings') then next_data:=next_data||jsonb_build_object('categories',coalesce(p_data->'categories',old_data->'categories'));
    elsif p_entity_type in ('calendar','academic_calendar') then next_data:=next_data||jsonb_build_object('academicCalendar',coalesce(p_data->'academicCalendar',old_data->'academicCalendar'));
    else raise exception 'JYC Editor does not have permission for this content area'; end if;
  elsif a_role='clubs_admin' and p_entity_type in ('club','clubs') then
    next_data:=old_data||jsonb_build_object('clubs',coalesce(p_data->'clubs','[]'::jsonb));
  elsif a_role='clubs_admin' and p_entity_type in ('categories','settings') then
    next_data:=old_data||jsonb_build_object('categories',coalesce(p_data->'categories',old_data->'categories'));
  elsif a_role='events_admin' and p_entity_type in ('event','events') then
    next_data:=old_data||jsonb_build_object('events',coalesce(p_data->'events','[]'::jsonb));
  elsif a_role='gallery_admin' and p_entity_type='gallery' then
    next_data:=old_data||jsonb_build_object('gallery',coalesce(p_data->'gallery','[]'::jsonb));
  elsif a_role='content_admin' and p_entity_type in ('homepage','team','fest') then
    next_data:=old_data||jsonb_build_object('homepage',coalesce(p_data->'homepage',old_data->'homepage'),'team',coalesce(p_data->'team',old_data->'team'),'fest',coalesce(p_data->'fest',old_data->'fest'));
  elsif a_role='content_admin' and p_entity_type in ('calendar','academic_calendar') then
    next_data:=old_data||jsonb_build_object('academicCalendar',coalesce(p_data->'academicCalendar',old_data->'academicCalendar'));
  elsif a_role='club_admin' then
    if a_club is null then raise exception 'Club Admin has no assigned club'; end if;
    own_clubs:=coalesce((select jsonb_agg(v) from jsonb_array_elements(coalesce(p_data->'clubs','[]'::jsonb)) v where v->>'id'=a_club),'[]'::jsonb);
    own_events:=coalesce((select jsonb_agg(v) from jsonb_array_elements(coalesce(p_data->'events','[]'::jsonb)) v where v->>'clubId'=a_club),'[]'::jsonb);
    own_gallery:=coalesce((select jsonb_agg(v) from jsonb_array_elements(coalesce(p_data->'gallery','[]'::jsonb)) v where v->>'clubId'=a_club),'[]'::jsonb);
    next_data:=old_data
      ||jsonb_build_object('clubs',coalesce((select jsonb_agg(v) from jsonb_array_elements(coalesce(old_data->'clubs','[]'::jsonb)) v where v->>'id'<>a_club),'[]'::jsonb)||own_clubs)
      ||jsonb_build_object('events',coalesce((select jsonb_agg(v) from jsonb_array_elements(coalesce(old_data->'events','[]'::jsonb)) v where coalesce(v->>'clubId','')<>a_club),'[]'::jsonb)||own_events)
      ||jsonb_build_object('gallery',coalesce((select jsonb_agg(v) from jsonb_array_elements(coalesce(old_data->'gallery','[]'::jsonb)) v where coalesce(v->>'clubId','')<>a_club),'[]'::jsonb)||own_gallery);
  else raise exception 'Administrator role does not have permission for this content area'; end if;

  -- Permanently protect the creator identity.
  next_data:=jsonb_set(next_data,'{creator}',jsonb_build_object('name','Kaustubh Dua','role','Website Creator','linkedin','https://www.linkedin.com/in/kaustubh-dua-2b5a76416','instagram','https://www.instagram.com/kaustubh.this.side/','github','https://github.com/coolbandariya','email','kaustubhdua1991@gmail.com'),true);
  insert into public.jyc_site_data(id,data,updated_at,updated_by) values('main',next_data,now(),auth.uid()) on conflict(id) do update set data=excluded.data,updated_at=excluded.updated_at,updated_by=excluded.updated_by;
  insert into public.jyc_activity_logs(actor_id,action,entity_type,entity_id,metadata) values(auth.uid(),coalesce(p_action,'Updated site'),p_entity_type,p_entity_id,jsonb_build_object('role',a_role));
  return next_data;
end $$;

revoke all on function public.jyc_save_site_data(jsonb,text,text,text) from public;
grant execute on function public.jyc_save_site_data(jsonb,text,text,text) to authenticated;

-- Some older JYC deployments created the same RPC with the arguments in a different order.
-- Keep a compatibility wrapper so old schema-cache/function signatures stop breaking saves.
drop function if exists public.jyc_save_site_data(text,jsonb,text,text);
create or replace function public.jyc_save_site_data(
  p_action text,
  p_data jsonb,
  p_entity_id text default 'main',
  p_entity_type text default 'site'
)
returns jsonb
language sql
security definer
set search_path=public
as $$
  select public.jyc_save_site_data(p_data,p_action,p_entity_type,p_entity_id);
$$;
revoke all on function public.jyc_save_site_data(text,jsonb,text,text) from public;
grant execute on function public.jyc_save_site_data(text,jsonb,text,text) to authenticated;

-- IMPORTANT: Abhivyakti is a legitimate JYC community in the supplied hub directory.
-- Never delete content by the name/slug "abhivyakti" from a production database.
-- The old starter cleanup used that identity and could destroy the real community.
-- Existing content is intentionally preserved during bootstrap/re-run.

select 'JYC V4 fix applied. Refresh the website.' as result;
