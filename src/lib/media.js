import { supabase } from './supabase.js';

export async function uploadJycMedia(file, folder = 'jyc') {
  if (!file) throw new Error('Choose an image first.');
  if (!(file instanceof Blob)) throw new Error('Invalid image.');
  if (file.size > 8 * 1024 * 1024) throw new Error('Image must be 8 MB or smaller.');

  const body = new FormData();
  body.append('file', file, file.name || 'upload');
  body.append('folder', String(folder || 'jyc'));

  const { data, error } = await supabase.functions.invoke('media-upload', { body });
  if (error) throw error;
  if (!data?.url) throw new Error('Media upload did not return a public URL.');
  return data.url;
}
