import { useState } from 'react';
import { LISTINGS, SELLERS } from '../data/index.js';
import SellerAvatar from '../components/SellerAvatar.jsx';
import BackLink from '../components/BackLink.jsx';

function formatDate(isoString) {
  const now   = new Date();
  const then  = new Date(isoString);
  const diffM = Math.floor((now - then) / 60000);
  const diffH = Math.floor(diffM / 60);
  const diffD = Math.floor(diffH / 24);
  if (diffM < 2)   return 'just now';
  if (diffM < 60)  return `${diffM} min ago`;
  if (diffH < 24)  return `today, ${then.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}`;
  if (diffD === 1) return 'yesterday';
  if (diffD < 7)   return `${diffD} days ago`;
  return then.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function expandOrder(order) {
  const items     = (order.cart || []).map((c) => ({ ...LISTINGS.find((l) => l.id === c.lid), qty: c.qty })).filter(Boolean);
  const sellerIds = [...new Set(items.map((i) => i.sellerId))];
  return { ...order, items, sellerIds };
}

function statusBadge(status) {
  if (status === 'Active')    return 'bg-saffron text-ink';
  if (status === 'Delivered') return 'bg-moss-soft text-moss';
  return 'bg-red-100 text-danger';
}

export default function OrderHistoryScreen({ navigate, orders = [], onBack, backLabel }) {
  const [filter,   setFilter]   = useState('All');
  const [expanded, setExpanded] = useState(null);

  if (orders.length === 0) {
    return (
      <div className="page">
        <BackLink onClick={onBack} label={backLabel} />
        <h1 className="h-page mb-1.5">Your orders</h1>
        <div className="py-20 flex flex-col items-center text-center gap-4">
          <div className="font-serif text-2xl text-ink">No orders yet.</div>
          <div className="font-serif italic text-ink-muted max-w-[340px] leading-[1.5]">
            Once you place an order, it'll appear here with live delivery tracking.
          </div>
          <button onClick={() => navigate('home')} className="btn btn--primary mt-2">
            Browse the market <span className="arr">→</span>
          </button>
        </div>
      </div>
    );
  }

  const expanded_ = orders.map(expandOrder);
  const filtered  = filter === 'All' ? expanded_ : expanded_.filter((o) => o.status === filter);

  return (
    <div className="page">
      <BackLink onClick={onBack} label={backLabel} />
      <h1 className="h-page mb-1.5">Your orders</h1>
      <div className="font-serif italic text-[18px] text-ink-muted mb-7">
        {orders.length} {orders.length === 1 ? 'order' : 'orders'}
      </div>

      <div className="flex gap-2 mb-6">
        {['All', 'Active', 'Delivered', 'Cancelled'].map((f) => (
          <button key={f} className={`chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center font-serif italic text-ink-muted">No {filter.toLowerCase()} orders.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((o) => (
            <div key={o.id} className="bg-surface border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                className="w-full px-4 md:px-6 py-4 md:py-5 text-left"
              >
                {/* Mobile layout */}
                <div className="flex items-center justify-between md:hidden">
                  <div>
                    <div className="font-mono text-[11px] text-ink mb-0.5">N° {o.num}</div>
                    <div className="font-serif italic text-[12px] text-ink-subtle mb-1.5">{formatDate(o.placedAt)}</div>
                    <span className={`inline-block py-0.5 px-2 rounded-full font-mono text-[8px] font-bold tracking-[0.14em] ${statusBadge(o.status)}`}>
                      {o.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <span className="font-serif text-[20px] text-hearth">₦{o.total.toLocaleString()}</span>
                    <span className="text-ink-subtle transition-transform duration-200" style={{ transform: expanded === o.id ? 'rotate(180deg)' : 'none' }}>⌄</span>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:grid gap-5 items-center" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto' }}>
                  <div>
                    <div className="font-mono text-[11px] text-ink mb-1">N° {o.num}</div>
                    <div className="font-serif italic text-[13px] text-ink-subtle">{formatDate(o.placedAt)}</div>
                  </div>

                  <div className="flex items-center">
                    {o.sellerIds.slice(0, 3).map((sid, i) => (
                      <span key={sid} className="border-2 border-surface rounded-full" style={{ marginLeft: i > 0 ? -8 : 0 }}>
                        <SellerAvatar seller={SELLERS[sid] || { initial: '?', grad: 'grad-cool' }} />
                      </span>
                    ))}
                    <span className="font-mono text-[10px] text-ink-subtle ml-2">
                      {o.sellerIds.length} {o.sellerIds.length === 1 ? 'SELLER' : 'SELLERS'}
                    </span>
                  </div>

                  <div className="text-[13px] text-ink-muted truncate">
                    {o.items.map((i) => i.title).join(' · ')}
                  </div>

                  <div>
                    <span className={`inline-block py-1 px-2.5 rounded-full font-mono text-[9px] font-bold tracking-[0.14em] ${statusBadge(o.status)}`}>
                      {o.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <span className="font-serif text-[22px] text-hearth">₦{o.total.toLocaleString()}</span>
                    <span className="text-ink-subtle transition-transform duration-200" style={{ transform: expanded === o.id ? 'rotate(180deg)' : 'none' }}>⌄</span>
                  </div>
                </div>
              </button>

              {expanded === o.id && (
                <div className="px-6 pb-6 border-t border-dashed border-border-strong pt-4">
                  <div className="flex flex-col md:grid md:grid-cols-[1fr_200px] gap-6">
                    <div>
                      {o.sellerIds.map((sid) => {
                        const s           = SELLERS[sid];
                        const sellerItems = o.items.filter((i) => i.sellerId === sid);
                        return (
                          <div key={sid} className="py-2.5 border-b border-dashed border-border flex flex-col sm:flex-row sm:items-start gap-2.5">
                            <div className="flex items-start gap-2.5 flex-1 min-w-0">
                              <SellerAvatar seller={s || { initial: '?', grad: 'grad-cool' }} />
                              <div className="flex-1 min-w-0">
                                <div className="font-serif text-[15px]">{s?.name || 'Unknown seller'}</div>
                                <div className="font-serif italic text-[12px] text-ink-subtle mt-0.5">
                                  {sellerItems.map((i) => `${i.title} ×${i.qty}`).join(', ')}
                                </div>
                              </div>
                            </div>
                            <span className="font-mono text-[9px] self-start sm:flex-shrink-0 sm:mt-1" style={{ color: 'var(--saffron)' }}>
                              OUT FOR DELIVERY
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-row md:flex-col gap-2">
                      <button className="btn btn--dark btn--sm flex-1 md:flex-none" onClick={() => navigate('home')}>Shop again</button>
                      <button className="btn btn--ghost btn--sm flex-1 md:flex-none">Message seller</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
