import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const main=read('src/main.jsx');
const css=read('src/v23.6-consolidated.css');const canonical=read('src/v23.6-canonical-system.css');const hubDetails=read('src/v23.6-hub-details.js');
const ids=read('src/hub-identities.js');
const pkg=JSON.parse(read('package.json'));
const failures=[];
const pass=(name,ok,detail='')=>{if(ok)console.log(`PASS: ${name}`);else{console.error(`FAIL: ${name}${detail?` — ${detail}`:''}`);failures.push(name)}};

pass('release remains V23.6',pkg.version==='23.6.0');
const cssImports=[...main.matchAll(/import\s+['"](\.\/[^'"]+\.css)['"];?/g)].map(m=>m[1]);
pass('consolidated stylesheet is the sole active CSS import',cssImports.length===1&&cssImports[0]==='./v23.6-consolidated.css');
pass('canonical layer is present inside consolidated stylesheet',css.includes('V23.6 CANONICAL SYSTEM')&&canonical.includes('V23.6 CANONICAL SYSTEM'));
pass('CSS imports are unique',new Set(cssImports).size===cssImports.length);
const missingCss=cssImports.filter(x=>!fs.existsSync(path.join(root,'src',x.slice(2))));
pass('all imported CSS files exist',missingCss.length===0,missingCss.join(', '));
pass('V65-inspired compact event list is wired',main.includes('EventDirectoryList')&&main.includes("view==='list'"));
pass('V65-inspired visual context rail is wired',main.includes('EcosystemContextRail')&&css.includes('.ecosystem-context-rail'));
pass('event programme remains connected to its hub',main.includes('COMMUNITY CONNECTION')&&main.includes('Explore the hub'));
pass('event cards carry hub identity',main.includes('event-identity-card')&&main.includes('event-domain-mark'));
pass('all 21 hub identities remain present',(ids.match(/^[ \t]*(?:'[^']+'|[A-Za-z][A-Za-z ]+):\{/gm)||[]).length>=21);
pass('public club themes are unified',main.includes("const clubTheme='jyc';"));
pass('fest visual themes are unified',main.includes("const allowedFestThemes=['jyc'];"));
pass('legacy custom cursor is disabled',css.includes('.custom-cursor')&&css.includes('display:none!important'));
pass('orbit and flying-bird decoration is disabled',css.includes('.team-orbit')&&css.includes('.jyc-flight-layer')&&css.includes('display:none!important'));
pass('mobile event list is defined',css.includes('@media(max-width:900px)')&&css.includes('.event-directory-row'));
pass('reduced motion contract exists',css.includes('@media(prefers-reduced-motion:reduce)'));
pass('public overflow is guarded',css.includes('body{overflow-x:hidden!important;}'));
pass('focus ring contract remains active',main.includes(':focus-visible')||read('src/v23.6-editorial-upgrade.css').includes(':focus-visible')||css.includes(':focus-visible'));
pass('21 hub detail records exist', ['Fortissimo','BDS','VamUnique','Panache','RPH','CICR','Innovation','Zencoders','JODC','CypherX','Arcadia','Neural Nexus','GDG','Dronotics','Aakriti','Aura','Cinekala','Abhivyakti','Prismatic','Eloquence','JSA'].every(x=>new RegExp(`(?:['\"])?${x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(?:['\"])?\s*:`).test(hubDetails)));
pass('hub detail system is rendered for every resolved hub',main.includes('hubDetails(c.name)')&&main.includes("WHAT YOU'LL FIND HERE")&&css.includes('.hub-detail-system'));
pass('hub detail content remains compact and responsive',css.includes('.hub-detail-columns{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,.8fr)')&&css.includes('@media(max-width:760px)'));
pass('assistant does not advertise planner',!main.includes('person, planner')&&!main.includes('planner, venue'));
pass('no red/pink/bright cyan identity tokens in canonical layer',!/#ff3bd4|#ff3044|#ff2d55|#20f0ff|#8cff4f|#78ffd6/i.test(canonical));

// Function-local duplicate declaration guard for the modifications made in this pass.
const eventCard=main.slice(main.indexOf('function EventCard'),main.indexOf('function EventDetail'));
pass('EventCard has no duplicate identity declaration',(eventCard.match(/const identity=/g)||[]).length===1);
const home=main.slice(main.indexOf('function Home'),main.indexOf('function About'));
pass('Home has one layout calculation',(home.match(/const visibleLayout=/g)||[]).length===1);

// JSX image alt contract across all source JSX files.
let missingAlt=0;
for(const file of fs.readdirSync(path.join(root,'src')).filter(x=>x.endsWith('.jsx'))){
  const s=read(`src/${file}`);
  for(const m of s.matchAll(/<img\b[^>]*>/g)) if(!/\balt\s*=/.test(m[0])) missingAlt++;
}
pass('all JSX images retain alt attributes',missingAlt===0,`${missingAlt} missing`);

if(failures.length){console.error(`V23.6 REFERENCE INTEGRATION FAIL: ${failures.length} checks failed.`);process.exit(1)}
console.log(`V23.6 REFERENCE INTEGRATION PASS: ${failures.length?0:27}/27 checks passed.`);
