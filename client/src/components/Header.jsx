import { useState, useRef, useEffect } from 'react';
import { HTMonogram, HTWordmark } from './Brand.jsx';
import { PinIcon } from './Icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function MobileMenu({ items, onClose }) {
  return (
    <div className="md:hidden absolute top-full left-0 right-0 z-50 bg-canvas/95 backdrop-blur-md border-b border-border shadow-md py-3 px-4 flex flex-col gap-1">
      {items.map(({ label, action, active, badge }) => (
        <button
          key={label}
          onClick={() => { action(); onClose(); }}
          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${active ? 'bg-ink text-canvas' : 'text-ink-muted hover:bg-surface-2 hover:text-ink'}`}
        >
          <span>{label}</span>
          {badge > 0 && (
            <span className="bg-hearth text-canvas font-mono text-[9px] rounded-full px-1.5 py-0.5">{badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}

function AccountDropdown({ navigate }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate('landing');
  }

  const initial = user?.name?.[0] || '?';
  const grad    = user?.grad || 'grad-cool';
  const firstName = user?.name?.split(' ')[0] || 'Account';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="nav-link"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        aria-expanded={open}
      >
        <span
          className={`grad ${grad} inline-flex items-center justify-center font-serif italic text-canvas flex-shrink-0`}
          style={{ width: 26, height: 26, borderRadius: '50%', fontSize: 13 }}
        >
          {initial}
        </span>
        {firstName}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-surface border border-border rounded-2xl shadow-lift py-2 z-50" style={{ minWidth: 176 }}>
          {[
            { label: 'My profile', route: 'profile' },
            { label: 'Orders',     route: 'orders' },
            { label: 'Sell',       route: 'dashboard' },
          ].map(({ label, route }) => (
            <button
              key={route}
              onClick={() => { setOpen(false); navigate(route); }}
              className="w-full text-left px-4 py-2.5 text-sm text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors"
            >
              {label}
            </button>
          ))}
          <div className="border-t border-dashed border-border mx-3 my-1.5" />
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-sm font-semibold text-hearth hover:bg-red-50 transition-colors rounded-b-2xl"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function HamburgerButton({ open, onClick }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden ml-auto p-2 rounded-lg text-ink-muted hover:bg-surface-2 transition-colors"
      aria-label={open ? 'Close menu' : 'Open menu'}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        {open ? (
          <>
            <path d="M4 4L16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </>
        ) : (
          <>
            <path d="M3 5H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M3 10H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M3 15H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </>
        )}
      </svg>
    </button>
  );
}

function LoggedOutHeader({ navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const mobileItems = [
    { label: 'Browse',      action: () => navigate('home') },
    { label: 'How it works', action: () => {
      navigate('landing');
      setTimeout(() => {
        const el = document.querySelector('[data-section="how-it-works"]');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }, 50);
    }},
    { label: 'Sell with us', action: () => navigate('dashboard') },
    { label: 'Sign in',      action: () => navigate('signin') },
    { label: 'Get started',  action: () => navigate('signup') },
  ];

  return (
    <header className="app-header relative">
      <div className="app-header-inner">
        <button type="button" className="brand-mark transition-opacity hover:opacity-70" onClick={() => navigate('landing')} aria-label="HavenTrade — home" style={{ all: 'unset', display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', opacity: 1 }}>
          <HTMonogram size={34} glow />
          <HTWordmark size={22} />
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1.5 ml-auto">
          <a className="nav-link" onClick={() => navigate('home')}>Browse</a>
          <a className="nav-link" onClick={() => {
            const el = document.querySelector('[data-section="how-it-works"]');
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
          }}>How it works</a>
          <a className="nav-link" onClick={() => navigate('dashboard')}>Sell with us</a>

          <a
            onClick={() => navigate('signin')}
            className="font-semibold cursor-pointer text-sm ml-2 transition-opacity hover:opacity-75"
            style={{ padding: '8px 14px', color: '#F2B544' }}
          >
            Sign in
          </a>

          <button
            onClick={() => navigate('signup')}
            className="inline-flex flex-col items-center gap-0.5 rounded-full cursor-pointer ml-1 transition-all"
            style={{ padding: '8px 18px 7px', background: '#F2B544', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(242,181,68,0.35)' }}
          >
            <span className="text-sm font-medium leading-[1.2]">Get started <span className="arr">→</span></span>
          </button>
        </nav>

        <HamburgerButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
      </div>

      {menuOpen && <MobileMenu items={mobileItems} onClose={() => setMenuOpen(false)} />}
    </header>
  );
}

function LoggedInHeader({ route, navigate, cartCount }) {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const mobileItems = [
    { label: 'Browse',    action: () => navigate('home'),      active: route === 'home' },
    { label: 'Sellers',   action: () => navigate('sellers'), active: route === 'sellers' || route === 'storefront' },
    { label: 'Orders',    action: () => navigate('orders'),     active: route === 'orders' },
    { label: 'Sell',      action: () => navigate('dashboard'),  active: route === 'dashboard' || route === 'editor' },
    { label: 'Cart',      action: () => navigate('cart'),       active: route === 'cart', badge: cartCount },
    { label: 'Profile',   action: () => navigate('profile'),    active: route === 'profile' },
    { label: 'Sign out',  action: async () => { await logout(); navigate('landing'); } },
  ];

  return (
    <header className="app-header relative">
      <div className="app-header-inner">
        <button type="button" className="brand-mark transition-opacity hover:opacity-70" onClick={() => navigate('landing')} aria-label="HavenTrade — home" style={{ all: 'unset', display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', opacity: 1 }}>
          <HTMonogram size={34} glow />
          <HTWordmark size={22} />
        </button>

        <div className="postcode-pill hidden lg:inline-flex">
          <span className="pin"><PinIcon size={10} /></span>
          <span>Browsing <span className="pc-code">900237</span> · <span className="pc-area">Maitama</span></span>
          <span className="pc-radius">2 KM</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-auto">
          <a className={`nav-link${route === 'home' ? ' active' : ''}`} onClick={() => navigate('home')}>Browse</a>
          <a className={`nav-link${route === 'sellers' || route === 'storefront' ? ' active' : ''}`} onClick={() => navigate('sellers')}>Sellers</a>
          <a className={`nav-link${route === 'orders' ? ' active' : ''}`} onClick={() => navigate('orders')}>Orders</a>
          <a className={`nav-link${route === 'dashboard' || route === 'editor' ? ' active' : ''}`} onClick={() => navigate('dashboard')}>
            Sell
          </a>
          <a className={`nav-link${route === 'cart' ? ' active' : ''}`} onClick={() => navigate('cart')}>
            Cart {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </a>
          <AccountDropdown navigate={navigate} />
        </nav>

        {/* Mobile actions — grouped so only one ml-auto needed */}
        <div className="md:hidden ml-auto flex items-center gap-1">
          <button
            className="relative p-2 text-ink-muted hover:text-ink transition-colors"
            onClick={() => navigate('cart')}
            aria-label="Cart"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3h2l.4 2M7 13h10l1.4-7H5.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7" cy="16.5" r="1.5" fill="currentColor"/>
              <circle cx="17" cy="16.5" r="1.5" fill="currentColor"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-hearth text-canvas font-mono text-[8px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <HamburgerButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
        </div>
      </div>

      {menuOpen && <MobileMenu items={mobileItems} onClose={() => setMenuOpen(false)} />}
    </header>
  );
}

export default function Header({ route, navigate, cartCount, isLanding }) {
  if (isLanding) return <LoggedOutHeader navigate={navigate} />;
  return <LoggedInHeader route={route} navigate={navigate} cartCount={cartCount} />;
}
