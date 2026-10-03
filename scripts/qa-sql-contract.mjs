import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const failures=[];
const req=(file, needles)=>{const text=fs.readFileSync(path.join(root,'supabase','migrations',file),'utf8');for(const n of needles)if(!text.includes(n))failures.push(file+': missing '+n)};
req('202610030001_production_hardening.sql',['jyc_ingest_error_report','jyc_registration_rate_limits','jyc-backups','revoke insert, update, delete on public.jyc_site_data from anon, authenticated;']);
req('202610030002_ai_hardening.sql',['jyc_allow_ai_request']);
req('202610030003_campus_verification.sql',['jyc_campuses','jyc_content_verification','sector-128','sector-62']);
req('202610030007_verification_trust_contract.sql',['jyc_content_verification_verified_contract','source_url','verified_by','verified_at']);
req('202610030008_verification_identity_audit.sql',['jyc_set_verification_audit_fields','auth.uid()','verified_at := now()','Verified content requires an authenticated verifier']);
req('202610030009_public_submission_guard.sql',['jyc_public_submission_rate_limits','jyc_allow_public_submission','revoke all on public.jyc_public_submission_rate_limits from anon, authenticated;','grant execute on function public.jyc_allow_public_submission(text,integer,integer) to service_role;']);
req('202610030005_publication_verification_guard.sql',['jyc_guard_json_publication','jyc_guard_json_publication on public.jyc_site_data','cannot be published before verification']);
if(failures.length){console.error('SQL CONTRACT QA FAIL');failures.forEach(x=>console.error('FAIL:',x));process.exit(1)}
console.log('SQL CONTRACT QA PASS');
