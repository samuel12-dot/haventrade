export default function DeliverySlotPicker({ slots, selected, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {slots.map((s, i) => {
        const sel = selected === i;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              border: `1.5px solid ${sel ? 'var(--ink)' : 'var(--saffron)'}`,
              background: sel ? 'var(--saffron)' : 'var(--surface)',
              color: 'var(--ink)',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
              minWidth: 160, textAlign: 'left',
              transition: 'all 180ms ease',
            }}
          >
            <span className="mono" style={{ fontSize: 9, color: 'var(--ink-muted)' }}>{s.label}</span>
            <span className="it" style={{ fontSize: 14 }}>{s.value}</span>
            <span className="mono" style={{ fontSize: 9, color: sel ? 'var(--ink)' : 'var(--hearth)', marginTop: 2 }}>{s.price}</span>
          </button>
        );
      })}
    </div>
  );
}
