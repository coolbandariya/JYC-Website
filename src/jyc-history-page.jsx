import React from 'react';
import {useNavigate} from 'react-router-dom';

const RESPONSIVE_CSS=`@media(max-width:800px){.jyc-history-hero,.jyc-history-intro,.jyc-history-current,.jyc-history-teaser{display:block!important}.jyc-history-principle-grid{grid-template-columns:1fr 1fr!important}.jyc-history-item{grid-template-columns:54px 1fr!important}}@media(max-width:560px){.jyc-history-principle-grid{grid-template-columns:1fr!important}.jyc-history-hero h1{font-size:48px}.jyc-history-card{padding:22px 20px!important}.jyc-history-current,.jyc-history-teaser{padding:26px 20px!important}}@media(prefers-reduced-motion:reduce){.jyc-history-page *{scroll-behavior:auto}}`;

const S={
 hero:{display:'grid',gridTemplateColumns:'1.25fr .75fr',gap:48,alignItems:'stretch',margin:'18px 0 48px',padding:'clamp(30px,5vw,72px)',border:'1px solid var(--line,rgba(21,32,48,.14))',borderRadius:28,background:'linear-gradient(135deg,var(--surface,#fff),color-mix(in srgb,var(--champagne,#c8ad7a) 12%,var(--surface,#fff)))',boxShadow:'0 24px 60px rgba(14,24,38,.08)'},
 heroTitle:{maxWidth:820,margin:'12px 0 18px',fontSize:'clamp(46px,7vw,92px)',lineHeight:.94,letterSpacing:'-.055em'},
 heroText:{maxWidth:720,fontSize:'clamp(17px,2vw,21px)',lineHeight:1.65,color:'var(--muted,#5e6672)'},
 seal:{minHeight:300,display:'grid',placeItems:'center',alignContent:'center',gap:10,border:'1px solid rgba(247,242,232,.2)',borderRadius:22,background:'var(--navy,#10233b)',color:'var(--ivory,#f7f2e8)',textAlign:'center',overflow:'hidden'},
 sealImg:{width:'min(210px,62%)',filter:'drop-shadow(0 16px 28px rgba(0,0,0,.22))'},
 intro:{display:'grid',gridTemplateColumns:'.8fr 1.2fr',gap:48,padding:'30px 0 58px',borderBottom:'1px solid var(--line,rgba(21,32,48,.14))'},
 big:{fontSize:'clamp(30px,4vw,52px)',lineHeight:1.02,letterSpacing:'-.035em',margin:'8px 0'},
 introText:{margin:0,fontSize:18,lineHeight:1.7,color:'var(--muted,#5e6672)'},
 timeline:{padding:'72px 0 30px'},
 item:{display:'grid',gridTemplateColumns:'210px minmax(0,1fr)',gap:44,position:'relative',paddingBottom:44},
 marker:{display:'flex',flexDirection:'column',alignItems:'flex-end',paddingRight:34,gap:7,textAlign:'right'},
 card:{position:'relative',border:'1px solid var(--line,rgba(21,32,48,.14))',borderRadius:22,padding:'28px 30px',background:'var(--surface,#fff)',boxShadow:'0 14px 36px rgba(14,24,38,.055)'},
 cardTitle:{fontSize:'clamp(24px,3vw,36px)',lineHeight:1.08,margin:'8px 0 12px',letterSpacing:'-.03em'},
 cardText:{fontSize:16,lineHeight:1.7,color:'var(--muted,#5e6672)',margin:'0 0 18px'},
 principles:{padding:'72px 0'},
 principleGrid:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginTop:30},
 principle:{minHeight:190,padding:24,border:'1px solid var(--line,rgba(21,32,48,.14))',borderRadius:18,background:'var(--surface,#fff)'},
 principleTitle:{fontSize:21,margin:'26px 0 8px'},
 principleText:{color:'var(--muted,#5e6672)',lineHeight:1.6,margin:0},
 current:{display:'grid',gridTemplateColumns:'1fr .8fr',gap:48,padding:42,borderRadius:24,background:'var(--navy,#10233b)',color:'var(--ivory,#f7f2e8)'},
 currentText:{maxWidth:680,color:'rgba(247,242,232,.72)',fontSize:17,lineHeight:1.7},
 links:{display:'grid',gap:10},
 link:{display:'grid',gridTemplateColumns:'34px 1fr',gridTemplateRows:'auto auto',gap:'3px 10px',padding:'14px 0',border:0,borderBottom:'1px solid rgba(247,242,232,.16)',background:'none',color:'inherit',textAlign:'left',cursor:'pointer'},
 teaser:{display:'grid',gridTemplateColumns:'1fr .85fr',gap:30,marginTop:18,padding:34,border:'1px solid var(--line,rgba(21,32,48,.14))',borderRadius:24,background:'linear-gradient(120deg,var(--surface,#fff),color-mix(in srgb,var(--champagne,#c8ad7a) 9%,var(--surface,#fff)))'},
 teaserTitle:{fontSize:'clamp(30px,4vw,50px)',lineHeight:1,letterSpacing:'-.04em',margin:'8px 0 12px'},
 teaserText:{maxWidth:650,color:'var(--muted,#5e6672)',lineHeight:1.65},
 teaserYears:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8},
 yearBtn:{border:'1px solid var(--line,rgba(21,32,48,.14))',background:'var(--surface,#fff)',color:'inherit',borderRadius:15,padding:18,textAlign:'left',cursor:'pointer'}
};

const HISTORY = [
  {
    year:'2019–20',
    label:'THE RECORD GROWS',
    title:'JYC coordinates a broad programme of hub activity.',
    text:'JIIT annual reporting records JYC activities across cultural and extracurricular hubs, including music, performances and community-facing initiatives. The record shows the model that still defines JYC: many student communities, one coordinating body.',
    source:'JIIT Annual Report 2019–20',
    href:'https://www.jiit.ac.in/uploads/Annual_Report_2019_20_3f3666a573.pdf'
  },
  {
    year:'2021',
    label:'ORIENTATION',
    title:'JYC introduces the ecosystem to a new cohort.',
    text:'The 2021–22 annual report records a JYC and associated-hubs orientation during the induction programme, with students introduced to the role of JYC and the activities of different hubs.',
    source:'JIIT Annual Report 2021–22',
    href:'https://www.jiit.ac.in/uploads/Annual_Report_2021_22_79ad4cbffd.pdf'
  },
  {
    year:'2022',
    label:'SCALE',
    title:'Hundreds of first-year students meet the JYC ecosystem.',
    text:'JIIT’s 2022–23 annual report records a larger JYC and hub orientation, with around 600 first-year students participating and more than 100 JYC and hub students helping introduce the ecosystem.',
    source:'JIIT Annual Report 2022–23',
    href:'https://www.jiit.ac.in/sites/default/files/Annual%20Report%202022-23.pdf'
  },
  {
    year:'2024',
    label:'FLAGSHIP CULTURE',
    title:'Impressions brings the JYC model onto a major stage.',
    text:'JIIT’s published record describes Impressions 2024 as a two-day annual techno-cultural fest organised by JYC with multiple hubs, combining technical and cultural experiences.',
    source:'JIIT Anunaad · Impressions 2024',
    href:'https://www.jiit.ac.in/sites/default/files/Anunaad-Vol%209-Issue2.pdf'
  },
  {
    year:'2026',
    label:'JYC · 128',
    title:'Converge becomes a Sector 128 flagship.',
    text:'JIIT’s official 2026 communication identifies Converge as the annual cultural and technical fest of Sector 128 and names JIIT Youth Club as the organising body.',
    source:'JIIT official · Converge 2026',
    href:'https://www.linkedin.com/posts/jiitofficial_converge2026-jiit-jiitnoida-activity-7437724646713536512-kt8q'
  }
];

const PRINCIPLES = [
  ['01','COORDINATE','JYC gives many communities a shared structure without erasing their individual identities.'],
  ['02','CREATE','Culture, technology, performance, literature, sport and ideas all have a place in the ecosystem.'],
  ['03','REPRESENT','JYC acts as a visible student body and a bridge between student-led activity and the institute.'],
  ['04','DELIVER','Large experiences require planning, hospitality, management, security, publicity, finance and teamwork.']
];

export function HistoryTeaser(){
  const nav=useNavigate();
  return <section className="jyc-history-teaser reveal" style={S.teaser} aria-labelledby="jyc-history-teaser-title">
    <div className="jyc-history-teaser-copy">
      <span className="eyebrow">JYC · THE RECORD</span>
      <h2 id="jyc-history-teaser-title" style={S.teaserTitle}>Built over years. Still student-led.</h2>
      <p style={S.teaserText}>JYC is more than a logo on an event poster. Its story is a record of communities coming together to create the culture of JIIT.</p>
      <button className="btn" type="button" onClick={()=>nav('/history')}>Explore the JYC story ↗</button>
    </div>
    <div className="jyc-history-teaser-years" style={S.teaserYears} aria-label="Selected JYC history years">
      {HISTORY.slice(-4).map(item=><button key={item.year} type="button" style={S.yearBtn} onClick={()=>nav('/history#'+item.year.replace('–','-'))}><span>{item.year}</span><b>{item.label}</b></button>)}
    </div>
  </section>
}

export default function JYCHistory({data}){
  const nav=useNavigate();
  return <main className="section page unified-public-page jyc-history-page"><style>{RESPONSIVE_CSS}</style>
    <div className="jyc-history-hero reveal" style={S.hero}>
      <div>
        <span className="eyebrow">JIIT YOUTH CLUB · HISTORY</span>
        <h1 style={S.heroTitle}>A living record of JYC.</h1>
        <p style={S.heroText}>From hub coordination and induction programmes to flagship campus experiences, JYC’s story is the story of students building something together.</p>
        <div className="hero-actions">
          <button className="btn" type="button" onClick={()=>nav('/clubs')}>Explore the communities ↗</button>
          <button className="btn secondary" type="button" onClick={()=>nav('/events')}>Explore the experiences →</button>
        </div>
      </div>
      <div className="jyc-history-seal" style={S.seal}>
        <img style={S.sealImg} src="/jyc-logo-official.webp" alt="JIIT Youth Club official emblem" loading="eager"/>
        <span>JYC · 128</span>
        <small>VOICE · TALENT · SPIRIT</small>
      </div>
    </div>

    <section className="jyc-history-intro reveal" style={S.intro}>
      <div><span className="eyebrow">HOW TO READ THIS</span><h2 style={S.big}>Selected milestones, not invented mythology.</h2></div>
      <p style={S.introText}>There is no single official public founding-date narrative we should manufacture. This timeline uses published JIIT records and the current public JYC identity as reference points, so the archive stays honest and expandable.</p>
    </section>

    <section className="jyc-history-timeline" style={S.timeline} aria-label="JYC historical timeline">
      {HISTORY.map((item,index)=><article className="jyc-history-item reveal" style={S.item} id={item.year.replace('–','-')} key={item.year}>
        <div className="jyc-history-marker" style={S.marker}><span>{String(index+1).padStart(2,'0')}</span><b>{item.year}</b></div>
        <div className="jyc-history-card" style={S.card}>
          <span className="eyebrow">{item.label}</span>
          <h2 style={S.cardTitle}>{item.title}</h2>
          <p style={S.cardText}>{item.text}</p>
          <a href={item.href} target="_blank" rel="noreferrer">{item.source} ↗</a>
        </div>
      </article>)}
    </section>

    <section className="jyc-history-principles reveal" style={S.principles}>
      <div className="section-head"><span className="eyebrow">THE JYC MODEL</span><h2 style={S.big}>What stays consistent.</h2><p>Across changing teams, events and communities, the role of JYC remains fundamentally organisational and cultural.</p></div>
      <div className="jyc-history-principle-grid" style={S.principleGrid}>{PRINCIPLES.map(([n,title,text])=><article key={n} style={S.principle}><b>{n}</b><h3 style={S.principleTitle}>{title}</h3><p style={S.principleText}>{text}</p></article>)}</div>
    </section>

    <section className="jyc-history-current reveal" style={S.current}>
      <div>
        <span className="eyebrow">TODAY · JIIT WISH TOWN</span>
        <h2 style={S.big}>The next chapter is written by the communities.</h2>
        <p style={S.currentText}>Keep the history page editorial and evidence-led. New flagship events, published club stories and official JYC milestones can be added here as the organisation creates them.</p>
      </div>
      <div className="jyc-history-current-links" style={S.links}>
        <a style={S.link} href="https://www.jiityouthclub128.in/" target="_blank" rel="noreferrer"><span>01</span><strong>Current JYC website ↗</strong><small>Official public reference</small></a>
        <button type="button" style={S.link} onClick={()=>nav('/archive')}><span>02</span><strong>Open JYC archive ↗</strong><small>Published events and moments</small></button>
        <button type="button" style={S.link} onClick={()=>nav('/team')}><span>03</span><strong>Meet the team ↗</strong><small>Current public leadership</small></button>
      </div>
    </section>
  </main>;
}
