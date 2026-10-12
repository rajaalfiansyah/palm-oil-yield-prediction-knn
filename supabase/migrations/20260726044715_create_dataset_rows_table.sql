/*
# Create dataset_rows table (single-tenant, shared research data)

1. New Tables
- `dataset_rows`
  - `id` (int, primary key, serial)
  - `date` (date, not null) — tanggal pengamatan (YYYY-MM-DD)
  - `rainfall` (numeric, not null) — curah hujan dalam mm
  - `temperature` (numeric, not null) — suhu dalam °C
  - `humidity` (numeric, not null) — kelembaban dalam %
  - `fertilizer` (numeric, not null) — dosis pupuk dalam kg
  - `production` (numeric, not null) — produksi TBS dalam Ton
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `dataset_rows`.
- The dataset is intentionally shared/public research data (single-tenant app with a mock login
  UI gate, no Supabase auth sessions). Allow anon + authenticated CRUD so the anon-key frontend
  can read and write the shared dataset.

3. Notes
- Unique constraint on `date` prevents duplicate daily observations; inserts from Excel import use
  `on conflict (date) do update` to upsert.
*/

CREATE TABLE IF NOT EXISTS dataset_rows (
  id serial PRIMARY KEY,
  date date NOT NULL UNIQUE,
  rainfall numeric NOT NULL,
  temperature numeric NOT NULL,
  humidity numeric NOT NULL,
  fertilizer numeric NOT NULL,
  production numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dataset_rows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_dataset_rows" ON dataset_rows;
CREATE POLICY "anon_select_dataset_rows" ON dataset_rows FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_dataset_rows" ON dataset_rows;
CREATE POLICY "anon_insert_dataset_rows" ON dataset_rows FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_dataset_rows" ON dataset_rows;
CREATE POLICY "anon_update_dataset_rows" ON dataset_rows FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_dataset_rows" ON dataset_rows;
CREATE POLICY "anon_delete_dataset_rows" ON dataset_rows FOR DELETE
  TO anon, authenticated USING (true);
