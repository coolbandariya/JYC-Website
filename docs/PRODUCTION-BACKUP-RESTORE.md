# JYC production backup / restore runbook

## Backup
- backup-site-data is protected by BACKUP_FUNCTION_TOKEN.
- Snapshots are written to the private jyc-backups Storage bucket.
- Never make jyc-backups public.
- Keep application/database credentials in Supabase/Vercel secrets, never in Git.

## Retention
Recommended policy: daily snapshots 14 days; weekly snapshots 8 weeks; monthly snapshots 12 months. Retention should be enforced by a scheduled server-side job, not by the browser.

## Restore drill
At least once per quarter: create a disposable Supabase project/branch; restore the latest database snapshot; verify jyc_read_site_data() and admin role checks; verify required media; run npm run qa; record timestamp, snapshot identifier, failures and remediation.

A backup is operationally verified only after a successful restore drill.
