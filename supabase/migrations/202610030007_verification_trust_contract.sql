-- JYC verification trust contract.
-- Verified/published verification records must carry auditable source metadata.
-- NOT VALID preserves compatibility with historical rows while enforcing the
-- contract for new and updated rows. Existing records can be backfilled and
-- validated separately after the production baseline is reconciled.

begin;

drop policy if exists "Admins can write content verification" on public.jyc_content_verification;
create policy "Editors can write content verification"
on public.jyc_content_verification
for all to authenticated
using (
  exists (
    select 1
    from public.jyc_admins a
    where a.user_id=auth.uid()
      and a.is_active=true
      and a.role in ('super_admin','jyc_admin')
  )
)
with check (
  exists (
    select 1
    from public.jyc_admins a
    where a.user_id=auth.uid()
      and a.is_active=true
      and a.role in ('super_admin','jyc_admin')
  )
);

alter table public.jyc_content_verification
  add constraint jyc_content_verification_verified_contract
  check (
    status not in ('verified','published')
    or (
      campus_id is not null
      and verified_by is not null
      and verified_at is not null
      and source_url is not null
      and source_url ~* '^https?://'
    )
  ) not valid;

create index if not exists jyc_content_verification_verified_at_idx
  on public.jyc_content_verification(verified_at desc);

commit;

select 'JYC verification trust contract enabled for new and updated verified records.' as result;
