-- JYC media write boundary: browser clients must use the media-upload Edge Function.
begin;

drop policy if exists "JYC admins can upload JYC media" on storage.objects;
drop policy if exists "JYC admins can update JYC media" on storage.objects;
drop policy if exists "JYC admins can delete JYC media" on storage.objects;

-- Keep public reads for published media, but remove direct client-side writes.
revoke insert, update, delete on storage.objects from anon, authenticated;

commit;
select 'JYC direct media writes disabled; media-upload is the write path.' as result;
