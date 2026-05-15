export function HTWordmark({ size = 24, mono = false, inverse = false, style = {} }) {
  const haven = inverse ? 'var(--canvas)' : mono ? 'var(--ink)' : 'var(--hearth)';
  const trade = inverse ? 'var(--canvas)' : 'var(--ink)';
  return (
    <span
      className="ht-wordmark"
      style={{
        fontFamily: 'var(--serif)',
        fontWeight: 500,
        fontSize: size,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'baseline',
        ...style,
      }}
    >
      <span style={{ color: haven }}>Haven</span>
      <span style={{ color: trade, marginLeft: '-0.04em' }}>Trade</span>
    </span>
  );
}

export function HTMonogram({ size = 64, mono = false, inverse = false, bare = false, glow = false, style = {} }) {
  const surface = inverse ? '#0A0F1C' : '#FBF6EC';
  const border  = inverse ? '#F2B544' : mono ? '#1F1410' : '#C44A2C';
  const arch    = inverse ? '#FBF6EC' : '#1F1410';
  const letter  = inverse ? '#F2B544' : mono ? '#1F1410' : '#C44A2C';
  const gradId  = `ht-paper-${size}-${inverse ? 'i' : mono ? 'm' : 'n'}`;

  if (glow) {
    const uid = `ht-glow-${size}`;
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="HavenTrade" style={{ display: 'block', flexShrink: 0, ...style }}>
        <defs>
          <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#DBEAFE" stopOpacity="1" />
            <stop offset="55%" stopColor="#93C5FD" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-inner`} cx="42%" cy="36%" r="65%">
            <stop offset="0%"   stopColor="#EFF6FF" />
            <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.8" />
          </radialGradient>
          <filter id={`${uid}-blur`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Outer halo */}
        <circle cx="50" cy="50" r="49" fill={`url(#${uid}-halo)`} />
        {/* Inner lit circle */}
        <circle cx="50" cy="50" r="33" fill={`url(#${uid}-inner)`} />
        {/* Dashed ring */}
        <circle cx="50" cy="50" r="44" fill="none" stroke="#3B82F6" strokeWidth="1.8" strokeDasharray="4.5 3" />
        {/* Arch */}
        <path d="M 34 72 L 34 50 Q 34 30 50 30 Q 66 30 66 50 L 66 72" fill="none" stroke="#93C5FD" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
        {/* H with glow */}
        <g fill="#3B82F6" filter={`url(#${uid}-blur)`}>
          <rect x="35.5" y="38"   width="4.4"  height="32"  />
          <rect x="60.1" y="38"   width="4.4"  height="32"  />
          <rect x="39.9" y="51.6" width="20.2" height="3.2" />
          <rect x="32.5" y="38"   width="10.4" height="1.8" />
          <rect x="32.5" y="68.2" width="10.4" height="1.8" />
          <rect x="57.1" y="38"   width="10.4" height="1.8" />
          <rect x="57.1" y="68.2" width="10.4" height="1.8" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="HavenTrade" style={{ display: 'block', flexShrink: 0, ...style }}>
      <defs>
        <radialGradient id={gradId} cx="34%" cy="28%" r="80%">
          <stop offset="0%"   stopColor={inverse ? '#131929' : '#FFFCF4'} />
          <stop offset="100%" stopColor={surface} />
        </radialGradient>
      </defs>
      {!bare && (
        <circle cx="50" cy="50" r="46" fill={`url(#${gradId})`} stroke={border} strokeWidth="1.5" strokeDasharray="3 3" />
      )}
      {bare && <circle cx="50" cy="50" r="48" fill={surface} />}
      <path d="M 30 74 L 30 46 Q 30 26 50 26 Q 70 26 70 46 L 70 74" fill="none" stroke={arch} strokeWidth="1.5" strokeLinecap="round" opacity={inverse ? 0.55 : 0.4} />
      <rect x="35.5" y="38"   width="4.4" height="32"  fill={letter} />
      <rect x="60.1" y="38"   width="4.4" height="32"  fill={letter} />
      <rect x="39.9" y="51.6" width="20.2" height="3.2" fill={letter} />
      <rect x="32.5" y="38"   width="10.4" height="1.8" fill={letter} />
      <rect x="32.5" y="68.2" width="10.4" height="1.8" fill={letter} />
      <rect x="57.1" y="38"   width="10.4" height="1.8" fill={letter} />
      <rect x="57.1" y="68.2" width="10.4" height="1.8" fill={letter} />
    </svg>
  );
}

export function HTLockupStacked({ monoSize = 72, wordSize = 28, mono = false, inverse = false }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <HTMonogram size={monoSize} mono={mono} inverse={inverse} />
      <HTWordmark size={wordSize} mono={mono} inverse={inverse} />
    </div>
  );
}

export function HTLockupHorizontal({ monoSize = 36, wordSize = 22, mono = false, inverse = false, gap = 10 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <HTMonogram size={monoSize} mono={mono} inverse={inverse} />
      <HTWordmark size={wordSize} mono={mono} inverse={inverse} />
    </div>
  );
}
