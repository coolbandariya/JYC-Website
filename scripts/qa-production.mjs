import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const checks=[];
const pass=(label)=>{checks.push([true,label]);console.log(`PASS: ${label}`)};
const fail=(label)=>{checks.push([false,label]);console.error(`FAIL: ${label}`)};

const vercel=read('vercel.json');
const pkg=JSON.parse(read('package.json'));
const lock=JSON.parse(read('package-lock.json'));
const main=read('src/main.jsx');
if(/https:\/\/[^*\s]+\.supabase\.co/.test(vercel)) fail('Vercel CSP does not hard-code a single Supabase project'); else pass('Vercel CSP is deployable across Supabase projects');
if(vercel.includes('X-Content-Type-Options')&&vercel.includes('X-Frame-Options')&&vercel.includes('Referrer-Policy')) pass('Baseline security headers present'); else fail('Baseline security headers incomplete');
if(vercel.includes('Strict-Transport-Security')) pass('HSTS header present'); else fail('HSTS header missing');
const robots=read('public/robots.txt');
if(!/^Sitemap:/mi.test(robots)) pass('Robots file intentionally waits for production domain'); else fail('Robots file contains a stale sitemap URL');
const sitemap=path.join(root,'public','sitemap.xml');
if(fs.existsSync(sitemap)) fail('Sitemap is not committed with a placeholder production origin'); else pass('No fake production sitemap committed');
const env=read('.env.example');
if(env.includes('VITE_SITE_URL=')) pass('Production canonical origin is explicitly configurable'); else fail('VITE_SITE_URL missing');
if(read('src/main.jsx').includes('unknownRoute')&&read('src/main.jsx').includes('noindex:privateRoute||unknownRoute')) pass('Unknown SPA routes are marked noindex'); else fail('Unknown SPA routes can be indexed');
if(read('src/extra-features.jsx').includes("if(item.date&&item.end)eventGraph.endDate")) pass('Event schema does not invent an end time'); else fail('Event schema end time fallback remains');
const ai=read('supabase/functions/ai-content-assist/index.ts');
const adminFn=read('supabase/functions/admin-management/index.ts');
const contactSql=read('supabase/contact-and-project-submissions.sql');
if(pkg.version!=='38.0.0'||lock.version!=='38.0.0'||lock.engines?.node!=='>=22') fail('Release metadata and lockfile engine are out of sync'); else pass('Release metadata and lockfile engine are synchronized');
if((main.match(/import '\.\/styles\/public-system\.css';/g)||[]).length!==1) fail('Consolidated public stylesheet must be imported exactly once'); else pass('Consolidated public stylesheet import is unique');
if(main.includes("functions.invoke('public-submission'")&&main.includes("type:'contact'")) pass('Contact form uses the guarded persistent submission target'); else fail('Contact form has no guarded persistent submission target');
if(contactSql.includes('alter table public.jyc_contact_submissions enable row level security')&&contactSql.includes('Admins can read contact messages')) pass('Contact inbox has RLS and admin-only reads'); else fail('Contact inbox security policy incomplete');
if(contactSql.includes('public.jyc_project_submissions')&&contactSql.includes('Admins can update project submissions')) pass('Project submission inbox schema and RLS are present'); else fail('Project submission schema/security incomplete');
if(ai.includes("gpt-6-luna")) pass('AI content assistant uses a current configured model default'); else fail('AI content assistant model default is stale');
if(ai.includes('if(!allowedOrigin(origin))')&&ai.includes('jyc_allow_ai_request')&&ai.includes('contentLength>24000')&&ai.includes('store:false')&&ai.includes('json_schema')) pass('AI content assistant has origin, size, distributed rate and structured-output guards'); else fail('AI content assistant request guards are incomplete');
if(adminFn.includes("Deno.env.get('SITE_ORIGINS')") && !/https?:\/\/jycjiit\.vercel\.app(?=\/|[\s'\")]|$)/i.test(adminFn)) pass('Admin edge function uses deploy-time origin configuration'); else fail('Admin edge function still hard-codes a legacy production origin');

const failed=checks.filter(x=>!x[0]);
if(failed.length){process.exitCode=1;console.error(`Production preflight failed: ${failed.length} check(s)`)}else console.log(`Production preflight complete: ${checks.length} checks passed`);
