export const JYC_SOCIALS = {
  JYC: {
    instagram: 'https://www.instagram.com/jiityouthclub128/',
    instagramHandle: '@jiityouthclub128',
    linkedin: 'https://www.linkedin.com/company/jiityouthclub/',
    label: 'JIIT Youth Club · Sector 128'
  },
  Fortissimo: {},
  BDS: {},
  VamUnique: {
    linkedin: 'https://www.linkedin.com/company/vamunique-the-dance-society-jiit-noida/',
    label: 'Vamunique · The Dance Society, JIIT Noida'
  },
  Panache: {},
  RPH: {
    linkedin: 'https://www.linkedin.com/company/rapid-programming-hub-jiit-noida/',
    label: 'Rapid Programming Hub · JIIT Noida'
  },
  CICR: {
    instagram: 'https://www.instagram.com/cicr_jiit/',
    instagramHandle: '@cicr_jiit',
    linkedin: 'https://www.linkedin.com/company/cicrjiit128/',
    website: 'https://www.cicr.in/',
    label: 'CICR · Creative & Innovative Cell in Robotics'
  },
  Innovation: {
    linkedin: 'https://www.linkedin.com/company/innovation-jiit/',
    website: 'https://www.innovationjiit.in/',
    label: 'INNOVATION JIIT'
  },
  Zencoders: {
    instagram: 'https://www.instagram.com/zencodersjiit/',
    instagramHandle: '@zencodersjiit',
    linkedin: 'https://www.linkedin.com/company/zencoders/',
    label: 'ZENCODERS'
  },
  JODC: {
    linkedin: 'https://www.linkedin.com/company/jiit-open-source-developers-circle/',
    label: 'JIIT Open-Source Developers Circle'
  },
  CypherX: {
    linkedin: 'https://www.linkedin.com/company/cypherx-jiit/',
    label: 'CypherX · JIIT-128'
  },
  Arcadia: {},
  'Neural Nexus': {},
  GDG: {
    instagram: 'https://www.instagram.com/gdg_jiit/',
    instagramHandle: '@gdg_jiit',
    linkedin: 'https://www.linkedin.com/company/dsc-jiit/',
    website: 'https://gdg-jiit.com/',
    label: 'GDG JIIT-128'
  },
  Dronotics: {
    instagram: 'https://www.instagram.com/dronoticsjiit128/',
    instagramHandle: '@dronoticsjiit128',
    website: 'https://www.dronotics.in/',
    label: 'Dronotics · JIIT-128'
  },
  Aakriti: {},
  Aura: {},
  Cinekala: {},
  Abhivyakti: {
    instagram: 'https://www.instagram.com/abhivyakti2024/',
    instagramHandle: '@abhivyakti2024',
    label: 'Abhivyakti · JIIT-128'
  },
  Prismatic: {},
  Eloquence: {},
  JSA: {}
};

export const JYC_FEST_SOCIALS = {
  'Converge 2026': {
    website: 'https://converge.cicr.in/',
    instagram: 'https://www.instagram.com/cicr_jiit/',
    instagramHandle: '@cicr_jiit',
    label: 'CICR × CONVERGE 2026'
  },
  'JAI 2026 · Jaypee Agentic AI Hackathon': {
    website: 'https://www.jiityouthclub128.in/',
    label: 'Jaypee Agentic AI International Summit 2026'
  },
  'RIDE Hack 26': {
    website: 'https://www.innovationjiit.in/',
    linkedin: 'https://www.linkedin.com/company/innovation-jiit/',
    label: 'INNOVATION JIIT'
  }
};

export function socialProfile(name){
  const key=Object.keys(JYC_SOCIALS).find(k=>k.toLowerCase()===String(name||'').trim().toLowerCase());
  return key ? {...JYC_SOCIALS[key],name:key} : null;
}

export function festSocialProfile(title){
  const key=Object.keys(JYC_FEST_SOCIALS).find(k=>String(title||'').toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(String(title||'').toLowerCase()));
  return key ? {...JYC_FEST_SOCIALS[key],title:key} : null;
}
