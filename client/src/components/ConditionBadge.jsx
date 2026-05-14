export default function ConditionBadge({ level, label, compact = false }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span className="cond-dots">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`d${i < level ? ' on' : ''}`} />
        ))}
      </span>
      {!compact && (
        <span className="mono" style={{ fontSize: 9, color: 'var(--ink-muted)' }}>
          {label.toUpperCase()}
        </span>
      )}
    </span>
  );
}
