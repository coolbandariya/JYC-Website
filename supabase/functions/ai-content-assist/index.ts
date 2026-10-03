import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.116.0';

const allowedOrigins = new Set((Deno.env.get('SITE_ORIGINS') || Deno.env.get('SITE_ORIGIN') || 'http://localhost:5173').split(',').map(x=>x.trim()).filter(Boolean));
const allowedOrigin = (origin:string|null) => origin && (allowedOrigins.has(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) ? origin : null;
const headersFor=(origin:string|null)=>({
  'Access-Control-Allow-Origin':allowedOrigin(origin) || 'null',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'POST, OPTIONS',
  'Vary':'Origin'
});
const json=(body:unknown,status=200,origin:string|null=null)=>new Response(JSON.stringify(body),{status,headers:{...headersFor(origin),'Content-Type':'application/json'}});
function extractOutputText(payload:any){if(typeof payload?.output_text==='string')return payload.output_text;const chunks:string[]=[];for(const item of payload?.output||[])for(const content of item?.content||[])if(typeof content?.text==='string')chunks.push(content.text);return chunks.join('\n').trim()}
function parseJson(text:string){const cleaned=text.trim().replace(/^```json\s*/i,'').replace(/^```\s*/i,'').replace(/```$/i,'').trim();try{return JSON.parse(cleaned)}catch{const start=cleaned.indexOf('{'),end=cleaned.lastIndexOf('}');if(start>=0&&end>start)return JSON.parse(cleaned.slice(start,end+1));throw new Error('AI returned an unreadable response.')}}
const aiSchema={type:'object',additionalProperties:false,properties:{summary:{type:'string'},improved_json:{type:'string'},suggestions:{type:'array',items:{type:'string'}}},required:['summary','improved_json','suggestions']};
const system=`You are the JYC Content Copilot for a university student website at JIIT Noida. Improve editorial quality without inventing facts. Work only from supplied workspace data. Never fabricate dates, venues, people, links, achievements, rankings, sponsors, speakers, fees, or claims. Make copy concise, student-friendly, premium and specific. Preserve factual values unless the user supplied an obvious formatting issue. For SEO, improve titles/descriptions/keywords only from supplied facts. For health audits, identify missing/weak content, duplicates, inconsistent labels, schedule conflicts, broken-looking URLs and SEO gaps from the supplied data, but do not invent facts. Return ONLY valid JSON with this shape: {"summary":"short summary","improved_json":"JSON object containing only fields from the supplied input that can be safely improved","suggestions":["...","..."]}. If a field cannot be improved without missing facts, leave it unchanged and mention the missing fact in suggestions.`;
Deno.serve(async(req)=>{
  const origin=req.headers.get('Origin');
  if(req.method==='OPTIONS')return new Response('ok',{headers:headersFor(origin)});
  if(req.method!=='POST')return json({error:'POST only.'},405,origin);
  if(!allowedOrigin(origin))return json({error:'Origin not allowed.'},403,origin);
  const auth=req.headers.get('Authorization');
  if(!auth)return json({error:'Administrator authentication is required.'},401,origin);
  const supabaseUrl=Deno.env.get('SUPABASE_URL'),serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),openaiKey=Deno.env.get('OPENAI_API_KEY');
  if(!supabaseUrl||!serviceKey)return json({error:'Supabase function environment is incomplete.'},500,origin);
  if(!openaiKey)return json({error:'OPENAI_API_KEY is not configured for the AI content assistant.'},503,origin);
  const adminClient=createClient(supabaseUrl,serviceKey,{global:{headers:{Authorization:auth}}});
  const {data:{user}}=await adminClient.auth.getUser();
  if(!user)return json({error:'Administrator authentication is required.'},401,origin);
  const {data:admin}=await adminClient.from('jyc_admins').select('role,is_active').eq('user_id',user.id).eq('is_active',true).maybeSingle();
  if(!admin)return json({error:'This account is not authorized for AI content assistance.'},403,origin);
  const {data:allowed,error:rateError}=await adminClient.rpc('jyc_allow_ai_request',{p_user_id:user.id,p_limit:20});
  if(rateError)return json({error:'AI assistant rate limiter is unavailable.'},503,origin);
  if(!allowed)return json({error:'AI assistant rate limit reached. Please try again in a minute.'},429,origin);
  let body:any;try{body=await req.json()}catch{return json({error:'Invalid JSON request.'},400,origin)}
  const action=['polish','audit','seo','health'].includes(body?.action)?body.action:'audit';
  const contentLength=Number(req.headers.get('Content-Length')||0);
  if(contentLength>24000)return json({error:'Request is too large.'},413,origin);
  const context=body?.context&&typeof body.context==='object'?body.context:{};
  const serialized=JSON.stringify(context);
  if(serialized.length>18000)return json({error:'AI workspace input is too large. Open a smaller draft or reduce the amount of context.'},413,origin);
  const prompt=`${system}\n\nTASK: ${action}\nWORKSPACE: ${body?.type||'workspace'}\nDATA:\n${serialized}`;
  const model=Deno.env.get('OPENAI_MODEL')||'gpt-6-luna';
  const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${openaiKey}`},body:JSON.stringify({model,input:prompt,max_output_tokens:1800,store:false,text:{format:{type:'json_schema',name:'jyc_content_assist',strict:true,schema:aiSchema}}})});
  if(!response.ok){const detail=await response.text();return json({error:`AI provider error (${response.status}).`,detail:detail.slice(0,500)},502,origin)}
  const payload=await response.json();
  try{
    const structured=JSON.parse(extractOutputText(payload));
    let improved={};
    if(typeof structured.improved_json==='string'&&structured.improved_json.trim()) improved=JSON.parse(structured.improved_json);
    return json({result:{summary:structured.summary||'',improved,suggestions:Array.isArray(structured.suggestions)?structured.suggestions:[]},model},200,origin);
  }catch(e){return json({error:e instanceof Error?e.message:'Could not parse AI response.'},502,origin)}
});
