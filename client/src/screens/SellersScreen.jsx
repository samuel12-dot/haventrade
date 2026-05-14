import { useState, useEffect } from 'react';
import { SELLERS } from '../data/index.js';
import { api } from '../api/index.js';
import SellerAvatar from '../components/SellerAvatar.jsx';
import { StarIcon } from '../components/Icons.jsx';

const NEIGHBOURHOOD_DISTANCE = {
  'Kralingen':           '0.4 km',
  'Cool':                '1.1 km',
  'Hillegersberg':       '1.9 km',
  'Kralingen-Crooswijk': '0.7 km',
  'Nieuwe Westen':       '1.6 km',
  'Delfshaven':          '1.8 km',
};

function normalizeDbSeller(s) {
  return {
    id:           s._id,
    name:         s.name,
    initial:      (s.name || '?')[0],
    grad:         s.grad || 'grad-cool',
    neighbourhood: s.neighbourhood || '',
    rating:       s.rating ?? 0,
    reviews:      s.reviewCount ?? 0,
    distance:     NEIGHBOURHOOD_DISTANCE[s.neighbourhood] || '?.? km',
    since:        s.sellerProfile?.since || '',
    tagline:      s.sellerProfile?.tagline || '',
    isVerified:   s.isVerified || false,
    fromDb:       true,
  };
}

function SellerCard({ seller, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-surface border border-border rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform shadow-lift"
      style={{ boxShadow: 'var(--shadow-lift)' }}
    >
      {/* Banner */}
      <div className={`grad ${seller.grad} h-24 relative`} />

      {/* Body */}
      <div className="px-5 pb-5" style={{ marginTop: -28 }}>
        <div className="flex items-end justify-between mb-3">
          <span className="inline-flex p-0.5 bg-canvas rounded-full">
            <SellerAvatar seller={seller} size="lg" />
          </span>
          <div className="text-right pb-1">
            <div className="font-serif text-[20px] leading-none inline-flex items-center gap-1">
              <StarIcon size={14} /> {seller.rating.toFixed(1)}
            </div>
            <div className="font-serif italic text-[11px] text-ink-subtle mt-0.5">{seller.reviews} reviews</div>
          </div>
        </div>

        <div className="font-serif text-[18px] leading-snug mb-0.5">{seller.name}</div>
        <div className="font-serif italic text-[13px] text-ink-subtle mb-3">
          {seller.neighbourhood}{seller.distance ? ` · ${seller.distance}` : ''}
          {seller.since ? ` · since ${seller.since}` : ''}
        </div>

        {seller.tagline && (
          <div className="font-serif italic text-[13px] text-ink-muted mb-3 line-clamp-2">
            "{seller.tagline}"
          </div>
        )}

        <button className="btn btn--ghost btn--sm w-full mt-1">
          Visit stall →
        </button>
      </div>
    </div>
  );
}

export default function SellersScreen({ navigate }) {
  const staticSellers = Object.values(SELLERS);
  const [sellers, setSellers] = useState(staticSellers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSellers()
      .then(({ sellers: data }) => {
        if (data.length > 0) {
          const normalized = data.map(normalizeDbSeller);
          // DB sellers first, then static ones that don't clash by name
          const dbNames = new Set(normalized.map((s) => s.name.toLowerCase()));
          const uniqueStatic = staticSellers.filter(
            (s) => !dbNames.has(s.name.toLowerCase())
          );
          setSellers([...normalized, ...uniqueStatic]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <h1 className="h-page mb-1">Your neighbours</h1>
      <div className="font-serif italic text-[18px] text-ink-muted mb-8">
        {sellers.length} sellers trading within 2km
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sellers.map((s) => (
            <SellerCard
              key={s.id}
              seller={s}
              onClick={() => navigate('storefront', { id: s.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
