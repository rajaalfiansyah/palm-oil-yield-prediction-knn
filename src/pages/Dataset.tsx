import { useMemo, useState } from 'react';
import {
  Database,
  Plus,
  Printer,
  Search,
  Pencil,
  Trash2,
  CloudRain,
  Thermometer,
  Droplet,
  Leaf,
  TrendingUp,
  X,
  Calendar,
  Filter,
  FileSpreadsheet,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import type { DatasetRow } from '../lib/knn';
import ImportModal from '../components/ImportModal';

export default function Dataset() {
  const { rows, loading, error, addRow, updateRow, deleteRow } = useDataset();
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState<DatasetRow | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      r.date.toLowerCase().includes(q) ||
      String(r.rainfall).includes(q) ||
      String(r.temperature).includes(q) ||
      String(r.humidity).includes(q) ||
      String(r.fertilizer).includes(q) ||
      String(r.production).includes(q),
    );
  }, [rows, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }, [currentPage, totalPages]);

  const handleDelete = async (id: number) => {
    await deleteRow(id);
  };

  const handleSave = async (row: DatasetRow) => {
    if (editing) {
      await updateRow(row);
    } else {
      await addRow({
        date: row.date,
        rainfall: row.rainfall,
        temperature: row.temperature,
        humidity: row.humidity,
        fertilizer: row.fertilizer,
        production: row.production,
      });
    }
    setModalOpen(false);
    setEditing(null);
  };

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row: DatasetRow) => {
    setEditing(row);
    setModalOpen(true);
  };

  // Reset to first page whenever the search query changes
  const onQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const summary = useMemo(() => {
    if (rows.length === 0) {
      return { avgRain: 0, avgTemp: 0, avgHum: 0, avgFert: 0, avgProd: 0 };
    }
    const sum = (k: keyof DatasetRow) => rows.reduce((s, r) => s + (r[k] as number), 0);
    return {
      avgRain: sum('rainfall') / rows.length,
      avgTemp: sum('temperature') / rows.length,
      avgHum: sum('humidity') / rows.length,
      avgFert: sum('fertilizer') / rows.length,
      avgProd: sum('production') / rows.length,
    };
  }, [rows]);

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 text-white">
        <div className="absolute inset-0 bg-grid opacity-15" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
            <Database className="h-3.5 w-3.5" />
            Modul Data · Protected
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Kelola Dataset Historis ({rows.length.toLocaleString('id-ID')} Baris)
          </h1>
          <p className="mt-2 max-w-2xl text-white/90">
            Repositori data harian agroklimat dan produksi TBS Desa Tumang yang menjadi dasar
            pelatihan model K-Nearest Neighbor.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Gagal memuat data: {error}</span>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <SummaryCard icon={CloudRain} label="Rata-rata Curah Hujan" value={`${summary.avgRain.toFixed(1)} mm`} tone="sky" />
          <SummaryCard icon={Thermometer} label="Rata-rata Suhu" value={`${summary.avgTemp.toFixed(1)} °C`} tone="amber" />
          <SummaryCard icon={Droplet} label="Rata-rata Kelembaban" value={`${summary.avgHum.toFixed(0)} %`} tone="cyan" />
          <SummaryCard icon={Leaf} label="Rata-rata Pupuk" value={`${summary.avgFert.toFixed(1)} kg`} tone="emerald" />
          <SummaryCard icon={TrendingUp} label="Rata-rata Produksi" value={`${summary.avgProd.toFixed(2)} Ton`} tone="brand" />
        </div>

        {/* Controls + Table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Cari berdasarkan tanggal atau nilai..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Cetak Laporan</span>
              </button>
              <button
                onClick={() => setImportOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3.5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Import Excel / CSV
              </button>
              <button
                onClick={openAdd}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                <Plus className="h-4 w-4" />
                Tambah Data
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center px-5 py-16 text-slate-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-brand-600" />
              Memuat data...
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[860px] text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3 font-semibold">#</th>
                    <th className="px-5 py-3 font-semibold">Tanggal</th>
                    <th className="px-5 py-3 font-semibold">Curah Hujan (mm)</th>
                    <th className="px-5 py-3 font-semibold">Suhu (°C)</th>
                    <th className="px-5 py-3 font-semibold">Kelembaban (%)</th>
                    <th className="px-5 py-3 font-semibold">Pupuk (kg)</th>
                    <th className="px-5 py-3 font-semibold">Produksi (Ton)</th>
                    <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageRows.map((row, i) => (
                    <tr key={row.id} className="transition hover:bg-brand-50/40">
                      <td className="px-5 py-3 text-slate-400">{pageStart + i + 1}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-2 font-medium text-slate-800">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {row.date}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-700">{row.rainfall}</td>
                      <td className="px-5 py-3 text-slate-700">{row.temperature.toFixed(1)}</td>
                      <td className="px-5 py-3 text-slate-700">{row.humidity}</td>
                      <td className="px-5 py-3 text-slate-700">{row.fertilizer}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                          <TrendingUp className="h-3.5 w-3.5" />
                          {row.production.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(row)}
                            aria-label="Edit"
                            className="rounded-md p-1.5 text-slate-500 transition hover:bg-amber-50 hover:text-amber-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            aria-label="Hapus"
                            className="rounded-md p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                        <Filter className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                        Tidak ada data yang cocok dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Menampilkan{' '}
              <span className="font-semibold text-slate-700">{filtered.length === 0 ? 0 : pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)}</span>{' '}
              dari <span className="font-semibold text-slate-700">{filtered.length}</span> baris
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={currentPage === 1}
                  aria-label="Halaman pertama"
                  className="rounded-md p-1.5 text-slate-500 transition hover:bg-white hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Halaman sebelumnya"
                  className="rounded-md p-1.5 text-slate-500 transition hover:bg-white hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`h-7 min-w-7 rounded-md px-2 text-xs font-semibold transition ${
                      n === currentPage
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-white hover:text-brand-700'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Halaman berikutnya"
                  className="rounded-md p-1.5 text-slate-500 transition hover:bg-white hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={currentPage === totalPages}
                  aria-label="Halaman terakhir"
                  className="rounded-md p-1.5 text-slate-500 transition hover:bg-white hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <DataModal initial={editing} onClose={() => setModalOpen(false)} onSave={handleSave} />
      )}
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: 'sky' | 'amber' | 'cyan' | 'emerald' | 'brand';
}) {
  const toneMap: Record<string, string> = {
    sky: 'text-sky-700 bg-sky-50 ring-sky-100',
    amber: 'text-amber-700 bg-amber-50 ring-amber-100',
    cyan: 'text-cyan-700 bg-cyan-50 ring-cyan-100',
    emerald: 'text-emerald-700 bg-emerald-50 ring-emerald-100',
    brand: 'text-brand-700 bg-brand-50 ring-brand-100',
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`inline-flex rounded-lg p-2 ring-1 ${toneMap[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-xl font-extrabold tracking-tight text-slate-900">{value}</div>
      <div className="text-xs font-medium text-slate-500">{label}</div>
    </div>
  );
}

function DataModal({
  initial,
  onClose,
  onSave,
}: {
  initial: DatasetRow | null;
  onClose: () => void;
  onSave: (row: DatasetRow) => void;
}) {
  const [form, setForm] = useState<DatasetRow>(
    initial ?? {
      id: 0,
      date: new Date().toISOString().slice(0, 10),
      rainfall: 0,
      temperature: 0,
      humidity: 0,
      fertilizer: 0,
      production: 0,
    },
  );

  const set = (key: keyof DatasetRow, value: string) => {
    setForm((f) => ({ ...f, [key]: key === 'date' ? value : Number(value) }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-lg animate-fade-in-up">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Database className="h-5 w-5 text-brand-600" />
              {initial ? 'Edit Data Historis' : 'Tambah Data Historis'}
            </h3>
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={submit} className="space-y-4 px-6 py-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Tanggal</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {([
                ['rainfall', 'Curah Hujan (mm)'],
                ['temperature', 'Suhu (°C)'],
                ['humidity', 'Kelembaban (%)'],
                ['fertilizer', 'Pupuk (kg)'],
                ['production', 'Produksi (Ton)'],
              ] as const).map(([key, label]) => (
                <div key={key} className={key === 'production' ? 'col-span-2' : ''}>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
                  <input
                    type="number"
                    step="any"
                    value={form[key] as number}
                    onChange={(e) => set(key, e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                {initial ? 'Simpan Perubahan' : 'Tambah Data'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
