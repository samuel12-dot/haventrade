import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/index.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // true while checking existing session

  // On mount: check if there's already a valid session cookie
  useEffect(() => {
    api.getMe()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { user } = await api.login({ email, password });
    setUser(user);
    return user;
  }

  async function register(data) {
    const { user } = await api.register(data);
    setUser(user);
    return user;
  }

async function logout() {
    await api.logout();
    setUser(null);
  }

  async function refreshUser() {
    const { user } = await api.getMe();
    setUser(user);
    return user;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
