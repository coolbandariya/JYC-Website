const CACHE_MS=15*60*1000;
let memory={at:0,items:[]};
const json=value=>{try{return JSON.parse(value||'{}')}catch{return {}}};
const unique=rows=>{const seen=new Set();return rows.filter(x=>{const key=x.externalId||x.url;if(!key||seen.has(key))return false;seen.add(key);return true})};
const cleanText=value=>String(value||'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const cfg={
 instagram:json(process.env.JYC_INSTAGRAM_ACCOUNTS),
 youtube:json(process.env.JYC_YOUTUBE_CHANNELS),
 linkedin:json(process.env.JYC_LINKEDIN_ORGS),
 rss:json(process.env.JYC_RSS_FEEDS),
 manual:Array.isArray(json(process.env.JYC_MANUAL_UPDATES))?json(process.env.JYC_MANUAL_UPDATES):[]
};
async function instagram(hub,userId){
 const token=process.env.META_ACCESS_TOKEN;if(!token||!userId)return [];
 const u=new URL('https://graph.instagram.com/'+encodeURIComponent(userId)+'/media');
 u.searchParams.set('fields','id,caption,media_type,media_url,thumbnail_url,permalink,timestamp');u.searchParams.set('limit','8');u.searchParams.set('access_token',token);
 const r=await fetch(u);if(!r.ok)throw Error('Instagram '+r.status);
 const data=await r.json();
 return (data.data||[]).map(x=>({externalId:x.id,hub,platform:'Instagram',type:x.media_type==='VIDEO'?'Video':'Post',title:cleanText(x.caption).split('. ')[0]||hub+' update',summary:cleanText(x.caption).slice(0,220),publishedAt:x.timestamp,url:x.permalink,image:x.media_type==='VIDEO'?x.thumbnail_url:x.media_url,verified:true}));
}
async function youtube(hub,channelId){
 const key=process.env.YOUTUBE_API_KEY;if(!key||!channelId)return [];
 const u=new URL('https://www.googleapis.com/youtube/v3/channels');u.searchParams.set('part','contentDetails');u.searchParams.set('id',channelId);u.searchParams.set('key',key);
 const r=await fetch(u);if(!r.ok)throw Error('YouTube channel '+r.status);
 const channel=(await r.json()).items?.[0];const playlist=channel?.contentDetails?.relatedPlaylists?.uploads;if(!playlist)return [];
 const p=new URL('https://www.googleapis.com/youtube/v3/playlistItems');p.searchParams.set('part','snippet,contentDetails');p.searchParams.set('playlistId',playlist);p.searchParams.set('maxResults','8');p.searchParams.set('key',key);
 const pr=await fetch(p);if(!pr.ok)throw Error('YouTube playlist '+pr.status);
 return ((await pr.json()).items||[]).map(x=>({externalId:x.contentDetails?.videoId,hub,platform:'YouTube',type:'Video',title:x.snippet?.title||hub+' video',summary:cleanText(x.snippet?.description).slice(0,220),publishedAt:x.snippet?.publishedAt,url:x.contentDetails?.videoId?'https://www.youtube.com/watch?v='+x.contentDetails.videoId:'',image:x.snippet?.thumbnails?.high?.url||x.snippet?.thumbnails?.medium?.url||'',verified:true}));
}
async function linkedin(hub,org){
 const token=process.env.LINKEDIN_ACCESS_TOKEN;if(!token||!org)return [];
 const author=String(org).startsWith('urn:li:organization:')?String(org):'urn:li:organization:'+String(org);
 const u=new URL('https://api.linkedin.com/rest/posts');u.searchParams.set('q','author');u.searchParams.set('author',author);u.searchParams.set('count','8');u.searchParams.set('sortBy','LAST_MODIFIED');
 const r=await fetch(u,{headers:{Authorization:'Bearer '+token,'X-Restli-Protocol-Version':'2.0.0','Linkedin-Version':process.env.JYC_LINKEDIN_VERSION||'202606'}});
 if(!r.ok)throw Error('LinkedIn '+r.status);
 const data=await r.json();
 return (data.elements||[]).filter(x=>x.lifecycleState==='PUBLISHED').map(x=>({externalId:x.id,hub,platform:'LinkedIn',type:x.content?.media?'Post':'Update',title:cleanText(x.commentary).split('. ')[0]||hub+' LinkedIn update',summary:cleanText(x.commentary).slice(0,220),publishedAt:x.publishedAt?new Date(x.publishedAt).toISOString():x.createdAt?new Date(x.createdAt).toISOString():'',url:'https://www.linkedin.com/feed/update/'+encodeURIComponent(x.id),image:'',verified:true}));
}
async function rss(hub,feedUrl){
 if(!feedUrl)return [];
 const r=await fetch(feedUrl,{headers:{accept:'application/rss+xml, application/atom+xml, text/xml'}});if(!r.ok)throw Error('RSS '+r.status);
 const xml=await r.text();const blocks=xml.match(/<(?:item|entry)\b[\s\S]*?<\/(?:item|entry)>/gi)||[];
 const get=(block,tag)=>{const m=block.match(new RegExp('<'+tag+'[^>]*>([\\s\\S]*?)<\\/'+tag+'>','i'));return m?cleanText(m[1]):''};
 return blocks.slice(0,8).map(block=>{const link=block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>(?:<\/link>)?/i);return {externalId:get(block,'guid')||get(block,'id')||link?.[1],hub,platform:'Web',type:'Update',title:get(block,'title')||hub+' update',summary:get(block,'description').slice(0,220),publishedAt:get(block,'pubDate')||get(block,'published')||get(block,'updated'),url:link?.[1]||get(block,'link'),image:'',verified:true};}).filter(x=>x.url);
}
async function manual(){return cfg.manual.map((x,i)=>({...x,externalId:x.externalId||'manual-'+i+'-'+x.url,verified:true})).filter(x=>x.url);}
async function collect(){
 const tasks=[];
 for(const [hub,id] of Object.entries(cfg.instagram||{}))tasks.push(instagram(hub,id));
 for(const [hub,id] of Object.entries(cfg.youtube||{}))tasks.push(youtube(hub,id));
 for(const [hub,id] of Object.entries(cfg.linkedin||{}))tasks.push(linkedin(hub,id));
 for(const [hub,url] of Object.entries(cfg.rss||{}))tasks.push(rss(hub,url));
 tasks.push(manual());
 const settled=await Promise.allSettled(tasks);
 const items=unique(settled.flatMap(x=>x.status==='fulfilled'?x.value:[]));
 return items.sort((a,b)=>new Date(b.publishedAt||0)-new Date(a.publishedAt||0)).slice(0,60);
}
async function dbRead(){
 const base=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SECRET_KEY;if(!base||!key)return [];
 const u=base.replace(/\/$/,'')+'/rest/v1/aggregated_posts?select=*&published=eq.true&order=published_at.desc&limit=60';
 const r=await fetch(u,{headers:{apikey:key,Authorization:'Bearer '+key}});if(!r.ok)return [];return await r.json();
}
async function dbWrite(items){
 const base=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SECRET_KEY;if(!base||!key||!items.length)return;
 const u=base.replace(/\/$/,'')+'/rest/v1/aggregated_posts?on_conflict=external_id';
 await fetch(u,{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},body:JSON.stringify(items.map(x=>({external_id:x.externalId,title:x.title,summary:x.summary||'',image_url:x.image||'',post_url:x.url,published_at:x.publishedAt||null,content_type:x.type||'Update',hub_name:x.hub,platform:x.platform,verified:true,published:true,updated_at:new Date().toISOString()})))});
}
export default async function handler(req,res){
 if(req.method!=='GET'){res.status(405).json({error:'Method not allowed'});return}
 const sync=req.query?.sync==='1';
 if(sync&&process.env.JYC_SYNC_SECRET&&req.headers['x-jyc-sync-secret']!==process.env.JYC_SYNC_SECRET){res.status(401).json({error:'Unauthorized'});return}
 if(!sync&&memory.items.length&&Date.now()-memory.at<CACHE_MS){res.setHeader('Cache-Control','s-maxage=900, stale-while-revalidate=1800');res.status(200).json({items:memory.items,live:true,cached:true});return}
 try{
  let items=await collect();
  if(items.length)await dbWrite(items);
  if(!items.length)items=await dbRead();
  memory={at:Date.now(),items};
  res.setHeader('Cache-Control','s-maxage=900, stale-while-revalidate=1800');
  res.status(200).json({items,live:items.length>0,configured:Boolean(process.env.META_ACCESS_TOKEN||process.env.YOUTUBE_API_KEY||process.env.LINKEDIN_ACCESS_TOKEN||process.env.JYC_RSS_FEEDS||process.env.JYC_MANUAL_UPDATES)});
 }catch(error){
  const fallback=await dbRead();memory={at:Date.now(),items:fallback};
  res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=600');
  res.status(200).json({items:fallback,live:false,error:'connector refresh failed'});
 }
}
