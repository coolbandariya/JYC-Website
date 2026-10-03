import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const failures=[];
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

const migrationsDir=path.join(root,'supabase','migrations');
if(!fs.existsSync(migrationsDir)) failures.push('supabase/migrations directory is missing');
const migrations=fs.existsSync(migrationsDir)?fs.readdirSync(migrationsDir).filter(x=>/^\d{12}_[a-z0-9_-]+\.sql$/.test(x)).sort():[];
if(!migrations.includes('202610030001_production_hardening.sql')) failures.push('production hardening migration is missing');
if(!migrations.includes('202610030002_ai_hardening.sql')) failures.push('AI hardening migration is missing');

const hardening=read('supabase/migrations/202610030001_production_hardening.sql');
for(const needle of [
  'revoke insert, update, delete on public.jyc_site_data from anon, authenticated;',
  "'jyc-backups',\n  'jyc-backups',\n  false",
  'jyc_ingest_error_report',
  'jyc_registration_rate_limits',
  'revoke insert, delete on public.jyc_event_registrations from anon, authenticated;'
]) if(!hardening.includes(needle)) failures.push('hardening migration missing: '+needle);

const ai=read('supabase/functions/ai-content-assist/index.ts');
if(!ai.includes("jyc_allow_ai_request")) failures.push('AI function is not using distributed rate limiting');
if(!ai.includes("store:false")) failures.push('AI Responses request must disable response storage');
if(!ai.includes("json_schema")) failures.push('AI Responses request must use a structured JSON schema');

const backup=read('supabase/functions/backup-site-data/index.ts');
if(!backup.includes("from('jyc-backups')")) failures.push('backup function is not using private jyc-backups bucket');
for(const fn of ['supabase/functions/admin-management/index.ts','supabase/functions/send-notification/index.ts','supabase/functions/ai-content-assist/index.ts']) {
  const source=read(fn);
  if(source.includes('https://jycjiit.vercel.app') || source.includes('https://jyc-website-livid.vercel.app')) failures.push(fn+' still contains a legacy Vercel origin');
}

const config=read('supabase/config.toml');
if(!config.includes('[functions.error-report]')||!config.includes('verify_jwt = false')) failures.push('public error-report Edge Function is not configured');

const main=read('src/main.jsx');
if(main.includes("from('jyc_error_reports').insert")) failures.push('browser still writes directly to jyc_error_reports');
if(!main.includes("functions.invoke('error-report'")) failures.push('browser error reporting does not use the Edge Function');

const vercel=JSON.parse(read('vercel.json'));
const headers=vercel.headers||[];
const asset= headers.find(x=>x.source==='/assets/:path*')?.headers||[];
const assetMap=new Map(asset.map(x=>[x.key.toLowerCase(),x.value]));
if(!String(assetMap.get('cache-control')||'').includes('immutable')) failures.push('hashed assets do not have immutable caching');

if(failures.length){
  console.error('PRODUCTION HARDENING QA FAIL');
  for(const f of failures) { console.error('FAIL:',f); console.error(`::error file=scripts/qa-production-hardening.mjs::${f}`); }
  process.exit(1);
}
console.log('PRODUCTION HARDENING QA PASS');
console.log(`Checked ${migrations.length} migration(s), security boundaries, Edge Functions, frontend telemetry path and asset caching.`);
