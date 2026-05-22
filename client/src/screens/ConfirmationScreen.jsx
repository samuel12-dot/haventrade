import { LISTINGS, SELLERS } from '../data/index.js';
import MarketTicket from '../components/MarketTicket.jsx';
import SellerAvatar from '../components/SellerAvatar.jsx';
import { CheckIcon } from '../components/Icons.jsx';

function SubDeliveryTimeline({ sellerId, items, index }) {
  const s          = SELLERS[sellerId];
  const allDigital = items.every((i) => i.digital);
  const stepIdx    = allDigital ? 2 : index === 0 ? 2 : 1;
  const stepLabels = allDigital
    ? ['Placed', 'Ready', 'Downloaded']
    : ['Placed', 'Accepted', 'Out for delivery', 'Delivered'];

  return (
    <div className="bg-surface border border-border rounded-[18px] p-4 sm:p-[22px] mb-[14px]">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <SellerAvatar seller={s} size="md" className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-serif text-[17px] sm:text-[19px] leading-[1.2] truncate">{s.name}</div>
          <div className="font-serif italic text-[12px] sm:text-[13px] text-ink-subtle">
            {items.length} {items.length === 1 ? 'item' : 'items'} · {allDigital ? 'instant download' : `delivery from ${s.neighbourhood}`}
          </div>
        </div>
        <div className="flex-shrink-0">
          <MarketTicket
            label={allDigital ? 'DELIVERED' : 'ETA'}
            value={allDigital ? 'just now' : index === 0 ? 'today, 18:30' : 'today, 19:00'}
            rotation={2}
            variant={allDigital ? 'moss' : 'saffron'}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-center mb-4">
        {stepLabels.map((label, i) => {
          const done    = i <= stepIdx;
          const current = i === stepIdx;
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div className={`flex-1 h-0.5 ${i <= stepIdx ? 'bg-moss' : 'bg-border'}`} />
                )}
                <span
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={{
                    background: done ? 'var(--moss)'    : 'var(--surface)',
                    border:     `1.5px ${current ? 'dashed' : 'solid'} ${done ? 'var(--moss)' : 'var(--border-strong)'}`,
                    color:      done ? 'var(--canvas)'  : 'var(--ink-subtle)',
                  }}
                >
                  {done ? <CheckIcon size={12} /> : i + 1}
                </span>
                {i < stepLabels.length - 1 && (
                  <div className={`flex-1 h-0.5 ${i < stepIdx ? 'bg-moss' : 'bg-border'}`} />
                )}
              </div>
              <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.1em] sm:tracking-[0.14em] mt-1.5 text-center leading-tight" style={{ color: current ? 'var(--ink)' : 'var(--ink-subtle)' }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Map preview if out for delivery */}
      {stepIdx === 2 && !allDigital && (
        <div className="grad grad-deepmoss h-[120px] rounded-xl relative overflow-hidden mb-[14px]">
          <div className="radius-rings">
            <div className="ring" style={{ width: 60, height: 60 }} />
            <div className="ring" style={{ width: 110, height: 110 }} />
            <span className="absolute w-3 h-3 rounded-full bg-saffron left-[30%] top-[55%]" style={{ boxShadow: '0 0 0 3px rgba(242,181,68,0.4)' }} />
            <span className="absolute w-3.5 h-3.5 rounded-full bg-surface border-2 border-ink right-[30%] top-[30%]" />
          </div>
          <div className="absolute bottom-2.5 left-3">
            <span className="font-mono text-[9px]" style={{ color: 'rgba(251,246,236,0.85)' }}>RIDER 0.6 KM AWAY</span>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-dashed border-border-strong">
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-2 py-1.5 px-2.5 bg-canvas rounded-full text-[12px]">
            <div className={`grad ${it.grad} w-[22px] h-[22px] rounded-full`} />
            <span className="font-medium">{it.title}</span>
            <span className="font-mono text-[9px] text-ink-subtle">×{it.qty}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ConfirmationScreen({ navigate, orders = [] }) {
  const order  = orders[0];
  const items  = order ? order.cart.map((c) => ({ ...LISTINGS.find((l) => l.id === c.lid), qty: c.qty })).filter(Boolean) : [];
  const groups = {};
  items.forEach((it) => {
    if (!groups[it.sellerId]) groups[it.sellerId] = [];
    groups[it.sellerId].push(it);
  });

  return (
    <div className="page">
      {/* Hero */}
      <div className="bg-moss-soft rounded-3xl p-10 mb-8 relative overflow-hidden">
        {order && (
          <div className="absolute top-6 right-8 anim-fade-in ad-3">
            <MarketTicket label="ORDER" value={`N° ${order.num}`} rotation={2} variant="moss" lg />
          </div>
        )}
        <div className="w-[72px] h-[72px] rounded-full bg-moss text-canvas flex items-center justify-center mb-[18px] anim-fade-up ad-0">
          <CheckIcon size={28} />
        </div>
        <h1 className="h-page mb-2 anim-fade-up ad-1">Order placed!</h1>
        <div className="font-serif italic text-[19px] text-ink-muted max-w-[580px] leading-[1.4] anim-fade-up ad-2">
          Your neighbours have been notified. {Object.keys(groups).length} sub-deliveries are being prepared — we'll keep you posted as each one moves.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-7 lg:gap-9">
        <div>
          <div className="divider-ticket">
            <span className="mono text-[11px] text-hearth">YOUR DELIVERIES · TIMELINE</span>
          </div>
          {Object.entries(groups).map(([sid, list], gi) => (
            <div key={sid} className={`anim-fade-up ad-${Math.min(gi + 2, 6)}`}>
              <SubDeliveryTimeline sellerId={sid} items={list} index={gi} />
            </div>
          ))}
        </div>

        <aside>
          <div className="bg-surface border border-border rounded-[20px] p-6 mb-4">
            <div className="font-mono text-[10px] text-hearth uppercase tracking-widest-2 mb-[14px]">WHAT'S NEXT</div>
            {[
              { mono: '01', t: 'Track every sub-delivery',   body: "We'll text you when each rider rolls out." },
              { mono: '02', t: 'Download digital items',      body: 'Already in your inbox + library.' },
              { mono: '03', t: 'Rate after delivery',         body: 'Two taps. Helps the next neighbour.' },
              { mono: '04', t: 'Message the seller',          body: 'Forgot to ask something? Just write.' },
            ].map((s) => (
              <div key={s.mono} className="flex gap-3 py-3 border-b border-dashed border-border-strong">
                <span className="font-mono text-[11px] text-hearth flex-shrink-0">{s.mono}</span>
                <div>
                  <div className="text-[14px] font-medium">{s.t}</div>
                  <div className="font-serif italic text-[12px] text-ink-subtle">{s.body}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn--ghost w-full mb-2" onClick={() => navigate('orders')}>View all orders</button>
          <button className="btn btn--dark w-full"  onClick={() => navigate('home')}>Back to the street →</button>
        </aside>
      </div>
    </div>
  );
}
