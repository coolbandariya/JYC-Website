import React,{useMemo,useState} from 'react';
import {useNavigate} from 'react-router-dom';

export function InteractivePhoenix(){
  return <div className="jyc-identity-stage" aria-label="JIIT Youth Club identity"><div className="ecosystem-brand-lockup ecosystem-logo-only"><img src="/jyc-logo-official.webp" alt="JIIT Youth Club"/></div></div>
}
export function EcosystemSection({data}){
  const nav=useNavigate();
  const [active,setActive]=useState('');
  const clubs=data.clubs.filter(c=>c.published&&c.status!=='archived').length;
  const events=data.events.filter(e=>e.published&&!e.archived).length;
  const people=data.team.filter(m=>m.published===true).length;
  const nodes=[['clubs','CLUBS',Math.max(clubs,25),'/clubs'],['events','EVENTS',events,'/events'],['my-jyc','MY JYC',0,'/my-jyc'],['team','TEAM',people,'/team']];
  return <section className="section ecosystem-section reveal">
    <div className="section-head ecosystem-head"><span className="eyebrow">JYC ECOSYSTEM</span><h2>One campus. Many possibilities.</h2><p>Four useful routes around one JYC centre — explore a community, an experience, your saved space or the people behind it.</p></div>
    <div className={`ecosystem-orbit ecosystem-active-${active||'none'}`}>
      <span className="ecosystem-connector ecosystem-connector-0" aria-hidden="true"/>
      <span className="ecosystem-connector ecosystem-connector-1" aria-hidden="true"/>
      <span className="ecosystem-connector ecosystem-connector-2" aria-hidden="true"/>
      <span className="ecosystem-connector ecosystem-connector-3" aria-hidden="true"/>
      <div className="ecosystem-core-wrap">
        <button className="ecosystem-core ecosystem-core-action" onClick={()=>nav('/about')} aria-label="Open About JYC" onMouseEnter={()=>setActive('core')} onMouseLeave={()=>setActive('')}>
          <div className="ecosystem-brand-lockup ecosystem-logo-only"><img src="/jyc-logo-official.webp" alt="JIIT Youth Club"/></div>
          <span>JYC</span>
        </button>
      </div>
      {nodes.map(([id,label,count,path],i)=><div key={id} className={`ecosystem-orbit-node ecosystem-orbit-node-${i}`}>
        <button className={`ecosystem-node ecosystem-node-${i} ${active===id?'is-active':''}`} onClick={()=>nav(path)} onMouseEnter={()=>setActive(id)} onMouseLeave={()=>setActive('')} onFocus={()=>setActive(id)} onBlur={()=>setActive('')}>
          <small>{count>0?`${count}${count===25?'+':''}`:'—'}</small><strong>{label}</strong><em>Explore →</em>
        </button>
      </div>)}
    </div>
  </section>
}

export function MomentsSection({data}){
  const nav=useNavigate();
  const preferred=['pdf-jyc-10','pdf-jyc-06','pdf-dronotics-01','pdf-vamunique-01','pdf-aura-01','pdf-aakriti-02','pdf-panache-01','pdf-cicr-01','pdf-rph-01','pdf-cypherx-01','pdf-arcadia-01','pdf-neural-01','extra-event-75','extra-event-79','extra-event-80','extra-event-88']; const map=new Map(data.gallery.map(x=>[x.id,x])); const items=preferred.map(id=>map.get(id)).filter(Boolean).concat(data.gallery.filter(x=>!preferred.includes(x.id)).slice(0,8)).slice(0,18);
  return <section className="section moments-section reveal"><div className="reference-section-head"><div><span className="eyebrow">JYC MOMENTS</span><h2>Real moments. Real campus.</h2><p>The visual archive grows from photos actually published by JYC.</p></div></div>{items.length?<div className="moments-editorial">{items.map((g,i)=><button key={g.id||i} className={`moment-tile moment-${i}`} onClick={()=>nav('/gallery')}><img src={g.url} loading="lazy" alt={g.caption||'JYC moment'}/><span><small>{g.association||'JYC'}</small><strong>{g.caption||'JYC moment'}</strong></span></button>)}</div>:<div className="moments-empty"><span className="eyebrow">VISUAL ARCHIVE</span><h2>Moments will appear here as JYC publishes them.</h2><p>No synthetic imagery is used as a substitute for official campus moments.</p></div>}</section>
}
