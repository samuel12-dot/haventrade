import { HTMonogram, HTWordmark } from './Brand.jsx';
import MarketTicket from './MarketTicket.jsx';

const LINKS = [
  ['Buy',   [['Browse', 'home'], ['Categories', null], ['Free items', null], ['Map view', null]]],
  ['Sell',  [['Open a stall', 'dashboard'], ['Seller dashboard', 'dashboard'], ['Pricing & fees', null], ['Couriers', null]]],
  ['Help',  [['FAQ', null], ['Returns', null], ['Disputes', null], ['Contact', null]]],
  ['About', [['Story', null], ['Neighbourhoods', null], ['Press', null], ['Jobs', null], ['Design system', 'design']]],
];

export default function Footer({ navigate }) {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div className="grid gap-8 grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <HTMonogram size={42} inverse />
              <HTWordmark size={26} inverse />
            </div>
            <div className="font-serif italic text-base leading-[1.5] max-w-[300px]" style={{ color: 'rgba(251,246,236,0.7)' }}>
              A postcode-gated neighbourhood marketplace. Made in Abuja, for Abujans.
            </div>
            <div className="mt-4">
              <MarketTicket label="EST. 2026" value="Abuja, NG" rotation={-2} variant="dark" />
            </div>
          </div>

          {/* Link columns */}
          {LINKS.map(([heading, links]) => (
            <div key={heading}>
              <div className="font-mono text-[10px] mb-3.5 tracking-[0.18em]" style={{ color: 'var(--saffron)' }}>
                {heading.toUpperCase()}
              </div>
              <div className="flex flex-col gap-2">
                {links.map(([label, route]) => (
                  <a
                    key={label}
                    onClick={route && navigate ? () => navigate(route) : undefined}
                    className={`text-[13px] transition-opacity hover:opacity-100 ${route ? 'cursor-pointer' : 'cursor-default'}`}
                    style={{ color: 'rgba(251,246,236,0.75)', opacity: route ? 1 : 0.65 }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-9 pt-[18px] border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2" style={{ borderColor: 'rgba(242,181,68,0.25)' }}>
          <span className="font-mono text-[10px]" style={{ color: 'rgba(251,246,236,0.5)' }}>
            © HAVENTRADE LTD — RC 1890458 — MAITAMA, ABUJA
          </span>
          <span className="font-serif italic text-[13px]" style={{ color: 'rgba(251,246,236,0.6)' }}>
            "Be a good neighbour."
          </span>
        </div>
      </div>
    </footer>
  );
}
