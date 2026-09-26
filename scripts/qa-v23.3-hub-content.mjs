import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const main=fs.readFileSync(path.join(root,'src/main.jsx'),'utf8');
const extra=fs.readFileSync(path.join(root,'src/pdf-hub-extra.js'),'utf8');
const pdf=fs.readFileSync(path.join(root,'src/pdf-hub-content.js'),'utf8');
const checks=[
 ['hub extra gallery module exists',fs.existsSync(path.join(root,'src/pdf-hub-extra.js'))],
 ['hub programme data exists',extra.includes('PDF_HUB_PROGRAMME')],
 ['all hub stories rendered',main.includes('PDF_HUB_STORIES.map')],
 ['extra hub gallery merged',main.includes('PDF_HUB_EXTRA_GALLERY')],
 ['homepage hub photo wall',main.includes('hub-photo-wall-section')],
 ['homepage event programme',main.includes('home-programme-grid')],
 ['no Something is coming placeholder',!main.includes('Something is coming')&&!pdf.includes('Something is coming')&&!extra.includes('Something is coming')],
 ['no Key activity areas placeholder',!main.includes('Key activity areas will appear here.')],
 ['moments use richer selection',fs.readFileSync(path.join(root,'src/v14-platform.jsx'),'utf8').includes('preferred=')]
];
let ok=0; for(const [n,v] of checks){console.log(`${v?'PASS':'FAIL'}: ${n}`); if(v)ok++}
if(ok!==checks.length)process.exit(1); console.log(`V23.3 HUB CONTENT QA: ${ok}/${checks.length} passed.`)
