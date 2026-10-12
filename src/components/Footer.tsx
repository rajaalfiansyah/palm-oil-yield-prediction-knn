import { Link } from 'react-router-dom';
import { Leaf, Mail, MapPin, Github, BookOpen, Ruler, Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-emerald-400 text-white">
                <Leaf className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <div className="text-base font-extrabold text-white">SPK Sawit Tumang</div>
                <div className="text-xs uppercase tracking-wider text-brand-400">UMSA · Sistem Informasi</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Sistem Informasi Prediksi Agrikultur Desa Tumang — membantu petani kelapa sawit
              memproyeksikan hasil Tandan Buah Segar (TBS) berbasis data cuaca, kelembaban,
              dan pemupukan dengan algoritma K-Nearest Neighbor.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="GitHub"
                className="rounded-lg bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Dokumentasi"
                className="rounded-lg bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                <BookOpen className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Tautan Cepat</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 transition hover:text-brand-400">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/prediksi" className="text-slate-400 transition hover:text-brand-400">
                  Simulasi Prediksi KNN
                </Link>
              </li>
              <li>
                <Link to="/dataset" className="text-slate-400 transition hover:text-brand-400">
                  Kelola Dataset
                </Link>
              </li>
              <li>
                <Link to="/metode" className="text-slate-400 transition hover:text-brand-400">
                  Metode KNN
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="text-slate-400 transition hover:text-brand-400">
                  Tentang Sistem
                </Link>
              </li>
            </ul>

            <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-white">Fokus Algoritma</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <Ruler className="h-4 w-4 text-brand-400" />
                K-Nearest Neighbor (K=5)
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Scale className="h-4 w-4 text-brand-400" />
                Euclidean Distance
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <BookOpen className="h-4 w-4 text-brand-400" />
                Min-Max Normalization
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Kontak</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-brand-400" />
                <a href="mailto:prodi.si@umsu.ac.id" className="text-slate-300 transition hover:text-brand-400">
                  prodi.si@umsu.ac.id
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-brand-400" />
                <span className="text-slate-400">
                  Desa Tumang, Kabupaten Siak,
                  <br />
                  Riau — Indonesia
                </span>
              </li>
              <li className="flex items-start gap-3">
                <BookOpen className="mt-0.5 h-4 w-4 text-brand-400" />
                <span className="text-slate-400">
                  Program Studi Sistem Informasi
                  <br />
                  Universitas Muhammadiyah Sumatera Utara
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 SPK Sawit Tumang · Skripsi Sistem Informasi UMSU.</p>
          <p className="text-slate-500">
            Dibangun dengan React, Tailwind CSS &amp; algoritma KNN.
          </p>
        </div>
      </div>
    </footer>
  );
}
