import { useState, useEffect } from 'react';
import { DEFAULT_CART } from './data/index.js';
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
  const [cart,     setCart]     = useState(DEFAULT_CART);
  const [savedSet, setSavedSet] = useState(new Set(['l01', 'l05']));

  const navigate = (r, p = {}) => {
    const query = new URLSearchParams(p).toString();
    window.location.hash = query ? `${r}?${query}` : r;
    setRoute(r);
    setParams(p);
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
  };

  const toggleSave = (id) => {
    setSavedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const cartCount    = cart.reduce((s, c) => s + c.qty, 0);
  const isAuthScreen = route === 'signin' || route === 'signup';
  // Show the logged-out marketing header only on landing while not authenticated
  const isLanding    = route === 'landing' && !isAuthenticated;

  return (
    <div data-screen={route}>
      {!isAuthScreen && (
        <Header route={route} navigate={navigate} cartCount={cartCount} isLanding={isLanding} />
      )}

      <main style={{ flex: 1, paddingTop: isAuthScreen ? 0 : 66 }}>
        {route === 'landing'      && <LandingScreen      navigate={navigate} />}
        {route === 'design'       && <DesignSystemScreen navigate={navigate} />}
        {route === 'home'         && <HomeFeedScreen     navigate={navigate} savedSet={savedSet} toggleSave={toggleSave} />}
        {route === 'pdp'          && <PDPScreen          navigate={navigate} listingId={params.id} addToCart={addToCart} />}
        {route === 'cart'         && <CartScreen         navigate={navigate} cart={cart} setCart={setCart} />}
        {route === 'checkout'     && <CheckoutScreen     navigate={navigate} cart={cart} setCart={setCart} />}
        {route === 'confirmation' && <ConfirmationScreen navigate={navigate} cart={cart} />}
        {route === 'sellers'      && <SellersScreen      navigate={navigate} />}
        {route === 'storefront'   && <StorefrontScreen   navigate={navigate} sellerId={params.id || 'sanne'} savedSet={savedSet} toggleSave={toggleSave} />}
        {route === 'profile'      && <ProfileScreen      navigate={navigate} />}
        {route === 'orders'       && <OrderHistoryScreen navigate={navigate} />}
        {route === 'dashboard'    && <DashboardScreen    navigate={navigate} />}
        {route === 'editor'       && <EditorScreen       navigate={navigate} />}
        {route === 'signin'       && <SignInScreen       navigate={navigate} />}
        {route === 'signup'       && <SignUpScreen       navigate={navigate} />}
      </main>

      {!isAuthScreen && <Footer navigate={navigate} />}
    </div>
  );
}
