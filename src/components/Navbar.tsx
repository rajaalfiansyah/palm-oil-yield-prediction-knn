import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, LogIn, LogOut, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Props = {
  onOpenLogin: () => void;
};

const NAV_LINKS = [
  { to: '/', label: 'Beranda' },
  { to: '/prediksi', label: 'Simulasi Prediksi KNN', protected: true },
  { to: '/dataset', label: 'Kelola Dataset', protected: true },
  { to: '/metode', label: 'Metode KNN' },
  { to: '/tentang', label: 'Tentang Sistem' },
];

export default function Navbar({ onOpenLogin }: Props) {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200 bg-white/85 backdrop-blur-md shadow-sm'
          : 'border-b border-transparent bg-white/40 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-emerald-500 text-white shadow-sm ring-1 ring-brand-700/20 transition group-hover:scale-105">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-extrabold tracking-tight text-slate-800">
              SPK Sawit Tumang
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-brand-700/80">
              Sistem Prediksi Produksi
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const locked = link.protected && !isAuthenticated;
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `group relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  {link.label}
                  {locked && <Lock className="h-3 w-3 text-slate-400" />}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {user?.name?.[0] ?? 'A'}
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-semibold text-slate-800">{user?.name}</div>
                  <div className="text-[10px] text-slate-500">{user?.role}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              <LogIn className="h-4 w-4" />
              Masuk Sistem
            </button>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <ul className="space-y-1 px-4 py-4">
            {NAV_LINKS.map((link) => {
              const locked = link.protected && !isAuthenticated;
              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`
                    }
                  >
                    <span className="flex items-center gap-2">
                      {link.label}
                      {locked && <Lock className="h-3.5 w-3.5 text-slate-400" />}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-slate-100 px-4 py-4">
            {isAuthenticated ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {user?.name?.[0] ?? 'A'}
                  </span>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold text-slate-800">{user?.name}</div>
                    <div className="text-xs text-slate-500">{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  onOpenLogin();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <LogIn className="h-4 w-4" />
                Masuk Sistem
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
