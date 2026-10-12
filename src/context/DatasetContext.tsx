import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import type { DatasetRow } from '../lib/knn';

type DatasetContextValue = {
  rows: DatasetRow[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addRow: (row: Omit<DatasetRow, 'id'>) => Promise<boolean>;
  updateRow: (row: DatasetRow) => Promise<boolean>;
  deleteRow: (id: number) => Promise<boolean>;
  importRows: (rows: Omit<DatasetRow, 'id'>[]) => Promise<{ ok: boolean; count: number; message: string }>;
};

const DatasetContext = createContext<DatasetContextValue | undefined>(undefined);

function toRow(r: any): DatasetRow {
  return {
    id: r.id,
    date: r.date,
    rainfall: Number(r.rainfall),
    temperature: Number(r.temperature),
    humidity: Number(r.humidity),
    fertilizer: Number(r.fertilizer),
    production: Number(r.production),
  };
}

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<DatasetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('dataset_rows')
      .select('*')
      .order('date', { ascending: true });
    if (err) {
      setError(err.message);
      setRows([]);
    } else {
      setRows((data as any[]).map(toRow));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addRow = useCallback(async (row: Omit<DatasetRow, 'id'>) => {
    const { error: err } = await supabase.from('dataset_rows').upsert(row, { onConflict: 'date' });
    if (err) return false;
    await refresh();
    return true;
  }, [refresh]);

  const updateRow = useCallback(async (row: DatasetRow) => {
    const { error: err } = await supabase
      .from('dataset_rows')
      .upsert(
        {
          date: row.date,
          rainfall: row.rainfall,
          temperature: row.temperature,
          humidity: row.humidity,
          fertilizer: row.fertilizer,
          production: row.production,
        },
        { onConflict: 'date' },
      );
    if (err) return false;
    await refresh();
    return true;
  }, [refresh]);

  const deleteRow = useCallback(async (id: number) => {
    const { error: err } = await supabase.from('dataset_rows').delete().eq('id', id);
    if (err) return false;
    setRows((r) => r.filter((x) => x.id !== id));
    return true;
  }, []);

  const importRows = useCallback(
    async (newRows: Omit<DatasetRow, 'id'>[]) => {
      if (newRows.length === 0) {
        return { ok: false, count: 0, message: 'Tidak ada baris untuk diimpor.' };
      }
      const { error: err } = await supabase
        .from('dataset_rows')
        .upsert(newRows, { onConflict: 'date' });
      if (err) {
        return { ok: false, count: 0, message: err.message };
      }
      await refresh();
      return {
        ok: true,
        count: newRows.length,
        message: `${newRows.length} baris data berhasil diperbarui.`,
      };
    },
    [refresh],
  );

  const value = useMemo<DatasetContextValue>(
    () => ({ rows, loading, error, refresh, addRow, updateRow, deleteRow, importRows }),
    [rows, loading, error, refresh, addRow, updateRow, deleteRow, importRows],
  );

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
}

export function useDataset() {
  const ctx = useContext(DatasetContext);
  if (!ctx) throw new Error('useDataset must be used within DatasetProvider');
  return ctx;
}
