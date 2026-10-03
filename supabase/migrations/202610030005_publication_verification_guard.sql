-- JYC publication guard: newly published JSON club/event records must have
-- an explicit verification record. Existing published records are not re-verified
-- merely because an unrelated field is edited.
begin;

create or replace function public.jyc_guard_json_publication()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  old_item jsonb;
  entity_id text;
begin
  -- Clubs
  for item in
    select value
    from jsonb_array_elements(coalesce(new.data->'clubs','[]'::jsonb))
    where coalesce(value->>'published','false')='true'
  loop
    entity_id := item->>'id';
    old_item := coalesce(
      (select value from jsonb_array_elements(coalesce(old.data->'clubs','[]'::jsonb)) value
       where value->>'id'=entity_id limit 1),
      '{}'::jsonb
    );
    if coalesce(old_item->>'published','false') <> 'true'
       and not exists (
         select 1
         from public.jyc_content_verification v
         where v.entity_type='club'
           and v.entity_id=entity_id
           and v.campus_id is not null
           and v.status in ('verified','published')
           and (v.expires_at is null or v.expires_at>now())
       )
    then
      raise exception 'Club % cannot be published before verification', entity_id
        using errcode='check_violation';
    end if;
  end loop;

  -- Events
  for item in
    select value
    from jsonb_array_elements(coalesce(new.data->'events','[]'::jsonb))
    where coalesce(value->>'published','false')='true'
  loop
    entity_id := item->>'id';
    old_item := coalesce(
      (select value from jsonb_array_elements(coalesce(old.data->'events','[]'::jsonb)) value
       where value->>'id'=entity_id limit 1),
      '{}'::jsonb
    );
    if coalesce(old_item->>'published','false') <> 'true'
       and not exists (
         select 1
         from public.jyc_content_verification v
         where v.entity_type='event'
           and v.entity_id=entity_id
           and v.campus_id is not null
           and v.status in ('verified','published')
           and (v.expires_at is null or v.expires_at>now())
       )
    then
      raise exception 'Event % cannot be published before verification', entity_id
        using errcode='check_violation';
    end if;
  end loop;

  return new;
end;
$$;

drop trigger if exists jyc_guard_json_publication on public.jyc_site_data;
create trigger jyc_guard_json_publication
before insert or update of data on public.jyc_site_data
for each row
execute function public.jyc_guard_json_publication();

revoke all on function public.jyc_guard_json_publication() from public;

commit;
select 'JYC publication verification guard enabled for newly published clubs and events.' as result;
