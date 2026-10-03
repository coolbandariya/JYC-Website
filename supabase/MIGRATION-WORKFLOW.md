# Supabase migration workflow

The repository contains the new production hardening migrations under `supabase/migrations/`, but the historical JYC database was originally assembled from legacy bootstrap/repair SQL. Do not treat those legacy files as a second migration system.

## One-time production baseline

From a machine with the Supabase CLI and access to the JYC project:

```bash
supabase login
supabase link --project-ref ogbanmjokjlxfuktkicj
supabase migration list
supabase db pull
supabase db pull --schema auth,storage
supabase db reset
supabase test db
```

Review the generated remote-schema migration carefully and commit it. If the CLI asks to update remote migration history, accept it only after verifying that the generated baseline matches the existing production schema.

After that point, all schema changes must be new files under `supabase/migrations/`.

## Normal change workflow

```bash
supabase migration new <change_name>
supabase db reset
supabase test db
supabase db push --dry-run
supabase db push
```

Never make an untracked production schema change through the Supabase SQL editor and leave it out of Git. Supabase's migration history and the repository must remain synchronized.

## RLS regression tests

The JYC security suite is:

`supabase/tests/database/jyc_security_rls.test.sql`

It asserts that browser roles cannot bypass the protected JSON CMS or Storage write paths, while preserving the authenticated registration status-update path used by My JYC.

Supabase documents `supabase test db` + pgTAP as the supported database/RLS test workflow.
