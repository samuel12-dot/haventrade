import { useState } from 'react';
import { LISTINGS, SELLERS } from '../data/index.js';
import SellerAvatar       from '../components/SellerAvatar.jsx';
import DeliverySlotPicker from '../components/DeliverySlotPicker.jsx';

function SumRow({ label, val }) {
  return (
    <div className="flex justify-between py-1.5 text-[13px] text-ink-muted">
      <span>{label}</span>
      <span className="font-mono text-xs text-ink tracking-normal">{val}</span>
    </div>
  );
}

function Accordion({ num, title, subtitle, open, onToggle, children }) {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <button onClick={onToggle} className="w-full px-6 py-5 flex items-center gap-4 text-left">
        <span className={`w-8 h-8 rounded-full inline-flex items-center justify-center font-mono text-[13px] font-bold ${open ? 'bg-hearth text-canvas' : 'bg-surface-2 text-ink-muted'}`}>{num}</span>
        <div className="flex-1">
          <div className="font-serif text-xl leading-[1.1]">{title}</div>
          <div className="font-serif italic text-[13px] text-ink-subtle">{subtitle}</div>
        </div>
        <span className="text-lg text-ink-muted transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>⌄</span>
      </button>
      {open && <div className="px-6 pb-6 border-t border-dashed border-border-strong pt-5">{children}</div>}
    </div>
  );
}

function FormField({ label, value, mono = false, textarea = false }) {
  const [v, setV] = useState(value);
  return (
    <label className="block">
      <div className="font-mono text-[9px] text-ink-muted mb-1.5">{label}</div>
      {textarea
        ? <textarea className="input" value={v} onChange={(e) => setV(e.target.value)} rows={2} style={{ resize: 'vertical' }} />
        : <input className="input" value={v} onChange={(e) => setV(e.target.value)} style={mono ? { fontFamily: 'var(--mono)', letterSpacing: '0.06em' } : {}} />
      }
    </label>
  );
}

function PayOption({ k, current, set, title, sub }) {
  const sel = current === k;
  return (
    <button onClick={() => set(k)} className={`flex-1 px-[18px] py-4 rounded-[14px] text-left transition-all duration-[180ms] border-[1.5px] ${sel ? 'border-ink bg-surface-2' : 'border-border bg-surface'}`}>
      <div className="font-serif text-lg">{title}</div>
      <div className="font-serif italic text-xs text-ink-subtle mt-0.5">{sub}</div>
    </button>
  );
}

export default function CheckoutScreen({ navigate, cart }) {
  const [accordionOpen, setAccordionOpen] = useState('address');
  const [slotPicks,     setSlotPicks]     = useState({});
  const [payment,       setPayment]       = useState('ideal');

  const items = cart.map((c) => ({ ...LISTINGS.find((l) => l.id === c.lid), qty: c.qty }));
  const groups = {};
  items.forEach((it) => {
    if (!groups[it.sellerId]) groups[it.sellerId] = [];
    groups[it.sellerId].push(it);
  });

  const subtotal    = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = Object.keys(groups).filter((g) => !groups[g].every((i) => i.digital)).length * 1500;
  const platformFee = 500;
  const total       = subtotal + deliveryFee + platformFee;
  const sellerCount = Object.keys(groups).length;

  const toggle = (k) => setAccordionOpen(accordionOpen === k ? '' : k);

  return (
    <div className="page">
      <h1 className="h-page mb-1.5">Checkout</h1>
      <div className="font-serif italic text-lg text-ink-muted mb-8">Three small things, then your neighbours start preparing</div>

      <div className="grid gap-7 lg:gap-9 lg:[grid-template-columns:1.7fr_1fr]">
        <div className="flex flex-col gap-4">
          {/* 1. Address */}
          <Accordion num="1" title="Delivery address" subtitle="900237 · Maitama" open={accordionOpen === 'address'} onToggle={() => toggle('address')}>
            <div className="grid gap-[18px] md:[grid-template-columns:1fr_200px]">
              <div className="flex flex-col gap-3">
                <FormField label="FULL NAME" value="Amara Okonkwo" />
                <FormField label="STREET + NUMBER" value="Aminu Kano Crescent 47-B" />
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="POSTCODE" value="900237" mono />
                  <FormField label="CITY" value="Abuja" />
                </div>
                <FormField label="DELIVERY NOTES" value="Buzzer 47B, third floor — leave with downstairs neighbour if not home" textarea />
              </div>
              <div className="grad grad-deepmoss rounded-[14px] relative overflow-hidden min-h-[200px]">
                <div className="radius-rings">
                  <div className="ring" style={{ width: 80, height: 80 }} />
                  <div className="ring" style={{ width: 140, height: 140 }} />
                  <span className="absolute w-3 h-3 rounded-full bg-saffron" style={{ boxShadow: '0 0 0 4px rgba(242,181,68,0.3)' }} />
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="font-mono text-[9px]" style={{ color: 'rgba(251,246,236,0.8)' }}>YOU ARE HERE</span>
                </div>
              </div>
            </div>
          </Accordion>

          {/* 2. Delivery windows */}
          <Accordion num="2" title="Delivery windows" subtitle={`${sellerCount} ${sellerCount === 1 ? 'seller' : 'sellers'} · choose your slots`} open={accordionOpen === 'delivery'} onToggle={() => toggle('delivery')}>
            <div className="flex flex-col gap-[18px]">
              {Object.entries(groups).map(([sid, list]) => {
                const s = SELLERS[sid];
                const allDigital = list.every((i) => i.digital);
                if (allDigital) {
                  return (
                    <div key={sid} className="p-4 bg-canvas rounded-[14px] border border-dashed border-border-strong">
                      <div className="flex items-center gap-2.5 mb-2">
                        <SellerAvatar seller={s} />
                        <span className="font-serif text-base">{s.name}</span>
                        <span className="tag-soft tag-soft--saffron">DIGITAL · INSTANT</span>
                      </div>
                      <div className="font-serif italic text-[13px] text-ink-muted">
                        {list.length} {list.length === 1 ? 'item' : 'items'} · download link sent the moment payment clears
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={sid} className="p-4 bg-canvas rounded-[14px] border border-border">
                    <div className="flex items-center gap-2.5 mb-3">
                      <SellerAvatar seller={s} />
                      <div>
                        <div className="font-serif text-base leading-[1.1]">{s.name}</div>
                        <div className="font-serif italic text-xs text-ink-subtle">{list.length} items · cargo bike from {s.neighbourhood}</div>
                      </div>
                    </div>
                    <DeliverySlotPicker slots={[{label:'TONIGHT',value:'18:00–19:00',price:'₦1,500'},{label:'TONIGHT',value:'19:00–20:00',price:'₦1,500'},{label:'TOMORROW',value:'morning',price:'FREE'},{label:'PICKUP',value:'from seller',price:'FREE'}]} selected={slotPicks[sid] ?? 0} onSelect={(i) => setSlotPicks({ ...slotPicks, [sid]: i })} />
                  </div>
                );
              })}
            </div>
          </Accordion>

          {/* 3. Payment */}
          <Accordion num="3" title="Payment method" subtitle="Bank Transfer · Visa · Mastercard" open={accordionOpen === 'payment'} onToggle={() => toggle('payment')}>
            <div className="flex gap-3 mb-4">
              <PayOption k="ideal" current={payment} set={setPayment} title="Bank Transfer" sub="Direct from your Nigerian bank account" />
              <PayOption k="card"  current={payment} set={setPayment} title="Card"  sub="Visa, Mastercard, Amex" />
            </div>
            {payment === 'ideal' ? (
              <div>
                <div className="font-mono text-[10px] text-ink-muted mb-2">YOUR BANK</div>
                <div className="grid grid-cols-4 gap-2.5">
                  {['GTBank', 'Access Bank', 'Zenith Bank', 'First Bank'].map((b, i) => (
                    <div key={b} className={`p-[14px] text-center cursor-pointer rounded-[10px] font-medium text-[13px] border-[1.5px] ${i === 0 ? 'bg-surface-2 border-ink' : 'bg-surface border-border'}`}>{b}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <FormField label="CARD NUMBER" value="•••• •••• •••• 4242" mono />
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="EXPIRY" value="04 / 28" mono />
                  <FormField label="CVC" value="•••" mono />
                </div>
              </div>
            )}
          </Accordion>
        </div>

        {/* Order mini-summary */}
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
          <div className="bg-surface border border-border rounded-[20px] p-6 shadow-lift">
            <div className="font-mono text-[10px] text-hearth mb-4">YOUR ORDER · {items.length} ITEMS</div>
            <div className="flex flex-col gap-2.5 mb-4 pb-3.5 border-b border-dashed border-border-strong">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-2.5">
                  <div className={`grad ${it.grad} w-[38px] h-[38px] rounded-lg flex-shrink-0`} />
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">{it.title}</div>
                    <div className="font-serif italic text-ink-subtle text-[11px]">×{it.qty} · {SELLERS[it.sellerId].name}</div>
                  </div>
                  <span className="font-mono text-[11px]">{it.price === 0 ? 'FREE' : `₦${(it.price * it.qty).toLocaleString()}`}</span>
                </div>
              ))}
            </div>
            <SumRow label="Items subtotal" val={`₦${subtotal.toLocaleString()}`} />
            <SumRow label={`Delivery (${sellerCount})`} val={`₦${deliveryFee.toLocaleString()}`} />
            <SumRow label="Platform fee" val={`₦${platformFee.toLocaleString()}`} />
            <div className="border-t border-dashed border-border-strong my-3.5" />
            <div className="flex justify-between items-baseline mb-[18px]">
              <span className="text-[13px]">Total</span>
              <span className="font-serif text-[30px] text-hearth">₦{total.toLocaleString()}</span>
            </div>
            <button className="btn btn--primary btn--lg w-full" onClick={() => navigate('confirmation')}>
              Place order <span className="arr">→</span>
            </button>
            <div className="font-serif italic text-[11px] text-ink-subtle text-center mt-3 leading-[1.4]">
              By placing this order you agree to HavenTrade's neighbourly terms and our 14-day return policy.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
