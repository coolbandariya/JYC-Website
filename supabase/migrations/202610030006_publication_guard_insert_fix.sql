-- Repair for the publication guard trigger: handle INSERT without referencing OLD.
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
  old_clubs jsonb := case when tg_op='UPDATE' then coalesce(old.data->'clubs','[]'::jsonb) else '[]'::jsonb end;
  old_events jsonb := case when tg_op='UPDATE' then coalesce(old.data->'events','[]'::jsonb) else '[]'::jsonb end;
  entity_id text;
begin
  for item in
    select value from jsonb_array_elements(coalesce(new.data->'clubs','[]'::jsonb))
    where coalesce(value->>'published','false')='true'
  loop
    entity_id := item->>'id';
    old_item := coalesce((select value from jsonb_array_elements(old_clubs) value where value->>'id'=entity_id limit 1),'{}'::jsonb);
    if coalesce(old_item->>'published','false') <> 'true'
       and not exists (
         select 1 from public.jyc_content_verification v
         where v.entity_type='club' and v.entity_id=entity_id
           and v.campus_id is not null and v.status in ('verified','published')
           and (v.expires_at is null or v.expires_at>now())
       )
    then
      raise exception 'Club % cannot be published before verification', entity_id using errcode='check_violation';
    end if;
  end loop;

  for item in
    select value from jsonb_array_elements(coalesce(new.data->'events','[]'::jsonb))
    where coalesce(value->>'published','false')='true'
  loop
    entity_id := item->>'id';
    old_item := coalesce((select value from jsonb_array_elements(old_events) value where value->>'id'=entity_id limit 1),'{}'::jsonb);
    if coalesce(old_item->>'published','false') <> 'true'
       and not exists (
         select 1 from public.jyc_content_verification v
         where v.entity_type='event' and v.entity_id=entity_id
           and v.campus_id is not null and v.status in ('verified','published')
           and (v.expires_at is null or v.expires_at>now())
       )
    then
      raise exception 'Event % cannot be published before verification', entity_id using errcode='check_violation';
    end if;
  end loop;

  return new;
end;
$$;

commit;
select 'JYC publication guard INSERT handling repaired.' as result;
