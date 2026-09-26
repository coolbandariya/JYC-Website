import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const main = fs.readFileSync(path.join(root,'src/main.jsx'),'utf8');
const phoenix = fs.readFileSync(path.join(root,'src/v14-platform.jsx'),'utf8');
const css = fs.readFileSync(path.join(root,'src/v21-ui-enhancement.css'),'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
let passed = 0;
let failed = 0;
function check(name, ok){ if(ok){console.log(`PASS: ${name}`);passed++;}else{console.error(`FAIL: ${name}`);failed++;} }

check('final package version is 23.6.0', pkg.version === '23.6.0');
check('Agentic bridge opens on home route load', main.includes("const isHome=path==='/'"));
check('Agentic bridge opens on /events and event detail routes', main.includes("const isEvents=path==='/events'||path.startsWith('/events/')"));
check('Agentic bridge has no first-visit/localStorage gate', !/agentic[\s\S]{0,250}(localStorage|storageGet|jyc-agentic)/i.test(main));
check('Agentic bridge links to the dedicated event experience', main.includes('https://demo-agentic-ai-website.vercel.app/'));
check('Agentic bridge uses its own visual system', main.includes('agentic-popup-visual') && css.includes('.agentic-popup-visual'));
check('Agentic bridge does not use JYC Phoenix artwork', !/AgenticAIPopup[\s\S]{0,3000}jyc-phoenix/i.test(main));
check('Agentic bridge supports Escape close', main.includes("if(e.key==='Escape')setOpen(false)"));
check('Agentic bridge locks page scroll while open', main.includes("document.body.style.overflow='hidden'"));
check('Phoenix orbit markup removed from the source component', !phoenix.includes('phoenix-orbital-system') && !phoenix.includes('phoenix-orbit'));
check('Theme flight bird markup removed', !main.includes('jyc-flight-layer') && !main.includes('jyc-flight-bird'));
check('Duplicate loading Phoenix ghosts removed', !main.includes('loading-ghost-a') && !main.includes('loading-ghost-b'));
check('Homepage Next JYC Moment plaque removed', !main.includes('next-event-plaque') && !main.includes('NEXT JYC MOMENT'));
check('404 secondary Phoenix removed', !/not-found-art[^\n]*jyc-phoenix/i.test(main));
check('Public alignment pass is present', css.includes('Final alignment pass'));
check('Reduced-motion Agentic fallback exists', css.includes('@media(prefers-reduced-motion:reduce)') && css.includes('.agentic-popup'));
check('Final release documentation exists', fs.existsSync(path.join(root,'RELEASE-V23.0.0-FINAL.md')));

console.log(`V21 FINAL QA: ${passed}/${passed+failed} passed.`);
if(failed) process.exit(1);
