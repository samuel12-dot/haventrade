import { useState, useEffect } from 'react';
import { LISTINGS, CATEGORIES, SELLERS } from '../data/index.js';
import { api } from '../api/index.js';
import ListingCard  from '../components/ListingCard.jsx';
import MarketTicket from '../components/MarketTicket.jsx';
import SellerAvatar from '../components/SellerAvatar.jsx';
import { PinIcon, StarIcon } from '../components/Icons.jsx';

function FilterGroup({ title, children }) {
  return (
    <div className="pb-4 mb-4 border-b border-dashed border-border-strong">
      <div className="font-mono text-[10px] text-hearth mb-2.5 uppercase">{title}</div>
      {children}
    </div>
  );
}

function ToggleRow({ label, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-[5px] text-[13px] cursor-pointer" onClick={() => setOn(!on)}>
      <span>{label}</span>
      <span className="w-8 h-[18px] rounded-full relative transition-colors duration-200" style={{ background: on ? 'var(--moss)' : 'var(--border-strong)' }}>
        <span className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-canvas transition-all duration-200" style={{ left: on ? 16 : 2 }} />
      </span>
    </div>
  );
}

function FilterRail() {
  const cats  = ['Furniture', 'Electronics', 'Vintage', 'Kids & Baby', 'Clothing', 'Books & Media', 'Home & Garden', 'Free'];
  const conds = ['New', 'Like new', 'Good', 'Fair', 'For parts'];
  return (
    <aside className="sticky top-[88px] self-start max-h-[calc(100vh-110px)] overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl p-5">
        <FilterGroup title="Category">
          {cats.map((c) => (
            <label key={c} className="flex items-center gap-2.5 py-[5px] text-[13px] cursor-pointer">
              <input type="checkbox" defaultChecked={c === 'Furniture'} className="accent-hearth" /> {c}
              <span className="font-mono ml-auto text-[9px] text-ink-subtle">{Math.floor(Math.random() * 40 + 10)}</span>
            </label>
          ))}
        </FilterGroup>
        <FilterGroup title="Condition">
          {conds.map((c) => (
            <label key={c} className="flex items-center gap-2.5 py-[5px] text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-hearth" /> {c}
            </label>
          ))}
        </FilterGroup>
        <FilterGroup title="Price range">
          <div className="flex justify-between text-xs text-ink-muted mb-1.5">
            <span className="font-mono">€0</span><span className="font-mono">€500+</span>
          </div>
          <input type="range" min="0" max="500" defaultValue="120" className="w-full accent-hearth" />
          <div className="text-xs text-ink-subtle mt-1 font-serif italic">up to €120</div>
        </FilterGroup>
        <FilterGroup title="Distance">
          <input type="range" min="0.2" max="2" step="0.1" defaultValue="2" className="w-full accent-hearth" />
          <div className="text-xs text-ink-subtle mt-1 font-serif italic">within 2.0 km</div>
        </FilterGroup>
        <FilterGroup title="Quick toggles">
          <ToggleRow label="Free items only" />
          <ToggleRow label="Available today" defaultOn />
          <ToggleRow label="Digital only" />
        </FilterGroup>
      </div>
    </aside>
  );
}

function FeaturedSellerTile({ sellerId, navigate }) {
  const s = SELLERS[sellerId];
  if (!s) return null;
  return (
    <div
      onClick={() => navigate('storefront', { id: sellerId })}
      className="col-span-1 sm:col-span-2 bg-surface rounded-2xl border border-border shadow-lift overflow-hidden cursor-pointer flex flex-col sm:flex-row"
    >
      <div className={`grad ${s.grad} sm:flex-[0_0_200px] relative h-40 sm:h-auto`}>
        <div className="absolute top-3 left-3">
          <MarketTicket label="MEMBER SINCE" value={s.since} rotation={-2} />
        </div>
        <div className="absolute bottom-3.5 left-3.5">
          <SellerAvatar seller={s} size="lg" />
        </div>
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="font-mono text-[10px] text-hearth mb-1">FEATURED STOREFRONT</div>
          <div className="font-serif text-2xl leading-[1.05] mb-1">{s.name}</div>
          <div className="font-serif italic text-[13px] text-ink-subtle">{s.neighbourhood} · {s.distance} away · {s.rating.toFixed(1)} ★ ({s.reviews})</div>
        </div>
        <div className="flex gap-1.5 mt-3 flex-wrap">
          <span className="tag-soft">TOP RESPONDER</span>
          <span className="tag-soft tag-soft--peach">ID VERIFIED</span>
        </div>
        <div className="font-serif italic text-[13px] text-ink-muted mt-3">
          "Refinishing mid-century furniture, one careful piece at a time."
        </div>
      </div>
    </div>
  );
}

export default function HomeFeedScreen({ navigate, savedSet, toggleSave }) {
  const [activeCat,   setActiveCat]   = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sort,        setSort]        = useState('Closest');
  const [listings,    setListings]    = useState(LISTINGS);

  useEffect(() => {
    api.getListings({ limit: 48 })
      .then(({ listings: data }) => {
        // Merge DB listings (real) with static demo listings — DB first, static after
        setListings(data.length > 0 ? [...data, ...LISTINGS] : LISTINGS);
      })
      .catch(() => {});
  }, []);

  const filtered = activeCat ? listings.filter((l) => l.category === activeCat) : listings;

  return (
    <div className="page">
      {/* Stalls strip */}
      <div className="mb-7">
        <div className="flex items-baseline justify-between mb-3.5 gap-2">
          <h2 className="h-section">The market today</h2>
          <span className="font-mono text-[10px] text-ink-subtle hidden sm:block">SCROLL TO BROWSE STALLS →</span>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => {
            const active = activeCat === c.name;
            return (
              <div
                key={c.name}
                onClick={() => setActiveCat(active ? null : c.name)}
                className={`stall grad ${c.grad}${c.dark ? ' dark' : ''}`}
                style={{ outline: active ? '2px solid var(--ink)' : 'none', outlineOffset: 2 }}
              >
                <span className="icon-bg">{c.icon}</span>
                <span className="name">{c.name}</span>
                <span className="count">{c.count} ITEMS</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-start sm:items-end justify-between mb-5 flex-col sm:flex-row gap-3 sm:gap-0">
        <div>
          <h2 className="h-page mb-1">On your street right now</h2>
          <span className="font-mono text-[11px] text-ink-subtle">SHOWING {filtered.length} LISTINGS · 3061 GA — KRALINGEN</span>
        </div>
        <div className="flex gap-2.5">
          <button className="chip" onClick={() => setShowFilters(!showFilters)}>⚙ Filters {showFilters ? '—' : '+'}</button>
          <select className="chip py-[7px] px-3" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>Closest</option>
            <option>Newest</option>
            <option>Price low → high</option>
            <option>Price high → low</option>
          </select>
        </div>
      </div>

      <div className={`grid gap-7 ${showFilters ? 'lg:grid-cols-[240px_1fr]' : ''}`}>
        {showFilters && (
          <div className="hidden lg:block">
            <FilterRail />
          </div>
        )}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {filtered.map((l, i) => {
              if (i === 5) {
                return (
                  <>
                    <FeaturedSellerTile key="featured" sellerId="sanne" navigate={navigate} />
                    <ListingCard key={l.id} listing={l} onClick={() => navigate('pdp', { id: l.id })} saved={savedSet.has(l.id)} onSave={toggleSave} />
                  </>
                );
              }
              return (
                <ListingCard
                  key={l.id}
                  listing={l}
                  onClick={() => navigate('pdp', { id: l.id })}
                  saved={savedSet.has(l.id)}
                  onSave={toggleSave}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating map toggle */}
      <button
        className="fixed bottom-6 right-4 sm:right-6 bg-ink text-canvas px-5 sm:px-[22px] py-3 sm:py-3.5 rounded-full inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] font-bold z-30"
        style={{ boxShadow: '0 12px 32px rgba(31,20,16,0.25)' }}
      >
        <PinIcon size={14} /> MAP VIEW
      </button>
    </div>
  );
}
