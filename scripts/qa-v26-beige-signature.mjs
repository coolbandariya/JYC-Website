import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const main=read('src/main.jsx');
const css=read('src/v26-beige-signature.css');
const index=read('index.html');
const pkg=JSON.parse(read('package.json'));
const v28=read('src/v28-editorial-system.css');
const v29=read('src/v29-interaction-polish.css');
const extra=read('src/extra-features.jsx');
const sw=read('public/sw.js');

let pass=0,fail=0;
const check=(name,ok)=>{
  if(ok){console.log(`PASS: ${name}`);pass++}
  else{console.error(`FAIL: ${name}`);fail++}
};

check('V26 visual foundation is loaded before final interaction layers',main.includes("import './v26-beige-signature.css';")&&main.includes("import './v28-editorial-system.css';")&&main.includes("import './v29-interaction-polish.css';")&&main.indexOf("v26-beige-signature.css")<main.indexOf("v28-editorial-system.css")&&main.indexOf("v28-editorial-system.css")<main.indexOf("v29-interaction-polish.css"));
check('Production HTML does not reference stale source CSS',!index.includes('/src/v27-editorial-polish.css'));
check('V27.1 surfaces the live JYC pulse',main.includes('<JYCPulse data={data}/>')&&css.includes('.pulse-strip')&&css.includes('.pulse-items'));
check('V29 interaction layer is loaded once after V28',main.includes("import './v29-interaction-polish.css';")&&main.match(/import '\.\/v29-interaction-polish\.css';/g)?.length===1&&v29.includes('--jyc-v29-focus')&&v29.includes('.theme-toggle'));
check('V29 removes loading orbit/ring decoration',v29.includes('.loading-orbit,.public-app .loading-ring{display:none!important}')||v29.includes('.public-app .loading-orbit,.public-app .loading-ring{display:none!important}'));
check('V29 keeps day/night controls visually coherent',v29.includes('.public-app .theme-toggle')&&v29.includes('html[data-theme="dark"] .public-app .theme-icon'));
check('V29 adds keyboard focus and reduced-motion safeguards',v29.includes(':focus-visible')&&v29.includes('@media(prefers-reduced-motion:reduce)'));
check('V29 keeps mobile assistant above the dock',v29.includes('.public-app .jyc-bot-launcher{right:14px!important;bottom:82px!important}'));
check('V28 editorial system is loaded after V26',main.includes("import './v28-editorial-system.css';")&&v28.includes('--jyc-v28-accent')&&v28.includes('about-hero-v28'));
check('V28 removes artificial hero dead space',v28.includes('.home .hero{min-height:auto!important;height:auto!important')&&v28.includes('.home .hero-art{height:min(430px,48vw)!important}'));
check('V28 removes legacy orbital hero rings',v28.includes('.home .hero-logo-ring,.home .hero-logo-ring-b{display:none!important}'));
check('V28 keeps the logo as the hero anchor',v28.includes('.home .hero-logo-stage')&&v28.includes('.home .hero-logo-stage img'));
check('About page is a connected editorial journey',main.includes('about-hero-v28')&&main.includes('about-family-grid-v28')&&main.includes('about-flow-grid-v28')&&main.includes('about-programme-grid-v28')&&main.includes('about-next-v28'));
check('About page links to Clubs, Events, Team and Gallery',main.includes("nav('/clubs')")&&main.includes("nav('/events')")&&main.includes("nav('/team')")&&main.includes("nav('/gallery')"));
check('V28 gives light/dark modes explicit coordinated surfaces',v28.includes('html[data-theme="dark"]')&&v28.includes('--jyc-v28-paper:#151515')&&v28.includes('--jyc-v28-surface:#0b0b0b')&&v28.includes('--jyc-v28-accent:#a47b43'));
check('V28 keeps all major page hierarchy centered',v28.includes('.public-app .section-head{text-align:center')&&v28.includes('.team-hero-panel{text-align:center')&&v28.includes('.contact-card{text-align:center'));
check('V28 responsive grids collapse without empty columns',v28.includes('@media(max-width:700px)')&&v28.includes('.about-family-grid-v28,.about-flow-grid-v28,.about-programme-grid-v28,.about-principles-v28{grid-template-columns:1fr!important}'));
check('V27.2 gives clubs and events distinct identities',main.includes('eventIdentity(e.title||e.club')&&main.includes('club-identity-mini')&&css.includes('.supplied-event-programme')&&css.includes('.club-identity-page'));
check('homepage uses a compact curated layout',main.includes("layout:['intro','agentic','events','activities','clubs','moments','hubPhotoWall','hubStories','team','cta']")||main.includes("layout:['intro','events','activities','clubs','moments','hubPhotoWall','hubStories','team','cta']")||main.includes("layout:['intro','agentic','events','clubs','moments','team','cta']")&&main.includes('const baseLayout=[...new Set(normalizedLayout.filter(x=>render[x]))]'));
check('Moments is rendered once through the layout',!main.includes('<div className="home-photo-story"><MomentsSection data={data}/></div>')&&main.includes('moments:<MomentsSection data={data}/>'));
check('fest-style event spotlight is data-driven',main.includes('jyc-festival-index')&&main.includes('jyc-feature-event')&&main.includes('featured.poster'));
check('homepage event discovery has interactive families',main.includes("eventFilter")&&main.includes("filteredEvents")&&main.includes("setEventFilter"));
check('homepage club discovery has interactive categories',main.includes("clubFilter")&&main.includes("filteredClubs")&&main.includes("setClubFilter"));
check('homepage exposes live/next event state',main.includes('jyc-now-strip')&&main.includes("eventState(e)==='live'")&&main.includes("'NEXT UP'"));
check('legacy ecosystem bird identity is replaced by JYC logo',main.includes('ecosystem-logo-only')||main.includes('jyc-logo-circle.png'));
check('gallery visibility controls Moments',main.includes("x==='moments'||x==='hubPhotoWall")&&main.includes('h.showGallery===false'));
check('gallery maps to the single moments section',main.includes("x==='gallery'?'moments'")&&main.includes("moments:<MomentsSection data={data}/>"));
check('editorial journal is rendered without the legacy duplicate hub story grid',main.includes('journal:<section')&&main.includes("'journal','hubPhotoWall'")&&main.includes("x!=='hubStories"));
check('hero contains the JYC logo, not a 3D bird',main.includes('hero-logo-stage')&&main.includes('<img src={logo}')&&!main.includes('Falcon3DLayer')&&!main.includes('v23.7-falcon-3d.jsx'));
check('team identity uses the JYC logo',main.includes('team-hero-identity')&&main.includes('team-closeout-mark')&&!main.includes('team-hero-bird'));
check('assistant does not auto-open on page load',!main.includes("window.setTimeout(()=>window.dispatchEvent(new CustomEvent('jyc-open-agentic'))"));
check('legacy atmospheric decoration is hidden',css.includes('.public-app .site-atmosphere')&&css.includes('.public-app .constellation-field'));
check('no Phoenix artwork is used for social previews',index.includes('og:image" content="/jyc-logo-circle.png"')&&index.includes('twitter:image" content="/jyc-logo-circle.png"'));
check('V26 palette is beige + neutral black/white',css.includes('--jyc-beige:#a47b43')&&css.includes('--jyc-black:#090909')&&css.includes('--jyc-white:#fffdf8'));
check('homepage hero is compact and responsive',css.includes('min-height:calc(100svh - 72px)')&&css.includes('@media(max-width:700px)'));
check('moment gallery prevents empty image space',css.includes('grid-auto-rows:145px')&&css.includes('object-fit:cover'));
check('legacy public bird/orbit layers are disabled',css.includes('.public-app .team-hero-bird')&&css.includes('.public-app .phoenix-model-viewer{display:none!important}'));
check('live assistant does not depend on deleted 3D assets',!main.includes('model-viewer')&&!main.includes('1780401615106-dmagefsj.glb')&&!main.includes('useModelViewerLoader'));
check('production data does not inject demo content when Supabase is configured',main.includes('allowContentFallback:false')&&main.includes('return mergePublicFallback(stripLegacySeed(data||empty),{allowContentFallback:false})'));
check('runtime metadata uses JYC logo rather than Phoenix artwork',extra.includes('jyc-logo-circle.png')&&!extra.includes('jyc-phoenix-reference-hd.png'));
check('service worker cache is versioned for V30 and logo-led',sw.includes('jyc-cache-v31-0-0')&&sw.includes('/jyc-logo-circle.png')&&!sw.includes('/jyc-phoenix-reference-hd.png'));
check('reduced motion remains supported',css.includes('@media(prefers-reduced-motion:reduce)'));
check('Agentic AI 2026 content is complete',main.includes('Cybersecurity')&&main.includes('Healthcare')&&main.includes('Natural Language Processing')&&main.includes('Open Innovation')&&main.includes('discord.gg/K6vrFAhMA')&&main.includes('unstop.com/o/XAfa40i'));
check('About section exposes the five-family ecosystem',main.includes('home-about-ecosystem')&&main.includes('FIVE FAMILIES · 21 COMMUNITIES'));
check('assistant is theme-safe in dark mode',css.includes('.assistant-panel-modern')&&css.includes('html[data-theme="dark"] .assistant-panel-modern')&&css.includes('.assistant-search'));
check('loading screen keeps the JYC logo and responsive boot state',main.includes('loading-mark')&&main.includes('loading-tagline')&&css.includes('.loading-mark img'));
const finalCss=fs.readFileSync(path.join(root,'src/v32-public-production-overhaul.css'),'utf8');
check('V32 final visual layer is loaded after V29',main.includes("import './v32-public-production-overhaul.css';")&&main.indexOf("v32-public-production-overhaul.css")>main.indexOf("v29-interaction-polish.css")&&finalCss.includes('--jyc32-accent'));
check('V32 light/dark surfaces have explicit readable contrast',finalCss.includes('html[data-theme="dark"]')&&finalCss.includes('--jyc32-paper:#171411')&&finalCss.includes('--jyc32-ink:#f8f1e7')&&finalCss.includes('.public-app .card p'));
check('homepage hierarchy is centered',css.includes('.home .section-head')&&css.includes('.home .jyc-feature-copy{align-items:center!important;text-align:center!important}'));
check('release metadata remains synchronized',pkg.version==='31.0.0');

if(fail)process.exit(1);
console.log(`V26 BEIGE SIGNATURE QA: ${pass}/${pass+fail} passed.`);
