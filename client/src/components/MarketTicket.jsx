export default function MarketTicket({ label, value, rotation = 0, variant = 'cream', lg = false, style = {} }) {
  const cls = {
    cream:   'ticket',
    saffron: 'ticket ticket--saffron',
    dark:    'ticket ticket--dark',
    moss:    'ticket ticket--moss',
    peach:   'ticket ticket--peach',
  }[variant] || 'ticket';

  return (
    <div className={`${cls}${lg ? ' ticket--lg' : ''}`} style={{ transform: `rotate(${rotation}deg)`, ...style }}>
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </div>
  );
}
