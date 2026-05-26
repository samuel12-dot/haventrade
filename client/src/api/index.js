const BASE = import.meta.env.VITE_API_URL || '/api';

// ── Fetch wrapper ─────────────────────────────────────────────────────────────

async function req(path, options = {}, attempt = 1) {
  const { body, ...rest } = options;
  const MAX_ATTEMPTS = 3;
  const RETRY_DELAY  = 4000; // ms between retries (Render cold-start needs ~30-60s total)

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...rest.headers },
      ...rest,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
      return req(path, options, attempt + 1);
    }
    throw new Error('Could not reach the server. Check your connection and try again.');
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Unexpected response from the server.');
  }

  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ── Data normalisation ────────────────────────────────────────────────────────
// Maps API shapes (MongoDB _id, populated seller) → the shape the frontend expects
// so components that already work with static data keep working unchanged.

const NEIGHBOURHOOD_DISTANCE = {
  'Maitama':      '0.4 km',
  'Wuse 2':       '1.1 km',
  'Asokoro':      '1.9 km',
  'Garki':        '0.7 km',
  'Utako':        '1.6 km',
  'Gwarinpa':     '1.8 km',
  'Jabi':         '0.6 km',
  'Central Area': '0.9 km',
};

export function normalizeSeller(s) {
  if (!s) return null;
  return {
    id:           s._id   || s.id,
    name:         s.name,
    initial:      (s.name || '?')[0],
    grad:         s.grad  || 'grad-cool',
    neighbourhood: s.neighbourhood || '',
    rating:       s.rating       ?? 0,
    reviews:      s.reviewCount  ?? s.reviews ?? 0,
    distance:     NEIGHBOURHOOD_DISTANCE[s.neighbourhood] || '?.? km',
    since:        s.sellerProfile?.since    || '',
    tagline:      s.sellerProfile?.tagline  || '',
    isSeller:     true,
    isVerified:   s.isVerified || false,
  };
}

export function normalizeListing(l) {
  const seller = l.seller ? normalizeSeller(l.seller) : null;
  return {
    id:             l._id  || l.id,
    title:          l.title,
    price:          l.price,
    sellerId:       seller?.id || l.sellerId,
    category:       l.category,
    condition:      l.condition,
    conditionLevel: l.conditionLevel || 3,
    distance:       seller ? (NEIGHBOURHOOD_DISTANCE[seller.neighbourhood] || '?.? km') : '?.? km',
    neighbourhood:  l.neighbourhood || '',
    grad:           l.grad  || 'grad-vintage',
    eta:            l.eta   || 'today',
    stock:          l.stock ?? 1,
    digital:        l.digital  || false,
    sub:            l.sub       || '',
    description:    l.description || '',
    images:         l.images    || [],
    dimensions:     l.dimensions,
    weight:         l.weight,
    materials:      l.materials,
    format:         l.format,
    license:        l.license,
    _seller:        seller, // embedded; components check this before SELLERS[sellerId]
  };
}

// ── API methods ───────────────────────────────────────────────────────────────

export const api = {
  // Auth
  register:       (body)  => req('/auth/register',     { method: 'POST',  body }),
  login:          (body)  => req('/auth/login',        { method: 'POST',  body }),
  logout:         ()      => req('/auth/logout',       { method: 'POST'        }),
  getMe:          ()      => req('/auth/me'),
  updateProfile:  (body)  => req('/auth/me',           { method: 'PATCH', body }),
  changePassword: (body)  => req('/auth/me/password',  { method: 'PATCH', body }),
  getSaved:       ()      => req('/auth/me/saved').then((d) => ({ listings: d.listings.map(normalizeListing) })),

  // Listings
  getListings: (params = {}) =>
    req(`/listings?${new URLSearchParams(params)}`).then((d) => ({
      ...d,
      listings: d.listings.map(normalizeListing),
    })),
  getListing: (id) =>
    req(`/listings/${id}`).then((d) => ({ listing: normalizeListing(d.listing) })),
  createListing: (body)       => req('/listings',          { method: 'POST',   body }),
  updateListing: (id, body)   => req(`/listings/${id}`,    { method: 'PATCH',  body }),
  deleteListing: (id)         => req(`/listings/${id}`,    { method: 'DELETE'       }),
  saveListing:   (id)         => req(`/listings/${id}/save`, { method: 'PATCH'    }),
  getSellerListings: (sellerId, params = {}) =>
    req(`/listings/seller/${sellerId}?${new URLSearchParams(params)}`).then((d) => ({
      listings: d.listings.map(normalizeListing),
    })),

  // Sellers
  getSellers: (params = {})   => req(`/sellers?${new URLSearchParams(params)}`),
  getSeller:  (id)            => req(`/sellers/${id}`),
  getSellerReviews: (id)      => req(`/sellers/${id}/reviews`),
  createReview: (id, body)    => req(`/sellers/${id}/reviews`, { method: 'POST', body }),

  // Upload — multipart/form-data, returns { url, publicId }
  uploadImage: async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const res  = await fetch(`${BASE}/upload`, { method: 'POST', credentials: 'include', body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },

  // Orders
  createOrder: (body)         => req('/orders',     { method: 'POST', body }),
  getOrders:   (params = {})  => req(`/orders?${new URLSearchParams(params)}`),
  getOrder:    (id)           => req(`/orders/${id}`),
  updateOrderStatus: (id, body) => req(`/orders/${id}/status`, { method: 'PATCH', body }),
  getSellerOrders: ()         => req('/orders/seller'),
};
