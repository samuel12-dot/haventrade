import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/index.js';
import BackLink from '../components/BackLink.jsx';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardScreen({ navigate, onBack, backLabel }) {
  const { user } = useAuth();
  const [listings, setListings] = useState(null);
  const [orders,   setOrders]   = useState(null);

  useEffect(() => {
    if (!user) return;
    const uid = user._id || user.id;
    api.getSellerListings(uid)
      .then(({ listings: data }) => setListings(data))
      .catch(() => setListings([]));
    api.getSellerOrders()
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]));
  }, [user?._id, user?.id]);

  if (!user) return null;

  const firstName     = user.name?.split(' ')[0] || user.name || 'there';
  const studioName    = `${user.name}'s Studio`;
  const activeCount   = listings?.filter((l) => l.status === 'active').length ?? 0;
  const pendingOrders = orders?.filter((o) => ['active', 'pending', 'confirmed'].includes(o.status)) ?? [];
  const recentOrders  = orders?.slice(0, 5) ?? [];

  const KPIS = [
    {
      lbl:   'ACTIVE LISTINGS',
      val:   listings ? String(activeCount) : '—',
      sub:   listings ? (activeCount > 0 ? `${listings.length} total` : 'No listings yet') : 'Loading…',
      color: 'text-ink',
    },
    {
      lbl:   'ORDERS',
      val:   orders ? String(orders.length) : '—',
      sub:   orders ? (pendingOrders.length > 0 ? `${pendingOrders.length} to fulfil` : 'All fulfilled') : 'Loading…',
      color: pendingOrders.length > 0 ? 'text-hearth' : 'text-ink',
    },
  ];

  return (
    <div className="page">
      <BackLink onClick={onBack} label={backLabel} />

      {/* Page header */}
      <div className="flex items-start sm:items-end justify-between mb-7 flex-col sm:flex-row gap-4 sm:gap-0">
        <div>
          <div className="font-mono text-[11px] text-hearth mb-1.5 uppercase tracking-widest-2">
            SELLER DASHBOARD · {studioName.toUpperCase()}
          </div>
          <h1 className="h-page mb-1">{greeting()}, {firstName}.</h1>
          <div className="font-serif italic text-[17px] text-ink-muted">
            {pendingOrders.length > 0
              ? `${pendingOrders.length} order${pendingOrders.length > 1 ? 's' : ''} to fulfil`
              : 'Your studio is open for business.'}
          </div>
        </div>
        <div className="flex gap-2.5">
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('home')}>Switch to buyer view</button>
          <button className="btn btn--primary btn--sm" onClick={() => navigate('editor')}>+ New listing</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3.5 mb-7">
        {KPIS.map((k) => (
          <div key={k.lbl} className="bg-surface border border-border rounded-2xl p-[22px]">
            <div className="font-mono text-[10px] text-ink-muted mb-2.5 uppercase tracking-[0.14em]">{k.lbl}</div>
            <div className={`font-serif text-[38px] leading-none tracking-[-0.025em] ${k.color}`}>{k.val}</div>
            <div className="font-serif italic text-[12px] text-ink-subtle mt-1.5">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:[grid-template-columns:1.5fr_1fr]">
        {/* Orders table */}
        <div className="bg-surface border border-border rounded-2xl">
          <div className="px-[22px] py-[18px] border-b border-dashed border-border-strong flex justify-between items-center">
            <div className="font-serif text-[22px]">Recent orders</div>
            {orders && (
              <span className="font-mono text-[10px] text-ink-subtle uppercase tracking-[0.14em]">
                SHOWING {recentOrders.length} OF {orders.length}
              </span>
            )}
          </div>

          {recentOrders.length === 0 ? (
            <div className="px-[22px] py-12 text-center">
              <div className="font-serif italic text-ink-muted text-[15px] mb-4">
                {orders === null ? 'Loading orders…' : 'No orders yet — your first sale is on its way.'}
              </div>
              {orders !== null && (
                <button className="btn btn--ghost btn--sm" onClick={() => navigate('editor')}>
                  + Add your first listing
                </button>
              )}
            </div>
          ) : (
            <div>
              <div className="orders-table-row px-[22px] py-2.5 border-b border-border font-mono text-[9px] text-ink-subtle uppercase tracking-[0.14em]">
                <span>ORDER N°</span>
                <span>ITEM</span>
                <span className="hidden md:block">BUYER</span>
                <span>STATUS</span>
                <span className="hidden lg:block text-right">ACTION</span>
              </div>
              {recentOrders.map((o, i) => {
                const myItem   = o.items?.find((it) => it.seller?.toString() === (user._id || user.id)?.toString());
                const itemTitle = myItem?.title || o.items?.[0]?.title || '—';
                const status   = myItem?.status || o.status || 'pending';
                const statusColor = status === 'delivered' ? 'text-moss' : status === 'active' ? 'text-saffron' : 'text-hearth';
                return (
                  <div key={o._id || i} className="orders-table-row px-[22px] py-3.5 border-b border-dashed border-border">
                    <span className="font-mono text-[11px] text-ink">HT-{String(o._id).slice(-4).toUpperCase()}</span>
                    <span className="text-[13px]">{itemTitle}</span>
                    <span className="hidden md:block font-serif italic text-[13px] text-ink-muted">{o.buyer?.name || '—'}</span>
                    <span className={`font-mono text-[9px] uppercase tracking-[0.14em] ${statusColor}`}>{status}</span>
                    <button className="hidden lg:block chip justify-self-end" onClick={() => navigate('orders')}>View</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3.5">
          {/* Quick actions */}
          <div className="bg-surface border border-border rounded-2xl p-[18px]">
            <div className="font-mono text-[10px] text-hearth mb-2.5 uppercase tracking-widest-2">QUICK ACTIONS</div>
            {[
              ['+ Add new listing',  () => navigate('editor')],
              ['Your storefront',    () => navigate('storefront', { id: user._id || user.id })],
              ['Account settings',  () => navigate('profile')],
            ].map(([t, fn]) => (
              <button
                key={t}
                onClick={fn}
                className="w-full py-2.5 border-b border-dashed border-border flex justify-between items-center text-[13px] font-medium text-left"
              >
                <span>{t}</span>
                <span className="text-ink-subtle">→</span>
              </button>
            ))}
          </div>

          {/* Tip */}
          <div className="bg-surface-2 rounded-2xl p-[18px]">
            <div className="font-mono text-[10px] text-hearth mb-2 uppercase tracking-widest-2">TIP OF THE DAY</div>
            <div className="font-serif italic text-[14px] text-ink-muted leading-[1.45]">
              Sellers who reply within 15 minutes get 2.4× more orders. Great photos and clear descriptions help you stand out.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
