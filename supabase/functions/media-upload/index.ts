import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.117.2';

const MAX_BYTES = 8 * 1024 * 1024;
const allowedFolders = new Set(['jyc','events','gallery','team','fests','general']);
const allowedOrigins = new Set((Deno.env.get('SITE_ORIGINS') || Deno.env.get('SITE_ORIGIN') || 'http://localhost:5173').split(',').map(x=>x.trim()).filter(Boolean));
const allowedOrigin = (origin:string|null) => origin && (allowedOrigins.has(origin) || /^https?:\\/\\/(localhost|127\\.0\\.1)(:\\d+)?$/.test(origin)) ? origin : null;

const json = (body: unknown, status = 200, origin: string | null = null) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Access-Control-Allow-Origin': allowedOrigin(origin) || 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
    'Content-Type': 'application/json'
  }
});

function detectImage(bytes: Uint8Array) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { type: 'image/jpeg', ext: 'jpg' };
  if (bytes.length >= 8 && bytes.slice(0, 8).every((v, i) => v === [0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a][i])) return { type: 'image/png', ext: 'png' };
  if (bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0,4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8,12)) === 'WEBP') return { type: 'image/webp', ext: 'webp' };
  return null;
}

function cleanFolder(value: unknown) {
  const raw = String(value || 'jyc').trim().replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
  if (!raw || raw.includes('..') || raw.split('/').some(part => !/^[a-z0-9_-]+$/i.test(part))) return null;
  return raw;
}

Deno.serve(async req => {
  const origin = req.headers.get('Origin');
  if (req.method === 'OPTIONS') return new Response('ok', { headers: {
    'Access-Control-Allow-Origin': allowedOrigin(origin) || 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin'
  }});
  if (req.method !== 'POST') return json({ error: 'POST only.' }, 405, origin);
  if (!allowedOrigin(origin)) return json({ error: 'Origin not allowed.' }, 403, origin);

  const auth = req.headers.get('Authorization') || '';
  const url = Deno.env.get('SUPABASE_URL');
  const anon = Deno.env.get('SUPABASE_ANON_KEY');
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !anon || !service) return json({ error: 'Media service is not configured.' }, 503, origin);

  const userClient = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const serviceClient = createClient(url, service);
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return json({ error: 'Administrator authentication is required.' }, 401, origin);

  const { data: admin } = await serviceClient.from('jyc_admins')
    .select('role,is_active,club_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle();
  if (!admin) return json({ error: 'This account is not authorized to upload JYC media.' }, 403, origin);

  const length = Number(req.headers.get('content-length') || 0);
  if (length > MAX_BYTES + 4096) return json({ error: 'Image must be 8 MB or smaller.' }, 413, origin);

  let form: FormData;
  try { form = await req.formData(); } catch { return json({ error: 'Invalid multipart upload.' }, 400, origin); }
  const file = form.get('file');
  const folder = cleanFolder(form.get('folder'));
  if (!(file instanceof File)) return json({ error: 'Image file is required.' }, 400, origin);
  if (!folder) return json({ error: 'Invalid media folder.' }, 400, origin);
  if (file.size === 0 || file.size > MAX_BYTES) return json({ error: 'Image must be between 1 byte and 8 MB.' }, 413, origin);

  const parts = folder.split('/');
  if (admin.role === 'club_admin') {
    if (parts.length !== 2 || parts[0] !== 'clubs' || parts[1] !== String(admin.club_id || '')) {
      return json({ error: 'Club Admin uploads must stay inside the assigned club folder.' }, 403, origin);
    }
  } else if (parts.length === 1 && !allowedFolders.has(parts[0])) {
    return json({ error: 'Unsupported media folder.' }, 400, origin);
  } else if (parts.length > 1 && parts[0] !== 'clubs') {
    return json({ error: 'Unsupported media folder.' }, 400, origin);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detected = detectImage(bytes);
  if (!detected) return json({ error: 'The uploaded bytes are not a supported JPEG, PNG or WebP image.' }, 415, origin);

  const id = crypto.randomUUID();
  const path = folder + '/' + id + '.' + detected.ext;
  const upload = await serviceClient.storage.from('jyc-media').upload(path, new Blob([bytes], { type: detected.type }), {
    cacheControl: '31536000',
    upsert: false,
    contentType: detected.type
  });
  if (upload.error) return json({ error: upload.error.message }, 500, origin);

  const { data: publicUrl } = serviceClient.storage.from('jyc-media').getPublicUrl(path);
  return json({ ok: true, path, url: publicUrl.publicUrl, contentType: detected.type }, 200, origin);
});
