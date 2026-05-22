import { useState } from 'react';

export default function MarketTicket({ label, value, rotation = 0, variant = 'cream', lg = false, style = {} }) {
  const [hovered, setHovered] = useState(false);
  const cls = {
    cream:   'ticket',
    saffron: 'ticket ticket--saffron',
    dark:    'ticket ticket--dark',
    moss:    'ticket ticket--moss',
    peach:   'ticket ticket--peach',
  }[variant] || 'ticket';

  return (
    <div
      className={`${cls}${lg ? ' ticket--lg' : ''}`}
      style={{ transform: `rotate(${hovered ? rotation + 3 : rotation}deg) scale(${hovered ? 1.04 : 1})`, ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </div>
  );
}
