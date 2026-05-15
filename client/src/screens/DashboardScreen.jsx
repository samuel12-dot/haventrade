const KPIS = [
  { lbl: "TODAY'S REVENUE",  val: '₦324,500', sub: '+12% vs yesterday',   color: 'text-moss' },
  { lbl: 'ORDERS TO FULFIL', val: '3',       sub: 'by 19:00 tonight',    color: 'text-hearth' },
  { lbl: 'ACTIVE LISTINGS',  val: '14',      sub: '2 low-stock',         color: 'text-ink' },
  { lbl: 'PROFILE VIEWS',    val: '147',     sub: 'this week',           color: 'text-ink' },
];

const RECENT_ORDERS = [
  { num: '0247', item: 'Vintage teak armchair',   buyer: 'Mara de Wit',  status: 'FULFIL BY 18:30',     color: 'text-hearth',  action: 'Pack →' },
  { num: '0241', item: 'Eames-style lounge',       buyer: 'Jonas Bakker', status: 'OUT FOR DELIVERY',   color: 'text-saffron', action: 'View' },
  { num: '0238', item: 'Walnut side table',         buyer: 'Eva Verhoef',  status: 'DELIVERED',          color: 'text-moss',    action: 'View' },
  { num: '0231', item: 'Brass floor lamp',          buyer: 'Tomas K.',     status: 'DELIVERED',          color: 'text-moss',    action: 'View' },
  { num: '0224', item: 'Set of two oak stools',     buyer: 'Lisa M.',      status: 'DELIVERED',          color: 'text-moss',    action: 'View' },
];

export default function DashboardScreen({ navigate }) {
  return (
    <div className="page">
      {/* Page header */}
      <div className="flex items-start sm:items-end justify-between mb-7 flex-col sm:flex-row gap-4 sm:gap-0">
        <div>
          <div className="font-mono text-[11px] text-hearth mb-1.5 uppercase tracking-widest-2">SELLER DASHBOARD · SANNE'S STUDIO</div>
          <h1 className="h-page mb-1">Good afternoon, Sanne.</h1>
          <div className="font-serif italic text-[17px] text-ink-muted">3 orders to fulfil before sundown</div>
        </div>
        <div className="flex gap-2.5">
          <button className="btn btn--ghost btn--sm">Switch to buyer view</button>
          <button className="btn btn--primary btn--sm" onClick={() => navigate('editor')}>+ New listing</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-7">
        {KPIS.map((k) => (
          <div key={k.lbl} className="bg-surface border border-border rounded-2xl p-[22px]">
            <div className="font-mono text-[10px] text-ink-muted mb-2.5 uppercase tracking-[0.14em]">{k.lbl}</div>
            <div className={`font-serif text-[38px] leading-none tracking-[-0.025em] ${k.color}`}>{k.val}</div>
            <div className="font-serif italic text-[12px] text-ink-subtle mt-1.5">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:[grid-template-columns:1.5fr_1fr]">
        {/* Recent orders table */}
        <div className="bg-surface border border-border rounded-2xl">
          <div className="px-[22px] py-[18px] border-b border-dashed border-border-strong flex justify-between items-center">
            <div className="font-serif text-[22px]">Recent orders</div>
            <span className="font-mono text-[10px] text-ink-subtle uppercase tracking-[0.14em]">SHOWING 5 OF 12</span>
          </div>
          <div className="overflow-x-auto">
            {/* Column headers */}
            <div className="px-[22px] py-2.5 border-b border-border font-mono text-[9px] text-ink-subtle uppercase tracking-[0.14em] grid gap-3 items-center min-w-[560px]" style={{ gridTemplateColumns: '100px 1fr 1fr 110px 90px' }}>
              <span>ORDER N°</span><span>ITEM</span><span>BUYER</span><span>STATUS</span><span className="text-right">ACTION</span>
            </div>
            {RECENT_ORDERS.map((r, i) => (
              <div key={i} className="px-[22px] py-3.5 border-b border-dashed border-border grid gap-3 items-center min-w-[560px]" style={{ gridTemplateColumns: '100px 1fr 1fr 110px 90px' }}>
                <span className="font-mono text-[11px] text-ink">HT-{r.num}</span>
                <span className="text-[13px]">{r.item}</span>
                <span className="font-serif italic text-[13px] text-ink-muted">{r.buyer}</span>
                <span className={`font-mono text-[9px] uppercase tracking-[0.14em] ${r.color}`}>{r.status}</span>
                <button className="chip justify-self-end">{r.action}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions column */}
        <div className="flex flex-col gap-3.5">
          {/* Next pickup */}
          <div className="bg-ink text-canvas rounded-2xl p-[22px] relative overflow-hidden">
            <span className="font-mono text-[10px] text-saffron uppercase tracking-widest-2">NEXT PICKUP</span>
            <div className="font-serif text-[32px] text-canvas mt-2 tracking-[-0.02em]">18:30</div>
            <div className="font-serif italic text-[14px] mt-1" style={{ color: 'rgba(251,246,236,0.75)' }}>Amara · Aminu Kano Crescent 47-B</div>
            <button className="btn mt-3.5 bg-saffron text-ink">Mark as packed →</button>
          </div>

          {/* Quick actions */}
          <div className="bg-surface border border-border rounded-2xl p-[18px]">
            <div className="font-mono text-[10px] text-hearth mb-2.5 uppercase tracking-widest-2">QUICK ACTIONS</div>
            {[
              ['+ Add new listing',      () => navigate('editor')],
              ['💬 Reply to 4 messages', null],
              ['🗓 Update availability',  null],
              ['✓ Mark items as sold',    null],
            ].map(([t, fn]) => (
              <button key={t} onClick={fn} className="w-full py-2.5 border-b border-dashed border-border flex justify-between items-center text-[13px] font-medium text-left">
                <span>{t}</span>
                <span className="text-ink-subtle">→</span>
              </button>
            ))}
          </div>

          {/* Tip */}
          <div className="bg-surface-2 rounded-2xl p-[18px]">
            <div className="font-mono text-[10px] text-hearth mb-2 uppercase tracking-widest-2">TIP OF THE DAY</div>
            <div className="font-serif italic text-[14px] text-ink-muted leading-[1.45]">
              Sellers who reply within 15 minutes get 2.4× more orders. You're at 12 min — keep going.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
