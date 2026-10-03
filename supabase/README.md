# Supabase project setup

Run migrations in this order:

0. `00-bootstrap-admins.sql`
1. `00-core-migration.sql`
2. `relational-v2.sql`
3. `platform-v3.sql`
4. `platform-v4-fix.sql`
5. `final-role-hardening.sql`
6. `platform-v5-production.sql`
7. `contact-and-project-submissions.sql`

The historical Abhivyakti cleanup script is now non-destructive. Do not delete a club by name alone; verify any unexpected record against an independent source-backed identifier first.

Edge Functions:

- `functions/admin-management`
- `functions/send-notification`
- `functions/backup-site-data`

Keep all privileged secrets server-side in Supabase.


V5 is the production-read hardening pass. It makes public content reads go through `jyc_read_site_data()` so unpublished/admin-only JSON content is not exposed to anonymous clients, and it adds account-linked event registrations with owner/admin RLS.

Before enabling passwordless student sign-in, configure Supabase Auth email/redirect settings to allow the deployed site's `/my-jyc` callback URL.


## Fresh-project shortcut

For a new JYC Supabase project, you can run `PRODUCTION-BOOTSTRAP-ALL.sql` once in the SQL Editor instead of pasting the individual files. It includes the admin-table bootstrap and then applies the migrations in the required order. Do not run the optional legacy-demo cleanup unless you intentionally need to remove that known starter record.
