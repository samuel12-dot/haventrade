import { LISTINGS, SELLERS } from '../data/index.js';
import MarketTicket from '../components/MarketTicket.jsx';
import SellerAvatar from '../components/SellerAvatar.jsx';
import BackLink from '../components/BackLink.jsx';

function SumRow({ label, bold, val }) {
  const parts = label.match(/^([^(]*)(\(.*\))?$/);
  return (
    <div className="flex justify-between items-baseline py-2 text-[13px]">
      <span className="text-ink-muted">
        {parts[1]}{parts[2] && <span className="font-semibold text-ink">{parts[2]}</span>}
      </span>
      <span className="font-serif text-[15px] text-ink">{val}</span>
    </div>
  );
}

function OrderSummary({ subtotal, deliveryFee, platformFee, total, cta, onCta, sellerCount, itemCount, ctaDisabled }) {
  return (
    <aside className="lg:sticky lg:top-[88px] lg:self-start">
      <div className="bg-surface border border-border rounded-[20px] p-7 shadow-lift">
        <div className="font-mono text-[10px] tracking-widest mb-5" style={{ color: '#C44A2C' }}>ORDER SUMMARY</div>
        <SumRow label={`Items (${itemCount})`} val={`₦${subtotal.toLocaleString()}`} />
        <SumRow label={`Delivery (${sellerCount} ${sellerCount === 1 ? 'neighbour' : 'neighbours'})`} val={`₦${deliveryFee.toLocaleString()}`} />
        <SumRow label="Platform fee" val={`₦${platformFee.toLocaleString()}`} />
        <div className="border-t border-dashed border-border-strong my-4" />
        <div className="flex justify-between items-baseline mb-5">
          <span className="text-[15px] font-bold text-ink">Total</span>
          <span className="font-serif text-[36px] font-bold tracking-[-0.02em]" style={{ color: '#F2B544' }}>₦{total.toLocaleString()}</span>
        </div>
        <button className="btn btn--dark btn--lg w-full disabled:opacity-40 disabled:cursor-not-allowed" onClick={onCta} disabled={ctaDisabled}>
          {cta} <span className="arr">→</span>
        </button>
        <div className="font-serif italic text-xs text-ink-subtle text-center mt-3">
          One cart, one payment, multiple deliveries
        </div>
        <div className="grid grid-cols-3 gap-2 mt-5 pt-[18px] border-t border-dashed border-border-strong">
          {[
            { label: 'SECURE',   value: 'Transfer · cards', icon: (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="4" y="8" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 8V6a3 3 0 1 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )},
            { label: 'VERIFIED', value: 'Neighbours', icon: (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9.5l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )},
            { label: 'RETURNS',  value: '14 days', icon: (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.5 9A5.5 5.5 0 1 0 9 3.5H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M6 1.5v2M6 3.5H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )},
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div className="w-11 h-11 rounded-full bg-moss-soft flex items-center justify-center text-moss">
                {icon}
              </div>
              <div className="font-sans text-[9px] font-semibold uppercase tracking-widest text-moss">{label}</div>
              <div className="font-sans text-[11px] text-ink-muted">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function CartLineItem({ item, setQty, navigate }) {
  const isFree = item.price === 0;
  return (
    <div className="px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-4 border-b border-dashed border-border">
      <div className={`grad ${item.grad} w-20 h-20 rounded-xl flex-shrink-0 cursor-pointer`} onClick={() => navigate('pdp', { id: item.id })} />
      <div className="flex-1 min-w-0">
        <div className="font-serif font-bold text-[17px] leading-snug mb-1 cursor-pointer" onClick={() => navigate('pdp', { id: item.id })}>{item.title}</div>
        <div className="font-sans text-[13px] text-ink-muted mb-2">{item.condition} · {item.neighbourhood}</div>
        <div className={`inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full ${item.digital ? 'bg-saffron' : 'bg-moss-soft'}`}>
          <span className={`font-mono text-[9px] ${item.digital ? 'text-ink' : 'text-moss'}`}>
            {item.digital ? 'INSTANT DOWNLOAD' : `DELIVERS TODAY ${item.eta?.split(', ')[1] || '18:00'}`}
          </span>
        </div>
      </div>
      {!item.digital && (
        <div className="qty">
          <button onClick={() => setQty(item.id, item.qty - 1)}>−</button>
          <span className="n">{item.qty}</span>
          <button onClick={() => setQty(item.id, item.qty + 1)}>+</button>
        </div>
      )}
      <div className="min-w-[80px] text-right pl-4">
        {isFree
          ? <span className="font-serif text-xl text-moss italic">Free</span>
          : <span className="font-serif font-bold text-[24px] text-ink tracking-[-0.02em]">₦{(item.price * item.qty).toLocaleString()}</span>
        }
        <button onClick={() => setQty(item.id, 0)} className="inline-flex items-center gap-1 mt-1.5 ml-4 text-[11px] text-ink-muted hover:text-danger transition-colors">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 2.5h8M4 2.5V1.5h3v1M2.5 2.5l.5 7h5l.5-7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Remove
        </button>
      </div>
    </div>
  );
}

function SellerCartGroup({ sellerId, items, setQty, navigate }) {
  const s = SELLERS[sellerId];
  const allDigital = items.every((i) => i.digital);
  const subtotal   = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  return (
    <div className="border border-border rounded-2xl mb-3 bg-surface">
      <div className="px-5 py-4 border-b border-dashed border-border-strong flex items-center gap-3">
        <SellerAvatar seller={s} />
        <div className="flex-1">
          <div className="font-serif font-bold text-[18px] leading-[1.2] cursor-pointer" onClick={() => navigate('storefront', { id: sellerId })}>{s.name}</div>
          <div className="font-sans text-[13px] text-ink-muted mt-0.5">
            {allDigital ? `${s.neighbourhood} · instant download after checkout` : `${s.neighbourhood} · arrives today 18:00–19:00`}
          </div>
        </div>
        <div className={`border rounded-lg px-3 py-1.5 font-mono text-[9px] tracking-[0.14em] flex-shrink-0 ${allDigital ? 'border-saffron text-ink' : 'border-moss text-moss'}`}>
          {allDigital ? 'PDF + PNG' : 'ETA TODAY 18:30'}
        </div>
      </div>
      {items.map((it) => <CartLineItem key={it.id} item={it} setQty={setQty} navigate={navigate} />)}
      <div className="px-5 py-3 flex justify-between items-center border-t border-dashed border-border-strong">
        <span className="font-mono text-[10px] text-ink-subtle">SUBTOTAL · {s.name.toUpperCase()}</span>
        <span className="font-serif text-xl text-ink">₦{subtotal.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function CartScreen({ navigate, cart, setCart, onBack, backLabel }) {
  const items  = cart.map((c) => ({ ...LISTINGS.find((l) => l.id === c.lid), qty: c.qty })).filter((i) => i.id);
  const groups = {};
  items.forEach((it) => {
    if (!groups[it.sellerId]) groups[it.sellerId] = [];
    groups[it.sellerId].push(it);
  });

  const subtotal    = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = Object.keys(groups).filter((g) => !groups[g].every((i) => i.digital)).length * 1500;
  const platformFee = items.length > 0 ? 500 : 0;
  const total       = subtotal + deliveryFee + platformFee;
  const sellerCount = Object.keys(groups).length;

  const setQty = (lid, q) => {
    if (q <= 0) setCart(cart.filter((c) => c.lid !== lid));
    else setCart(cart.map((c) => (c.lid === lid ? { ...c, qty: q } : c)));
  };

  return (
    <div className="page">
      <BackLink onClick={onBack} label={backLabel} />
      <div className="grid gap-7 lg:gap-9 lg:[grid-template-columns:1.7fr_1fr]">
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <h1 className="h-page">Your cart</h1>
            {items.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="font-mono text-[10px] tracking-[0.14em] text-ink-muted hover:text-danger transition-colors"
              >
                CLEAR ALL
              </button>
            )}
          </div>
          <div className="font-serif italic text-lg text-ink-muted mb-7">
            {items.length} items from {sellerCount} {sellerCount === 1 ? 'neighbour' : 'neighbours'}
          </div>
          {Object.entries(groups).map(([sid, list], gi) => (
            <>
              <SellerCartGroup key={sid} sellerId={sid} items={list} setQty={setQty} navigate={navigate} />
              {gi === 0 && (
                <div key="promo" className="bg-saffron rounded-[14px] px-[18px] py-3.5 my-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-ink text-saffron inline-flex items-center justify-center font-mono text-sm">+</span>
                  <div className="flex-1">
                    <div className="font-mono text-[10px] text-ink">ALMOST THERE</div>
                    <div className="font-serif italic text-sm text-ink">Add ₦2,000 more from Sanne's Studio for free delivery on this group</div>
                  </div>
                  <button className="btn btn--dark btn--sm" onClick={() => navigate('storefront', { id: 'sanne' })}>BROWSE STUDIO</button>
                </div>
              )}
            </>
          ))}
          <a onClick={() => navigate('home')} className="inline-flex items-center gap-2 mt-2 text-sm text-ink-muted underline underline-offset-4 cursor-pointer">← Keep looking on your street</a>
        </div>
        <OrderSummary subtotal={subtotal} deliveryFee={deliveryFee} platformFee={platformFee} total={total} cta="Continue to checkout" onCta={() => navigate('checkout')} sellerCount={sellerCount} itemCount={items.length} ctaDisabled={items.length === 0} />
      </div>
    </div>
  );
}
