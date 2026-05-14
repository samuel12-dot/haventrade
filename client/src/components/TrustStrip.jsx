const ITEMS = [
  { mono: 'ID-VERIFIED',  it: 'every neighbour' },
  { mono: 'SAME-DAY',     it: 'by 19:00 tonight' },
  { mono: 'WITHIN 2KM',   it: 'your radius' },
];

export default function TrustStrip() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
      {ITEMS.map((it, i) => (
        <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--hearth)' }}>{it.mono}</span>
          <span className="it" style={{ fontSize: 18 }}>{it.it}</span>
        </div>
      ))}
    </div>
  );
}
