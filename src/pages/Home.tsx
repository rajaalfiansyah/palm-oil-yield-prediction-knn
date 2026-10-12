import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Calculator,
  CloudRain,
  Database,
  Droplet,
  Leaf,
  MapPin,
  Sparkles,
  Target,
  Thermometer,
  Trees,
  TrendingUp,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import { useAuth } from '../context/AuthContext';
import { useDataset } from '../context/DatasetContext';
import { predictKnn } from '../lib/knn';

const FEATURES = [
  {
    icon: CloudRain,
    title: 'Analisis Cuaca & Suhu',
    desc: 'Mengolah curah hujan, suhu harian, dan kelembaban udara sebagai sinyal utama yang memengaruhi produktivitas TBS kelapa sawit.',
    accent: 'from-sky-500 to-blue-500',
  },
  {
    icon: Calculator,
    title: 'Kalkulasi Pemupukan',
    desc: 'Mengkuantifikasikan dosis pupuk harian sebagai fitur prediktor untuk menilai kontribusi nutrisi terhadap hasil panen.',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Prediksi Kategori Panen',
    desc: 'Mengklasifikasikan estimasi hasil panen ke kategori Tinggi atau Rendah menggunakan voting mayoritas 5 tetangga terdekat.',
    accent: 'from-brand-600 to-emerald-500',
  },
];

const STEPS = [
  { step: '01', title: 'Input Parameter', desc: 'Masukkan curah hujan, suhu, kelembaban, dosis pupuk, dan nilai K.', icon: Target },
  { step: '02', title: 'Normalisasi Data', desc: 'Min-Max Scaling menyamakan skala 4 fitur prediktor ke rentang [0, 1].', icon: Activity },
  { step: '03', title: 'Euclidean Distance', desc: 'Hitung jarak antara data uji dan seluruh data latih berdimensi 4.', icon: Calculator },
  { step: '04', title: 'Voting K=5', desc: 'Ambil rata-rata produksi dari 5 tetangga terdekat sebagai estimasi.', icon: Trees },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { rows } = useDataset();

  const stats = [
    { label: 'Hari Data Historis', value: rows.length, suffix: ' Hari', icon: Database, color: 'text-brand-600' },
    { label: 'Rata-rata Produksi', value: rows.length ? rows.reduce((s, r) => s + r.production, 0) / rows.length : 0, decimals: 2, suffix: ' Ton', icon: TrendingUp, color: 'text-amber-600' },
    { label: 'Konstanta K', value: 5, suffix: '', icon: Target, color: 'text-emerald-600' },
    { label: 'Fitur Prediktor', value: 4, suffix: '', icon: Sparkles, color: 'text-sky-600' },
  ];

  const heroPrediction = rows.length > 0 ? predictKnn(rows, { rainfall: 14, temperature: 26.5, humidity: 80, fertilizer: 25, k: 5 }) : null;
  const heroEstimate = heroPrediction ? heroPrediction.estimate.toFixed(2) : '—';
  const heroCategory = heroPrediction ? heroPrediction.category : '—';
  const heroDistances = heroPrediction ? heroPrediction.neighbors.slice(0, 3).map((n) => n.distance) : [0.1321, 0.1508, 0.1873];

  const startSimulation = () => {
    if (isAuthenticated) navigate('/prediksi');
    else navigate('/prediksi'); // ProtectedRoute will redirect and trigger login
  };

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative bg-hero-radial">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
                <Sparkles className="h-3.5 w-3.5" />
                Skripsi Sistem Informasi · UMSU Medan
              </div>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl text-balance">
                Sistem Prediksi Cerdas{' '}
                <span className="bg-gradient-to-r from-brand-700 via-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Produksi Kelapa Sawit
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                Optimalkan logistik panen Desa Tumang dengan Machine Learning berbasis
                algoritma <span className="font-semibold text-slate-800">K-Nearest Neighbor</span> yang
                mempertimbangkan data iklim dan pemupukan harian.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                  <Target className="h-3.5 w-3.5 text-brand-600" />
                  Akurasi Prediksi 79.91%
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                  <Calculator className="h-3.5 w-3.5 text-emerald-600" />
                  Algoritma KNN (K=5)
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                  <MapPin className="h-3.5 w-3.5 text-amber-600" />
                  Data Desa Tumang
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={startSimulation}
                  className="group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 hover:shadow-brand-700/30"
                >
                  Mulai Simulasi Prediksi
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
                <Link
                  to="/metode"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                >
                  Pelajari Algoritma
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-fade-in-up [animation-delay:120ms]">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand-200/50 via-emerald-100/40 to-amber-100/40 blur-2xl" />
                <div className="relative rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl shadow-brand-900/10 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
                        <Leaf className="h-5 w-5" />
                      </span>
                      <div className="leading-tight">
                        <div className="text-sm font-bold text-slate-800">Dashboard Prediksi TBS</div>
                        <div className="text-[11px] text-slate-500">Model KNN · K=5</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-1 text-[11px] font-semibold text-brand-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Live
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      { icon: CloudRain, label: 'Curah Hujan', value: '14 mm', tone: 'text-sky-700 bg-sky-50' },
                      { icon: Thermometer, label: 'Suhu', value: '26.5°C', tone: 'text-amber-700 bg-amber-50' },
                      { icon: Droplet, label: 'Kelembaban', value: '80%', tone: 'text-cyan-700 bg-cyan-50' },
                      { icon: Calculator, label: 'Pupuk', value: '25 kg', tone: 'text-emerald-700 bg-emerald-50' },
                    ].map((m) => (
                      <div key={m.label} className="rounded-xl border border-slate-100 bg-white p-3">
                        <div className={`inline-flex rounded-md p-1.5 ${m.tone}`}>
                          <m.icon className="h-4 w-4" />
                        </div>
                        <div className="mt-2 text-[11px] font-medium text-slate-500">{m.label}</div>
                        <div className="text-base font-bold text-slate-800">{m.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl bg-gradient-to-br from-brand-600 to-emerald-500 p-4 text-white">
                    <div className="text-[11px] uppercase tracking-wider text-white/80">Estimasi Produksi</div>
                    <div className="mt-1 flex items-end gap-2">
                      <span className="text-3xl font-extrabold">{heroEstimate}</span>
                      <span className="mb-1 text-sm text-white/90">Ton TBS</span>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-1 text-[11px] font-semibold">
                      <TrendingUp className="h-3 w-3" /> Kategori: {heroCategory}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {heroDistances.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400"
                            style={{ width: `${80 - i * 18}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">d={d.toFixed(4)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute -right-4 -top-4 hidden animate-float rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl sm:block">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-brand-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">MAE 0.94 Ton</div>
                      <div className="text-[10px] text-slate-500">Error rendah</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative -mt-10 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-4 px-2">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-100 ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold tracking-tight text-slate-900">
                    <AnimatedCounter value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
                  </div>
                  <div className="text-xs font-medium text-slate-500">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5" /> Fitur Utama
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Tiga Pilar Sistem Prediksi
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Sistem memadukan data agroklimat dengan algoritma KNN untuk menghasilkan estimasi produksi
            TBS yang dapat ditindaklanjuti oleh petani dan koperasi.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
            >
              <div className={`absolute right-0 top-0 h-24 w-24 rounded-bl-[3rem] bg-gradient-to-br ${f.accent} opacity-10 transition group-hover:opacity-20`} />
              <div className={`inline-flex rounded-xl bg-gradient-to-br ${f.accent} p-3 text-white shadow-sm`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                <Calculator className="h-3.5 w-3.5" /> Alur Kerja KNN
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Dari Parameter Harian ke Estimasi Panen
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Empat langkah ringkas menggambarkan bagaimana sistem mengubah parameter agroklimat
                menjadi angka estimasi produksi TBS yang dapat diandalkan.
              </p>
              <Link
                to="/metode"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                Pelajari landasan teori KNN
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {STEPS.map((s, i) => (
                <div
                  key={s.step}
                  className={`relative rounded-2xl border border-slate-200 bg-slate-50/60 p-5 transition hover:border-brand-300 hover:bg-white ${
                    i % 2 === 1 ? 'sm:translate-y-6' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-700 ring-1 ring-slate-200">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-2xl font-bold text-slate-200">{s.step}</span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 px-8 py-12 text-white shadow-2xl shadow-brand-900/20">
          <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-300/30 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-extrabold sm:text-3xl">Coba Simulasi Prediksi Sekarang</h3>
              <p className="mt-2 max-w-xl text-white/90">
                Masuk sebagai operator untuk mengakses kalkulator KNN dan repositori dataset historis
                Desa Tumang.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={startSimulation}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-700 shadow-lg transition hover:bg-brand-50"
              >
                Mulai Simulasi
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/tentang"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Tentang Penelitian
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
