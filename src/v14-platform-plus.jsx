import {jycToast,jycConfirm} from './lib/ui';
import React,{useMemo,useState} from 'react';
import {useParams} from 'react-router-dom';
const safe=(v)=>{try{const u=new URL(String(v||''),window.location.origin);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return ''}};

const CAMPUSES={
  '62':{id:'62',label:'Sector 62',short:'62',subtitle:'Main campus · A-10, Sector-62, Noida',lat:28.630000,lng:77.372267,address:'A-10, Sector-62, Noida-201 309, Uttar Pradesh, India',pulse:'https://jiit-pulse.vercel.app/',bbox:'77.366,28.626,77.379,28.634'},
  '128':{id:'128',label:'Sector 128',short:'128',subtitle:'Jaypee Wish Town · Sector-128, Noida',lat:28.518691,lng:77.365052,address:'Sector-128, Jaypee Wish Town Village, Sultanpur, Noida-201 304, Uttar Pradesh, India',pulse:'https://jiit-pulse.vercel.app/',bbox:'77.359,28.514,77.371,28.523'}
};
const directions=(c)=>`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${c.lat},${c.lng}`)}`;
const googleMaps=(c)=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.lat},${c.lng}`)}`;
const osmEmbed=(c)=>`https://www.openstreetmap.org/export/embed.html?bbox=${c.bbox}&layer=mapnik&marker=${c.lat},${c.lng}`;

export function CampusMapPage({data}){
 const locations=Array.isArray(data.campusMap?.locations)?data.campusMap.locations:[];
 const [campus,setCampus]=useState('128');
 const [q,setQ]=useState('');
 const [selected,setSelected]=useState(null);
 const c=CAMPUSES[campus];
 const publishedLocations=locations.filter(x=>x?.published!==false);
 const filtered=publishedLocations.filter(x=>String(x.campus||campus)===String(campus)&&(!q.trim()||`${x.name||''} ${x.type||''} ${x.description||''}`.toLowerCase().includes(q.trim().toLowerCase())));
 const selectedLocation=publishedLocations.find(x=>String(x.id)===String(selected));
 return <section className="section page platform-page campus-map-page">
  <div className="compact-page-head reveal">
   <div><span className="eyebrow">JIIT CAMPUS MAP</span><h1>Know where to go.</h1><p>Switch between JIIT campuses, find published JYC venues and open live directions for JYC event venues.</p></div>
   <div className="page-stat-row"><span><b>2</b> campuses</span><span><b>{publishedLocations.length}</b> JYC venues</span></div>
  </div>
  <div className="campus-map-toolbar reveal">
   <div className="campus-switch" role="tablist" aria-label="JIIT campus">
    {Object.values(CAMPUSES).map(x=><button key={x.id} className={campus===x.id?'active':''} onClick={()=>{setCampus(x.id);setSelected(null);setQ('')}}>{x.label}</button>)}
   </div>
   <label className="map-search"><span aria-hidden="true">⌕</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search JYC venue…" aria-label="Search campus venues"/>{q&&<button type="button" onClick={()=>setQ('')} aria-label="Clear venue search">×</button>}</label>
  </div>
  <div className="campus-map-summary reveal"><div><span className="eyebrow">CURRENT CAMPUS</span><strong>{c.label}</strong><small>{c.subtitle}</small></div><div><b>{filtered.length}</b><span>JYC venues</span></div><div><b>{data.events.filter(e=>e.published&&!e.archived&&e.map_url&&(!e.campus||String(e.campus)===String(campus)||String(e.venue||'').toLowerCase().includes(c.label.toLowerCase())||String(e.venue||'').toLowerCase().includes(c.label.toLowerCase().replace('sector ','sector-')))).length}</b><span>event-linked places</span></div><a href={googleMaps(c)} target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a><a href={directions(c)} target="_blank" rel="noopener noreferrer">Directions ↗</a></div>
  <div className="campus-map-layout reveal">
   <div className="campus-map-frame functional-map">
    <iframe title={`OpenStreetMap map for JIIT ${c.label}`} src={osmEmbed(c)} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
    <div className="map-theme-vignette" aria-hidden="true"/>
    <div className="map-overlay-card"><span className="eyebrow">SELECTED CAMPUS</span><strong>JIIT {c.label}</strong><small>{c.subtitle}</small><div><a href={directions(c)} target="_blank" rel="noopener noreferrer">Directions ↗</a></div></div>
    <div className="map-source-chip">OPENSTREETMAP · JYC CAMPUS LAYER</div>
   </div>
   <aside className="campus-map-side">
    <div className="campus-location-highlight"><span className="eyebrow">CAMPUS</span><h2>{c.label}</h2><p>{c.address}</p><div className="map-side-actions"><a className="btn" href={googleMaps(c)} target="_blank" rel="noopener noreferrer">Open JIIT in Google Maps ↗</a><a className="btn secondary" href={directions(c)} target="_blank" rel="noopener noreferrer">Get directions ↗</a></div></div>
    <div className="campus-venue-list"><div className="venue-list-head"><span className="eyebrow">JYC VENUES</span><small>{filtered.length} result{filtered.length===1?'':'s'}</small></div>{filtered.length?filtered.map((x,i)=><button key={x.id||i} className={selected===x.id?'active':''} onClick={()=>setSelected(x.id||null)}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{x.name}</strong><small>{x.type||'VENUE'} · {x.description||'Official JYC location'}</small></div><b>→</b></button>):<div className="map-empty"><strong>No published JYC venue matches.</strong><span>Try another search or check the campus selector.</span></div>}{selectedLocation&&<div className="selected-venue-card"><span className="eyebrow">SELECTED VENUE</span><strong>{selectedLocation.name}</strong><small>{selectedLocation.description||selectedLocation.type||'JYC venue'}</small><div>{selectedLocation.mapUrl&&<a href={safe(selectedLocation.mapUrl)} target="_blank" rel="noopener noreferrer">Open venue map ↗</a>}<a href={selectedLocation.lat&&selectedLocation.lng?directions({lat:selectedLocation.lat,lng:selectedLocation.lng}):directions(c)} target="_blank" rel="noopener noreferrer">Directions ↗</a></div></div>}</div>
   </aside>
  </div>
  <div className="campus-utility-grid reveal">
   <article><span className="eyebrow">JYC EVENT ROUTING</span><h3>Every published event can point to a venue.</h3><p>Admins can attach confirmed venue names and map links to event records. The public map remains useful even when no event is live.</p><button onClick={()=>window.location.assign('/events')}>Browse events →</button></article>
  </div>
  <div className="platform-note reveal"><strong>Map source</strong><span>Interactive basemap: OpenStreetMap. Campus addresses are based on JIIT's official contact information; JYC-specific venues are published by JYC administrators.</span></div>
 </section>
}

export function QRSharePage({data}){const {type,id}=useParams();const target=type==='event'?data.events.find(e=>String(e.id)===String(id)):null;const url=`${window.location.origin}/${type==='event'?'events/'+(target?.id||id):type}`;const qr=`https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=12&data=${encodeURIComponent(url)}`;const title=target?.title||'JYC';const copy=async()=>{try{await navigator.clipboard.writeText(url);jycToast('Link copied.')}catch{}};return <section className="section page platform-page qr-page"><div className="qr-shell reveal"><div><span className="eyebrow">JYC QR</span><h1>{title}</h1><p>Scan this official JYC link from another phone or display it at an event desk.</p><div className="qr-actions"><button className="btn" onClick={copy}>Copy link</button><button className="btn secondary" onClick={()=>window.print()}>Print QR</button></div></div><div className="qr-code-wrap"><img src={qr} alt={`QR code for ${title}`}/><small>{url}</small></div></div><div className="platform-note reveal"><strong>Privacy</strong><span>The QR encodes only the public JYC URL. No participant data is embedded.</span></div></section>}
