import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.116.0'

Deno.serve(async (req) => {
  const auth = req.headers.get('authorization') || ''
  const expected = Deno.env.get('BACKUP_FUNCTION_TOKEN') || ''
  if (!expected || auth !== `Bearer ${expected}`) return new Response(JSON.stringify({error:'Unauthorized'}), {status:401,headers:{'content-type':'application/json'}})
  const url=Deno.env.get('SUPABASE_URL')!
  const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const db=createClient(url,service)
  const {data,error}=await db.from('jyc_site_data').select('id,data,updated_at').eq('id','main').maybeSingle()
  if(error) return new Response(JSON.stringify({error:error.message}),{status:500,headers:{'content-type':'application/json'}})
  const body=JSON.stringify({backup_at:new Date().toISOString(),source:data})
  const path=`automated/${new Date().toISOString().replace(/[:.]/g,'-')}.json`
  const upload=await db.storage.from('jyc-backups').upload(path,new Blob([body],{type:'application/json'}),{upsert:false,contentType:'application/json'})
  if(upload.error) return new Response(JSON.stringify({error:upload.error.message}),{status:500,headers:{'content-type':'application/json'}})
  return new Response(JSON.stringify({ok:true,path}),{headers:{'content-type':'application/json'}})
})
