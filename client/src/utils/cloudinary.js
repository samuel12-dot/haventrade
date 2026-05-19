// Injects Cloudinary transformation params into a URL.
// Non-Cloudinary URLs (local /images/...) are returned unchanged.
export function imgUrl(url, { width = 800, quality = 'auto' } = {}) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_${quality},w_${width}/`);
}
