import React from 'react';
import {useNavigate} from 'react-router-dom';

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
  return <section className="jyc-history-teaser reveal" aria-labelledby="jyc-history-teaser-title">
    <div className="jyc-history-teaser-copy">
      <span className="eyebrow">JYC · THE RECORD</span>
      <h2 id="jyc-history-teaser-title">Built over years. Still student-led.</h2>
      <p>JYC is more than a logo on an event poster. Its story is a record of communities coming together to create the culture of JIIT.</p>
      <button className="btn" type="button" onClick={()=>nav('/history')}>Explore the JYC story ↗</button>
    </div>
    <div className="jyc-history-teaser-years" aria-label="Selected JYC history years">
      {HISTORY.slice(-4).map(item=><button key={item.year} type="button" onClick={()=>nav('/history#'+item.year.replace('–','-'))}><span>{item.year}</span><b>{item.label}</b></button>)}
    </div>
  </section>
}

export default function JYCHistory({data}){
  const nav=useNavigate();
  return <main className="section page unified-public-page jyc-history-page">
    <div className="jyc-history-hero reveal">
      <div>
        <span className="eyebrow">JIIT YOUTH CLUB · HISTORY</span>
        <h1>A living record of JYC.</h1>
        <p>From hub coordination and induction programmes to flagship campus experiences, JYC’s story is the story of students building something together.</p>
        <div className="hero-actions">
          <button className="btn" type="button" onClick={()=>nav('/clubs')}>Explore the communities ↗</button>
          <button className="btn secondary" type="button" onClick={()=>nav('/events')}>Explore the experiences →</button>
        </div>
      </div>
      <div className="jyc-history-seal">
        <img src="/jyc-logo-official.webp" alt="JIIT Youth Club official emblem" loading="eager"/>
        <span>JYC · 128</span>
        <small>VOICE · TALENT · SPIRIT</small>
      </div>
    </div>

    <section className="jyc-history-intro reveal">
      <div><span className="eyebrow">HOW TO READ THIS</span><h2>Selected milestones, not invented mythology.</h2></div>
      <p>There is no single official public founding-date narrative we should manufacture. This timeline uses published JIIT records and the current public JYC identity as reference points, so the archive stays honest and expandable.</p>
    </section>

    <section className="jyc-history-timeline" aria-label="JYC historical timeline">
      {HISTORY.map((item,index)=><article className="jyc-history-item reveal" id={item.year.replace('–','-')} key={item.year}>
        <div className="jyc-history-marker"><span>{String(index+1).padStart(2,'0')}</span><b>{item.year}</b></div>
        <div className="jyc-history-card">
          <span className="eyebrow">{item.label}</span>
          <h2>{item.title}</h2>
          <p>{item.text}</p>
          <a href={item.href} target="_blank" rel="noreferrer">{item.source} ↗</a>
        </div>
      </article>)}
    </section>

    <section className="jyc-history-principles reveal">
      <div className="section-head"><span className="eyebrow">THE JYC MODEL</span><h2>What stays consistent.</h2><p>Across changing teams, events and communities, the role of JYC remains fundamentally organisational and cultural.</p></div>
      <div className="jyc-history-principle-grid">{PRINCIPLES.map(([n,title,text])=><article key={n}><b>{n}</b><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section className="jyc-history-current reveal">
      <div>
        <span className="eyebrow">TODAY · JIIT WISH TOWN</span>
        <h2>The next chapter is written by the communities.</h2>
        <p>Keep the history page editorial and evidence-led. New flagship events, published club stories and official JYC milestones can be added here as the organisation creates them.</p>
      </div>
      <div className="jyc-history-current-links">
        <a href="https://www.jiityouthclub128.in/" target="_blank" rel="noreferrer"><span>01</span><strong>Current JYC website ↗</strong><small>Official public reference</small></a>
        <button type="button" onClick={()=>nav('/archive')}><span>02</span><strong>Open JYC archive ↗</strong><small>Published events and moments</small></button>
        <button type="button" onClick={()=>nav('/team')}><span>03</span><strong>Meet the team ↗</strong><small>Current public leadership</small></button>
      </div>
    </section>
  </main>;
}
