import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import MarketTicket from '../components/MarketTicket.jsx';
import { HTWordmark } from '../components/Brand.jsx';
import { PinIcon } from '../components/Icons.jsx';

function AuthBackButton({ navigate }) {
  return (
    <button
      onClick={() => navigate('landing')}
      className="inline-flex items-center gap-2 rounded-full text-[13px] text-ink cursor-pointer border border-border transition-colors hover:border-border-strong"
      style={{ padding: '8px 14px 8px 10px', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}
      aria-label="Back to HavenTrade"
    >
      <span className="font-mono text-sm text-hearth">←</span>
      <span>Back to HavenTrade</span>
    </button>
  );
}

function AuthFormField({ label, type = 'text', value, onChange, placeholder, mono, icon, suffix }) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] text-ink-muted mb-2 tracking-[0.16em]">{label}</div>
      <div className="flex items-center gap-2.5 bg-canvas border-[1.5px] border-border rounded-xl transition-all" style={{ padding: '4px 6px 4px 12px' }}>
        {icon && <span className="text-hearth inline-flex flex-shrink-0">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-0 border-none outline-none bg-transparent py-2.5 text-[15px] text-ink"
          style={{
            fontFamily: mono ? 'var(--mono)' : 'var(--sans)',
            letterSpacing: mono ? '0.12em' : 'normal',
            textTransform: mono ? 'uppercase' : 'none',
            fontWeight: mono ? 700 : 400,
          }}
        />
        {suffix}
      </div>
    </label>
  );
}

function OrDivider() {
  return (
    <div className="flex items-center gap-3.5 my-[22px]">
      <span className="flex-1 border-t border-dashed border-border-strong" />
      <span className="font-mono text-[10px] text-ink-subtle tracking-[0.2em]">OR</span>
      <span className="flex-1 border-t border-dashed border-border-strong" />
    </div>
  );
}

function GoogleButton() {
  return (
    <button type="button" className="btn btn--ghost w-full gap-3 font-medium bg-canvas border-[1.5px] border-border-strong" style={{ padding: '14px 20px' }}>
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="flex-shrink-0">
        <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.61z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.87-3.06.87a5.33 5.33 0 0 1-5-3.69H.96v2.32A9 9 0 0 0 9 18z"/>
        <path fill="#FBBC05" d="M4 10.74A5.4 5.4 0 0 1 3.71 9c0-.6.1-1.19.29-1.74V4.94H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.06L4 10.74z"/>
        <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.94L4 7.26C4.71 5.13 6.7 3.58 9 3.58z"/>
      </svg>
      Continue with Google
    </button>
  );
}

export default function SignUpScreen({ navigate }) {
  const { register } = useAuth();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [postcode, setPostcode] = useState('900237');
  const [isSeller, setIsSeller] = useState(false);
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password, postcode, isSeller });
      navigate('home');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white relative md:grid md:grid-cols-2">
      <div className="absolute top-4 left-4 md:top-5 md:left-8 z-10">
        <AuthBackButton navigate={navigate} />
      </div>

      {/* Left — gradient editorial (hidden on mobile) */}
      <div
        className="hidden md:flex grad grad-hero-blue flex-col justify-between relative overflow-hidden"
        style={{ padding: '96px 56px 56px', color: '#FFFFFF', minHeight: '100vh' }}
      >
        <div className="absolute top-7 right-8">
          <MarketTicket label="EST. 2026" value="Abuja" rotation={3} variant="cream" lg />
        </div>

        <div className="relative z-[1] max-w-[500px]">
          <span className="font-mono text-[11px] text-saffron tracking-widest-2">NEW NEIGHBOUR</span>
          <h1 className="font-serif text-[44px] leading-none tracking-[-0.03em] mt-3.5 mb-3.5" style={{ color: '#FFFFFF' }}>
            Welcome to the neighbourhood.
          </h1>
          <div className="font-serif italic text-xl leading-[1.4]" style={{ color: 'rgba(255,255,255,0.88)' }}>
            Three minutes to set up. Five seconds to your first listing.
          </div>
        </div>

        <div className="relative z-[1] flex flex-col gap-3.5 max-w-[380px]">
          <MarketTicket label="STEP 01" value="confirm your postcode" rotation={-3} lg />
          <MarketTicket label="STEP 02" value="verify ID with BVN" rotation={2} variant="saffron" lg />
          <MarketTicket label="STEP 03" value="browse within 2km" rotation={-2} variant="moss" lg />
        </div>

        <div className="relative z-[1] mt-12 max-w-[460px]">
          <div className="font-serif italic text-[17px] leading-[1.4]" style={{ color: '#FFFFFF' }}>
            "Sold a chair in 40 minutes to someone two streets over."
          </div>
          <div className="font-mono text-[10px] text-saffron tracking-widest-2 mt-2.5">
            — SANNE, MAITAMA
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-col justify-center px-6 py-20 md:px-14 md:py-14 max-w-[560px] w-full mx-auto bg-white">
        <h2 className="font-serif text-[28px] tracking-[-0.025em] leading-[1.1] mb-1.5 flex items-baseline gap-2 flex-wrap">
          Create your <HTWordmark size={28} /> account
        </h2>
        <div className="font-serif italic text-[15px] text-ink-subtle mb-7">
          Free, forever. No card.
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthFormField label="DISPLAY NAME" placeholder="Mara de Wit" value={name} onChange={setName} />
          <AuthFormField label="EMAIL" type="email" placeholder="mara@example.com" value={email} onChange={setEmail} />
          <AuthFormField
            label="PASSWORD"
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            suffix={
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="font-mono text-[11px] text-ink-muted tracking-[0.14em] font-bold cursor-pointer bg-transparent"
                style={{ padding: '6px 12px' }}
              >
                {showPw ? 'HIDE' : 'SHOW'}
              </button>
            }
          />
          <AuthFormField
            label="POSTCODE"
            placeholder="900237"
            value={postcode}
            onChange={setPostcode}
            mono
            icon={<PinIcon size={16} />}
          />

          {/* Seller toggle */}
          <label className={`flex items-start gap-3.5 px-4 py-4 rounded-xl border-[1.5px] cursor-pointer transition-colors ${isSeller ? 'bg-moss-soft border-moss' : 'bg-canvas border-border'}`}>
            <input type="checkbox" checked={isSeller} onChange={(e) => setIsSeller(e.target.checked)} className="mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-[14px] font-medium leading-snug">I want to sell on HavenTrade</div>
              <div className="font-serif italic text-[12px] text-ink-subtle mt-0.5">List items and open your stall to the neighbourhood.</div>
            </div>
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn--primary btn--lg w-full mt-2 disabled:opacity-60">
            {loading ? 'Creating account…' : <>Create account <span className="arr">→</span></>}
          </button>

          <div className="font-serif italic text-xs text-ink-subtle text-center leading-[1.5]">
            By creating an account you agree to our{' '}
            <a className="text-ink-muted underline underline-offset-[3px] cursor-pointer">Terms</a>{' '}
            and{' '}
            <a className="text-ink-muted underline underline-offset-[3px] cursor-pointer">Privacy</a>.
          </div>

          <OrDivider />
          <GoogleButton />
        </form>

        <div className="mt-7 pt-[18px] border-t border-dashed border-border-strong text-sm text-ink-muted text-center">
          Already have an account?{' '}
          <a onClick={() => navigate('signin')} className="text-hearth font-semibold cursor-pointer underline underline-offset-[3px]">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
