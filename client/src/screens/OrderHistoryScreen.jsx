import { useState } from 'react';
import { SELLERS } from '../data/index.js';
import SellerAvatar from '../components/SellerAvatar.jsx';

const ORDERS = [
  { id: 'o1', num: 'HT-2026-0247', date: 'today, 14:32',    status: 'Active',    statusColor: 'saffron', total: 268500, sellers: ['sanne', 'aisha', 'pixel'], items: ['Vintage teak armchair', 'Sourdough loaf ×2', 'Abuja print'] },
  { id: 'o2', num: 'HT-2026-0231', date: 'two days ago',    status: 'Delivered', statusColor: 'moss',    total: 45000,  sellers: ['pieter'],                   items: ['Sony WH-1000XM4 headphones'] },
  { id: 'o3', num: 'HT-2026-0198', date: 'last week',       status: 'Delivered', statusColor: 'moss',    total: 65000,  sellers: ['linda'],                    items: ['Mid-century pendant lamp'] },
  { id: 'o4', num: 'HT-2026-0156', date: 'two weeks ago',   status: 'Delivered', statusColor: 'moss',    total: 20000,  sellers: ['mark', 'aisha'],            items: ['Wooden train set', 'Monstera cutting'] },
  { id: 'o5', num: 'HT-2025-3041', date: 'last month',      status: 'Cancelled', statusColor: 'danger',  total: 0,      sellers: ['daan'],                     items: ['Patagonia raincoat (cancelled by seller)'] },
];

function statusBadge(color) {
  if (color === 'saffron') return 'bg-saffron text-ink';
  if (color === 'moss')    return 'bg-moss-soft text-moss';
  return 'bg-red-100 text-danger';
}

export default function OrderHistoryScreen({ navigate }) {
  const [filter,   setFilter]   = useState('All');
  const [expanded, setExpanded] = useState('o1');

  const filtered = filter === 'All' ? ORDERS : ORDERS.filter((o) => o.status === filter);

  return (
    <div className="page">
      <h1 className="h-page mb-1.5">Your orders</h1>
      <div className="font-serif italic text-[18px] text-ink-muted mb-7">
        {ORDERS.length} orders, all from within 2km
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-6">
        {['All', 'Active', 'Delivered', 'Cancelled'].map((f) => (
          <button key={f} className={`chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((o) => (
          <div key={o.id} className="bg-surface border border-border rounded-2xl overflow-hidden">
            {/* Row */}
            <button
              onClick={() => setExpanded(expanded === o.id ? '' : o.id)}
              className="w-full px-6 py-5 grid gap-5 items-center text-left"
              style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto' }}
            >
              <div>
                <div className="font-mono text-[11px] text-ink mb-1">N° {o.num}</div>
                <div className="font-serif italic text-[13px] text-ink-subtle">{o.date}</div>
              </div>
              <div className="flex items-center">
                {o.sellers.slice(0, 3).map((sid, i) => (
                  <span key={sid} className="border-2 border-surface rounded-full" style={{ marginLeft: i > 0 ? -8 : 0 }}>
                    <SellerAvatar seller={SELLERS[sid]} />
                  </span>
                ))}
                <span className="font-mono text-[10px] text-ink-subtle ml-2">
                  {o.sellers.length} {o.sellers.length === 1 ? 'SELLER' : 'SELLERS'}
                </span>
              </div>
              <div className="text-[13px] text-ink-muted truncate">{o.items.join(' · ')}</div>
              <div>
                <span className={`inline-block py-1 px-2.5 rounded-full font-mono text-[9px] font-bold tracking-[0.14em] ${statusBadge(o.statusColor)}`}>
                  {o.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3.5">
                <span className="font-serif text-[22px] text-hearth">₦{o.total.toLocaleString()}</span>
                <span className="text-ink-subtle transition-transform duration-200" style={{ transform: expanded === o.id ? 'rotate(180deg)' : 'none' }}>⌄</span>
              </div>
            </button>

            {/* Expanded */}
            {expanded === o.id && (
              <div className="px-6 pb-6 border-t border-dashed border-border-strong pt-4">
                <div className="grid grid-cols-[1fr_240px] gap-6">
                  <div>
                    {o.sellers.map((sid) => (
                      <div key={sid} className="py-2.5 border-b border-dashed border-border flex items-center gap-2.5">
                        <SellerAvatar seller={SELLERS[sid]} />
                        <span className="font-serif text-[15px]">{SELLERS[sid].name}</span>
                        <span className="font-mono text-[9px] ml-auto" style={{ color: o.status === 'Delivered' ? 'var(--moss)' : o.status === 'Active' ? 'var(--saffron)' : 'var(--danger)' }}>
                          {o.status === 'Delivered' ? 'DELIVERED · 18:42' : o.status === 'Active' ? 'OUT FOR DELIVERY' : 'CANCELLED'}
                        </span>
                      </div>
                    ))}
                    <div className="font-serif italic text-[13px] text-ink-subtle mt-3">
                      Delivered to Aminu Kano Crescent 47-B by Sanne herself, on the cargo bike.
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {o.status === 'Active'
                      ? <button className="btn btn--primary btn--sm" onClick={() => navigate('confirmation')}>Track delivery →</button>
                      : <button className="btn btn--dark btn--sm">Buy again</button>
                    }
                    {o.status === 'Delivered' && <button className="btn btn--ghost btn--sm">Leave a review</button>}
                    <button className="btn btn--ghost btn--sm">Message seller</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
