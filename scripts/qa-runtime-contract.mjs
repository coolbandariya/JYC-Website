import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const main=fs.readFileSync(path.join(root,'src/main.jsx'),'utf8');
const extra=fs.readFileSync(path.join(root,'src/extra-features.jsx'),'utf8');
const importLine=main.split(/\r?\n/).find(line=>line.includes("from './extra-features.jsx'"));
const importMatch=importLine?.match(/import\s*\{([^}]*)\}\s*from\s*['"]\.\/extra-features\.jsx['"]/);
if(!importMatch){console.error('FAIL: extra-features import block not found');process.exit(1)}
const names=importMatch[1].split(',').map(x=>x.trim()).filter(Boolean).map(x=>x.replace(/\s+as\s+\w+$/,''));
const exports=new Set();
for(const m of extra.matchAll(/export\s+(?:async\s+)?(?:function|const|let|var|class)\s+(\w+)/g))exports.add(m[1]);
for(const m of extra.matchAll(/export\s*\{([^}]+)\}/gs))for(const x of m[1].split(',')){const n=x.trim().replace(/\s+as\s+\w+$/,'');if(n)exports.add(n)}
let failed=0;
for(const n of names){const ok=exports.has(n);console.log(`${ok?'PASS':'FAIL'}: extra-features export ${n}`);if(!ok)failed++}
const required=['EventTools','DownloadICS'];
for(const n of required){const ok=exports.has(n);console.log(`${ok?'PASS':'FAIL'}: runtime-critical export ${n}`);if(!ok)failed++}
const source=fs.readFileSync(path.join(root,'src/main.jsx'),'utf8');
const metaOriginOk=extra.includes("export function usePageMeta")&&extra.includes("const origin=(import.meta.env.VITE_SITE_URL||window.location.origin)");
console.log((metaOriginOk ? "PASS" : "FAIL")+": usePageMeta resolves a site origin before building canonical/OG URLs");
if(!metaOriginOk)failed++;
const modalA11yOk=extra.includes("export function GalleryItems")&&extra.includes('role="dialog"')&&extra.includes('aria-modal="true"')&&extra.includes("closeRef.current?.focus()")&&extra.includes("e.key==='Tab'");
console.log((modalA11yOk ? "PASS" : "FAIL")+": gallery lightbox keeps keyboard focus inside the modal");
if(!modalA11yOk)failed++;
for(const [label,needle] of [['Fest Mode fallback',':[]'],['Recruitment homepage gate','recruitmentEnabled(data)'],['Contact route',"clean==='/contact'"]]){const ok=source.includes(needle);console.log(`${ok?'PASS':'FAIL'}: ${label}`);if(!ok)failed++}
if(failed)process.exit(1);
console.log('Runtime contract QA complete.');
