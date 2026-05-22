import { useState, useEffect } from "react";
import { LISTINGS, SELLERS } from "../data/index.js";
import { api } from "../api/index.js";
import MarketTicket from "../components/MarketTicket.jsx";
import SellerCardCompact from "../components/SellerCardCompact.jsx";
import ConditionBadge from "../components/ConditionBadge.jsx";
import ListingCard from "../components/ListingCard.jsx";
import DeliverySlotPicker from "../components/DeliverySlotPicker.jsx";
import { HeartIcon, StarIcon } from "../components/Icons.jsx";
import { imgUrl } from "../utils/cloudinary.js";
import BackLink from "../components/BackLink.jsx";

const isMongoId = (id) => /^[a-f\d]{24}$/i.test(String(id));

export default function PDPScreen({ navigate, listingId, addToCart, savedSet, toggleSave, onBack, backLabel }) {
  const staticListing = isMongoId(listingId)
    ? null
    : LISTINGS.find((l) => l.id === listingId) || LISTINGS[0];

  const [listing, setListing] = useState(staticListing);
  const [tab, setTab] = useState("description");
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveImg(0);
    setTab('description');
    if (isMongoId(listingId)) {
      api.getListing(listingId)
        .then(({ listing: data }) => setListing(data))
        .catch(() => setListing(LISTINGS[0]));
    } else {
      setListing(LISTINGS.find((l) => l.id === listingId) || LISTINGS[0]);
    }
  }, [listingId]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
        return;
      }
      if (!listing?.images?.length) return;
      if (e.key === "ArrowLeft")
        setActiveImg(
          (i) => (i - 1 + listing.images.length) % listing.images.length,
        );
      if (e.key === "ArrowRight")
        setActiveImg((i) => (i + 1) % listing.images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, listing?.images?.length]);

  if (!listing) {
    return (
      <div className="page flex items-center justify-center min-h-[60vh]">
        <div className="font-serif italic text-ink-subtle text-xl">
          Loading…
        </div>
      </div>
    );
  }

  const seller = listing._seller || SELLERS[listing.sellerId] || {};
  const isDigital = listing.digital;
  const isFree = listing.price === 0;

  const variants =
    listing.category === "Furniture"
      ? ["Walnut", "Oak", "Refurbished as-is"]
      : listing.category === "Clothing"
        ? ["S", "M", "L"]
        : null;

  const tabs = isDigital
    ? ["Description", "Item details", "License & format", "Reviews"]
    : ["Description", "Item details", "Delivery & returns", "Reviews"];

  return (
    <div className="page">
      <BackLink onClick={onBack} label={backLabel} />

      {/* Main 2-col layout — stacks on mobile */}
      <div className="grid gap-6 md:gap-10 md:[grid-template-columns:7fr_5fr]">
        {/* Gallery */}
        <div>
          {listing.images?.length > 0 ? (
            <>
              {/* Main image */}
              <div
                className="rounded-[20px] relative overflow-hidden cursor-pointer"
                style={{ aspectRatio: "5/4" }}
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={imgUrl(listing.images[activeImg], { width: 800 })}
                  alt={listing.title}
                  fetchpriority="high"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {/* Overlays */}
                <div className="absolute top-4 left-4" style={{ zIndex: 2 }}>
                  {isDigital ? (
                    <MarketTicket
                      label="DIGITAL"
                      value="instant download"
                      rotation={-2}
                      variant="saffron"
                      lg
                    />
                  ) : (
                    <MarketTicket
                      label={`N° ${String(listing.id).slice(-4).padStart(4, "0")}M`}
                      value={listing.neighbourhood}
                      rotation={-2}
                      lg
                    />
                  )}
                </div>
                <div className="absolute top-4 right-4" style={{ zIndex: 2 }}>
                  <span className="cat-pill">
                    {listing.category.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="grid grid-cols-4 gap-2.5 mt-3">
                {listing.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      aspectRatio: "1/1",
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      outline:
                        activeImg === i ? "2px solid var(--ink)" : "none",
                      outlineOffset: 2,
                    }}
                  >
                    <img
                      src={imgUrl(src, { width: 120 })}
                      alt={`${listing.title} ${i + 1}`}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </button>
                ))}
                {/* Fill remaining slots with gradient placeholders */}
                {Array.from({
                  length: Math.max(0, 4 - listing.images.length),
                }).map((_, i) => (
                  <div
                    key={`ph-${i}`}
                    className={`grad ${listing.grad} rounded-xl`}
                    style={{ aspectRatio: "1/1" }}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* No images — original gradient block */}
              <div
                className={`grad ${listing.grad} rounded-[20px] relative overflow-hidden`}
                style={{ aspectRatio: "5/4" }}
              >
                <div className="absolute top-4 left-4">
                  {isDigital ? (
                    <MarketTicket
                      label="DIGITAL"
                      value="instant download"
                      rotation={-2}
                      variant="saffron"
                      lg
                    />
                  ) : (
                    <MarketTicket
                      label={`N° ${String(listing.id).slice(-4).padStart(4, "0")}M`}
                      value={listing.neighbourhood}
                      rotation={-2}
                      lg
                    />
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="cat-pill">
                    {listing.category.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2.5 mt-3">
                {[listing.grad, "grad-cream", "grad-saffron", "grad-peach"].map(
                  (g, i) => (
                    <div
                      key={i}
                      className={`grad ${g} rounded-xl cursor-pointer`}
                      style={{
                        aspectRatio: "1/1",
                        outline: i === 0 ? "2px solid var(--ink)" : "none",
                        outlineOffset: 2,
                      }}
                    />
                  ),
                )}
              </div>
            </>
          )}
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <div
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
              backgroundColor: "rgba(0,0,0,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              style={{
                position: "absolute",
                top: 20,
                right: 28,
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 40,
                fontFamily: "monospace",
                cursor: "pointer",
                lineHeight: 1,
              }}
              aria-label="Close lightbox"
            >
              ×
            </button>

            {/* Prev arrow */}
            {listing.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImg(
                    (i) =>
                      (i - 1 + listing.images.length) % listing.images.length,
                  );
                }}
                style={{
                  position: "absolute",
                  left: 24,
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "#fff",
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  fontSize: 22,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}

            {/* Main lightbox image */}
            <img
              src={imgUrl(listing.images[activeImg], { width: 1200 })}
              alt={listing.title}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxHeight: "90vh",
                maxWidth: "90vw",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />

            {/* Next arrow */}
            {listing.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImg((i) => (i + 1) % listing.images.length);
                }}
                style={{
                  position: "absolute",
                  right: 24,
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "#fff",
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  fontSize: 22,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Next image"
              >
                ›
              </button>
            )}
          </div>
        )}

        {/* Right rail */}
        <div>
          <div className="mb-3.5">
            <MarketTicket
              label="DISTANCE"
              value={`${listing.distance} · ${listing.neighbourhood}`}
              rotation={-2}
            />
          </div>
          <h1 className="font-serif text-[32px] md:text-[40px] leading-[1.05] mb-2.5 tracking-[-0.025em]">
            {listing.title}
          </h1>
          <div className="flex items-center gap-3 mb-5 text-ink-muted text-sm flex-wrap">
            <span>{listing.category}</span>
            <span className="text-border-strong">·</span>
            <ConditionBadge
              level={listing.conditionLevel}
              label={listing.condition}
            />
          </div>

          <div className="mb-4">
            {isFree ? (
              <div className="font-serif text-[44px] text-moss italic leading-none">
                Free
              </div>
            ) : (
              <div className="flex items-baseline gap-3.5 flex-wrap">
                <span className="price-lg">₦{listing.price.toLocaleString()}</span>
                {!isDigital && (
                  <span className="font-serif italic text-sm text-ink-subtle">
                    / free delivery over ₦15,000
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mb-6">
            {isDigital ? (
              <div className="bg-saffron rounded-[14px] p-[18px] flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-ink text-saffron inline-flex items-center justify-center flex-shrink-0">
                  ↓
                </span>
                <div>
                  <div className="font-mono text-[10px] text-ink">
                    INSTANT DOWNLOAD
                  </div>
                  <div className="font-serif italic text-sm text-ink">
                    Available the moment payment clears
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-moss-soft rounded-[14px] p-[18px] flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-moss text-canvas inline-flex items-center justify-center flex-shrink-0">
                  🚲
                </span>
                <div>
                  <div className="font-mono text-[10px] text-moss">
                    DELIVERS TODAY
                  </div>
                  <div className="font-serif italic text-sm text-ink">
                    {listing.eta}, by bike from {listing.neighbourhood}
                  </div>
                </div>
              </div>
            )}
          </div>

          {variants && (
            <div className="mb-[18px]">
              <div className="font-mono text-[10px] text-ink-muted mb-2">
                FINISH
              </div>
              <div className="flex gap-2 flex-wrap">
                {variants.map((v, i) => (
                  <button
                    key={i}
                    className={`chip${variant === i ? " active" : ""}`}
                    onClick={() => setVariant(i)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div
            className={`font-mono text-[10px] mb-[18px] ${listing.stock <= 1 ? "text-hearth" : "text-ink-muted"}`}
          >
            {listing.stock <= 1
              ? "ONLY 1 LEFT AT THIS PRICE"
              : `${listing.stock} IN STOCK`}
          </div>

          <div className="flex items-center gap-3 mb-[22px]">
            {!isDigital && listing.stock > 1 && (
              <div className="qty">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="n">{qty}</span>
                <button onClick={() => setQty(qty + 1)}>+</button>
              </div>
            )}
            <button
              className="btn btn--primary btn--lg flex-1"
              onClick={() => addToCart(listing.id, qty)}
            >
              Add to cart <span className="arr">→</span>
            </button>
            <button
              className={`btn btn--lg ${savedSet?.has(listing.id) ? 'btn--primary' : 'btn--ghost'}`}
              aria-label={savedSet?.has(listing.id) ? 'Remove from wishlist' : 'Save to wishlist'}
              onClick={() => toggleSave?.(listing.id)}
            >
              <HeartIcon filled={savedSet?.has(listing.id)} />
              {savedSet?.has(listing.id) ? 'Saved' : 'Save'}
            </button>
          </div>

          <SellerCardCompact
            sellerId={listing.sellerId}
            sellerData={listing._seller}
            navigate={navigate}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 md:mt-14">
        <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
          {tabs.map((t) => {
            const k = t.toLowerCase();
            return (
              <button
                key={t}
                className="nav-link whitespace-nowrap flex-shrink-0"
                onClick={() => setTab(k)}
                style={{
                  borderRadius: 0,
                  padding: "12px 18px",
                  borderBottom:
                    tab === k
                      ? "2px solid var(--hearth)"
                      : "2px solid transparent",
                  color: tab === k ? "var(--ink)" : "var(--ink-muted)",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {tab === "description" && (
          <div className="grid gap-6 md:gap-10 max-w-[980px] md:[grid-template-columns:2fr_1fr]">
            <div className="font-serif text-[17px] leading-[1.55] text-ink-muted">
              <p className="mt-0">{listing.description}</p>
              {!isDigital && listing.eta && (
                <p className="font-serif italic text-[15px] text-ink-subtle">
                  Pickup or delivery within 2 km — {listing.eta}, by bike from {listing.neighbourhood}.
                </p>
              )}
            </div>
            <div>
              {seller.name && (
                <MarketTicket
                  label="HANDLED BY"
                  value={seller.name}
                  rotation={2}
                  variant="peach"
                  lg
                />
              )}
            </div>
          </div>
        )}

        {tab === "item details" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[980px]">
            {(listing.details?.length ? listing.details : [
              ["CATEGORY",     listing.category],
              ["CONDITION",    listing.condition],
              ["NEIGHBOURHOOD", listing.neighbourhood],
              ["ETA",          listing.eta || "—"],
              ["WARRANTY",     "30-day neighbour return"],
            ]).map(([k, v]) => (
              <div
                key={k}
                className="p-[14px] bg-surface border border-border rounded-xl"
              >
                <div className="font-mono text-[9px] text-ink-subtle mb-1.5">
                  {k}
                </div>
                <div className="font-serif italic text-base">{v}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "delivery & returns" && (
          <div className="max-w-[720px]">
            <DeliverySlotPicker
              slots={[
                { label: "TONIGHT", value: "18:00–19:00", price: "₦1,500" },
                { label: "TONIGHT", value: "19:00–20:00", price: "₦1,500" },
                { label: "TOMORROW", value: "morning", price: "FREE" },
                { label: "PICKUP", value: "from seller", price: "FREE" },
              ]}
              selected={0}
              onSelect={() => {}}
            />
            <div className="font-serif italic text-[15px] text-ink-muted mt-[18px] leading-[1.5]">
              All physical goods are delivered by platform-coordinated couriers
              on bicycles within your radius. Returns accepted within 14 days
              for a full refund — neighbour-to-neighbour, no questions, just a
              knock at the door.
            </div>
          </div>
        )}

        {tab === "license & format" && (
          <div className="max-w-[720px] grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(listing.details?.length ? listing.details : [
              ["FORMAT",     "PDF + PNG"],
              ["RESOLUTION", "300 DPI"],
              ["LICENSE",    "Personal use, single household"],
              ["FILE SIZE",  "—"],
            ]).map(([k, v]) => (
              <div
                key={k}
                className="p-4 bg-surface border border-border rounded-xl"
              >
                <div className="font-mono text-[9px] text-ink-subtle mb-1.5">
                  {k}
                </div>
                <div className="font-serif italic text-base">{v}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "reviews" && (
          <div className="max-w-[720px]">
            {[
              {
                who: "Jonas",
                grad: "grad-cool",
                when: "two weeks ago",
                stars: 5,
                body: "Sanne dropped it round on the cargo bike at exactly 18:00, helped me carry it up two flights. Chair is gorgeous.",
              },
              {
                who: "Mira",
                grad: "grad-peach",
                when: "a month ago",
                stars: 5,
                body: "Honest description, beautifully refinished. Felt like buying from a friend who happens to have great taste.",
              },
            ].map((r, i) => (
              <div
                key={i}
                className="py-5 border-b border-dashed border-border-strong"
              >
                <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                  <span className={`seller-avatar grad ${r.grad}`}>
                    <span className="relative z-[1]">{r.who[0]}</span>
                  </span>
                  <span className="font-serif text-base">{r.who}</span>
                  <span className="inline-flex gap-px">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <StarIcon key={s} size={12} />
                    ))}
                  </span>
                  <span className="font-serif italic text-xs text-ink-subtle">
                    {r.when}
                  </span>
                </div>
                <div className="font-serif text-base text-ink-muted">
                  {r.body}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related listings */}
      {seller.name && (
        <div className="mt-12 md:mt-16">
          <div className="divider-ticket">
            <span className="font-mono text-[11px] text-hearth">
              MORE FROM {seller.name.toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[18px]">
            {[
              ...LISTINGS.filter(
                (l) => l.sellerId === listing.sellerId && l.id !== listing.id,
              ),
              ...LISTINGS.filter((l) => l.sellerId !== listing.sellerId),
            ]
              .slice(0, 4)
              .map((l) => (
                <ListingCard
                  key={l.id}
                  listing={l}
                  onClick={() => navigate("pdp", { id: l.id })}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
