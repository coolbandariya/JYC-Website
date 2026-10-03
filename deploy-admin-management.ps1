$ErrorActionPreference = "Stop"
Write-Host "JYC - deploying admin-management Edge Function" -ForegroundColor Cyan
Write-Host "Using the project-local Supabase CLI via npx." -ForegroundColor Gray
npx supabase --version
npx supabase functions deploy admin-management
Write-Host "" 
Write-Host "Set SITE_ORIGINS in Supabase Function secrets to your production origin(s), comma-separated." -ForegroundColor Yellow
Write-Host "Example: https://www.jiityouthclub128.in,http://localhost:5173" -ForegroundColor Yellow
Write-Host "Admin Management is now ready. Refresh /admin -> Admins." -ForegroundColor Green
