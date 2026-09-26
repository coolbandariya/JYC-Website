import fs from 'node:fs';
const main=fs.readFileSync('src/main.jsx','utf8');
const css=fs.readFileSync('src/v25-theme-coherence.css','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const checks=[
 ['version 23.6.0',pkg.version==='23.6.0'],
 ['journal section',main.includes('jyc-journal-section')],
 ['organisation structure',main.includes('HOW JYC IS ORGANISED')],
 ['archive collage',main.includes('archive-story-collage')],
 ['recruitment public route',main.includes('RecruitmentHub')],
 ['my jyc removed from More',!main.includes("['/my-jyc','My JYC'")],
 ['planner removed from More',!main.includes("['/planner','JYC Planner'")],
 ['public save controls hidden',css.includes('.public-app .save-btn')],
 ['source stories used',main.includes('PDF_HUB_STORIES')],
 ['no coming placeholder',!main.includes('Something is coming.')],
 ['about avoids portal planner copy',!main.includes('JYC Planner when you want those dates')]
];
let bad=0;
for(const [n,ok] of checks){console.log((ok?'PASS: ':'FAIL: ')+n);if(!ok)bad++;}
if(bad)process.exit(1);
console.log(`V23.5 JYC boundary QA: ${checks.length}/${checks.length} passed`);
