import fs from 'node:fs';
const content=fs.readFileSync('src/hub-identities.js','utf8');
const main=fs.readFileSync('src/main.jsx','utf8');
const names=['Fortissimo','BDS','VamUnique','Panache','RPH','CICR','Innovation','Zencoders','JODC','CypherX','Arcadia','Neural Nexus','GDG','Dronotics','Aakriti','Aura','Cinekala','Abhivyakti','Prismatic','Eloquence','JSA'];
const count=(content.match(/^[ \t]*[^\n:]+:\{/gm)||[]).length;
if(count!==21) throw new Error(`Expected 21 hub identities, found ${count}`);
for(const n of names){if(!content.includes(`${n}:`) && !content.includes(`'${n}':`)) throw new Error(`Missing identity: ${n}`)}
for(const token of ['hubIdentity','hub-identity-rail','club-identity-card','data-hub']) if(!main.includes(token)) throw new Error(`Missing wiring: ${token}`);
if(!main.includes("'--club-banner':c.banner?`url(${c.banner})`:'none'")) throw new Error('Missing safe club banner fallback');
console.log('PASS: 21 JYC hub identities are defined and wired');
console.log('PASS: club cards and detail pages use shared identity variables');
console.log('PASS: missing banner fallback is safe');
console.log('V23.6 HUB IDENTITY QA: 3/3 passed');
