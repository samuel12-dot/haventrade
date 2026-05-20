const CLOUD = 'dsqhopa3g';

export function imgUrl(url, { width = 800, quality = 'auto' } = {}) {
  if (!url) return url;
  const t = `f_auto,q_${quality},w_${width}`;
  // Only transform URLs already hosted on Cloudinary.
  // Local /images/... paths are served by Vercel's CDN as-is.
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/${t}/`);
  }
  return url;
}
