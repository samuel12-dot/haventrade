const BARS = [22, 38, 30, 55, 42, 68, 50, 74, 60, 88, 70, 95];

export default function PulsePanel() {
  return (
    <div className="pulse-panel">
      <div className="live-tag"><span className="dot" /> LIVE · PULSE</div>
      <div className="mono" style={{ fontSize: 10, color: 'rgba(251,246,236,0.55)', marginBottom: 16 }}>THIS HOUR · YOUR RADIUS</div>
      <div className="pulse-stat"><span className="num">17</span><span className="lbl">new listings</span></div>
      <div className="pulse-stat"><span className="num">8</span><span className="lbl">orders out the door</span></div>
      <div className="pulse-stat"><span className="num">3</span><span className="lbl">new neighbours joined</span></div>
      <div className="minibar">
        {BARS.map((h, i) => (
          <div key={i} className="bar" style={{ height: `${h}%`, opacity: 0.4 + (i / BARS.length) * 0.6 }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span className="mono" style={{ fontSize: 8, color: 'rgba(251,246,236,0.4)' }}>05:00</span>
        <span className="mono" style={{ fontSize: 8, color: 'rgba(251,246,236,0.4)' }}>now</span>
      </div>
    </div>
  );
}
