import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/index.js';
import { LISTINGS } from '../data/index.js';
import SellerAvatar from '../components/SellerAvatar.jsx';
import BackLink from '../components/BackLink.jsx';
import ListingCard  from '../components/ListingCard.jsx';
import { PinIcon }  from '../components/Icons.jsx';

const GRADS = [
  'grad-cool', 'grad-terracotta', 'grad-saffron', 'grad-moss',
  'grad-peach', 'grad-vintage', 'grad-plum', 'grad-deepmoss', 'grad-sun',
];

function Field({ label, type = 'text', value, onChange, placeholder, mono }) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] text-ink-muted mb-2 tracking-[0.16em]">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
        style={mono ? { fontFamily: 'var(--mono)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 } : undefined}
      />
    </label>
  );
}

function Toast({ msg, error }) {
  if (!msg) return null;
  return (
    <div className={`rounded-xl px-4 py-3 text-sm ${error ? 'bg-red-50 border border-red-200 text-danger' : 'bg-moss-soft border border-moss text-moss'}`}>
      {msg}
    </div>
  );
}

function TabBar({ tab, setTab }) {
  const tabs = [
    { id: 'profile',  label: 'Profile' },
    { id: 'saved',    label: 'Saved' },
    { id: 'security', label: 'Security' },
  ];
  return (
    <div className="flex gap-1 border-b border-dashed border-border-strong mb-8">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${tab === t.id ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
        >
          {t.label}
          {tab === t.id && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-hearth rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
}

function ProfileTab({ user }) {
  const { refreshUser } = useAuth();
  const [name,          setName]          = useState(user?.name         || '');
  const [postcode,      setPostcode]      = useState(user?.postcode     || '');
  const [neighbourhood, setNeighbourhood] = useState(user?.neighbourhood || '');
  const [grad,          setGrad]          = useState(user?.grad         || 'grad-cool');
  const [saving,        setSaving]        = useState(false);
  const [msg,           setMsg]           = useState('');
  const [isError,       setIsError]       = useState(false);
  const [becomingBuyer, setBecomingBuyer] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      await api.updateProfile({ name, postcode, neighbourhood, grad });
      setMsg('Profile updated.'); setIsError(false);
    } catch (err) {
      setMsg(err.message); setIsError(true);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 4000);
    }
  }

  async function handleBecomeSeller() {
    setBecomingBuyer(true);
    try {
      await api.updateProfile({ sellerProfile: { since: String(new Date().getFullYear()) } });
      await refreshUser();
    } catch (err) {
      setMsg(err.message); setIsError(true);
    } finally {
      setBecomingBuyer(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-[520px]">
      <Field label="DISPLAY NAME" value={name} onChange={setName} placeholder="Your name" />
      <Field label="POSTCODE"     value={postcode} onChange={setPostcode} placeholder="900237" mono />
      <Field label="NEIGHBOURHOOD" value={neighbourhood} onChange={setNeighbourhood} placeholder="Maitama" />

      <div>
        <div className="font-mono text-[10px] text-ink-muted mb-3 tracking-[0.16em]">AVATAR COLOUR</div>
        <div className="flex flex-wrap gap-2.5">
          {GRADS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGrad(g)}
              className={`grad ${g} w-9 h-9 rounded-full transition-transform ${grad === g ? 'ring-2 ring-offset-2 ring-hearth scale-110' : 'hover:scale-105'}`}
            />
          ))}
        </div>
      </div>

      <Toast msg={msg} error={isError} />

      <button type="submit" disabled={saving} className="btn btn--primary self-start disabled:opacity-60">
        {saving ? 'Saving…' : 'Save changes'}
      </button>

      {!user?.isSeller && (
        <div className="mt-2 pt-6 border-t border-dashed border-border-strong">
          <div className="font-serif text-[18px] mb-1">Open your stall</div>
          <div className="font-serif italic text-[13px] text-ink-subtle mb-4">
            Become a seller to list items and sell to neighbours.
          </div>
          <button
            type="button"
            disabled={becomingBuyer}
            onClick={handleBecomeSeller}
            className="btn btn--primary disabled:opacity-60"
          >
            {becomingBuyer ? 'Setting up…' : 'Become a seller →'}
          </button>
        </div>
      )}

      {user?.isSeller && (
        <div className="mt-2 pt-6 border-t border-dashed border-border-strong">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-moss-soft rounded-full">
            <span className="text-moss text-[11px] font-mono font-bold tracking-[0.14em]">✓ SELLER ACCOUNT</span>
          </div>
        </div>
      )}
    </form>
  );
}

function SavedTab({ navigate, savedSet, toggleSave }) {
  const saved = LISTINGS.filter((l) => savedSet?.has(l.id));

  if (!saved.length) {
    return (
      <div className="py-16 text-center">
        <div className="font-serif text-2xl text-ink mb-2">Nothing saved yet.</div>
        <div className="font-serif italic text-ink-muted mb-6">Heart listings while browsing to save them here.</div>
        <button onClick={() => navigate('home')} className="btn btn--primary">
          Browse the market <span className="arr">→</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
  );
}

function SecurityTab() {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw,     setNewPw]     = useState('');
  const [showCur,   setShowCur]   = useState(false);
  const [showNew,   setShowNew]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState('');
  const [isError,   setIsError]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPw.length < 8) { setMsg('New password must be at least 8 characters.'); setIsError(true); return; }
    setSaving(true); setMsg('');
    try {
      await api.changePassword({ currentPassword: currentPw, newPassword: newPw });
      setMsg('Password updated.'); setIsError(false);
      setCurrentPw(''); setNewPw('');
    } catch (err) {
      setMsg(err.message); setIsError(true);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 4000);
    }
  }

  function PasswordField({ label, value, onChange, show, onToggle }) {
    return (
      <label className="block">
        <div className="font-mono text-[10px] text-ink-muted mb-2 tracking-[0.16em]">{label}</div>
        <div className="flex items-center gap-2 bg-surface border-[1.5px] border-border rounded-xl" style={{ padding: '4px 6px 4px 14px' }}>
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="••••••••"
            className="flex-1 min-w-0 border-none outline-none bg-transparent py-2.5 text-[15px] text-ink"
          />
          <button type="button" onClick={onToggle} className="font-mono text-[11px] text-ink-muted tracking-[0.14em] font-bold" style={{ padding: '6px 12px' }}>
            {show ? 'HIDE' : 'SHOW'}
          </button>
        </div>
      </label>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-[520px]">
      <PasswordField label="CURRENT PASSWORD" value={currentPw} onChange={setCurrentPw} show={showCur} onToggle={() => setShowCur(!showCur)} />
      <PasswordField label="NEW PASSWORD"      value={newPw}     onChange={setNewPw}     show={showNew} onToggle={() => setShowNew(!showNew)} />

      <Toast msg={msg} error={isError} />

      <button type="submit" disabled={saving} className="btn btn--primary self-start disabled:opacity-60">
        {saving ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}

export default function ProfileScreen({ navigate, savedSet, toggleSave, onBack, backLabel }) {
  const { user, logout, loading } = useAuth();
  const [tab, setTab] = useState('profile');

  useEffect(() => {
    if (!loading && !user) navigate('signin');
  }, [user, loading]);

  async function handleLogout() {
    await logout();
    navigate('landing');
  }

  if (loading || !user) return null;

  return (
    <div className="page pt-8 pb-16">
      <BackLink onClick={onBack} label={backLabel} />
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-8 border-b border-dashed border-border-strong">
        <div className="flex items-center gap-5">
          <SellerAvatar seller={{ grad: user.grad || 'grad-cool', initial: user.name?.[0] || '?' }} size="lg" />
          <div>
            <div className="font-serif text-[26px] leading-[1.1] tracking-[-0.02em]">{user.name}</div>
            <div className="font-serif italic text-sm text-ink-subtle mt-0.5">{user.email}</div>
            {user.postcode && (
              <div className="inline-flex items-center gap-1.5 mt-2 text-xs text-ink-muted">
                <PinIcon size={11} />
                <span className="font-mono font-bold tracking-[0.1em]">{user.postcode}</span>
                {user.neighbourhood && <span className="font-serif italic">· {user.neighbourhood}</span>}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn--ghost self-start sm:self-auto text-sm text-ink-muted"
        >
          Sign out <span className="arr font-mono text-[11px]">→</span>
        </button>
      </div>

      <TabBar tab={tab} setTab={setTab} />

      {tab === 'profile'  && <ProfileTab user={user} />}
      {tab === 'saved'    && <SavedTab navigate={navigate} savedSet={savedSet} toggleSave={toggleSave} />}
      {tab === 'security' && <SecurityTab />}
    </div>
  );
}
