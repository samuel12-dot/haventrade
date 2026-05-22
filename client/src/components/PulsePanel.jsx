import { useState, useEffect, useRef } from 'react';

const BARS = [22, 38, 30, 55, 42, 68, 50, 74, 60, 88, 70, 95];

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function useCountUp(target, duration, active) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf;
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

export default function PulsePanel() {
  const [panelRef, inView] = useInView();
  const listings = useCountUp(17, 1000, inView);
  const orders   = useCountUp(8,  800,  inView);
  const joined   = useCountUp(3,  700,  inView);

  return (
    <div className="pulse-panel" ref={panelRef}>
      <div className="live-tag"><span className="dot" /> LIVE · PULSE</div>
      <div className="mono" style={{ fontSize: 10, color: 'rgba(251,246,236,0.55)', marginBottom: 16 }}>THIS HOUR · YOUR RADIUS</div>
      <div className="pulse-stat"><span className="num">{listings}</span><span className="lbl">new listings</span></div>
      <div className="pulse-stat"><span className="num">{orders}</span><span className="lbl">orders out the door</span></div>
      <div className="pulse-stat"><span className="num">{joined}</span><span className="lbl">new neighbours joined</span></div>
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
