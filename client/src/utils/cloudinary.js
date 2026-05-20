const CLOUD = 'dsqhopa3g';

export function imgUrl(url, { width = 800, quality = 'auto' } = {}) {
  if (!url) return url;
  const t = `f_auto,q_${quality},w_${width}`;
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/${t}/`);
  }
  if (url.startsWith('/images/')) {
    const path = url.slice('/images/'.length);
    return `https://res.cloudinary.com/${CLOUD}/image/upload/${t}/${path}`;
  }
  return url;
}
