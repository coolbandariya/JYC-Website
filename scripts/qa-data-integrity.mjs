import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const main=read('src/main.jsx');
const admin=read('src/admin-chunk.jsx');
const bootstrap=read('supabase/PRODUCTION-BOOTSTRAP-ALL.sql');
const v4=read('supabase/platform-v4-fix.sql');
const maintenance=read('supabase/maintenance/00-remove-legacy-demo-data.sql');
const sitemap=read('scripts/generate-sitemap.mjs');
const orientation=read('src/jyc-orientation-insights.js');

const checks=[
  [orientation.includes('Abhivyakti'),'official hub orientation still contains Abhivyakti'],
  [!main.includes("String(c?.id||'').toLowerCase()==='abhivyakti'")&&!main.includes("String(c.id).toLowerCase()==='abhivyakti'"),'public runtime does not delete/filter Abhivyakti by name'],
  [!admin.includes("String(c.id).toLowerCase()==='abhivyakti'")&&!admin.includes("String(e.club||'').toLowerCase().trim()!=='abhivyakti'"),'admin workspaces do not hide Abhivyakti by name'],
  [!bootstrap.includes("DELETE FROM public.jyc_clubs WHERE lower(name)='abhivyakti'")&&!bootstrap.includes("coalesce(c->>'id',''))='abhivyakti'"),'production bootstrap does not delete Abhivyakti by name'],
  [!v4.includes("DELETE FROM public.jyc_clubs WHERE lower(name)='abhivyakti'")&&!v4.includes("coalesce(c->>'id',''))='abhivyakti'"),'legacy V4 repair does not delete Abhivyakti by name'],
  [!maintenance.split(/\n/).some(line=>/^\s*(delete|update|insert)\b/i.test(line)),'historical Abhivyakti maintenance script is non-destructive'],
  [!sitemap.includes("'/map'"),'retired map route is absent from generated sitemap'],
  [!main.includes("clean==='/events'?'map'"),'route metadata has no stale events-to-map branch']
];

let failed=0;
for(const [ok,label] of checks){console.log(ok?'PASS':'FAIL',label);if(!ok)failed++}
if(failed)process.exit(1);
console.log('DATA INTEGRITY QA PASS');
