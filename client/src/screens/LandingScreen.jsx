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

function TrendingRail({ navigate }) {
  const trending = ["l12", "l02", "l10", "l03"];
  return (
    <section className="mt-[88px]">
      <SectionHead
        title="Trending on your street"
        sub="What Kralingen is buying right now."
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
      where: "Kralingen",
      grad: "grad-vintage",
      initial: "S",
      ticket: { l: "MEMBER SINCE", v: "spring '24", rot: -3, variant: "cream" },
    },
    {
      text: "I bought a sourdough starter and ended up at Aisha's bakery the next morning. That doesn't happen on Marktplaats.",
      who: "Mark",
      where: "Hillegersberg",
      grad: "grad-cream",
      initial: "M",
      ticket: { l: "VERIFIED", v: "purchase", rot: 3, variant: "moss" },
      tall: true,
    },
    {
      text: "The 2 km radius means I actually meet the people I buy from. It feels like the city used to before everything went online.",
      who: "Linda",
      where: "Nieuwe Westen",
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

function OpenAStall({ navigate }) {
  const stats = [
    ["€2.4M", "TRADED IN 2025"],
    ["6 HRS", "AVG TIME TO SELL"],
    ["92%", "DELIVERED SAME DAY"],
  ];
  return (
    <section
      className="mt-[88px]"
      style={{
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
      }}
    >
      <div
        className="grad grad-terracotta px-6 sm:px-16 py-[56px] sm:py-[72px] relative overflow-hidden"
        style={{ color: "var(--canvas)" }}
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 md:gap-12 items-center">
          <div>
            <div className="font-mono text-[11px] text-saffron tracking-widest-2 mb-[18px]">
              FOR SELLERS
            </div>
            <h2 className="font-serif text-[40px] sm:text-[56px] leading-none tracking-[-0.03em] text-canvas m-0">
              Open a stall on your street.
            </h2>
            <div
              className="font-serif italic text-xl sm:text-2xl leading-[1.3] mt-3.5"
              style={{ color: "rgba(251,246,236,0.9)" }}
            >
              List in 3 minutes. Sell to neighbours by sundown.
            </div>
            <div className="flex gap-3 mt-9 flex-wrap">
              {stats.map(([n, l], i) => (
                <div
                  key={l}
                  className="flex flex-col gap-1 px-4 py-3 rounded-[10px]"
                  style={{
                    border: "1.5px dashed rgba(251,246,236,0.5)",
                    background: "rgba(31,20,16,0.12)",
                    transform: `rotate(${i === 1 ? 1 : -1}deg)`,
                  }}
                >
                  <span className="font-serif text-[22px] text-canvas tracking-[-0.02em]">
                    {n}
                  </span>
                  <span className="font-mono text-[9px] text-saffron tracking-[0.16em]">
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-3">
            <button
              className="btn btn--dark btn--lg"
              onClick={() => navigate("dashboard")}
              style={{
                fontFamily: "var(--mono)",
                fontSize: 13,
                letterSpacing: "0.16em",
                padding: "20px 32px",
              }}
            >
              OPEN YOUR STALL <span className="arr">→</span>
            </button>
            <span
              className="font-serif italic text-sm ml-1"
              style={{ color: "rgba(251,246,236,0.8)" }}
            >
              No listing fees, ever.
            </span>
          </div>
        </div>
        <div className="absolute top-7 right-8 hidden sm:block">
          <MarketTicket
            label="EST. 2026"
            value="Rotterdam"
            rotation={3}
            variant="cream"
            lg
          />
        </div>
      </div>
    </section>
  );
}

function PressStrip() {
  const press = [
    {
      name: "NRC Handelsblad",
      cls: "font-serif font-semibold text-[22px] tracking-[-0.02em]",
    },
    {
      name: "Vers Beton",
      cls: "font-mono font-bold text-sm tracking-widest-2 uppercase",
    },
    {
      name: "Rotterdam.info",
      cls: "font-sans font-medium text-lg tracking-[-0.01em]",
    },
    {
      name: "BNR Nieuwsradio",
      cls: "font-sans font-bold text-[17px] tracking-[0.04em] uppercase",
    },
    {
      name: "Het Parool",
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
      a: "Every seller goes through ID verification with iDIN. Look for the green checkmark on their storefront.",
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

export default function LandingScreen({ navigate }) {
  return (
    <div className="page pt-6">
      {/* Bento hero — stacks on mobile */}
      <div
        className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4"
        style={{ gridTemplateRows: "auto auto", minHeight: undefined }}
      >
        {/* Left hero */}
        <div
          className="grad grad-terracotta rounded-3xl px-7 sm:px-12 py-9 sm:py-11 flex flex-col justify-between relative md:[grid-row:1/span_2]"
          style={{ color: "var(--canvas)", minHeight: 480 }}
        >
          <div className="absolute top-7 right-8 z-[2] hidden sm:block">
            <MarketTicket
              label="EST. 2026"
              value="Rotterdam"
              rotation={3}
              variant="cream"
              lg
            />
          </div>
          <div className="relative z-[1]">
            <div
              className="inline-flex items-center gap-3 mb-[22px] px-3.5 py-2 rounded-full"
              style={{
                background: "rgba(251,246,236,0.14)",
                backdropFilter: "blur(2px)",
              }}
            >
              <HTMonogram size={32} inverse />
              <HTWordmark size={20} inverse />
            </div>
            <StatusPill>247 NEIGHBOURS · LIVE NOW</StatusPill>
            <h1
              className="h-hero mt-5 mb-3 max-w-[580px]"
              style={{ color: "var(--canvas)" }}
            >
              Shop your street.
            </h1>
            <div
              className="font-serif italic text-[24px] sm:text-[32px] leading-[1.05] tracking-[-0.01em] mb-7"
              style={{ color: "rgba(251,246,236,0.92)" }}
            >
              Meet your neighbours.
            </div>
            <p
              className="text-base max-w-[460px] mb-7 leading-[1.5]"
              style={{ color: "rgba(251,246,236,0.85)" }}
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
          />
        ))}
      </div>

      <TrustStrip />

      <MeetNeighbours navigate={navigate} />
      <HowItWorks />
      <TrendingRail navigate={navigate} />
      <Testimonials />
      <OpenAStall navigate={navigate} />
      <PressStrip />
      <FAQ />
    </div>
  );
}
