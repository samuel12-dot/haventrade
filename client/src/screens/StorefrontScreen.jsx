import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { LISTINGS, SELLERS } from '../data/index.js';
import { api, normalizeSeller } from '../api/index.js';
import ListingCard  from '../components/ListingCard.jsx';
import MarketTicket from '../components/MarketTicket.jsx';
import SellerAvatar from '../components/SellerAvatar.jsx';
import { CheckIcon, StarIcon } from '../components/Icons.jsx';
import BackLink from '../components/BackLink.jsx';

const isMongoId = (id) => /^[a-f\d]{24}$/i.test(String(id || ''));

function useInView(opts = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.02, rootMargin: '0px 0px -20px 0px', ...opts }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const NEIGHBOURHOODS = [
  'Maitama', 'Wuse 2', 'Asokoro', 'Garki', 'Utako',
  'Gwarinpa', 'Jabi', 'Central Area', 'Wuse', 'Durumi',
];

function CompleteProfileCard({ seller, onSaved }) {
  const [neighbourhood, setNeighbourhood] = useState(seller.neighbourhood || '');
  const [tagline,       setTagline]       = useState(seller.tagline || '');
  const [saving,        setSaving]        = useState(false);
  const [msg,           setMsg]           = useState('');

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile({
        neighbourhood,
        sellerProfile: { tagline },
      });
      setMsg('Saved!');
      setTimeout(() => { setMsg(''); onSaved({ neighbourhood, tagline }); }, 800);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-8 bg-saffron/20 border border-saffron rounded-2xl p-[22px]">
      <div className="font-mono text-[10px] text-hearth mb-1 uppercase tracking-widest-2">COMPLETE YOUR STALL</div>
      <div className="font-serif italic text-[15px] text-ink-muted mb-5">
        Fill in a few details so neighbours know who they're buying from.
      </div>
      <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-[480px]">
        <label className="block">
          <div className="font-mono text-[10px] text-ink-muted mb-2 tracking-[0.16em]">NEIGHBOURHOOD</div>
          <select
            className="input"
            value={neighbourhood}
            onChange={(e) => setNeighbourhood(e.target.value)}
          >
            <option value="">Select your neighbourhood…</option>
            {NEIGHBOURHOODS.map((n) => <option key={n}>{n}</option>)}
          </select>
        </label>
        <label className="block">
          <div className="font-mono text-[10px] text-ink-muted mb-2 tracking-[0.16em]">YOUR TAGLINE</div>
          <input
            className="input"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="e.g. Hand-restored furniture, delivered by bike"
            maxLength={120}
          />
        </label>
        {msg && <div className="text-sm text-moss font-medium">{msg}</div>}
        <button type="submit" disabled={saving || !neighbourhood} className="btn btn--primary self-start disabled:opacity-60">
          {saving ? 'Saving…' : 'Save details →'}
        </button>
      </form>
    </div>
  );
}

export default function StorefrontScreen({ navigate, sellerId, savedSet, toggleSave, onBack, backLabel }) {
  const { user } = useAuth();
  const isDb = isMongoId(sellerId);

  // Static seller path
  const staticSeller = !isDb ? (SELLERS[sellerId] || null) : null;
  const staticItems  = staticSeller ? LISTINGS.filter((l) => l.sellerId === staticSeller.id) : [];

  // DB seller state
  const [dbSeller,   setDbSeller]   = useState(null);
  const [dbListings, setDbListings] = useState(null);
  const [loadError,  setLoadError]  = useState(false);

  // For own-storefront inline editing (local override until page refreshes)
  const [localOverride, setLocalOverride] = useState(null);

  const [tab, setTab] = useState('All items');
  const [gridRef, gridInView] = useInView();

  useEffect(() => {
    if (!isDb) return;
    setDbSeller(null);
    setDbListings(null);
    setLoadError(false);
    setLocalOverride(null);

    api.getSeller(sellerId)
      .then(({ seller }) => setDbSeller(normalizeSeller(seller)))
      .catch(() => setLoadError(true));

    api.getSellerListings(sellerId)
      .then(({ listings }) => setDbListings(listings))
      .catch(() => setDbListings([]));
  }, [sellerId]);

  // Loading state for DB sellers
  if (isDb && !dbSeller && !loadError) {
    return (
      <div className="page flex items-center justify-center min-h-[60vh]">
        <div className="font-serif italic text-ink-subtle text-xl">Loading…</div>
      </div>
    );
  }

  // Error / not found
  if ((isDb && loadError) || (!isDb && !staticSeller)) {
    return (
      <div className="page flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="font-serif text-2xl mb-2">Stall not found.</div>
          <button className="btn btn--ghost mt-4" onClick={() => navigate('sellers')}>← Back to sellers</button>
        </div>
      </div>
    );
  }

  const s     = localOverride ? { ...(isDb ? dbSeller : staticSeller), ...localOverride } : (isDb ? dbSeller : staticSeller);
  const items = isDb ? (dbListings || []) : staticItems;
  const cats  = [...new Set(items.map((l) => l.category))];
  const tabs  = ['All items', ...cats, 'About', 'Reviews', 'Policies'];

  const isOwn      = user && isDb && (user._id === sellerId || user.id === sellerId);
  const needsSetup = isOwn && (!s.neighbourhood || !s.tagline);

  return (
    <div>
      {/* Hero banner */}
      <div
        className={`h-[220px] relative overflow-hidden ${s.banner ? '' : `grad ${s.grad}`}`}
        style={s.banner ? { backgroundImage: `url(${s.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {s.banner && (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.28) 100%)' }} />
        )}
        <div className="absolute top-7 right-9">
          {s.since && <MarketTicket label="EST." value={s.since} rotation={3} variant="cream" lg />}
        </div>
        <div className="absolute top-8 left-8">
          <span className="font-mono text-[10px] uppercase tracking-widest-2" style={{ color: 'rgba(251,246,236,0.85)' }}>STOREFRONT</span>
        </div>
      </div>

      <div className="page" style={{ marginTop: s.banner ? 0 : -16, paddingTop: s.banner ? 20 : 0 }}>
        <BackLink onClick={onBack} label={backLabel} />

        {/* Complete profile prompt — own storefront only */}
        {needsSetup && (
          <CompleteProfileCard
            seller={s}
            onSaved={(updates) => setLocalOverride((prev) => ({ ...prev, ...updates }))}
          />
        )}

        {/* Profile row */}
        <div className="flex items-start gap-5 mb-6">
          <span className="inline-flex items-center justify-center w-[72px] h-[72px] p-1 bg-canvas rounded-full flex-shrink-0 box-border" style={{ marginTop: s.banner ? 0 : -20 }}>
            <SellerAvatar seller={s} size="lg" />
          </span>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2.5">
              <h1 className="h-page mb-1">{s.name}</h1>
              {s.isVerified && (
                <span className="w-6 h-6 rounded-full bg-moss text-canvas flex items-center justify-center flex-shrink-0">
                  <CheckIcon size={12} />
                </span>
              )}
            </div>
            <div className="font-serif italic text-[16px] text-ink-muted">
              {s.neighbourhood
                ? `${s.neighbourhood}${s.distance ? ` · ${s.distance} from you` : ''}`
                : isOwn
                  ? <span className="text-hearth italic text-[14px]">Add your neighbourhood above ↑</span>
                  : <span className="text-ink-subtle italic text-[14px]">Location not set</span>
              }
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-serif text-[28px] leading-none inline-flex items-center gap-1.5">
              <StarIcon size={20} /> {(s.rating ?? 0).toFixed(1)}
            </div>
            <div className="font-serif italic text-[13px] text-ink-subtle mt-1">{s.reviews ?? 0} reviews</div>
          </div>
        </div>

        {/* Tagline */}
        {s.tagline && (
          <div className="font-serif italic text-[18px] text-ink-muted mb-5 max-w-[560px]">
            "{s.tagline}"
          </div>
        )}

        {/* Trust pills — only for static/verified sellers */}
        {!isDb && (
          <div className="flex gap-2 mb-5 flex-wrap">
            <span className="tag-soft">⚡ TOP RESPONDER · 12 MIN</span>
            <span className="tag-soft tag-soft--peach">✓ ID VERIFIED</span>
            <span className="tag-soft tag-soft--cream">★ LOCAL FAVOURITE</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 py-5 mb-8 border-t border-b border-dashed border-border-strong overflow-x-auto">
          {[
            ['ITEMS LISTED', `${items.length} listing${items.length !== 1 ? 's' : ''}`],
            ['DISTANCE',     s.distance || (isOwn ? 'Set neighbourhood' : 'Unknown')],
            ['SINCE',        s.since    || (isOwn ? 'This year'         : 'New seller')],
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
                transition: 'color 0.2s ease, border-color 0.2s ease',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'About' && (
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 md:gap-10 max-w-[980px] mb-[60px]">
            <div className="font-serif text-[18px] leading-[1.6] text-ink-muted">
              {s.tagline ? (
                <>
                  <p className="mt-0">{s.tagline}</p>
                  {s.since && (
                    <p className="font-serif italic text-[15px] text-ink-subtle">
                      Trading on HavenTrade since {s.since}.
                    </p>
                  )}
                </>
              ) : isOwn ? (
                <p className="mt-0 text-ink-subtle italic">
                  Add a tagline above to tell neighbours what you sell.
                </p>
              ) : (
                <p className="mt-0 text-ink-subtle italic">This seller hasn't added a bio yet.</p>
              )}
            </div>
            <div className="flex flex-col gap-3.5">
              {s.neighbourhood && (
                <MarketTicket label="NEIGHBOURHOOD" value={s.neighbourhood} rotation={-2} lg />
              )}
              {s.since && (
                <MarketTicket label="SINCE" value={s.since} rotation={2} variant="saffron" lg />
              )}
            </div>
          </div>
        )}

        {tab === 'Reviews' && (
          <div className="max-w-[720px]">
            {isDb ? (
              <div className="py-10 text-center font-serif italic text-ink-muted">
                No reviews yet.
              </div>
            ) : (
              [
                { who: 'Jonas', grad: 'grad-cool', when: 'two weeks ago', stars: 5, body: 'Sanne dropped it round on the cargo bike at exactly 18:00, helped me carry it up two flights. Chair is gorgeous.' },
                { who: 'Mira',  grad: 'grad-peach', when: 'a month ago', stars: 5, body: 'Honest description, beautifully refinished. Felt like buying from a friend who happens to have great taste.' },
              ].map((r, i) => (
                <div key={i} className="py-5 border-b border-dashed border-border-strong">
                  <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                    <span className={`seller-avatar grad ${r.grad}`}><span className="relative z-[1]">{r.who[0]}</span></span>
                    <span className="font-serif text-base">{r.who}</span>
                    <span className="inline-flex gap-px">{[0,1,2,3,4].map((s) => <StarIcon key={s} size={12} />)}</span>
                    <span className="font-serif italic text-xs text-ink-subtle">{r.when}</span>
                  </div>
                  <div className="font-serif text-base text-ink-muted">{r.body}</div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'Policies' && (
          <div className="max-w-[720px] font-serif text-[16px] leading-[1.6] text-ink-muted">
            <p>Returns accepted within 14 days for a full refund — neighbour-to-neighbour, no questions.</p>
            <p>All physical goods are delivered by platform-coordinated couriers on bicycles within your radius.</p>
          </div>
        )}

        {tab !== 'About' && tab !== 'Reviews' && tab !== 'Policies' && (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {(tab === 'All items' ? items : items.filter((l) => l.category === tab)).map((l, i) => (
              <div key={l.id} className={`reveal sd-${(i % 3) + 1} ${gridInView ? 'in-view' : ''}`}>
                <ListingCard
                  listing={l}
                  onClick={() => navigate('pdp', { id: l.id })}
                  saved={savedSet?.has(l.id)}
                  onSave={toggleSave}
                />
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <div className="font-serif italic text-ink-muted text-[16px]">
                  {isOwn ? 'No listings yet.' : 'Nothing listed yet.'}
                </div>
                {isOwn && (
                  <button className="btn btn--ghost btn--sm mt-4" onClick={() => navigate('editor')}>
                    + Add your first listing
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
