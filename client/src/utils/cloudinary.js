const IS_DEV = import.meta.env.DEV;

export function imgUrl(url, { width = 800, quality = 'auto' } = {}) {
  if (!url) return url;
  if (url.includes('res.cloudinary.com')) {
    // On localhost: use the local copy in public/images (works offline)
    if (IS_DEV) {
      const idx = url.indexOf('/images/');
      if (idx !== -1) return url.slice(idx);
    }
    // In production: apply Cloudinary CDN transformations
    const t = `f_auto,q_${quality},w_${width}`;
    return url.replace('/upload/', `/upload/${t}/`);
  }
  return url;
}
