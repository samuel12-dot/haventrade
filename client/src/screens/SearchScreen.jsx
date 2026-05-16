import { useState, useMemo, useRef, useEffect } from 'react';
import { LISTINGS, CATEGORIES } from '../data/index.js';
import ListingCard from '../components/ListingCard.jsx';

function SearchIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function EmptyState({ q, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'var(--surface-2)' }}
      >
        <SearchIcon size={24} />
      </div>
      <div>
        <h3 className="font-serif text-[22px] tracking-[-0.02em] text-ink mb-1">
          Nothing found{q ? ` for "${q}"` : ''}
        </h3>
        <p className="font-serif italic text-ink-muted text-[15px] max-w-[340px] leading-[1.5]">
          Try a different spelling, browse by category, or check nearby neighbourhoods.
        </p>
      </div>
      <button onClick={onClear} className="btn btn--ghost mt-1">
        Clear search
      </button>
    </div>
  );
}

export default function SearchScreen({ navigate, query: initialQuery, savedSet, toggleSave }) {
  const inputRef = useRef(null);
  const [q,         setQ]         = useState(initialQuery || '');
  const [activeCat, setActiveCat] = useState(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const base = activeCat
      ? LISTINGS.filter((l) => l.category === activeCat)
      : LISTINGS;

    const term = q.trim().toLowerCase();
    if (!term) return base;

    return base.filter(
      (l) =>
        l.title.toLowerCase().includes(term) ||
        l.category.toLowerCase().includes(term) ||
        l.condition.toLowerCase().includes(term) ||
        l.neighbourhood.toLowerCase().includes(term) ||
        (l.sub         || '').toLowerCase().includes(term) ||
        (l.description || '').toLowerCase().includes(term)
    );
  }, [q, activeCat]);

  function clear() {
    setQ('');
    setActiveCat(null);
    inputRef.current?.focus();
  }

  return (
    <div className="page">

      {/* ── Search bar ─────────────────────────────── */}
      <div className="mb-7">
        <div
          className="flex items-center gap-3 rounded-2xl border transition-all"
          style={{
            padding: '12px 18px',
            background: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--ink-muted)')}
          onBlur={(e)  => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <span className="text-ink-muted flex-shrink-0"><SearchIcon size={18} /></span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search listings, categories, neighbourhoods…"
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-[16px] text-ink"
            style={{ fontFamily: 'var(--sans)' }}
          />
          {q && (
            <button
              onClick={clear}
              className="flex-shrink-0 text-ink-muted hover:text-ink transition-colors font-mono text-sm"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Category quick-filter pills ─────────────── */}
      <div className="flex gap-2 flex-wrap mb-7">
        {CATEGORIES.map((c) => {
          const active = activeCat === c.name;
          return (
            <button
              key={c.name}
              onClick={() => setActiveCat(active ? null : c.name)}
              className="chip transition-all"
              style={
                active
                  ? { background: 'var(--ink)', color: 'var(--canvas)', borderColor: 'var(--ink)' }
                  : {}
              }
            >
              {c.icon} {c.name}
            </button>
          );
        })}
      </div>

      {/* ── Results header ──────────────────────────── */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h2 className="h-page mb-1">
            {q ? `Results for "${q}"` : activeCat ? activeCat : 'All listings'}
          </h2>
          <span className="font-mono text-[11px] text-ink-subtle">
            {results.length} LISTING{results.length !== 1 ? 'S' : ''} · 900237 — MAITAMA
          </span>
        </div>
      </div>

      {/* ── Grid / empty state ──────────────────────── */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {results.map((l) => (
            <ListingCard
              key={l.id}
              listing={l}
              onClick={() => navigate('pdp', { id: l.id })}
              saved={savedSet?.has(l.id)}
              onSave={toggleSave}
            />
          ))}
        </div>
      ) : (
        <EmptyState q={q} onClear={clear} />
      )}
    </div>
  );
}
