# JYC V9.3 — Exact Setup & QA Order

## 0. Environment
Create `.env.local` in the project root (never commit it):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
VITE_VAPID_PUBLIC_KEY=YOUR_PUBLIC_VAPID_KEY
```

Do not put service-role, secret, or VAPID private keys in `.env.local`.

## 1. Install
```powershell
npm install
npm install supabase --save-dev
npx supabase --version
```

## 2. Inspect before touching the database
```powershell
npx supabase projects list
```
Confirm the JYC project ID. Do not guess it.

## 3. Link
```powershell
npx supabase link --project-ref YOUR_CONFIRMED_PROJECT_ID
```

## 4. Verify local source/build
```powershell
npm run build
npm run dev
```
Open the local Vite URL and test:
- `/`
- `/about`
- `/clubs`
- `/events`
- `/gallery`
- `/team`
- `/contact`
- `/admin`

On mobile width, verify the fixed bottom navigation: Home / Clubs / Events / Gallery / More.

## 5. If the browser shows the OLD UI
This release source already contains the compact Events/Clubs UI and styled Quick Find. If an old deployment appears:
- hard refresh (`Ctrl+Shift+R`)
- DevTools → Application → Service Workers → unregister the old JYC worker
- Application → Storage → Clear site data
- close/reopen the tab
- then test localhost again

Do not diagnose old screenshots as source-code state until localhost is checked.

## 6. Supabase database
The existing migrations are intentionally kept unchanged. For a fresh/known database, use:
1. `supabase/00-core-migration.sql`
2. `supabase/relational-v2.sql`
3. `supabase/platform-v3.sql`
4. `supabase/platform-v4-fix.sql`
5. `supabase/final-role-hardening.sql`

Abhivyakti is a legitimate JYC community. Do not run a name-based deletion. If a stale record is suspected, verify it against an independent source-backed identifier before changing production data.

For an already-migrated production database, do not blindly rerun destructive SQL. Verify tables/functions first.

## 7. Edge Functions
After linking:
```powershell
npx supabase functions deploy admin-management
npx supabase functions deploy send-notification
npx supabase functions deploy backup-site-data
```

For admin-management:
```powershell
npx supabase secrets set SITE_ORIGINS="https://YOUR-VERCEL-DOMAIN.vercel.app,http://localhost:5173"
```

For push:
```powershell
npx supabase secrets set VAPID_PUBLIC_KEY="..." VAPID_PRIVATE_KEY="..." VAPID_SUBJECT="mailto:jyc.website@gmail.com"
```

For backups, set a strong server-side token:
```powershell
npx supabase secrets set BACKUP_FUNCTION_TOKEN="GENERATE_A_LONG_RANDOM_TOKEN"
```

Never place those private values in Vite variables.

## 8. Vercel
Set only frontend variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_VAPID_PUBLIC_KEY` (only if push is configured)

Redeploy after changing them.

## 9. Security/config check
Before production:
- `vercel.json` CSP must contain the confirmed Supabase project origin.
- `supabase/config.toml` project ID must match the confirmed linked project.
- `.env.local` must not be committed.
- No service-role key may appear under `src/`.

## 10. Final functional test
As Super Admin:
- login
- dashboard loads
- sidebar scrolls
- Quick Find opens and filters
- create club/event
- publish/unpublish
- gallery
- admin management
- activity log

As Club Admin:
- only assigned club is editable
- own events/gallery work
- unrelated clubs are not editable

Public:
- empty state starts clean
- Events is only events
- Clubs has search/filter
- mobile bottom nav works
- desktop uses top nav
- theme toggle works
- no raw `Overviewoverview↗`/`abcd` UI
- no stale Abhivyakti
