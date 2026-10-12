import { useCallback, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  UploadCloud,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileUp,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import type { DatasetRow } from '../lib/knn';

type Props = {
  open: boolean;
  onClose: () => void;
};

type Status =
  | { kind: 'idle' }
  | { kind: 'parsing' }
  | { kind: 'importing' }
  | { kind: 'success'; message: string; count: number; fileName: string }
  | { kind: 'error'; message: string };

const COLUMN_ALIASES: Record<string, keyof Omit<DatasetRow, 'id'>> = {
  tanggal: 'date',
  date: 'date',
  curah_hujan: 'rainfall',
  curahhujan: 'rainfall',
  rainfall: 'rainfall',
  suhu: 'temperature',
  temperature: 'temperature',
  temp: 'temperature',
  kelembaban: 'humidity',
  humidity: 'humidity',
  dosis_pupuk: 'fertilizer',
  dosispupuk: 'fertilizer',
  pupuk: 'fertilizer',
  fertilizer: 'fertilizer',
  produksi_tbs: 'production',
  produksitbs: 'production',
  produksi: 'production',
  production: 'production',
};

function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[\s_]+/g, '_').replace(/^_+|_+$/g, '');
}

function parseRow(row: Record<string, any>): Omit<DatasetRow, 'id'> | null {
  const out: Partial<Omit<DatasetRow, 'id'>> = {};
  for (const [key, value] of Object.entries(row)) {
    const field = COLUMN_ALIASES[normalizeHeader(key)];
    if (!field) continue;
    if (field === 'date') {
      let d: Date | null = null;
      if (value instanceof Date) d = value;
      else if (typeof value === 'number') {
        // Excel serial date
        const epoch = new Date(Date.UTC(1899, 11, 30));
        d = new Date(epoch.getTime() + value * 86400000);
      } else if (typeof value === 'string') {
        d = new Date(value);
      }
      if (!d || isNaN(d.getTime())) return null;
      out.date = d.toISOString().slice(0, 10);
    } else {
      const num = Number(value);
      if (Number.isNaN(num)) return null;
      out[field] = num;
    }
  }
  if (
    out.date == null ||
    out.rainfall == null ||
    out.temperature == null ||
    out.humidity == null ||
    out.fertilizer == null ||
    out.production == null
  ) {
    return null;
  }
  return out as Omit<DatasetRow, 'id'>;
}

export default function ImportModal({ open, onClose }: Props) {
  const { importRows } = useDataset();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStatus({ kind: 'idle' });
    setFileName(null);
    setDragOver(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const close = () => {
    if (status.kind === 'parsing' || status.kind === 'importing') return;
    reset();
    onClose();
  };

  const handleFile = useCallback(
    async (file: File) => {
      setFileName(file.name);
      setStatus({ kind: 'parsing' });
      try {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array', cellDates: true });
        const sheetName = wb.SheetNames[0];
        const sheet = wb.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
          defval: '',
          raw: true,
        });
        const parsed: Omit<DatasetRow, 'id'>[] = [];
        let skipped = 0;
        for (const row of json) {
          const r = parseRow(row);
          if (r) parsed.push(r);
          else skipped += 1;
        }
        if (parsed.length === 0) {
          setStatus({
            kind: 'error',
            message:
              'Tidak ada baris valid. Pastikan kolom: Tanggal, Curah_Hujan, Suhu, Kelembaban, Dosis_Pupuk, Produksi_TBS.',
          });
          return;
        }
        setStatus({ kind: 'importing' });
        const res = await importRows(parsed);
        if (res.ok) {
          setStatus({
            kind: 'success',
            message: `Berhasil mengimpor ${res.count} baris data dari file ${file.name}`,
            count: res.count,
            fileName: file.name,
          });
        } else {
          setStatus({ kind: 'error', message: res.message });
        }
      } catch (e: any) {
        setStatus({ kind: 'error', message: e?.message ?? 'Gagal membaca file.' });
      }
    },
    [importRows],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={close} aria-hidden />
      <div className="relative w-full max-w-lg animate-fade-in-up">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <FileSpreadsheet className="h-5 w-5 text-brand-600" />
              Import Excel / CSV
            </h3>
            <button
              onClick={close}
              aria-label="Tutup"
              className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-5">
            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
                dragOver
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-300 bg-slate-50 hover:border-brand-400 hover:bg-brand-50/40'
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 ring-1 ring-slate-200 shadow-sm">
                <UploadCloud className="h-7 w-7" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-800">
                Tarik &amp; lepas file di sini, atau klik untuk memilih
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Mendukung format .xlsx dan .csv (maks ~10MB)
              </p>
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>

            {/* Expected columns */}
            <div className="mt-4 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <div className="text-xs font-semibold text-slate-600">Kolom yang Diharapkan:</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['Tanggal', 'Curah_Hujan', 'Suhu', 'Kelembaban', 'Dosis_Pupuk', 'Produksi_TBS'].map((c) => (
                  <span
                    key={c}
                    className="rounded-md bg-white px-2 py-1 font-mono text-[11px] text-slate-600 ring-1 ring-slate-200"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            {fileName && status.kind !== 'idle' && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm">
                <FileUp className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate font-medium text-slate-700">{fileName}</span>
                {(status.kind === 'parsing' || status.kind === 'importing') && (
                  <Loader2 className="ml-auto h-4 w-4 shrink-0 animate-spin text-brand-600" />
                )}
              </div>
            )}

            {status.kind === 'parsing' && (
              <p className="mt-2 text-xs text-slate-500">Membaca dan memvalidasi isi file...</p>
            )}
            {status.kind === 'importing' && (
              <p className="mt-2 text-xs text-slate-500">Menyimpan data ke repositori...</p>
            )}

            {status.kind === 'success' && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2.5 text-sm text-brand-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <div>
                  <div className="font-semibold">{status.message}</div>
                  <div className="text-xs text-brand-700/80">
                    Tabel (dengan pagination), ringkasan, kalkulator KNN, dan grafik analitik kini menggunakan data baru.
                  </div>
                </div>
              </div>
            )}

            {status.kind === 'error' && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{status.message}</span>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={close}
                disabled={status.kind === 'parsing' || status.kind === 'importing'}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status.kind === 'success' ? 'Selesai' : 'Tutup'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
