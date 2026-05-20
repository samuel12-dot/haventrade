import { useState } from 'react';
import { LISTINGS, SELLERS } from '../data/index.js';
import ListingCard  from '../components/ListingCard.jsx';
import MarketTicket from '../components/MarketTicket.jsx';
import SellerAvatar from '../components/SellerAvatar.jsx';
import { CheckIcon, StarIcon } from '../components/Icons.jsx';
import BackLink from '../components/BackLink.jsx';

export default function StorefrontScreen({ navigate, sellerId, savedSet, toggleSave, onBack, backLabel }) {
  const s     = SELLERS[sellerId || 'sanne'];
  const [tab, setTab] = useState('All items');
  const items = LISTINGS.filter((l) => l.sellerId === s.id);
  const cats  = [...new Set(items.map((l) => l.category))];
  const tabs  = ['All items', ...cats, 'About', 'Reviews', 'Policies'];

  return (
    <div>
      {/* Hero banner */}
      <div
        className={`h-[220px] relative overflow-hidden ${s.banner ? '' : `grad ${s.grad}`}`}
        style={s.banner ? { backgroundImage: `url(${s.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {s.banner && <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.28) 100%)' }} />}
        <div className="absolute top-7 right-9">
          <MarketTicket label="EST." value={s.since} rotation={3} variant="cream" lg />
        </div>
        <div className="absolute top-8 left-8">
          <span className="font-mono text-[10px] uppercase tracking-widest-2" style={{ color: 'rgba(251,246,236,0.85)' }}>STOREFRONT</span>
        </div>
      </div>

      <div className="page" style={{ marginTop: -16, paddingTop: 0 }}>
        <BackLink onClick={onBack} label={backLabel} />
        {/* Profile row */}
        <div className="flex items-start gap-5 mb-6">
          <span className="inline-flex items-center justify-center w-[72px] h-[72px] p-1 bg-canvas rounded-full flex-shrink-0 box-border" style={{ marginTop: -20 }}>
            <SellerAvatar seller={s} size="lg" />
          </span>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2.5">
              <h1 className="h-page mb-1">{s.name}</h1>
              <span className="w-6 h-6 rounded-full bg-moss text-canvas flex items-center justify-center flex-shrink-0">
                <CheckIcon size={12} />
              </span>
            </div>
            <div className="font-serif italic text-[16px] text-ink-muted">{s.neighbourhood} · {s.distance} from you</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-serif text-[28px] leading-none inline-flex items-center gap-1.5">
              <StarIcon size={20} /> {s.rating.toFixed(1)}
            </div>
            <div className="font-serif italic text-[13px] text-ink-subtle mt-1">{s.reviews} reviews</div>
          </div>
        </div>

        {/* Trust pills */}
        <div className="flex gap-2 mb-5 flex-wrap">
          <span className="tag-soft">⚡ TOP RESPONDER · 12 MIN</span>
          <span className="tag-soft tag-soft--peach">✓ ID VERIFIED</span>
          <span className="tag-soft tag-soft--cream">★ LOCAL FAVOURITE · KRALINGEN</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 py-5 mb-8 border-t border-b border-dashed border-border-strong overflow-x-auto">
          {[
            ['RESPONDS IN', '≈ 12 minutes'],
            ['DISTANCE',    `${s.distance} away`],
            ['ITEMS LISTED',`${items.length} this week`],
          ].map(([k, v], i) => (
            <div key={k} className={`px-6 ${i > 0 ? 'border-l border-dashed border-border-strong' : ''}`}>
              <div className="font-mono text-[10px] text-ink-muted mb-1 uppercase tracking-[0.14em]">{k}</div>
              <div className="font-serif text-[22px]">{v}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              className="nav-link whitespace-nowrap"
              onClick={() => setTab(t)}
              style={{
                borderRadius: 0,
                padding: '12px 18px',
                borderBottom: tab === t ? '2px solid var(--hearth)' : '2px solid transparent',
                color: tab === t ? 'var(--ink)' : 'var(--ink-muted)',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'About' ? (
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 md:gap-10 max-w-[980px] mb-[60px]">
            <div className="font-serif text-[18px] leading-[1.6] text-ink-muted">
              <p className="mt-0">I started this studio in {s.since} after years of refurbishing pieces for friends. Every chair, table or lamp here passes through my workshop on Aminu Kano Crescent — joints re-glued, finishes hand-rubbed, hardware polished — before it heads to its next home.</p>
              <p className="font-serif italic text-[22px] text-hearth border-l-[3px] border-hearth pl-[18px] my-6">
                "If a piece survived sixty years already, it deserves another sixty."
              </p>
              <p>I deliver myself by cargo bike within Maitama and the surrounding neighbourhoods — usually same evening. Pickup welcome with a coffee. Returns? If something doesn't fit your space, I'll bring the bike round and pick it up.</p>
            </div>
            <div className="flex flex-col gap-3.5">
              <MarketTicket label="WORKSHOP" value="Aminu Kano Crescent 47-B" rotation={-2} lg />
              <MarketTicket label="OPEN" value="Wed–Sat, 13:00–18:00" rotation={2} variant="saffron" lg />
              <MarketTicket label="LANGUAGES" value="EN · HA · YO" rotation={-2} variant="moss" lg />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {(tab === 'All items' ? items : items.filter((l) => l.category === tab)).map((l) => (
              <ListingCard key={l.id} listing={l} onClick={() => navigate('pdp', { id: l.id })} saved={savedSet.has(l.id)} onSave={toggleSave} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
