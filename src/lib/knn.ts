export type DatasetRow = {
  id: number;
  date: string;
  rainfall: number;
  temperature: number;
  humidity: number;
  fertilizer: number;
  production: number;
};

export type Neighbor = {
  distance: number;
  date: string;
  rainfall: number;
  temperature: number;
  humidity: number;
  fertilizer: number;
  production: number;
};

export type PredictionResult = {
  estimate: number;
  category: string;
  neighbors: Neighbor[];
};

export type KnnInput = {
  rainfall: number;
  temperature: number;
  humidity: number;
  fertilizer: number;
  k: number;
};

type FeatureKey = 'rainfall' | 'temperature' | 'humidity' | 'fertilizer';

const FEATURES: FeatureKey[] = ['rainfall', 'temperature', 'humidity', 'fertilizer'];

function minMaxBounds(rows: DatasetRow[]) {
  const bounds: Record<FeatureKey, { min: number; max: number }> = {
    rainfall: { min: Infinity, max: -Infinity },
    temperature: { min: Infinity, max: -Infinity },
    humidity: { min: Infinity, max: -Infinity },
    fertilizer: { min: Infinity, max: -Infinity },
  };
  for (const r of rows) {
    for (const f of FEATURES) {
      if (r[f] < bounds[f].min) bounds[f].min = r[f];
      if (r[f] > bounds[f].max) bounds[f].max = r[f];
    }
  }
  for (const f of FEATURES) {
    if (bounds[f].min === bounds[f].max) bounds[f].max = bounds[f].min + 1;
  }
  return bounds;
}

function normalize(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

export function predictKnn(rows: DatasetRow[], input: KnnInput): PredictionResult | null {
  if (rows.length === 0) return null;
  const bounds = minMaxBounds(rows);

  const testVec = FEATURES.map((f) =>
    normalize(input[f], bounds[f].min, bounds[f].max),
  );

  const distances = rows.map((r) => {
    const trainVec = FEATURES.map((f) =>
      normalize(r[f], bounds[f].min, bounds[f].max),
    );
    let sum = 0;
    for (let i = 0; i < testVec.length; i++) {
      const diff = testVec[i] - trainVec[i];
      sum += diff * diff;
    }
    const distance = Math.sqrt(sum);
    return { distance, row: r };
  });

  distances.sort((a, b) => a.distance - b.distance);

  const k = Math.max(1, Math.min(input.k, distances.length));
  const top = distances.slice(0, k);

  const neighbors: Neighbor[] = top.map((d) => ({
    distance: d.distance,
    date: d.row.date,
    rainfall: d.row.rainfall,
    temperature: d.row.temperature,
    humidity: d.row.humidity,
    fertilizer: d.row.fertilizer,
    production: d.row.production,
  }));

  const avg = top.reduce((s, d) => s + d.row.production, 0) / k;
  const estimate = Math.round(avg * 100) / 100;
  const category = estimate >= 6 ? 'Tinggi' : 'Rendah';

  return { estimate, category, neighbors };
}
