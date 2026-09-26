/* JYC HUB IDENTITIES
   One JYC visual system, 21 distinct community signatures.
   The accents are intentionally muted so a hub feels unique without becoming
   a separate branded website. Copy is descriptive and based on supplied hub material.
*/
export const JYC_HUB_IDENTITIES = {
  Fortissimo:{accent:'#806b52',motif:'SOUND & PERFORMANCE',signature:'Music, ensemble and stage presence',traits:['Music','Performance','Ensemble']},
  BDS:{accent:'#98734f',motif:'RHYTHM & CULTURE',signature:'Bhangra, energy and group performance',traits:['Bhangra','Dance','Culture']},
  VamUnique:{accent:'#876d58',motif:'MOVEMENT & EXPRESSION',signature:'Dance across contemporary and classical styles',traits:['Hip Hop','Contemporary','Bollywood']},
  Panache:{accent:'#92704f',motif:'STYLE & PRESENTATION',signature:'Fashion, confidence and visual presence',traits:['Fashion','Styling','Performance']},
  RPH:{accent:'#64745f',motif:'LOGIC & COMPETITION',signature:'Algorithms, problem solving and competitive programming',traits:['DSA','Competitive Programming','Code Clash']},
  CICR:{accent:'#64745b',motif:'BUILD & PROTOTYPE',signature:'Robotics, electronics and hands-on engineering',traits:['Robotics','Prototyping','Projects']},
  Innovation:{accent:'#82724b',motif:'IDEAS & BUILDING',signature:'Innovation, mentorship and entrepreneurship',traits:['Innovation','Mentorship','Entrepreneurship']},
  Zencoders:{accent:'#68715f',motif:'CODE & CREATE',signature:'Programming practice, development and collaborative learning',traits:['Programming','Development','Coding']},
  JODC:{accent:'#68775b',motif:'OPEN & COLLABORATE',signature:'Open-source contribution and developer collaboration',traits:['Open Source','Repositories','Contribution']},
  CypherX:{accent:'#6c705f',motif:'SECURE & THINK',signature:'Cybersecurity awareness, practical learning and CTFs',traits:['Cybersecurity','CTF','Awareness']},
  Arcadia:{accent:'#74684f',motif:'PLAY & COMPETE',signature:'Esports, gaming challenges and community',traits:['Esports','Gaming','AR/VR']},
  'Neural Nexus':{accent:'#63745b',motif:'LEARN & INTELLIGENTLY BUILD',signature:'Artificial intelligence, machine learning and projects',traits:['AI / ML','Hackathons','Research']},
  GDG:{accent:'#6f735d',motif:'DEVELOP & CONNECT',signature:'Developer community, events and practical technology',traits:['Developer Community','Events','Technology']},
  Dronotics:{accent:'#61765e',motif:'FLIGHT & ENGINEERING',signature:'Drones, aerial robotics and technical competition',traits:['Drones','Aerial Robotics','Dron-O-War']},
  Aakriti:{accent:'#927452',motif:'MAKE & IMAGINE',signature:'Fine art, visual craft and campus installations',traits:['Fine Arts','Craft','Installations']},
  Aura:{accent:'#69745f',motif:'SEE & DOCUMENT',signature:'Photography, event coverage and visual storytelling',traits:['Photography','Photo Walks','Archive']},
  Cinekala:{accent:'#7d6c55',motif:'FRAME & TELL',signature:'Film, visual storytelling and screen culture',traits:['Film','Storytelling','Visuals']},
  Abhivyakti:{accent:'#856b52',motif:'PERFORM & EXPRESS',signature:'Dramatics, theatre and storytelling through performance',traits:['Dramatics','Theatre','Performance']},
  Prismatic:{accent:'#7b6c58',motif:'DESIGN & COMMUNICATE',signature:'Graphic design, visual systems and creative collaboration',traits:['Graphic Design','Visual Storytelling','Projects']},
  Eloquence:{accent:'#806c55',motif:'WRITE & SPEAK',signature:'Writing, debate, anchoring and literary expression',traits:['Writing','Speaking','Debate']},
  JSA:{accent:'#65765a',motif:'PLAY & REPRESENT',signature:'Sport, competition, teamwork and campus representation',traits:['Cricket','Football','Basketball']}
};

export function hubIdentity(name){
  const key=Object.keys(JYC_HUB_IDENTITIES).find(k=>k.toLowerCase()===String(name||'').trim().toLowerCase());
  return JYC_HUB_IDENTITIES[key]||{accent:'#9b7542',motif:'JYC COMMUNITY',signature:'A student community within JYC',traits:[]};
}
