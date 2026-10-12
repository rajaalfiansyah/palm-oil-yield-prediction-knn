import {
  BookOpen,
  GraduationCap,
  Leaf,
  MapPin,
  Target,
  Users,
  Lightbulb,
  Mail,
  CheckCircle2,
  Sparkles,
  Trees,
} from 'lucide-react';

const OBJECTIVES = [
  'Membantu petani kelapa sawit Desa Tumang memproyeksikan hasil panen harian TBS berbasis data agroklimat.',
  'Menyediakan sistem pendukung keputusan (SPK) yang transparan dengan algoritma K-Nearest Neighbor.',
  'Mengurangi risiko kelebihan/kekurangan logistik panen melalui estimasi yang terukur.',
  'Menjadi rujukan akademis penerapan machine learning pada domain agrikultur tropis.',
];

const SCOPE = [
  { icon: MapPin, title: 'Lokasi Studi', value: 'Desa Tumang, Kab. Siak, Riau' },
  { icon: Trees, title: 'Komoditas', value: 'Tandan Buah Segar (TBS) Kelapa Sawit' },
  { icon: Target, title: 'Algoritma', value: 'K-Nearest Neighbor (K=5)' },
  { icon: BookOpen, title: 'Periode Data', value: '730 hari historis (2024–2025)' },
];

export default function Tentang() {
  return (
    <div className="bg-slate-50">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 text-white">
        <div className="absolute inset-0 bg-grid opacity-15" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
            <BookOpen className="h-3.5 w-3.5" />
            Tentang Penelitian
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tentang Penelitian Skripsi
          </h1>
          <p className="mt-2 max-w-2xl text-white/90">
            Sistem Prediksi Produksi Kelapa Sawit (SPK-SAWIT-TUMANG) merupakan penelitian skripsi
            untuk Program Studi Sistem Informasi, Universitas Muhammadiyah Sumatera Utara (UMSU)
            Medan.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Leaf className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  SPK-SAWIT-TUMANG
                </h2>
                <p className="text-sm text-slate-500">
                  Sistem Prediksi Produksi Kelapa Sawit Desa Tumang
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Penelitian ini mengembangkan sebuah Sistem Pendukung Keputusan (SPK) berbasis web yang
              memanfaatkan algoritma <span className="font-semibold text-slate-800">K-Nearest Neighbor (KNN)</span> untuk
              memprediksi produksi harian Tandan Buah Segar (TBS) kelapa sawit di Desa Tumang,
              Kabupaten Siak. Sistem menerima empat fitur prediktor — curah hujan, suhu, kelembaban,
              dan dosis pupuk — lalu menghasilkan estimasi produksi beserta kategori panen
              (Tinggi/Rendah).
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Dengan akurasi <span className="font-semibold text-brand-700">79.91%</span> dan Mean
              Absolute Error (MAE) <span className="font-semibold text-brand-700">0.94 Ton</span>,
              sistem ini diharapkan membantu petani dan koperasi menyusun rencala panen dan
              logistik distribusi yang lebih efisien.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-emerald-50 p-7 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs uppercase tracking-wider text-brand-700/80">Akademik</div>
                <div className="text-lg font-bold text-slate-900">Identitas Penelitian</div>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ['Program Studi', 'Sistem Informasi'],
                ['Fakultas', 'Ilmu Komputer & Teknologi Informasi'],
                ['Universitas', 'Universitas Muhammadiyah Sumatera Utara'],
                ['Tahun', '2026'],
              ].map(([k, v]) => (
                <li key={k} className="border-b border-brand-100 pb-2 last:border-0 last:pb-0">
                  <div className="text-[11px] uppercase tracking-wider text-slate-500">{k}</div>
                  <div className="font-semibold text-slate-900">{v}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Scope */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SCOPE.map((s) => (
            <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <s.icon className="h-5 w-5" />
              </span>
              <div className="mt-3 text-xs uppercase tracking-wider text-slate-500">{s.title}</div>
              <div className="text-base font-bold text-slate-900">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Objectives + Benefits */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                <Target className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">Tujuan Penelitian</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {OBJECTIVES.map((o) => (
                <li key={o} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <Lightbulb className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">Manfaat Sistem</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {[
                'Petani memperoleh estimasi panen harian yang terukur dan dapat dipertanggungjawabkan.',
                'Koperasi/pengelola kebun dapat menyusun logistik pengangkutan TBS lebih efisien.',
                'Pemerintah desa memiliki rujukan data untuk perencanaan agraris lokal.',
                'Akademisi memperoleh studi kasus penerapan KNN pada data agroklimat tropis.',
              ].map((o) => (
                <li key={o} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Team / Contact */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Users className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900">Pengguna Sasaran</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Petani kelapa sawit Desa Tumang</li>
              <li>• Koperasi & pengelola kebun</li>
              <li>• Pemerintah Desa Tumang</li>
              <li>• Peneliti & mahasiswa Sistem Informasi</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <MapPin className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900">Lokasi Penelitian</h3>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Desa Tumang, Kabupaten Siak, Provinsi Riau — salah satu sentra produksi kelapa sawit
              dengan kondisi agroklimat tropis lembap yang khas.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Mail className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900">Kontak Akademik</h3>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Program Studi Sistem Informasi
              <br />
              Universitas Muhammadiyah Sumatera Utara
            </p>
            <a
              href="mailto:prodi.si@umsu.ac.id"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              prodi.si@umsu.ac.id
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-100/70 p-5 text-center text-xs text-slate-500">
          Prototipe ini dibangun untuk tujuan akademis sebagai bagian dari skripsi Program Studi
          Sistem Informasi UMSU. Data prediksi bersifat ilustratif dan dapat dikembangkan lebih lanjut
          dengan integrasi sensor agroklimat real-time.
        </div>
      </div>
    </div>
  );
}
