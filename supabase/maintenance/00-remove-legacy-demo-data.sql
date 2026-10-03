-- Historical maintenance note.
-- Abhivyakti is a legitimate JYC community in the supplied hub directory.
-- The former script deleted records solely by the "abhivyakti" name/slug,
-- which is unsafe because it cannot distinguish a stale starter record from
-- the real community. This file is now intentionally non-destructive.
--
-- Inspect first and remove a record only when you have an independent,
-- source-backed identifier proving it is stale. Never delete by name alone.

select
  c->>'id' as club_id,
  c->>'name' as club_name,
  c->>'status' as status,
  c->>'published' as published
from public.jyc_site_data,
     jsonb_array_elements(coalesce(data->'clubs','[]'::jsonb)) c
where lower(trim(c->>'name')) = 'abhivyakti'
   or lower(trim(c->>'id')) = 'abhivyakti';

select 'No records were deleted. Manual, source-backed review is required.' as result;