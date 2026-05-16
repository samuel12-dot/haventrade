import { useState } from "react";
import { LISTINGS, SELLERS } from "../data/index.js";
import MarketTicket from "../components/MarketTicket.jsx";
import StatusPill from "../components/StatusPill.jsx";
import PulsePanel from "../components/PulsePanel.jsx";
import TrustStrip from "../components/TrustStrip.jsx";
import PostcodeInput from "../components/PostcodeInput.jsx";
import ListingCard from "../components/ListingCard.jsx";
import SellerAvatar from "../components/SellerAvatar.jsx";
import { HTMonogram, HTWordmark } from "../components/Brand.jsx";
import { StarIcon, PinIcon } from "../components/Icons.jsx";

function SectionHead({ eyebrow, title, sub, right }) {
  return (
    <div className="flex items-start sm:items-end justify-between gap-4 sm:gap-6 mb-7 flex-col sm:flex-row">
      <div>
        {eyebrow && (
          <div className="font-mono text-[10px] text-hearth mb-2.5 tracking-widest-2">
            {eyebrow}
          </div>
        )}
        <div className="font-serif text-[26px] sm:text-[32px] leading-[1.05] tracking-[-0.025em] text-ink">
          {title}
        </div>
        {sub && (
          <div className="font-serif italic text-base sm:text-lg text-ink-muted mt-1.5 leading-[1.4]">
            {sub}
          </div>
        )}
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  );
}

function MeetNeighbours({ navigate }) {
  const ids = ["sanne", "pieter", "aisha", "linda", "mark"];
  const blurbs = {
    sanne: "Refinishing mid-century furniture, one careful piece at a time.",
    pieter: "Tested electronics with the original cables and boxes.",
    aisha: "Sourdough, ferments, the occasional jar of jam.",
    linda: "Brass, ceramic, the odd Le Creuset that's seen a kitchen or two.",
    mark: "Moving out of a 4-bedroom. Everything must walk.",
  };
  return (
    <section className="mt-[72px]">
      <SectionHead
        title="Meet your neighbours"
        sub="The people behind the listings on your street."
        right={
          <span className="font-mono text-[10px] text-ink-subtle tracking-widest-2">
            8 SELLERS · KRALINGEN
          </span>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {ids.map((id, i) => {
          const s = SELLERS[id];
          const rot = (i % 2 === 0 ? -2 : 2) + (i === 2 ? 1 : 0);
          return (
            <div
              key={id}
              onClick={() => navigate("storefront", { id })}
              className="bg-surface border border-border rounded-2xl shadow-lift overflow-hidden cursor-pointer flex flex-col"
            >
              <div className={`grad ${s.grad} h-[110px] relative`}>
                <div className="absolute top-3 right-3">
                  <MarketTicket
                    label="MEMBER SINCE"
                    value={s.since}
                    rotation={rot}
                  />
                </div>
                <div className="absolute -bottom-[22px] left-4">
                  <SellerAvatar seller={s} size="md" />
                </div>
              </div>
              <div className="pt-[30px] pb-[18px] px-[18px] flex flex-col gap-1.5 flex-1">
                <div className="font-serif text-lg leading-[1.15]">
                  {s.name}
                </div>
                <div className="font-serif italic text-xs text-ink-subtle">
                  {s.neighbourhood} · {s.distance}
                </div>
                <div className="font-serif italic text-[13px] text-ink-muted leading-[1.4] mt-1 flex-1 hidden sm:block">
                  {blurbs[id]}
                </div>
                <div className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-dashed border-border">
                  <span className="font-serif text-sm inline-flex items-center gap-1">
                    <StarIcon size={12} /> {s.rating.toFixed(1)}
                  </span>
                  <span className="font-mono text-[9px] text-ink-subtle">
                    {s.reviews} REVIEWS
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      v: "the postcode",
      title: "Drop your postcode",
      body: "We show you what's within walking distance — usually 2 km, your call.",
      rot: -3,
    },
    {
      n: "02",
      v: "one cart",
      title: "Cart from many neighbours",
      body: "Sanne's chair, Pieter's headphones, Aisha's loaf — one checkout.",
      rot: 2,
    },
    {
      n: "03",
      v: "by sundown",
      title: "Delivered by bike, today",
      body: "Local couriers handle the rounds. Most orders arrive within 4 hours.",
      rot: -2,
    },
  ];
  return (
    <section
      className="mt-[88px] py-16 border-t border-b border-dashed border-border-strong"
      data-section="how-it-works"
    >
      <SectionHead
        eyebrow="HOW IT WORKS"
        title="Three steps. No app required."
        sub="Same neighbourly grammar, all the way down."
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-6">
        {steps.map((s) => (
          <div key={s.n} className="flex flex-col gap-[18px] p-2">
            <div className="self-start">
              <MarketTicket
                label={`STEP ${s.n}`}
                value={s.v}
                rotation={s.rot}
                lg
              />
            </div>
            <div className="font-serif text-2xl tracking-[-0.02em] mt-3">
              {s.title}
            </div>
            <div className="text-sm text-ink-muted leading-[1.55] max-w-[320px]">
              {s.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrendingRail({ navigate, savedSet, toggleSave }) {
  const trending = ["l12", "l02", "l10", "l03"];
  return (
    <section className="mt-[88px]">
      <SectionHead
        title="Trending on your street"
        sub="What Maitama is buying right now."
        right={
          <span className="inline-flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-saffron"
              style={{
                boxShadow: "0 0 0 4px rgba(242,181,68,0.3)",
                animation: "pulse 1.6s ease-in-out infinite",
              }}
            />
            <span className="font-mono text-[10px] text-ink-subtle tracking-widest-2">
              UPDATED 12 MIN AGO
            </span>
          </span>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trending.map((id, i) => {
          const listing = LISTINGS.find((l) => l.id === id);
          if (!listing) return null;
          return (
            <div key={id} className="relative">
              <div className="absolute -top-3 right-4 z-[3]">
                <MarketTicket
                  label={`TRENDING N° ${i + 1}`}
                  value="this week"
                  rotation={i % 2 === 0 ? -3 : 2}
                  variant="saffron"
                />
              </div>
              <ListingCard
                listing={listing}
                onClick={() => navigate("pdp", { id })}
                saved={savedSet?.has(listing.id)}
                onSave={toggleSave}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      text: "Sold a chair in 40 minutes to someone two streets over. Beats lugging it to the recycling centre.",
      who: "Sanne",
      where: "Maitama",
      grad: "grad-vintage",
      initial: "S",
      ticket: { l: "MEMBER SINCE", v: "spring '24", rot: -3, variant: "cream" },
    },
    {
      text: "I bought a sourdough starter and ended up at Aisha's bakery the next morning. That doesn't happen on Jiji.",
      who: "Mark",
      where: "Asokoro",
      grad: "grad-cream",
      initial: "M",
      ticket: { l: "VERIFIED", v: "purchase", rot: 3, variant: "moss" },
      tall: true,
    },
    {
      text: "The 2 km radius means I actually meet the people I buy from. It feels like the city used to before everything went online.",
      who: "Linda",
      where: "Utako",
      grad: "grad-plum",
      initial: "L",
      ticket: { l: "MEMBER SINCE", v: "summer '23", rot: -2, variant: "peach" },
    },
  ];
  return (
    <section className="mt-[88px]">
      <SectionHead
        eyebrow="WHAT NEIGHBOURS SAY"
        title="Word, mostly, gets around."
        sub="Three of the seven hundred reviews this month."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {quotes.map((q, i) => (
          <div
            key={i}
            className={`bg-surface border border-border rounded-2xl shadow-lift relative flex flex-col gap-[18px] ${q.tall ? "px-6 py-8" : "p-6"}`}
          >
            <div className="absolute -top-2.5 right-4">
              <MarketTicket
                label={q.ticket.l}
                value={q.ticket.v}
                rotation={q.ticket.rot}
                variant={q.ticket.variant}
              />
            </div>
            <div className="font-serif italic text-lg leading-[1.45] text-ink mt-2">
              "{q.text}"
            </div>
            <div className="border-t border-dashed border-border pt-3.5 flex items-center gap-3">
              <SellerAvatar seller={{ grad: q.grad, initial: q.initial }} />
              <div>
                <div className="text-sm font-semibold text-ink">{q.who}</div>
                <div className="font-serif italic text-xs text-ink-subtle">
                  {q.where}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SellerGrain() {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        opacity: 0.038, pointerEvents: "none", zIndex: 1,
      }}
    >
      <filter id="seller-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#seller-grain)" />
    </svg>
  );
}

function SellerRadiusViz() {
  const cx = 265, cy = 195;
  const rings = [
    { r: 58,  dash: "5 8",  sw: 1.2 },
    { r: 112, dash: "3 11", sw: 0.9 },
    { r: 170, dash: "",     sw: 0.7 },
    { r: 230, dash: "",     sw: 0.5 },
  ];
  const nodes = [
    { x: cx + 52, y: cy - 24, s: 2.8 },
    { x: cx - 37, y: cy + 46, s: 2.5 },
    { x: cx + 18, y: cy + 57, s: 2.8 },
    { x: cx + 104, y: cy + 36, s: 2.5 },
    { x: cx - 92,  y: cy - 50, s: 2.2 },
    { x: cx + 60,  y: cy + 110, s: 2.5 },
    { x: cx - 110, y: cy + 82, s: 2.2 },
    { x: cx + 145, y: cy - 42, s: 2 },
    { x: cx - 145, y: cy + 150, s: 2 },
    { x: cx + 52,  y: cy - 165, s: 2 },
  ];
  const lineIdxs = [0, 2, 3, 5, 7];

  return (
    <div
      className="absolute inset-0 pointer-events-none hidden md:flex items-center justify-end"
      style={{ paddingRight: "6%", animation: "ring-breathe 9s ease-in-out infinite" }}
    >
      <svg
        viewBox="0 0 530 390"
        width="530"
        height="390"
        style={{ opacity: 0.1, overflow: "visible", flexShrink: 0 }}
      >
        {/* Axis guides */}
        <line x1={cx - 245} y1={cy} x2={cx + 245} y2={cy} stroke="#BFDBFE" strokeWidth="0.4" />
        <line x1={cx} y1={cy - 245} x2={cx} y2={cy + 245} stroke="#BFDBFE" strokeWidth="0.4" />

        {/* Concentric rings */}
        {rings.map(({ r, dash, sw }) => (
          <circle
            key={r}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#BFDBFE"
            strokeWidth={sw}
            strokeDasharray={dash || undefined}
          />
        ))}

        {/* Connection lines from centre */}
        {lineIdxs.map((i) => (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={nodes[i].x} y2={nodes[i].y}
            stroke="#BFDBFE" strokeWidth="0.55"
          />
        ))}

        {/* Neighbourhood nodes */}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.s} fill="#BFDBFE" />
        ))}

        {/* Centre: halo + dot */}
        <circle cx={cx} cy={cy} r={9}  fill="#BFDBFE" opacity="0.2" />
        <circle cx={cx} cy={cy} r={4.5} fill="#BFDBFE" opacity="0.9" />

        {/* Labels */}
        <text
          x={cx + rings[3].r + 8} y={cy + 4}
          fontSize="8" fill="#BFDBFE"
          fontFamily="'JetBrains Mono', monospace"
          letterSpacing="1.5"
        >
          2KM
        </text>
        <text
          x={cx + 10} y={cy - 14}
          fontSize="7" fill="#BFDBFE"
          fontFamily="'JetBrains Mono', monospace"
          letterSpacing="2"
        >
          MAITAMA
        </text>
      </svg>
    </div>
  );
}

function OpenAStall({ navigate }) {
  const stats = [
    ["₦2.4B", "TRADED IN 2025"],
    ["6 HRS",  "AVG TIME TO SELL"],
    ["92%",    "DELIVERED SAME DAY"],
  ];
  const rotations = [-1, 1, -0.5];
  const avatars = [
    { g: "saffron",    l: "M" },
    { g: "terracotta", l: "K" },
    { g: "moss",       l: "A" },
    { g: "vintage",    l: "S" },
  ];

  return (
    <section
      className="mt-[88px]"
      style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
    >
      <div
        className="grad grad-hero-blue relative overflow-hidden"
        style={{ color: "#F4EFE8", minHeight: 460 }}
      >
        {/* Extra depth: deeper navy bottom-right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 92% 95%, rgba(6,10,32,0.72) 0%, transparent 50%)",
            zIndex: 0,
          }}
        />

        {/* Left readability layer — full-hero, fades to transparent, no visible edge */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, rgba(5,10,25,0.20) 0%, rgba(5,10,25,0.08) 38%, transparent 70%)",
            zIndex: 1,
          }}
        />

        {/* Film grain */}
        <SellerGrain />

        {/* Radius map visualization */}
        <SellerRadiusViz />

        {/* Content */}
        <div
          className="relative max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] items-center px-6 sm:px-16 py-[56px] sm:py-[72px] gap-8"
          style={{ zIndex: 2 }}
        >
          {/* ── Left column ────────────────────── */}
          <div>
            <div
              className="font-mono mb-[22px]"
              style={{
                color: "rgba(227,201,143,0.95)",
                fontSize: 11,
                letterSpacing: "0.22em",
                fontWeight: 500,
                textShadow: "0 1px 2px rgba(0,0,0,0.18)",
              }}
            >
              FOR SELLERS
            </div>

            <h2
              className="font-serif text-[38px] sm:text-[54px] leading-[0.93] tracking-[-0.03em] mb-5 max-w-[540px]"
              style={{ color: "#FFF6ED" }}
            >
              Open a stall on your street.
            </h2>

            <p
              className="font-serif italic text-[19px] sm:text-[22px] leading-[1.4] mb-10 max-w-[440px]"
              style={{ color: "rgba(255,246,237,0.82)" }}
            >
              List in 3 minutes. Sell to neighbours by sundown.
            </p>

            {/* Stat glass cards */}
            <div className="flex gap-3 flex-wrap mb-10">
              {stats.map(([n, l], i) => {
                const rot = rotations[i];
                return (
                  <div
                    key={l}
                    className="flex flex-col gap-1.5 px-5 py-4 rounded-[12px]"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      transform: `rotate(${rot}deg)`,
                      transition: "transform 240ms ease, box-shadow 240ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "rotate(0deg) translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.28)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = `rotate(${rot}deg)`;
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <span
                      className="font-serif text-[26px] leading-none tracking-[-0.03em]"
                      style={{ color: "#FFF6ED" }}
                    >
                      {n}
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        color: "rgba(227,201,143,0.95)",
                        fontSize: 11,
                        letterSpacing: "0.22em",
                        fontWeight: 500,
                        textShadow: "0 1px 2px rgba(0,0,0,0.18)",
                      }}
                    >
                      {l}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTA + social proof */}
            <div className="flex flex-col items-start gap-4">
              <button className="seller-hero-cta" onClick={() => navigate("dashboard")}>
                OPEN YOUR STALL <span className="arr">→</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {avatars.map(({ g, l }, idx) => (
                    <span
                      key={g}
                      className={`grad grad-${g} w-[28px] h-[28px] rounded-full inline-flex items-center justify-center font-serif italic text-canvas text-[11px]`}
                      style={{
                        border: "1.5px solid rgba(244,239,232,0.22)",
                        zIndex: avatars.length - idx,
                      }}
                    >
                      {l}
                    </span>
                  ))}
                </div>
                <span
                  className="font-serif italic text-[13px]"
                  style={{ color: "rgba(244,239,232,0.58)" }}
                >
                  No listing fees, ever.
                </span>
              </div>
            </div>
          </div>

          {/* ── Right column: visual anchor fills this space absolutely ── */}
          <div className="hidden md:block" />
        </div>

        {/* Abuja stamp — integrated top-right */}
        <div
          className="absolute top-8 right-9 z-[3] hidden sm:block"
          style={{ transform: "rotate(2deg)" }}
        >
          <MarketTicket label="EST. 2026" value="Abuja" rotation={0} variant="cream" lg />
        </div>
      </div>
    </section>
  );
}

function PressStrip() {
  const press = [
    {
      name: "Punch Newspapers",
      cls: "font-serif font-semibold text-[22px] tracking-[-0.02em]",
    },
    {
      name: "TechCabal",
      cls: "font-mono font-bold text-sm tracking-widest-2 uppercase",
    },
    {
      name: "Abuja.info",
      cls: "font-sans font-medium text-lg tracking-[-0.01em]",
    },
    {
      name: "Channels TV",
      cls: "font-sans font-bold text-[17px] tracking-[0.04em] uppercase",
    },
    {
      name: "The Cable",
      cls: "font-serif italic font-medium text-[22px] tracking-[-0.015em]",
    },
  ];
  return (
    <section className="py-12 text-center">
      <div className="font-mono text-[10px] text-ink-subtle tracking-widest-3 mb-6">
        AS SEEN IN
      </div>
      <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
        {press.map((p) => (
          <span key={p.name} className={`${p.cls} text-ink-subtle opacity-65`}>
            {p.name}
          </span>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "How fast is delivery, really?",
      a: "Most orders inside 4 hours, by bike. You pick a delivery window at checkout — same-day until 19:00, otherwise tomorrow morning.",
    },
    {
      q: "What happens if a seller can't fulfil their part of my order?",
      a: "We refund just their portion automatically. The rest of your order proceeds. You'll see this in your order tracking page.",
    },
    {
      q: "Why only 2 km?",
      a: "Because that's walking and cycling distance. Bigger radius means more inventory but less of the neighbourhood feeling. You can dial it down to 500 m if you prefer.",
    },
    {
      q: "Are sellers verified?",
      a: "Every seller goes through ID verification with BVN. Look for the green checkmark on their storefront.",
    },
    {
      q: "Can I sell digital goods?",
      a: "Yes — design files, e-books, prints. They deliver instantly via download link.",
    },
    {
      q: "What about returns?",
      a: "14 days on physical goods, no questions asked. Digital sales are final.",
    },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="mt-[88px] mb-8 py-12 border-t border-dashed border-border-strong">
      <div className="grid grid-cols-1 md:[grid-template-columns:2fr_3fr] gap-8 md:gap-16 items-start">
        <div>
          <div className="font-mono text-[10px] text-hearth tracking-widest-2 mb-3">
            FAQ
          </div>
          <div className="font-serif text-[26px] sm:text-[32px] leading-[1.05] tracking-[-0.025em] mb-3.5">
            Questions neighbours ask
          </div>
          <div className="font-serif italic text-[17px] text-ink-muted leading-[1.45] mb-5">
            If something isn't here, our team replies in under an hour.
          </div>
          <a className="text-sm text-hearth font-semibold cursor-pointer underline underline-offset-4 decoration-dotted">
            Contact support →
          </a>
        </div>
        <div className="flex flex-col">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`${i === 0 ? "border-t border-dashed border-border-strong" : ""} border-b border-dashed border-border-strong`}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full bg-transparent border-none py-5 px-1 flex items-center justify-between gap-4 cursor-pointer text-left text-ink"
                >
                  <span className="font-serif text-base sm:text-lg tracking-[-0.015em] leading-[1.3]">
                    {it.q}
                  </span>
                  <span
                    className="font-mono text-lg text-hearth flex-shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-1 pb-[22px] text-sm text-ink-muted leading-[1.6] max-w-[620px]">
                    {it.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function LandingScreen({ navigate, savedSet, toggleSave }) {
  return (
    <div className="page pt-6">
      {/* Bento hero — stacks on mobile */}
      <div
        className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4"
        style={{ gridTemplateRows: "auto auto", minHeight: undefined }}
      >
        {/* Left hero */}
        <div
          className="grad grad-hero-blue rounded-3xl px-7 sm:px-12 py-9 sm:py-11 flex flex-col justify-between relative md:[grid-row:1/span_2]"
          style={{ color: "#FFFFFF", minHeight: 480 }}
        >
          <div className="absolute top-7 right-8 z-[2] hidden sm:block">
            <MarketTicket
              label="EST. 2026"
              value="Abuja"
              rotation={3}
              variant="cream"
              lg
            />
          </div>
          <div className="relative z-[1]">
            <div
              className="inline-flex items-center gap-3 mb-[22px] px-3.5 py-2 rounded-full"
              style={{
                background: "rgba(255,255,255,0.16)",
                backdropFilter: "blur(4px)",
              }}
            >
              <HTMonogram size={32} inverse />
              <HTWordmark size={20} inverse />
            </div>
            <StatusPill>247 NEIGHBOURS · LIVE NOW</StatusPill>
            <h1
              className="h-hero mt-5 mb-3 max-w-[580px]"
              style={{ color: "#FFFFFF" }}
            >
              Shop your street.
            </h1>
            <div
              className="font-serif italic text-[24px] sm:text-[32px] leading-[1.05] tracking-[-0.01em] mb-7"
              style={{ color: "rgba(255,255,255,0.88)" }}
            >
              Meet your neighbours.
            </div>
            <p
              className="text-base max-w-[460px] mb-7 leading-[1.5]"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              A postcode-gated marketplace within a 2km walk. Furniture,
              electronics, vintage, the sourdough your neighbour just baked. One
              cart, many sellers.
            </p>
          </div>
          <div className="relative z-[1]">
            <PostcodeInput onSubmit={() => navigate("home")} />
            <div className="mt-3.5 flex items-center gap-3.5">
              <a
                className="font-serif italic text-sm text-canvas underline decoration-dotted underline-offset-4 cursor-pointer"
                onClick={() => navigate("home")}
              >
                or use my current location →
              </a>
            </div>
          </div>
        </div>

        {/* Right top — Pulse */}
        <div>
          <PulsePanel />
        </div>

        {/* Right bottom — Radius */}
        <div
          className="grad grad-deepmoss rounded-[20px] p-[22px] relative overflow-hidden"
          style={{ color: "var(--canvas)", minHeight: 220 }}
        >
          <div className="radius-rings">
            <div className="ring" style={{ width: 120, height: 120 }} />
            <div className="ring" style={{ width: 220, height: 220 }} />
            <div className="ring" style={{ width: 320, height: 320 }} />
            <span
              className="absolute w-3.5 h-3.5 rounded-full bg-saffron"
              style={{ boxShadow: "0 0 0 4px rgba(242,181,68,0.3)" }}
            />
          </div>
          <div className="relative z-[1] flex flex-col h-full justify-between">
            <span
              className="font-mono text-[10px]"
              style={{ color: "rgba(251,246,236,0.7)" }}
            >
              YOUR RADIUS
            </span>
            <div>
              <div className="font-serif text-[56px] leading-[0.95] text-canvas">
                2.0 <span className="text-[26px]">km</span>
              </div>
              <div
                className="font-serif italic text-base mt-1.5"
                style={{ color: "rgba(251,246,236,0.9)" }}
              >
                walking, cycling distance
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Peek strip */}
      <div className="divider-ticket mt-14">
        <span className="font-mono text-[11px] text-hearth">
          A PEEK AT WHAT'S NEARBY
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {[LISTINGS[0], LISTINGS[1], LISTINGS[10]].map((l) => (
          <ListingCard
            key={l.id}
            listing={l}
            onClick={() => navigate("pdp", { id: l.id })}
            saved={savedSet?.has(l.id)}
            onSave={toggleSave}
          />
        ))}
      </div>

      <TrustStrip />

      <MeetNeighbours navigate={navigate} />
      <HowItWorks />
      <TrendingRail navigate={navigate} savedSet={savedSet} toggleSave={toggleSave} />
      <Testimonials />
      <OpenAStall navigate={navigate} />
      <PressStrip />
      <FAQ />
    </div>
  );
}
