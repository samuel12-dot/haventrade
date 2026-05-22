import { useState, useEffect, useRef } from 'react';
import { LISTINGS } from './data/index.js';
import { useAuth } from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

import LandingScreen      from './screens/LandingScreen.jsx';
import DesignSystemScreen from './screens/DesignSystemScreen.jsx';
import HomeFeedScreen     from './screens/HomeFeedScreen.jsx';
import PDPScreen          from './screens/PDPScreen.jsx';
import CartScreen         from './screens/CartScreen.jsx';
import CheckoutScreen     from './screens/CheckoutScreen.jsx';
import ConfirmationScreen from './screens/ConfirmationScreen.jsx';
import StorefrontScreen   from './screens/StorefrontScreen.jsx';
import ProfileScreen      from './screens/ProfileScreen.jsx';
import OrderHistoryScreen from './screens/OrderHistoryScreen.jsx';
import SellersScreen      from './screens/SellersScreen.jsx';
import DashboardScreen    from './screens/DashboardScreen.jsx';
import EditorScreen       from './screens/EditorScreen.jsx';
import SignInScreen       from './screens/SignInScreen.jsx';
import SignUpScreen       from './screens/SignUpScreen.jsx';
import SearchScreen       from './screens/SearchScreen.jsx';
import WishlistScreen     from './screens/WishlistScreen.jsx';

function parseHash() {
  const hash  = window.location.hash.slice(1); // strip leading '#'
  const [r, q] = hash.split('?');
  const p = {};
  if (q) new URLSearchParams(q).forEach((v, k) => { p[k] = v; });
  return { route: r || 'landing', params: p };
}

export default function App() {
  const { isAuthenticated } = useAuth();

  const initial = parseHash();
  const [route,    setRoute]    = useState(initial.route);
  const [params,   setParams]   = useState(initial.params);
  const [cart,     setCart]     = useState(() => {
    try {
      const stored = localStorage.getItem('ht_cart');
      const parsed = stored ? JSON.parse(stored) : [];
      return parsed.filter((c) => LISTINGS.some((l) => l.id === c.lid));
    } catch {
      return [];
    }
  });
  const [savedSet, setSavedSet] = useState(() => {
    try {
      const stored = localStorage.getItem('ht_saved');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [orders,   setOrders]   = useState(() => {
    try {
      const stored = localStorage.getItem('ht_orders');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [navStack, setNavStack] = useState([]);
  const [toast,    setToast]    = useState(null);

  const prevAuthenticated = useRef(isAuthenticated);
  useEffect(() => {
    if (prevAuthenticated.current && !isAuthenticated) {
      setCart([]);
      setOrders([]);
      setSavedSet(new Set());
    }
    prevAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  const navigate = (r, p = {}) => {
    setNavStack(prev => [...prev, { route, params }]);
    const query = new URLSearchParams(p).toString();
    window.location.hash = query ? `${r}?${query}` : r;
    setRoute(r);
    setParams(p);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const goBack = () => {
    if (navStack.length === 0) return;
    const prev = navStack[navStack.length - 1];
    setNavStack(s => s.slice(0, -1));
    const query = new URLSearchParams(prev.params).toString();
    window.location.hash = query ? `${prev.route}?${query}` : prev.route;
    setRoute(prev.route);
    setParams(prev.params);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Handle browser back / forward buttons
  useEffect(() => {
    const onHashChange = () => {
      const { route: r, params: p } = parseHash();
      setRoute(r);
      setParams(p);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const addToCart = (lid, qty = 1) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.lid === lid);
      if (ex) return prev.map((c) => (c.lid === lid ? { ...c, qty: c.qty + qty } : c));
      return [...prev, { lid, qty }];
    });
    const listing = LISTINGS.find((l) => l.id === lid);
    setToast({ title: listing?.title || 'Item', key: Date.now() });
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast?.key]);

  const toggleSave = (id) => {
    setSavedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    localStorage.setItem('ht_saved', JSON.stringify([...savedSet]));
  }, [savedSet]);

  useEffect(() => {
    localStorage.setItem('ht_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ht_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = () => {
    const year  = new Date().getFullYear();
    const num   = `HT-${year}-${String(orders.length + 1).padStart(4, '0')}`;
    const items = cart.map((c) => ({ ...LISTINGS.find((l) => l.id === c.lid), qty: c.qty })).filter(Boolean);
    const subtotal    = items.reduce((s, i) => s + i.price * i.qty, 0);
    const sellerIds   = [...new Set(items.map((i) => i.sellerId))];
    const deliveryFee = sellerIds.filter((sid) => !items.filter((i) => i.sellerId === sid).every((i) => i.digital)).length * 1500;
    const total       = subtotal + deliveryFee + 500;
    const order = {
      id:       String(Date.now()),
      num,
      placedAt: new Date().toISOString(),
      status:   'Active',
      total,
      cart:     [...cart],
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    navigate('confirmation');
  };

  const cartCount    = cart.reduce((s, c) => s + c.qty, 0);
  const isAuthScreen = route === 'signin' || route === 'signup';
  const isLanding    = route === 'landing' && !isAuthenticated;

  const ROUTE_LABELS = {
    home: 'Browse', search: 'Search', sellers: 'Sellers',
    cart: 'Cart', wishlist: 'Wishlist', orders: 'Orders',
    dashboard: 'Dashboard', storefront: 'Storefront',
    pdp: 'Listing', landing: 'Home', profile: 'Profile',
  };
  const prevRoute  = navStack[navStack.length - 1]?.route;
  const backLabel  = prevRoute ? (ROUTE_LABELS[prevRoute] || 'Back') : null;
  const onBack     = navStack.length > 0 ? goBack : null;

  return (
    <div data-screen={route}>
      {!isAuthScreen && (
        <Header route={route} navigate={navigate} cartCount={cartCount} savedCount={savedSet.size} isLanding={isLanding} />
      )}

      <main style={{ flex: 1, paddingTop: isAuthScreen ? 0 : 'var(--header-h)', position: 'relative' }}>
        <div key={route} className={isAuthScreen ? 'anim-fade-in' : 'page-enter'}>
          {route === 'landing'      && <LandingScreen      navigate={navigate} savedSet={savedSet} toggleSave={toggleSave} />}
          {route === 'wishlist'     && <WishlistScreen     navigate={navigate} savedSet={savedSet} toggleSave={toggleSave} onBack={onBack} backLabel={backLabel} />}
          {route === 'design'       && <DesignSystemScreen navigate={navigate} />}
          {route === 'home'         && <HomeFeedScreen     navigate={navigate} savedSet={savedSet} toggleSave={toggleSave} />}
          {route === 'pdp'          && <PDPScreen          navigate={navigate} listingId={params.id} addToCart={addToCart} savedSet={savedSet} toggleSave={toggleSave} onBack={onBack} backLabel={backLabel} />}
          {route === 'cart'         && <CartScreen         navigate={navigate} cart={cart} setCart={setCart} onBack={onBack} backLabel={backLabel} />}
          {route === 'checkout'     && <CheckoutScreen     navigate={navigate} cart={cart} setCart={setCart} onPlaceOrder={placeOrder} onBack={onBack} backLabel={backLabel} />}
          {route === 'confirmation' && <ConfirmationScreen navigate={navigate} orders={orders} />}
          {route === 'sellers'      && <SellersScreen      navigate={navigate} onBack={onBack} backLabel={backLabel} />}
          {route === 'storefront'   && <StorefrontScreen   navigate={navigate} sellerId={params.id || 'sanne'} savedSet={savedSet} toggleSave={toggleSave} onBack={onBack} backLabel={backLabel} />}
          {route === 'profile'      && <ProfileScreen      navigate={navigate} savedSet={savedSet} toggleSave={toggleSave} onBack={onBack} backLabel={backLabel} />}
          {route === 'orders'       && <OrderHistoryScreen navigate={navigate} orders={orders} onBack={onBack} backLabel={backLabel} />}
          {route === 'dashboard'    && <DashboardScreen    navigate={navigate} onBack={onBack} backLabel={backLabel} />}
          {route === 'editor'       && <EditorScreen       navigate={navigate} onBack={onBack} backLabel={backLabel} />}
          {route === 'search'       && <SearchScreen       navigate={navigate} query={params.q} savedSet={savedSet} toggleSave={toggleSave} onBack={onBack} backLabel={backLabel} />}
          {route === 'signin'       && <SignInScreen       navigate={navigate} />}
          {route === 'signup'       && <SignUpScreen       navigate={navigate} />}
        </div>
      </main>

      {!isAuthScreen && <Footer navigate={navigate} />}

      {toast && (
        <div
          key={toast.key}
          style={{
            position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
            zIndex: 200, display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '12px 16px 12px 14px',
            background: 'var(--ink)', color: 'var(--canvas)',
            borderRadius: 999,
            boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
            fontFamily: 'var(--sans)', fontSize: 14,
            whiteSpace: 'nowrap',
            animation: 'toast-in 260ms cubic-bezier(0.34,1.56,0.64,1) both',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: 'var(--moss)', flexShrink: 0 }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6.5l3 3 5-6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span style={{ color: 'rgba(251,246,236,0.6)', marginRight: 2 }}>Added to cart —</span>
          <span style={{ fontWeight: 500 }}>{toast.title}</span>
          <button
            onClick={() => { setToast(null); navigate('cart'); }}
            style={{ marginLeft: 8, fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--saffron)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            VIEW CART →
          </button>
        </div>
      )}
    </div>
  );
}
