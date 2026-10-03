import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const theme=read('src/jyc-logo-final-theme.css');
const system=read('src/styles/public-system.css');
const index=read('index.html');
const manifest=read('public/manifest.json');
const main=read('src/main.jsx');

const checks=[
  [system.includes("@import '../jyc-logo-final-theme.css';"),'senior theme remains the final public CSS layer'],
  [theme.includes('--jyc-navy:#141927')&&theme.includes('--jyc-champagne:#c2a682')&&theme.includes('--jyc-ivory:#faf7ef'),'senior logo palette is explicit'],
  [theme.includes('hero-logo-stage::after')&&theme.includes('jycLogoSheen'),'hero has a restrained visible micro-interaction'],
  [theme.includes('.hero-logo-ring,')&&theme.includes('display:none!important'),'rejected orbital rings stay disabled'],
  [theme.includes('prefers-reduced-motion:reduce')&&theme.includes('jycLogoSheen'),'motion has a reduced-motion kill switch'],
  [theme.includes('prefers-contrast:more'),'higher-contrast preference is supported'],
  [theme.includes('min-width:44px')&&theme.includes('min-height:44px'),'public controls use the project 44px target contract'],
  [theme.includes('.public-app p,.public-app li{color:var(--jyc-muted-live)!important}'),'body copy has an explicit readable theme color'],
  [index.includes('theme-color" media="(prefers-color-scheme: dark)" content="#0f1420"'),'dark browser chrome uses the deep navy brand color'],
  [manifest.includes('"theme_color": "#efe3cb"'),'PWA theme color stays on the senior palette'],
  [main.includes('fetchPriority="high"')&&main.includes('decoding="async"'),'hero identity image is prioritized for first paint'],
  [main.includes('PDF_HUB_PROGRAMME.map')&&main.includes('supplied-event-programme'),'All Hubs programme material remains surfaced'],
  [main.includes('PDF_HUB_EXTRA_GALLERY')&&main.includes('PDF_HUB_STORIES'),'source archive remains wired into the public experience']
];
let failed=false;
for(const [ok,label] of checks){console.log(ok?'PASS':'FAIL',label);if(!ok)failed=true}
process.exit(failed?1:0);
