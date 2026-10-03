import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const main=fs.readFileSync(path.join(root,'src','main.jsx'),'utf8');
const css=fs.readFileSync(path.join(root,'src','v18.16-runtime-fix.css'),'utf8');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const checks=[
 ['version is 18.16.0',pkg.version==='18.16.0'],
 ['Footer component exists',/function Footer\(\{data,admin\}\)/.test(main)],
 ['Footer is rendered for public pages',/\{!isAdmin&&<Footer data=\{data\} admin=\{admin\}\/\>\}/.test(main)],
 ['boot minimum is deliberately slower',/1450:1800/.test(main)],
 ['boot stage transition is slower',main.includes("'LOADING'),420")],
 ['loading CSS repair is imported',/v18\.15-runtime-fix\.css/.test(main)],
 ['loading logo animation is slowed',/loading-logo img\{animation-duration:1\.65s/.test(css)],
 ['reduced motion remains supported',/prefers-reduced-motion: reduce/.test(css)],
 ['manifest is same-origin',/rel="manifest" href="\/manifest\.json"/.test(fs.readFileSync(path.join(root,'index.html'),'utf8'))],
 ['no cross-origin manifest reference',!/href=["']https:\/\/jycjiit\.vercel\.app\/manifest\.json/i.test(fs.readFileSync(path.join(root,'index.html'),'utf8'))],
];
let failed=0; for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'}: ${name}`);if(!ok)failed++;}
if(failed){process.exitCode=1;console.error(`V18.16 RUNTIME QA FAIL: ${failed}`)}else console.log('V18.16 RUNTIME QA PASS');
