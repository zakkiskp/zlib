/**
 * resolveMediaUrl() mengecek dan merapikan path media.
 * Menggunakan URL absolut (window.location.origin) dan mengambil nama file 
 * secara langsung untuk mencegah jalur error nyasar ke /admin/avatars/ atau duplikasi storage.
 */
export function resolveMediaUrl(path) {
  console.log("resolveMediaUrl dipanggil dengan path mentah:", path);
  
  if (!path) return null;
  
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  
  // Ambil nama file terakhir saja untuk memastikan path bersih dari awalan admin/ atau storage/
  const filename = path.split('/').pop();
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const finalUrl = `${baseUrl}/storage/avatars/${filename}`;
  
  console.log("Hasil akhir URL resolveMediaUrl:", finalUrl);
  return finalUrl;
}

const baseInput =
  'rounded-lg bg-base border border-border text-sm text-ink placeholder-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all';

export const inputClass = `w-full ${baseInput} px-3.5 py-2.5`;
export const inputClassWithIcon = `w-full ${baseInput} pl-9 pr-3.5 py-2.5`;
export const selectClass = `${baseInput} px-3 py-2`;
export const dateInputClass = `${baseInput} px-2.5 py-2`;