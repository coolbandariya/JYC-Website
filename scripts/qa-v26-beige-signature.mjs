import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const main=read('src/main.jsx');
const extra=read('src/extra-features.jsx');
const css=read('src/v33-final-public-experience.css');
const index=read('index.html');
const pkg=JSON.parse(read('package.json'));
const sw=read('public/sw.js');
const hubContent=read('src/v21-hub-content.js');
const sourceMedia=read('src/jyc-source-media.js');

const hasExactUrl=(content,{protocol,hostname,pathname})=>{
  const matches=content.match(/https?:\/\/[^\s"'`<>)]+/g)??[];
  return matches.some(raw=>{
    try{
      const u=new URL(raw);
      return u.protocol===protocol&&u.hostname===hostname&&u.pathname===pathname;
    }catch{
      return false;
    }
  });
};

let pass=0,fail=0;
const check=(name,ok)=>{if(ok){console.log('PASS: '+name);pass++}else{console.error('FAIL: '+name);fail++}};

check('Consolidated public stylesheet is loaded exactly once',main.match(/import '\.\/styles\/public-system\.css';/g)?.length===1);
check('V33 visual layer remains inside consolidated stylesheet stack',read('src/styles/public-system.css').includes("@import '../v33-final-public-experience.css';") && read('src/styles/public-system.css').indexOf('v33-final-public-experience.css')>read('src/styles/public-system.css').indexOf('v32-public-production-overhaul.css'));
check('logo beige is the final public brand anchor',css.includes('--jyc33-brand:#f5d894')&&css.includes('--jyc33-light-bg:#f7f0e4'));
check('light/dark theme contracts are explicit',css.includes('html[data-theme="light"]')&&css.includes('html[data-theme="dark"]')&&css.includes('--jyc33-light-ink:#171411')&&css.includes('--jyc33-dark-ink:#fff9ed'));
check('public text has explicit secondary contrast',css.includes('.public-app p,.public-app li,.public-app small')&&css.includes('color:var(--jyc33-muted)!important'));
check('homepage hierarchy and motion layer are present',css.includes('.home .hero{')&&css.includes('text-align:center!important')&&css.includes('@keyframes jyc33Breath'));
check('latest updates are part of homepage',main.includes('home-latest-updates')&&main.includes('LATEST UPDATES'));
check('Join JYC Coming Soon destination exists',main.includes("clean==='/join-jyc'")&&main.includes('function JoinJYC')&&main.includes('Join JYC · Coming Soon'));
check('Team hierarchy is explicit',main.includes('Faculty → Apex → Core → Clubs & Hubs')&&main.includes('team-command-strip')&&main.includes('JYC Apex'));
check('About exposes requested principles',main.includes('WHAT WE STAND FOR')&&main.includes('about-principles-v33'));
check('Gallery supports year discovery',extra.includes('gallery-years')&&extra.includes("const years=['All'"));
check('Event details support structured extra information',main.includes('e.rules?.length')&&main.includes('e.eligibility')&&main.includes('e.prizes?.length')&&main.includes('e.faqs?.length'));
check('Contact includes official JIIT campus context',main.includes('contact-location')&&hasExactUrl(main,{protocol:'https:',hostname:'www.jiit.ac.in',pathname:'/contact-us'}));
check('mobile layout stays compact',css.includes('@media(max-width:560px)')&&css.includes('grid-template-columns:1fr'));
check('image treatment uses non-distorting crops',css.includes('object-fit:cover!important')&&css.includes('object-position:center'));
check('reduced motion remains supported',css.includes('@media(prefers-reduced-motion:reduce)'));
check('public navigation exposes Contact',main.includes("['Contact','/contact']"));
check('official JYC hub content is wired',main.includes('JYC_HUB_CONTENT')&&main.includes('JYC_HUB_FAMILIES'));
check('verified leadership content remains source-grounded',main.includes('Dr. Vinay Anand Tikkiwal')&&main.includes('Dr. Pankaj Kumar Srivastava')&&main.includes("name:'Harisha'")&&main.includes("name:'Dhruv Choudhary'"));
check('production path does not fabricate demo content',main.includes('allowContentFallback:false')&&main.includes('return norm(empty)'));
check('JYC logo remains the public hero identity',main.includes('hero-logo-stage')&&main.includes('<img src={logo}'));
check('SEO/social preview remains logo-led',index.includes('og:image" content="https://www.jiityouthclub128.in/jyc-logo-official.webp"')&&index.includes('twitter:image" content="https://www.jiityouthclub128.in/jyc-logo-official.webp"'));
check('service worker cache is current',sw.includes('jyc-cache-v38-0-0'));
const maintainedHubCount=(hubContent.match(/^\s{2}(?:'[^']+'|[A-Za-z][^:]+):\{/gm)||[]).length;
check('orientation source count stays internally consistent',main.includes('21 communities')&&main.includes("Object.keys(JYC_HUB_CONTENT).length")&&maintainedHubCount===21);
check('hub detail exposes source and live evidence layers',main.includes('hub-evidence-rail')&&main.includes('club-source')&&main.includes('Published JYC records provide the live layer'));
check('events support family-level discovery',main.includes("[family,setFamily]=useState('All')")&&main.includes('eventCategoryOf(e).toLowerCase()===family.toLowerCase()')&&main.includes('All'));
check('hub identity comment matches maintained count',read('src/hub-identities.js').includes('21 maintained community signatures'));
check('all 21 hub identities are represented',maintainedHubCount===21&&read('src/hub-identities.js').includes('21 maintained community signatures'));
check('event identity system covers supplied flagship events',read('src/hub-identities.js').includes('Dron-O-War')&&read('src/hub-identities.js').includes('Converge')&&read('src/hub-identities.js').includes('Code Clash')&&main.includes('eventIdentity(e)'));
check('event detail carries its own identity lockup',main.includes('event-identity-lockup')&&main.includes('event-identity-panel'));
check('source-first hub media helper exists',sourceMedia.includes('enrichSourceClubs')&&sourceMedia.includes('mergeSourceGallery')&&sourceMedia.includes('QUALITY_OVERRIDES'));
check('event identity fallback is deterministic',read('src/hub-identities.js').includes('EVENT_VISUALS')&&read('src/hub-identities.js').includes('hashEvent')&&read('src/hub-identities.js').includes('eventSeed'));
check('hub directory editorial preview exists',main.includes('hub-directory-stage')&&main.includes('hub-directory-preview')&&main.includes('onMouseEnter={()=>setActive(name)}'));
check('event timeline preview exists',main.includes('EventTimelinePreview')&&main.includes('event-timeline-row'));
const lock=JSON.parse(read('package-lock.json'));check('release metadata is synchronized',pkg.version===lock.version&&pkg.version===lock.packages?.['']?.version);

if(fail)process.exit(1);
console.log(`Public visual QA: ${pass}/${pass+fail} passed.`);
