# JYC production environment

This repository intentionally keeps privileged Supabase Edge Function secrets out of Vite/client environment variables.

## Browser/Vercel variables

Set these in Vercel for the Production environment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SITE_URL`
- `VITE_VAPID_PUBLIC_KEY` when web push is enabled
- `VITE_ENABLE_ANALYTICS=false` unless the analytics schema is deployed

Never put `SUPABASE_SERVICE_ROLE_KEY`, OpenAI API keys, VAPID private keys, or backup tokens in Vite variables.

## Supabase Edge Function secrets

Set these with the Supabase CLI/secrets UI:

- `SITE_ORIGINS` — comma-separated exact browser origins, e.g. `https://your-domain.example`
- `BACKUP_FUNCTION_TOKEN` — long random secret used by the backup function scheduler
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` and optional `OPENAI_MODEL` for the AI content assistant
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` for notifications

The backup, admin, notification and AI functions must not rely on hard-coded Vercel origins. Origin allowlists are deployment configuration.

## Migration order

Apply the ordered files in `supabase/migrations/` after the existing bootstrap/repair SQL:

1. `202610030001_production_hardening.sql`
2. `202610030002_ai_hardening.sql`
3. `202610030003_campus_verification.sql`

Run the backup/restore drill documented in `docs/PRODUCTION-BACKUP-RESTORE.md` before treating a new production environment as recoverable.

## Release gates

A production release requires:

1. `npm ci`
2. `npm run qa`
3. `npm run qa:seo`
4. `npm run build`
5. `npm run qa:browser`
6. GitHub CodeQL, CI and Quality Gate success

Do not mark the deployment healthy solely because the Vercel build completed; verify the application and Supabase functions against the production environment.
