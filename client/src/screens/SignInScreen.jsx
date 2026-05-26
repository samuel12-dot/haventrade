import { useState } from 'react';
import { LISTINGS } from '../data/index.js';
import { useAuth } from '../context/AuthContext.jsx';
import ListingCard  from '../components/ListingCard.jsx';
import MarketTicket from '../components/MarketTicket.jsx';
import { HTWordmark } from '../components/Brand.jsx';

function AuthBackButton({ navigate }) {
  return (
    <button
      onClick={() => navigate('landing')}
      className="inline-flex items-center gap-2 rounded-full text-[13px] text-ink cursor-pointer border border-border transition-colors hover:border-border-strong"
      style={{ padding: '8px 14px 8px 10px', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}
    >
      <span className="font-mono text-sm text-hearth">←</span>
      <span>Back to HavenTrade</span>
    </button>
  );
}

function AuthFormField({ label, type = 'text', value, onChange, placeholder, suffix }) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] text-ink-muted mb-2 tracking-[0.16em]">{label}</div>
      <div className="auth-field-wrap flex items-center gap-2.5 bg-canvas border-[1.5px] border-border rounded-xl" style={{ padding: '4px 6px 4px 12px' }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-0 border-none outline-none bg-transparent py-2.5 text-[15px] text-ink"
        />
        {suffix}
      </div>
    </label>
  );
}


export default function SignInScreen({ navigate }) {
  const { login } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [errorKey, setErrorKey] = useState(0);

  const teaser = LISTINGS.find((l) => l.id === 'l12') || LISTINGS[0];

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('home');
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.');
      setErrorKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white relative md:grid md:grid-cols-2">
      <div className="absolute top-4 left-4 md:top-5 md:left-8 z-10">
        <AuthBackButton navigate={navigate} />
      </div>

      {/* Left — form */}
      <div className="flex flex-col justify-center px-6 py-20 md:px-14 md:py-14 max-w-[560px] w-full mx-auto bg-white">
        <h2 className="font-serif text-[28px] tracking-[-0.025em] leading-[1.1] mb-1.5 flex items-baseline gap-2 flex-wrap">
          Sign in to <HTWordmark size={28} />
        </h2>
        <div className="font-serif italic text-[15px] text-ink-subtle mb-7">
          Pick up where the neighbours left you.
        </div>

        <form key={errorKey} onSubmit={handleSubmit} className={`flex flex-col gap-4${error ? ' shake' : ''}`}>
          <AuthFormField label="EMAIL" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
          <AuthFormField
            label="PASSWORD"
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            suffix={
              <button type="button" onClick={() => setShowPw(!showPw)} className="font-mono text-[11px] text-ink-muted tracking-[0.14em] font-bold cursor-pointer bg-transparent" style={{ padding: '6px 12px' }}>
                {showPw ? 'HIDE' : 'SHOW'}
              </button>
            }
          />

          <div className="flex justify-between items-center">
            <label className="inline-flex items-center gap-2 text-[13px] text-ink-muted cursor-pointer">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-hearth" />
              Remember me
            </label>
            <a className="text-[13px] text-hearth font-semibold cursor-pointer underline underline-offset-[3px] decoration-dotted">
              Forgot password?
            </a>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn--primary btn--lg w-full mt-2 disabled:opacity-60">
            {loading ? 'Signing in…' : <>Sign in <span className="arr">→</span></>}
          </button>

        </form>

        <div className="mt-7 pt-[18px] border-t border-dashed border-border-strong text-sm text-ink-muted text-center">
          New here?{' '}
          <a onClick={() => navigate('signup')} className="text-hearth font-semibold cursor-pointer underline underline-offset-[3px]">
            Create an account
          </a>
        </div>
      </div>

      {/* Right — gradient editorial (hidden on mobile) */}
      <div className="hidden md:flex grad grad-hero-blue flex-col justify-between relative overflow-hidden" style={{ padding: '96px 56px 56px', color: '#FFF6ED', minHeight: '100vh' }}>

        {/* Seamless readability overlay — dark tint on left text area, white lift behind card */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              'linear-gradient(180deg, rgba(5,10,25,0.28) 0%, rgba(5,10,25,0.10) 35%, transparent 65%)',
              'linear-gradient(90deg, rgba(5,10,25,0.18) 0%, rgba(5,10,25,0.06) 45%, transparent 80%)',
              'radial-gradient(circle at 65% 55%, rgba(255,255,255,0.14), transparent 32%)',
            ].join(', '),
            zIndex: 0,
          }}
        />

        <div className="absolute top-7 right-8" style={{ zIndex: 2 }}>
          <MarketTicket label="LIVE" value="247 neighbours" rotation={3} variant="dark" lg />
        </div>

        <div className="relative max-w-[500px]" style={{ zIndex: 1 }}>
          <span
            className="font-mono"
            style={{
              color: 'rgba(227,201,143,0.95)',
              fontSize: 11,
              letterSpacing: '0.22em',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0,0,0,0.18)',
            }}
          >
            SIGN BACK IN
          </span>
          <h1 className="font-serif text-[44px] leading-none tracking-[-0.03em] mt-3.5 mb-3.5" style={{ color: '#FFF6ED' }}>
            Welcome back.
          </h1>
          <div className="font-serif italic text-xl leading-[1.4]" style={{ color: 'rgba(255,246,237,0.84)' }}>
            Your neighbours have been busy.{' '}
            <span style={{ color: 'rgba(227,201,143,0.95)' }}>17 new listings</span>{' '}
            on your street since you were last here.
          </div>
        </div>

        <div className="relative flex justify-center my-8" style={{ zIndex: 1 }}>
          <div className="max-w-[360px] w-full rounded-2xl" style={{ transform: 'rotate(2deg)', boxShadow: '0 24px 56px rgba(15,30,80,0.30)' }}>
            <ListingCard listing={teaser} onClick={() => {}} />
          </div>
        </div>

        <div className="relative max-w-[460px]" style={{ zIndex: 1 }}>
          <div
            className="font-mono"
            style={{
              color: 'rgba(227,201,143,0.95)',
              fontSize: 11,
              letterSpacing: '0.22em',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0,0,0,0.18)',
            }}
          >
            JUST ADDED ON YOUR STREET
          </div>
        </div>
      </div>
    </div>
  );
}
