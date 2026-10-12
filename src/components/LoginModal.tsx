import { useEffect, useRef, useState } from 'react';
import { Lock, ShieldCheck, User, X, Loader2, Leaf, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function LoginModal({ open, onClose, onSuccess }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUsername('');
      setPassword('');
      setError(null);
      setLoading(false);
      setTimeout(() => usernameRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(username, password);
    setLoading(false);
    if (res.ok) {
      onSuccess?.();
      onClose();
    } else {
      setError(res.message ?? 'Login gagal.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
          <div className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 px-7 py-8 text-white">
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="absolute right-4 top-4 rounded-full p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold leading-tight">Masuk Sistem</h2>
                <p className="text-sm text-white/85">SPK Sawit Tumang — Operator</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/85">
              Kredensial operator dibutuhkan untuk mengakses Simulasi Prediksi KNN dan Kelola Dataset.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5 px-7 py-7">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  ref={usernameRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_tumang"
                  autoComplete="username"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/60 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/60 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Masuk Sistem
                </>
              )}
            </button>

            <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-500 ring-1 ring-slate-100">
              <span className="font-semibold text-slate-600">Demo:</span> gunakan{' '}
              <code className="rounded bg-white px-1.5 py-0.5 font-mono text-brand-700 ring-1 ring-slate-200">admin_tumang</code> /{' '}
              <code className="rounded bg-white px-1.5 py-0.5 font-mono text-brand-700 ring-1 ring-slate-200">umsu2026</code>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
