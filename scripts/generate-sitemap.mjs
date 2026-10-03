import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const rawSite=(process.env.VITE_SITE_URL||process.env.SITE_URL||process.env.VERCEL_PROJECT_PRODUCTION_URL||'https://www.jiityouthclub128.in').trim();
const site=(rawSite?(/^[a-z]+:\/\//i.test(rawSite)?rawSite:`https://${rawSite}`):'').replace(/\/$/,'');
const out=path.join(root,'public','sitemap.xml');
const core=['/','/about','/history','/clubs','/events','/fests','/gallery','/team','/contact','/calendar','/announcements','/achievements','/join-jyc'];
const urls=new Set(core);
const dynamicDates=new Map();
const slug=value=>String(value||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

async function loadDynamic(){
  const supabaseUrl=(process.env.VITE_SUPABASE_URL||'').replace(/\/$/,'');
  const key=process.env.VITE_SUPABASE_PUBLISHABLE_KEY||process.env.VITE_SUPABASE_ANON_KEY||'';
  if(!supabaseUrl||!key)return;
  try{
    const r=await fetch(`${supabaseUrl}/rest/v1/rpc/jyc_read_site_data`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,Prefer:'return=representation'}});
    if(!r.ok)return;
    const data=await r.json();
    for(const c of (data?.clubs||[])) if(c?.published&&c?.status!=='archived') { const u=`/clubs/${slug(c.name)||encodeURIComponent(String(c.id))}`; urls.add(u); if(c.updated_at) dynamicDates.set(u,String(c.updated_at).slice(0,10)); }
    for(const e of (data?.events||[])) if(e?.published&&!e?.archived) { const u=`/events/${slug(e.title)||encodeURIComponent(String(e.id))}`; urls.add(u); if(e.updated_at) dynamicDates.set(u,String(e.updated_at).slice(0,10)); }
  }catch{}
}

if(!site) throw new Error('SEO sitemap: production origin could not be resolved.');
await loadDynamic();
const fallbackDate=new Date().toISOString().slice(0,10);
// Use content timestamps when available; otherwise fall back to the build date.
try{
  const supabaseUrl=(process.env.VITE_SUPABASE_URL||'').replace(/\/$/,'');
  const key=process.env.VITE_SUPABASE_PUBLISHABLE_KEY||process.env.VITE_SUPABASE_ANON_KEY||'';
  if(supabaseUrl&&key){
    const r=await fetch(`${supabaseUrl}/rest/v1/jyc_site_data?id=eq.main&select=updated_at`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
    if(r.ok){const rows=await r.json();if(rows?.[0]?.updated_at)dynamicDates.set('/',String(rows[0].updated_at).slice(0,10));}
  }
}catch{}
const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...urls].map(u=>`  <url><loc>${site}${u}</loc><lastmod>${dynamicDates.get(u)||fallbackDate}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(out,xml);
const robots=path.join(root,'public','robots.txt');
if(fs.existsSync(robots)){
  let robotsText=fs.readFileSync(robots,'utf8');
  robotsText=robotsText.replace(/^# Production build:[\s\S]*$/m,'');
  robotsText=robotsText.replace(/\n# Production: add the absolute sitemap URL after the real domain is configured\.\n?/g,'\n');
  robotsText=robotsText.replace(/\n?Sitemap:.*\n?/gi,'\n');
  robotsText=robotsText.trimEnd()+`\n\nSitemap: ${site}/sitemap.xml\n`;
  fs.writeFileSync(robots,robotsText);
}
console.log(`SEO sitemap: wrote ${urls.size} URLs to ${out}`);
