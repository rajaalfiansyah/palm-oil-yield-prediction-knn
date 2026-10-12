import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type User = {
  username: string;
  name: string;
  role: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
};

const STORAGE_KEY = 'spk-sawit-tumang.session';

const VALID_CREDENTIALS = {
  username: 'admin_tumang',
  password: 'umsu2026',
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    if (username.trim() === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
      const u: User = { username: username.trim(), name: 'Admin Desa Tumang', role: 'Operator Sistem' };
      setUser(u);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      } catch {
        // ignore
      }
      return { ok: true };
    }
    return { ok: false, message: 'Username atau password salah. Coba lagi.' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated: !!user, user, login, logout }),
    [user, login, logout],
  );

  if (!ready) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
