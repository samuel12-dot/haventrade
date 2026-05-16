import { LISTINGS } from '../data/index.js';
import ListingCard from '../components/ListingCard.jsx';

function HeartOutline() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21C12 21 3 13.5 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-9 13-9 13z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WishlistScreen({ navigate, savedSet, toggleSave }) {
  const saved = LISTINGS.filter((l) => savedSet?.has(l.id));

  return (
    <div className="page">
      <h1 className="h-page mb-1.5">Wishlist</h1>

      {saved.length === 0 ? (
        <div className="py-24 flex flex-col items-center text-center gap-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-ink-subtle"
            style={{ background: 'var(--surface-2)' }}
          >
            <HeartOutline />
          </div>
          <div>
            <h3 className="font-serif text-[22px] tracking-[-0.02em] text-ink mb-2">
              Nothing saved yet.
            </h3>
            <p className="font-serif italic text-ink-muted text-[15px] max-w-[340px] leading-[1.5]">
              You haven't saved anything on your street yet. Heart a listing to keep it here.
            </p>
          </div>
          <button onClick={() => navigate('home')} className="btn btn--primary mt-1">
            Browse the market <span className="arr">→</span>
          </button>
        </div>
      ) : (
        <>
          <div className="font-serif italic text-[18px] text-ink-muted mb-7">
            {saved.length} {saved.length === 1 ? 'item' : 'items'} saved
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {saved.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                onClick={() => navigate('pdp', { id: l.id })}
                saved={savedSet?.has(l.id)}
                onSave={toggleSave}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
