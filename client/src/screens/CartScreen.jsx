import { LISTINGS, SELLERS } from '../data/index.js';
import MarketTicket from '../components/MarketTicket.jsx';
import SellerAvatar from '../components/SellerAvatar.jsx';

function SumRow({ label, val }) {
  return (
    <div className="flex justify-between py-1.5 text-[13px] text-ink-muted">
      <span>{label}</span>
      <span className="font-mono text-xs text-ink tracking-normal">{val}</span>
    </div>
  );
}

function OrderSummary({ subtotal, deliveryFee, platformFee, total, cta, onCta, sellerCount }) {
  return (
    <aside className="lg:sticky lg:top-[88px] lg:self-start">
      <div className="bg-surface border border-border rounded-[20px] p-7 shadow-lift">
        <div className="font-mono text-[10px] text-hearth mb-4">ORDER SUMMARY</div>
        <SumRow label="Items subtotal" val={`€${subtotal.toFixed(2)}`} />
        <SumRow label={`Delivery (${sellerCount} ${sellerCount === 1 ? 'seller' : 'sellers'})`} val={`€${deliveryFee.toFixed(2)}`} />
        <SumRow label="Platform fee" val={`€${platformFee.toFixed(2)}`} />
        <div className="border-t border-dashed border-border-strong my-3.5" />
        <div className="flex justify-between items-baseline mb-[18px]">
          <span className="text-[13px]">Total</span>
          <span className="font-serif text-[32px] text-hearth tracking-[-0.02em]">€{total.toFixed(2)}</span>
        </div>
        <button className="btn btn--primary btn--lg w-full" onClick={onCta}>
          {cta} <span className="arr">→</span>
        </button>
        <div className="font-serif italic text-xs text-ink-subtle text-center mt-3">
          One cart, one payment, multiple deliveries
        </div>
        <div className="grid grid-cols-3 gap-2 mt-5 pt-[18px] border-t border-dashed border-border-strong">
          {[['SECURE','iDEAL + cards'],['VERIFIED','neighbours'],['RETURNS','14 days']].map(([k, v]) => (
            <div key={k} className="text-center">
              <div className="font-mono text-[8px] text-hearth mb-0.5">{k}</div>
              <div className="font-serif italic text-[11px] text-ink-muted">{v}</div>
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
        <div className="text-sm font-medium mb-1 cursor-pointer" onClick={() => navigate('pdp', { id: item.id })}>{item.title}</div>
        <div className="font-serif italic text-xs text-ink-subtle mb-1.5">{item.condition} · {item.neighbourhood}</div>
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
      <div className="min-w-[80px] text-right">
        {isFree
          ? <span className="font-serif text-xl text-moss italic">Free</span>
          : <span className="font-serif text-[22px] text-hearth">€{(item.price * item.qty).toFixed(2)}</span>
        }
        <button onClick={() => setQty(item.id, 0)} className="block mt-1 ml-auto text-[11px] text-ink-subtle underline">Remove</button>
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
          <div className="font-serif text-base leading-[1.1] cursor-pointer" onClick={() => navigate('storefront', { id: sellerId })}>{s.name}</div>
          <div className="font-serif italic text-[13px] text-ink-subtle">
            {allDigital ? `Instant download from ${s.name}` : `Delivery from ${s.neighbourhood} — today 18:00–19:00`}
          </div>
        </div>
        <MarketTicket label={allDigital ? 'FORMAT' : 'ETA'} value={allDigital ? 'PDF + PNG' : 'today, 18:30'} rotation={2} variant={allDigital ? 'saffron' : 'moss'} />
      </div>
      {items.map((it) => <CartLineItem key={it.id} item={it} setQty={setQty} navigate={navigate} />)}
      <div className="px-5 py-3 flex justify-between items-center border-t border-dashed border-border-strong">
        <span className="font-mono text-[10px] text-ink-subtle">SUBTOTAL · {s.name.toUpperCase()}</span>
        <span className="font-serif text-xl text-ink">€{subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default function CartScreen({ navigate, cart, setCart }) {
  const items  = cart.map((c) => ({ ...LISTINGS.find((l) => l.id === c.lid), qty: c.qty }));
  const groups = {};
  items.forEach((it) => {
    if (!groups[it.sellerId]) groups[it.sellerId] = [];
    groups[it.sellerId].push(it);
  });

  const subtotal    = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = Object.keys(groups).filter((g) => !groups[g].every((i) => i.digital)).length * 2.5;
  const platformFee = 0.99;
  const total       = subtotal + deliveryFee + platformFee;
  const sellerCount = Object.keys(groups).length;

  const setQty = (lid, q) => {
    if (q <= 0) setCart(cart.filter((c) => c.lid !== lid));
    else setCart(cart.map((c) => (c.lid === lid ? { ...c, qty: q } : c)));
  };

  return (
    <div className="page">
      <div className="grid gap-7 lg:gap-9 lg:[grid-template-columns:1.7fr_1fr]">
        <div>
          <h1 className="h-page mb-1.5">Your cart</h1>
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
                    <div className="font-serif italic text-sm text-ink">Add €4 more from Sanne's Studio for free delivery on this group</div>
                  </div>
                  <button className="btn btn--dark btn--sm" onClick={() => navigate('storefront', { id: 'sanne' })}>BROWSE STUDIO</button>
                </div>
              )}
            </>
          ))}
          <a onClick={() => navigate('home')} className="inline-flex items-center gap-2 mt-2 text-sm text-ink-muted underline underline-offset-4 cursor-pointer">← Keep looking on your street</a>
        </div>
        <OrderSummary subtotal={subtotal} deliveryFee={deliveryFee} platformFee={platformFee} total={total} cta="Continue to checkout" onCta={() => navigate('checkout')} sellerCount={sellerCount} />
      </div>
    </div>
  );
}
