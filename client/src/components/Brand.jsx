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

export function HTMonogram({ size = 64, mono = false, inverse = false, bare = false, style = {} }) {
  const surface = inverse ? '#1F1410' : '#FBF6EC';
  const border  = inverse ? '#F2B544' : mono ? '#1F1410' : '#C44A2C';
  const arch    = inverse ? '#FBF6EC' : '#1F1410';
  const letter  = inverse ? '#F2B544' : mono ? '#1F1410' : '#C44A2C';
  const gradId  = `ht-paper-${size}-${inverse ? 'i' : mono ? 'm' : 'n'}`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="HavenTrade" style={{ display: 'block', flexShrink: 0, ...style }}>
      <defs>
        <radialGradient id={gradId} cx="34%" cy="28%" r="80%">
          <stop offset="0%"   stopColor={inverse ? '#2A1A14' : '#FFFCF4'} />
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
