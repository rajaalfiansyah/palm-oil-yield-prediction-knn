import {
  Scale,
  Ruler,
  Vote,
  Target,
  Sigma,
  ArrowRight,
  BookOpen,
  Calculator,
  Database,
  CheckCircle2,
  Layers,
} from 'lucide-react';

const STEPS = [
  {
    icon: Database,
    step: '01',
    title: 'Pengumpulan Data Latih',
    desc: 'Dataset 730 hari historis berisi 4 fitur prediktor (curah hujan, suhu, kelembaban, dosis pupuk) dan label produksi TBS.',
  },
  {
    icon: Scale,
    step: '02',
    title: 'Normalisasi Min-Max',
    desc: 'Setiap fitur diskalakan ke rentang [0, 1] agar fitur dengan skala besar tidak mendominasi perhitungan jarak.',
  },
  {
    icon: Ruler,
    step: '03',
    title: 'Perhitungan Euclidean Distance',
    desc: 'Jarak antara data uji dan setiap data latih dihitung dalam ruang berdimensi 4 menggunakan rumus Euclidean.',
  },
  {
    icon: Vote,
    step: '04',
    title: 'Voting K Tetangga Terdekat',
    desc: 'Dipilih K=5 data dengan jarak terkecil, lalu dirata-rata produksinya untuk mendapatkan estimasi produksi.',
  },
];

export default function Metode() {
  return (
    <div className="bg-slate-50">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 text-white">
        <div className="absolute inset-0 bg-grid opacity-15" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
            <BookOpen className="h-3.5 w-3.5" />
            Landasan Teori
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Landasan Teori K-Nearest Neighbor
          </h1>
          <p className="mt-2 max-w-2xl text-white/90">
            Penjelasan teknis tahapan pemodelan yang digunakan dalam SPK Sawit Tumang — mulai dari
            normalisasi, perhitungan jarak, hingga voting tetangga terdekat.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <Sigma className="h-3.5 w-3.5" />
              Pendekatan Instance-Based Learning
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
              Apa itu K-Nearest Neighbor?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              K-Nearest Neighbor (KNN) adalah algoritma machine learning <em>lazy learning</em> yang
              memprediksi nilai baru dengan mencari sejumlah <span className="font-semibold text-slate-800">K</span> data
              paling mirip (tetangga terdekat) dari data latih. Kemiripan diukur menggunakan jarak
              Euclidean dalam ruang fitur berdimensi 4: curah hujan, suhu, kelembaban, dan dosis pupuk.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Pada penelitian ini digunakan <span className="font-semibold text-slate-800">K=5</span> dengan
              voting berupa rata-rata produksi TBS dari 5 tetangga terdekat, menghasilkan akurasi
              prediksi <span className="font-semibold text-brand-700">79.91%</span> dan MAE{' '}
              <span className="font-semibold text-brand-700">0.94 Ton</span>.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-emerald-50 p-7 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Target className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs uppercase tracking-wider text-brand-700/80">Konfigurasi Model</div>
                <div className="text-lg font-bold text-slate-900">Parameter KNN</div>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ['Jumlah tetangga (K)', '5'],
                ['Metode jarak', 'Euclidean'],
                ['Normalisasi', 'Min-Max'],
                ['Voting', 'Rata-rata (regresi)'],
                ['Jumlah fitur', '4'],
                ['Ukuran data latih', '730 baris'],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between border-b border-brand-100 pb-2 last:border-0 last:pb-0">
                  <span className="text-slate-600">{k}</span>
                  <span className="font-mono font-semibold text-slate-900">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">Tahapan Pemodelan KNN</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-3xl font-bold text-slate-100">{s.step}</span>
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formula Cards */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Min-Max */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                <Scale className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">Normalisasi Min-Max Scaling</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Min-Max Scaling menyamakan skala seluruh fitur ke rentang [0, 1] sehingga fitur dengan
              rentang besar (mis. curah hujan 0–50 mm) tidak mendominasi fitur dengan rentang kecil
              (mis. suhu 22–34 °C) dalam perhitungan jarak.
            </p>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-900 p-5 font-mono text-sm text-slate-100 shadow-inner">
              <div className="text-center text-base">
                x<sub>norm</sub> = (x − x<sub>min</sub>) / (x<sub>max</sub> − x<sub>min</sub>)
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <span><span className="font-semibold text-slate-800">x</span> — nilai fitur asli</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <span><span className="font-semibold text-slate-800">x<sub>min</sub>, x<sub>max</sub></span> — nilai minimum & maksimum fitur pada data latih</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <span>Hasil berada pada rentang <span className="font-semibold text-slate-800">[0, 1]</span></span>
              </li>
            </ul>
          </div>

          {/* Euclidean */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                <Ruler className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">Euclidean Distance</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Jarak Euclidean mengukur kedekatan antara data uji dan setiap data latih dalam ruang
              fitur berdimensi 4. Semakin kecil jarak, semakin mirip kedua titik data tersebut.
            </p>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-900 p-5 font-mono text-sm text-slate-100 shadow-inner">
              <div className="text-center text-base">
                d(x, y) = √ Σᵢ₌₁ⁿ (xᵢ − yᵢ)²
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <span><span className="font-semibold text-slate-800">x, y</span> — dua titik data (uji & latih)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <span><span className="font-semibold text-slate-800">n = 4</span> — jumlah fitur prediktor</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <span>Dihitung untuk seluruh pasangan data uji–latih</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Voting */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                  <Vote className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-slate-900">Voting & Averaging (K=5)</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Setelah seluruh jarak dihitung, sistem memilih <span className="font-semibold text-slate-800">5 data latih</span> dengan
                jarak terkecil. Estimasi produksi diambil sebagai <span className="font-semibold text-slate-800">rata-rata</span> produksi
                kelima tetangga tersebut. Kategori panen diklasifikasikan sebagai{' '}
                <span className="font-semibold text-brand-700">Tinggi</span> bila estimasi ≥ 6 Ton, dan{' '}
                <span className="font-semibold text-amber-700">Rendah</span> bila di bawahnya.
              </p>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-900 p-5 font-mono text-sm text-slate-100 shadow-inner">
                <div className="text-center text-base">
                  ŷ = (1 / K) · Σᵢ₌₁ᴷ yᵢ
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Layers className="h-4 w-4 text-brand-600" />
                Contoh Perhitungan
              </div>
              <ol className="mt-3 space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">1</span>
                  <span>Input: curah hujan 14 mm, suhu 26.5 °C, kelembaban 80%, pupuk 25 kg.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">2</span>
                  <span>Hitung jarak ke seluruh data latih, ambil 5 jarak terkecil (mis. d₁=0.1321, d₂=0.1508, ...).</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">3</span>
                  <span>Rata-rata produksi 5 tetangga: (7.85 + 7.42 + 8.10 + 7.05 + 7.97) / 5 = <span className="font-semibold text-brand-700">7.68 Ton</span>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">4</span>
                  <span>Kategori: <span className="font-semibold text-brand-700">Tinggi</span> (≥ 6 Ton).</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-brand-200 bg-brand-50 px-6 py-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Calculator className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Sudah paham alurnya?</h3>
              <p className="text-sm text-slate-600">Coba simulasi prediksi langsung dengan parameter harian Anda.</p>
            </div>
          </div>
          <a
            href="/prediksi"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Buka Simulasi KNN
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
