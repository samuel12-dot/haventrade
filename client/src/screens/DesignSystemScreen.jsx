import { LISTINGS } from "../data/index.js";
import MarketTicket from "../components/MarketTicket.jsx";
import StatusPill from "../components/StatusPill.jsx";
import ConditionBadge from "../components/ConditionBadge.jsx";
import ListingCard from "../components/ListingCard.jsx";
import {
  HTWordmark,
  HTMonogram,
  HTLockupStacked,
  HTLockupHorizontal,
} from "../components/Brand.jsx";

const COLOR_TOKENS = [
  ["--canvas", "#FBF6EC", "Warm cream main background", "var(--ink)"],
  ["--surface", "#FFFFFF", "Cards, modals", "var(--ink)"],
  ["--surface-2", "#F4EAD3", "Section accent", "var(--ink)"],
  ["--surface-peach", "#F8C4B0", "Soft highlights", "var(--ink)"],
  ["--hearth", "#C44A2C", "Primary CTA, prices", "#FBF6EC"],
  ["--hearth-glow", "#E27A3F", "Gradient companion", "#FBF6EC"],
  ["--saffron", "#F2B544", "Accents, live", "var(--ink)"],
  ["--moss", "#2F5D3F", "Success, secondary CTA", "#FBF6EC"],
  ["--moss-soft", "#E5F0E8", "Mint surface", "var(--ink)"],
  ["--ink", "#1F1410", "Primary text", "#FBF6EC"],
  ["--ink-muted", "#5C4A3A", "Secondary text", "#FBF6EC"],
  ["--ink-subtle", "#7A6B5A", "Captions", "#FBF6EC"],
];

const TAGLINES = [
  {
    rank: "01",
    line: "Bring it home from the next street over.",
    note: "Recommended. Concrete verb (bring), implies short distance, sounds like something a person says.",
    winner: true,
  },
  {
    rank: "02",
    line: "Two thousand metres of marketplace.",
    note: 'Distinctive. Names the radius without saying "local". Numeric specificity reads premium.',
    winner: false,
  },
  {
    rank: "03",
    line: "Goods, from people you've passed on the bridge.",
    note: "Most warm-literary. Rotterdam-flavoured. Slightly long for hero, sings as a section pull-quote.",
    winner: false,
  },
  {
    rank: "04",
    line: "The market is the street.",
    note: "Punchy, stall-poster energy. Strong but slightly aphoristic.",
    winner: false,
  },
  {
    rank: "05",
    line: "Trade closer to home.",
    note: "User-supplied. Acceptable. Real-estate scent — 'home' has been worn down.",
    winner: false,
  },
];

function DSSection({ num, title, sub, children }) {
  return (
    <div className="mb-12">
      <div className="flex items-baseline gap-4 mb-[18px] pb-3.5 border-b border-dashed border-border-strong">
        <span className="font-mono text-[11px] text-hearth">{num}</span>
        <div>
          <div className="font-serif text-[28px] leading-none tracking-[-0.02em]">
            {title}
          </div>
          <div className="font-serif italic text-[14px] text-ink-subtle mt-1">
            {sub}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function DesignSystemScreen({ navigate }) {
  return (
    <div className="page">
      <div className="mb-8">
        <span className="font-mono text-[11px] text-hearth uppercase tracking-widest-2">
          HAVENTRADE DESIGN SYSTEM · v0.9
        </span>
        <h1 className="h-page mt-2 mb-2">Warm modern neighbourhood festival</h1>
        <div className="font-serif italic text-[18px] text-ink-muted max-w-[720px] leading-[1.5]">
          A sun-drenched, hand-printed marketplace. Aesop's clarity, Wolt's
          energy, a market poster's warmth.
        </div>
      </div>

      {/* 01 Brand */}
      <DSSection
        num="01"
        title="Brand"
        sub="HavenTrade. Haven for the warmth, Trade for the honesty."
      >
        {/* Wordmark scales */}
        <div className="mb-7">
          <div className="font-mono text-[10px] text-ink-muted mb-3.5 uppercase tracking-widest-2">
            WORDMARK · THREE SCALES
          </div>
          <div className="bg-surface border border-border rounded-2xl px-10 py-9 flex flex-col gap-7">
            {[
              [44, "HERO · 44PX"],
              [32, "PAGE · 32PX"],
              [22, "HEADER · 22PX"],
            ].map(([sz, label], i) => (
              <div
                key={sz}
                className={`flex items-baseline justify-between gap-6 ${i < 2 ? "border-b border-dashed border-border pb-6" : ""}`}
              >
                <HTWordmark size={sz} />
                <span className="font-mono text-[9px] text-ink-subtle">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monogram scales */}
        <div className="mb-7">
          <div className="font-mono text-[10px] text-ink-muted mb-3.5 uppercase tracking-widest-2">
            MONOGRAM · THREE SCALES
          </div>
          <div className="bg-surface border border-border rounded-2xl px-10 py-9 flex items-center justify-around gap-8">
            {[
              [96, "96PX · LARGE"],
              [48, "48PX · NAV"],
              [24, "24PX · FAVICON"],
            ].map(([sz, label]) => (
              <div key={sz} className="flex flex-col items-center gap-2.5">
                <HTMonogram size={sz} />
                <span className="font-mono text-[9px] text-ink-subtle">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lockups */}
        <div className="mb-7">
          <div className="font-mono text-[10px] text-ink-muted mb-3.5 uppercase tracking-widest-2">
            LOCKUPS
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-2xl px-8 py-11 flex flex-col items-center justify-center gap-3.5 min-h-[220px]">
              <HTLockupStacked monoSize={72} wordSize={28} />
              <span className="font-mono text-[9px] text-ink-subtle mt-2">
                STACKED · CENTERED
              </span>
            </div>
            <div className="bg-surface border border-border rounded-2xl px-8 py-11 flex flex-col items-center justify-center gap-3.5 min-h-[220px]">
              <HTLockupHorizontal monoSize={56} wordSize={32} />
              <span className="font-mono text-[9px] text-ink-subtle mt-2">
                HORIZONTAL · NAV / FOOTER
              </span>
            </div>
          </div>
        </div>

        {/* Monochrome + inverse */}
        <div className="mb-7">
          <div className="font-mono text-[10px] text-ink-muted mb-3.5 uppercase tracking-widest-2">
            MONOCHROME · INVERSE
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-canvas border border-border rounded-2xl px-8 py-9 flex flex-col items-center justify-center gap-[18px] min-h-[200px]">
              <HTLockupHorizontal monoSize={48} wordSize={26} mono />
              <HTWordmark size={20} mono />
              <span className="font-mono text-[9px] text-ink-subtle mt-1">
                INK ON CANVAS · SINGLE-COLOUR PRINT
              </span>
            </div>
            <div className="bg-ink rounded-2xl px-8 py-9 flex flex-col items-center justify-center gap-[18px] min-h-[200px]">
              <HTLockupHorizontal monoSize={48} wordSize={26} inverse />
              <HTWordmark size={20} inverse />
              <span
                className="font-mono text-[9px] mt-1"
                style={{ color: "rgba(251,246,236,0.5)" }}
              >
                CREAM ON INK · DARK SURFACES
              </span>
            </div>
          </div>
        </div>

        {/* Taglines */}
        <div>
          <div className="font-mono text-[10px] text-ink-muted mb-3.5 uppercase tracking-widest-2">
            TAGLINE — FIVE CANDIDATES, RANKED
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            {TAGLINES.map((t) => (
              <div
                key={t.rank}
                className={`rounded-xl p-5 flex flex-col gap-2.5 ${t.winner ? "bg-surface-2 border-[1.5px] border-dashed border-hearth" : "bg-surface border border-border"}`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`font-mono text-[11px] font-bold ${t.winner ? "text-hearth" : "text-ink-subtle"}`}
                  >
                    N° {t.rank}
                  </span>
                  {t.winner && (
                    <span className="font-mono text-[9px] text-canvas bg-hearth px-2 py-0.5 rounded-full tracking-[0.16em]">
                      RECOMMENDED
                    </span>
                  )}
                </div>
                <div className="font-serif text-[22px] text-ink tracking-[-0.015em] leading-[1.2]">
                  "{t.line}"
                </div>
                <div className="font-serif italic text-[13px] text-ink-muted leading-[1.5]">
                  {t.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DSSection>

      {/* 02 Colour */}
      <DSSection
        num="02"
        title="Colour"
        sub="Cream canvas, terracotta hearth, saffron sun, moss undergrowth."
      >
        <div className="grid grid-cols-4 gap-2.5">
          {COLOR_TOKENS.map(([k, hex, desc, fg]) => (
            <div
              key={k}
              style={{ background: hex, color: fg }}
              className="p-[18px] rounded-xl border border-border min-h-[120px] flex flex-col justify-between"
            >
              <div className="font-mono text-[10px] font-bold opacity-85">
                {k}
              </div>
              <div>
                <div className="font-mono text-[11px] font-bold">{hex}</div>
                <div className="font-serif italic text-[11px] opacity-85 mt-0.5">
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DSSection>

      {/* 03 Type */}
      <DSSection
        num="03"
        title="Type"
        sub="Fraunces for editorial presence. Inter for clarity. JetBrains Mono for the ticket detail."
      >
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="font-mono text-[10px] text-hearth mb-2 uppercase tracking-[0.18em]">
              FRAUNCES — DISPLAY
            </div>
            <div className="h-hero">Shop your street.</div>
            <div className="h-page mt-3.5">Meet your neighbours.</div>
            <div className="h-section mt-3.5">On your street right now</div>
            <div className="font-serif italic text-[18px] mt-3.5 text-ink-muted">
              "Today, 18:00 — by cargo bike."
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-hearth mb-2 uppercase tracking-[0.18em]">
              INTER — BODY
            </div>
            <p className="text-[16px] leading-[1.55] text-ink-muted">
              A postcode-gated marketplace within a 2 km walk. Furniture,
              electronics, vintage, the sourdough your neighbour just baked.
            </p>
            <div className="font-mono text-[10px] text-hearth mb-2 mt-[22px] uppercase tracking-[0.18em]">
              JETBRAINS MONO — TICKETS
            </div>
            <div className="font-mono text-[11px] text-ink">
              N° 0247M · 0.4 KM · LIVE NOW
            </div>
            <div className="price-lg mt-[22px]">
              €85
              <span className="font-serif italic text-[14px] text-ink-subtle ml-2">
                / free delivery over €30
              </span>
            </div>
          </div>
        </div>
      </DSSection>

      {/* 04 Tickets */}
      <DSSection
        num="04"
        title="Market tickets"
        sub="The signature element. Dashed border, slight rotation, mono label, italic value."
      >
        <div className="flex flex-wrap gap-[18px] items-start">
          <MarketTicket label="N° 0350M" value="Kralingen" rotation={-2} lg />
          <MarketTicket
            label="ETA"
            value="today, 18:00"
            rotation={2}
            variant="moss"
            lg
          />
          <MarketTicket
            label="DIGITAL"
            value="instant"
            rotation={-1}
            variant="saffron"
            lg
          />
          <MarketTicket label="EST. 2026" value="Rotterdam" rotation={3} lg />
          <MarketTicket
            label="MEMBER SINCE"
            value="spring '24"
            rotation={-2}
            variant="peach"
            lg
          />
          <MarketTicket
            label="LIVE"
            value="247 neighbours"
            rotation={1}
            variant="dark"
            lg
          />
        </div>
      </DSSection>

      {/* 05 Status */}
      <DSSection
        num="05"
        title="Status & live"
        sub="Pulse, presence, the warm hum of the street."
      >
        <div className="flex gap-4 flex-wrap items-center">
          <StatusPill>247 NEIGHBOURS · LIVE NOW</StatusPill>
          <span className="tag-soft">TOP RESPONDER</span>
          <span className="tag-soft tag-soft--peach">ID VERIFIED</span>
          <span className="tag-soft tag-soft--saffron">DIGITAL · INSTANT</span>
          <span className="tag-soft tag-soft--cream">LOCAL FAVOURITE</span>
        </div>
      </DSSection>

      {/* 06 Buttons */}
      <DSSection
        num="06"
        title="Buttons"
        sub="Hearth fill, dark fill, ghost, moss for affirmation."
      >
        <div className="flex gap-3 flex-wrap">
          <button className="btn btn--primary">
            Add to cart <span className="arr">→</span>
          </button>
          <button className="btn btn--dark">
            FIND <span className="arr">→</span>
          </button>
          <button className="btn btn--ghost">Save</button>
          <button className="btn btn--moss">Mark as packed</button>
          <button className="btn btn--primary btn--sm">Browse studio</button>
          <button className="btn btn--primary btn--lg">
            Continue to checkout <span className="arr">→</span>
          </button>
        </div>
      </DSSection>

      {/* 07 Listing card */}
      <DSSection
        num="07"
        title="Listing card"
        sub="The atom. Same skeleton, three states."
      >
        <div className="grid grid-cols-3 gap-[18px]">
          <ListingCard listing={LISTINGS[0]} onClick={() => {}} />
          <ListingCard listing={LISTINGS[3]} onClick={() => {}} />
          <ListingCard listing={LISTINGS[8]} onClick={() => {}} />
        </div>
      </DSSection>

      {/* 08 Condition */}
      <DSSection num="08" title="Condition" sub="Five dots, no ambiguity.">
        <div className="flex flex-col gap-2.5">
          {[
            ["New", 5],
            ["Like new", 4],
            ["Good", 3],
            ["Fair", 2],
            ["For parts", 1],
          ].map(([l, n]) => (
            <div key={l} className="flex items-center gap-[18px]">
              <ConditionBadge level={n} label={l} />
              <span className="font-serif italic text-[14px] text-ink-muted">
                {l === "Like new"
                  ? "Used briefly. Looks new."
                  : l === "Good"
                    ? "Light wear, fully functional."
                    : l === "Fair"
                      ? "Honest signs of life."
                      : l === "For parts"
                        ? "Won't run as-is. Tinker bait."
                        : "Sealed or unworn."}
              </span>
            </div>
          ))}
        </div>
      </DSSection>

      {/* CTA footer */}
      <div className="bg-ink text-canvas rounded-[20px] p-8 mt-8 flex justify-between items-center">
        <div>
          <div className="font-mono text-[11px] text-saffron mb-2 uppercase tracking-widest-2">
            READY TO BROWSE?
          </div>
          <div className="font-serif text-[32px] text-canvas">
            Open the prototype.
          </div>
        </div>
        <button
          className="btn bg-saffron text-ink"
          onClick={() => navigate("landing")}
        >
          Start at the front door <span className="arr">→</span>
        </button>
      </div>
    </div>
  );
}
