import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const main=read('src/main.jsx');
const pkg=JSON.parse(read('package.json'));
const checks=[];
const add=(name,ok)=>checks.push({name,ok:Boolean(ok)});

add('V36 package version',pkg.version==='36.0.0');
add('Senior navigation includes About, Clubs, Events, Gallery, Leadership and Contact',
  main.includes("['About','/about']")&&main.includes("['Clubs','/clubs']")&&main.includes("['Events','/events']")&&main.includes("['Gallery','/gallery']")&&main.includes("['Leadership','/leadership']")&&main.includes("['Contact','/contact']"));
add('Leadership canonical route exists',main.includes("clean==='/team'||clean==='/leadership'")&&main.includes("'/leadership':'JYC 128 Leadership"));
add('Event Calendar canonical alias exists',main.includes("clean==='/calendar'||clean==='/event-calendar'")&&main.includes("'/event-calendar':'JYC 128 Event Calendar"));
add('Join JYC coming-soon destination exists',main.includes("clean==='/join-jyc'")&&main.includes('function JoinJYC')&&main.includes('Join JYC · Coming Soon'));
add('Home hero has required participation CTAs',main.includes("nav('/events')")&&main.includes("nav('/clubs')")&&main.includes("nav('/join-jyc')"));
add('Home hero uses senior-approved statement',main.includes('THE VOICE. THE TALENT. THE SPIRIT.'));
add('JYC 128 scope is explicit',main.includes('JIIT · SECTOR 128 · NOIDA')&&main.includes('JIIT Youth Club 128'));
add('Events expose upcoming/live/past states',main.includes("['upcoming','Upcoming',upcoming.length]")&&main.includes("['live','Live',live.length]")&&main.includes("['past','Past',past.length]"));
add('Events expose senior-requested categories',main.includes("eventCategories=['All','Cultural','Technical','Literary','Sports','Management','Social Outreach','Creative']"));
add('Event cards retain organiser, venue and registration data',main.includes('event.club')&&main.includes('event.venue')&&main.includes('registrationUrl'));
add('Event template contains rules, eligibility, prizes and FAQs',main.includes('rules:[]')&&main.includes('eligibility:')&&main.includes('prizes:[]')&&main.includes('faqs:[]'));
add('Team structure follows Faculty → Apex → Core → Clubs & Hubs',main.includes('Faculty → Apex → Core → Clubs & Hubs')&&main.includes('JYC Apex'));
add('Clubs have recruitment and social fields',main.includes("recruitment:{on:false")&&main.includes("instagram:''")&&main.includes("linkedin:''"));
add('Announcements and achievements have dedicated public routes',main.includes("clean==='/announcements'")&&main.includes("clean==='/achievements'"));
add('Gallery and archive remain public',main.includes("clean==='/gallery'")&&main.includes("clean==='/archive'"));
add('Contact form has name/email/message fields',main.includes('name="name"')&&main.includes('name="email"')&&main.includes('name="message"'));
add('Production does not use demo fallback content',main.includes('allowContentFallback:false')&&main.includes('return norm(empty)'));

const failed=checks.filter(x=>!x.ok);
for(const c of checks)console.log((c.ok?'PASS: ':'FAIL: ')+c.name);
if(failed.length){console.error('JYC V1 senior QA failed: '+failed.length+' check(s)');process.exitCode=1}
else console.log('PASS: JYC V1 senior QA ('+checks.length+' checks)');
