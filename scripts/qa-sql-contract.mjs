import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const failures=[];
const req=(file, needles)=>{const text=fs.readFileSync(path.join(root,'supabase','migrations',file),'utf8');for(const n of needles)if(!text.includes(n))failures.push(file+': missing '+n)};
req('202610030001_production_hardening.sql',['jyc_ingest_error_report','jyc_registration_rate_limits','jyc-backups','revoke insert, update, delete on public.jyc_site_data from anon, authenticated;']);
req('202610030002_ai_hardening.sql',['jyc_allow_ai_request']);
req('202610030003_campus_verification.sql',['jyc_campuses','jyc_content_verification','sector-128','sector-62']);
req('202610030005_publication_verification_guard.sql',['jyc_guard_json_publication','jyc_guard_json_publication on public.jyc_site_data','cannot be published before verification']);
if(failures.length){console.error('SQL CONTRACT QA FAIL');failures.forEach(x=>console.error('FAIL:',x));process.exit(1)}
console.log('SQL CONTRACT QA PASS');
