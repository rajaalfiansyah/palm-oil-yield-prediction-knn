import { useMemo, useState } from 'react';
import {
  Calculator,
  CloudRain,
  Droplet,
  Thermometer,
  Leaf,
  Loader2,
  Sparkles,
  TrendingUp,
  Trees,
  Target,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import { predictKnn, type Neighbor, type PredictionResult } from '../lib/knn';

const LOADING_STEPS = [
  'Menormalisasi parameter dengan Min-Max Scaling...',
  'Menghitung Jarak Euclidean ke seluruh data latih...',
  'Mencari K Tetangga Terdekat...',
  'Menghitung rata-rata produksi (voting)...',
];

type FormState = {
  rainfall: string;
  temperature: string;
  humidity: string;
  fertilizer: string;
  k: string;
};

const DEFAULT_FORM: FormState = {
  rainfall: '14',
  temperature: '26.5',
  humidity: '80',
  fertilizer: '25',
  k: '5',
};

export default function Prediksi() {
  const { rows, loading: datasetLoading, error: datasetError } = useDataset();
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [resultK, setResultK] = useState(5);

  const isValid = useMemo(() => {
    return (
      form.rainfall !== '' &&
      form.temperature !== '' &&
      form.humidity !== '' &&
      form.fertilizer !== '' &&
      form.k !== '' &&
      Number(form.k) > 0
    );
  }, [form]);

  const update = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const runPrediction = async () => {
    if (!isValid || rows.length === 0) return;
    setLoading(true);
    setResult(null);
    setLoadingStep(0);
    for (let i = 0; i < LOADING_STEPS.length; i++) {
      setLoadingStep(i);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 450));
    }
    const k = Math.max(1, Math.min(Number(form.k), rows.length));
    const res = predictKnn(rows, {
      rainfall: Number(form.rainfall),
      temperature: Number(form.temperature),
      humidity: Number(form.humidity),
      fertilizer: Number(form.fertilizer),
      k,
    });
    setResultK(k);
    setLoading(false);
    setResult(res);
  };

  const reset = () => {
    setForm(DEFAULT_FORM);
    setResult(null);
  };

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 text-white">
        <div className="absolute inset-0 bg-grid opacity-15" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
            <Sparkles className="h-3.5 w-3.5" />
            Modul KNN · Protected
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Kalkulator Prediksi Produksi (Model KNN)
          </h1>
          <p className="mt-2 max-w-2xl text-white/90">
            Masukkan parameter kondisi harian untuk mengestimasi hasil panen Tandan Buah Segar (TBS)
            kelapa sawit di Desa Tumang.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {datasetError && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Gagal memuat data latih: {datasetError}</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-5">
          {/* INPUT FORM */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Calculator className="h-5 w-5" />
                  </span>
                  Parameter Input
                </h2>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <Field
                  icon={<CloudRain className="h-4 w-4" />}
                  label="Curah Hujan"
                  unit="mm"
                  value={form.rainfall}
                  onChange={(v) => update('rainfall', v)}
                  hint="Rentang tipikal 0–50 mm/hari"
                  tone="sky"
                />
                <Field
                  icon={<Thermometer className="h-4 w-4" />}
                  label="Suhu"
                  unit="°C"
                  value={form.temperature}
                  onChange={(v) => update('temperature', v)}
                  hint="Rentang tipikal 22–34 °C"
                  tone="amber"
                />
                <Field
                  icon={<Droplet className="h-4 w-4" />}
                  label="Kelembaban"
                  unit="%"
                  value={form.humidity}
                  onChange={(v) => update('humidity', v)}
                  hint="Rentang tipikal 60–95 %"
                  tone="cyan"
                />
                <Field
                  icon={<Leaf className="h-4 w-4" />}
                  label="Dosis Pupuk"
                  unit="kg"
                  value={form.fertilizer}
                  onChange={(v) => update('fertilizer', v)}
                  hint="Pemupukan harian per blok"
                  tone="emerald"
                />
                <Field
                  icon={<Target className="h-4 w-4" />}
                  label="Nilai K"
                  unit=""
                  value={form.k}
                  onChange={(v) => update('k', v)}
                  hint={`Default: 5 (maks ${rows.length || 5})`}
                  tone="violet"
                />
              </div>

              <button
                onClick={runPrediction}
                disabled={!isValid || loading || datasetLoading || rows.length === 0}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Proses Prediksi
                  </>
                )}
              </button>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500 ring-1 ring-slate-100">
                <span className="font-semibold text-slate-600">Catatan:</span> Estimasi menggunakan
                model KNN dengan Euclidean Distance pada {rows.length.toLocaleString('id-ID')} data latih aktif.
              </div>
            </div>
          </div>

          {/* OUTPUT */}
          <div className="lg:col-span-3">
            {!result && !loading && <EmptyState count={rows.length} loading={datasetLoading} />}
            {loading && <LoadingState step={loadingStep} />}
            {result && !loading && <ResultState result={result} k={resultK} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  unit,
  value,
  onChange,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  tone: 'sky' | 'amber' | 'cyan' | 'emerald' | 'violet';
}) {
  const toneMap: Record<string, string> = {
    sky: 'text-sky-700 bg-sky-50 ring-sky-100',
    amber: 'text-amber-700 bg-amber-50 ring-amber-100',
    cyan: 'text-cyan-700 bg-cyan-50 ring-cyan-100',
    emerald: 'text-emerald-700 bg-emerald-50 ring-emerald-100',
    violet: 'text-violet-700 bg-violet-50 ring-violet-100',
  };

  return (
    <div>
      <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
        <span className="flex items-center gap-2">
          <span className={`inline-flex rounded-md p-1 ring-1 ${toneMap[tone]}`}>{icon}</span>
          {label}
        </span>
        {hint && <span className="text-[11px] font-normal text-slate-400">{hint}</span>}
      </label>
      <div className="relative">
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-3 pr-12 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        {unit && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function EmptyState({ count, loading }: { count: number; loading: boolean }) {
  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
      <div className="relative">
        <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-brand-200/60" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
          <Trees className="h-8 w-8" />
        </span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-800">Menunggu Parameter Prediksi</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        {loading
          ? 'Memuat data latih dari repositori...'
          : count === 0
          ? 'Belum ada data latih. Impor dataset pada halaman Kelola Dataset terlebih dahulu.'
          : 'Lengkapi formulir di samping, lalu klik Proses Prediksi untuk menghitung estimasi produksi TBS dengan algoritma K-Nearest Neighbor.'}
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
        <Sparkles className="h-3.5 w-3.5" />
        Model KNN · Euclidean Distance · {count.toLocaleString('id-ID')} data latih
      </div>
    </div>
  );
}

function LoadingState({ step }: { step: number }) {
  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-2xl bg-brand-200/50" />
        <Loader2 className="relative h-8 w-8 animate-spin text-brand-600" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-800">Memproses Prediksi</h3>
      <ul className="mt-4 w-full max-w-sm space-y-2 text-left">
        {LOADING_STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li
              key={s}
              className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm transition ${
                done
                  ? 'bg-brand-50 text-brand-700'
                  : active
                  ? 'bg-slate-50 text-slate-700 ring-1 ring-slate-200'
                  : 'text-slate-400'
              }`}
            >
              {done ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              ) : active ? (
                <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-slate-500" />
              ) : (
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-slate-200" />
              )}
              <span>{s}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ResultState({ result, k }: { result: PredictionResult; k: number }) {
  const isHigh = result.category === 'Tinggi';
  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Result Card */}
      <div
        className={`relative overflow-hidden rounded-2xl p-7 text-white shadow-xl ${
          isHigh
            ? 'bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500'
            : 'bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500'
        }`}
      >
        <div className="absolute inset-0 bg-grid opacity-15" aria-hidden />
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Prediksi Selesai
            </div>
            <div className="mt-3 text-sm uppercase tracking-wider text-white/80">Estimasi Produksi TBS</div>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-5xl font-extrabold tracking-tight">{result.estimate.toFixed(2)}</span>
              <span className="mb-2 text-lg font-semibold text-white/90">Ton</span>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
              <TrendingUp className="h-4 w-4" />
              Kategori: {result.category}
            </div>
          </div>
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
            <Trees className="h-12 w-12" />
          </div>
        </div>
      </div>

      {/* Neighbors Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <Target className="h-4 w-4" />
            </span>
            {k} Tetangga Terdekat (Nearest Neighbors)
          </h3>
          <span className="hidden text-xs text-slate-500 sm:block">Diurutkan berdasarkan jarak Euclidean</span>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-semibold">Jarak Euclidean</th>
                <th className="px-5 py-3 font-semibold">Tanggal</th>
                <th className="px-5 py-3 font-semibold">Curah Hujan</th>
                <th className="px-5 py-3 font-semibold">Suhu</th>
                <th className="px-5 py-3 font-semibold">Kelembaban</th>
                <th className="px-5 py-3 font-semibold">Pupuk</th>
                <th className="px-5 py-3 font-semibold">Produksi Asli</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.neighbors.map((n: Neighbor, i) => (
                <tr key={n.date} className="transition hover:bg-brand-50/40">
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                          i === 0 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="font-mono font-semibold text-slate-800">{n.distance.toFixed(4)}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{n.date}</td>
                  <td className="px-5 py-3 text-slate-700">{n.rainfall} mm</td>
                  <td className="px-5 py-3 text-slate-700">{n.temperature.toFixed(1)} °C</td>
                  <td className="px-5 py-3 text-slate-700">{n.humidity} %</td>
                  <td className="px-5 py-3 text-slate-700">{n.fertilizer} kg</td>
                  <td className="px-5 py-3 font-semibold text-brand-700">{n.production.toFixed(2)} Ton</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
          <span>
            Rata-rata produksi dari {k} tetangga:{' '}
            <span className="font-semibold text-slate-700">{result.estimate.toFixed(2)} Ton</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ArrowRight className="h-3.5 w-3.5" />
            Voting rata-rata (K={k})
          </span>
        </div>
      </div>
    </div>
  );
}
