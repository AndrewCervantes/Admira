import { PkmEvent } from "./types";
import { formatISO, parseISO } from "date-fns";

/** 1) Agregación temporal: sumatoria por día del valor */
export function aggregateByDay(rows: PkmEvent[]) {
  const m = new Map<string, number>();
  for (const r of rows) {
    const day = formatISO(parseISO(r.ts), { representation: "date" });
    m.set(day, (m.get(day) ?? 0) + r.value);
  }
  return Array.from(m, ([day, total]) => ({ day, total }));
}

/** 2) % cambio */
export function pctChange(series: { day: string; total: number }[]) {
  return series.map((p, i) => {
    if (i === 0) return { ...p, pct: 0 };
    const prev = series[i - 1].total || 0.0001;
    return { ...p, pct: ((p.total - prev) / prev) * 100 };
  });
}

/** 3) Media móvil 7d */
export function rolling7(series: { day: string; total: number }[]) {
  const out: { day: string; ma7: number }[] = [];
  for (let i = 0; i < series.length; i++) {
    const w = series.slice(Math.max(0, i - 6), i + 1);
    const avg = w.reduce((s, r) => s + r.total, 0) / w.length;
    out.push({ day: series[i].day, ma7: Math.round(avg * 100) / 100 });
  }
  return out;
}

/** Top-N por tipo */
export function topNByType(rows: PkmEvent[], n: number) {
  const m = new Map<string, number>();
  for (const r of rows) m.set(r.pokemon.type, (m.get(r.pokemon.type) ?? 0) + r.value);
  return Array.from(m, ([type, total]) => ({ type, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, n);
}

/** Serie por región (stacked) */
export function seriesByRegion(rows: PkmEvent[]) {
  const byDay = new Map<string, Map<string, number>>();
  for (const r of rows) {
    const day = r.ts.slice(0, 10);
    if (!byDay.has(day)) byDay.set(day, new Map());
    const inner = byDay.get(day)!;
    inner.set(r.region, (inner.get(r.region) ?? 0) + r.value);
  }
  return Array.from(byDay.entries()).map(([day, inner]) => ({
    day,
    ...Object.fromEntries(inner.entries())
  }));
}

/** Distribución por acción (pie) */
export function distributionByAction(rows: PkmEvent[]) {
  const m = new Map<string, number>();
  for (const r of rows) m.set(r.action, (m.get(r.action) ?? 0) + r.value);
  return Array.from(m, ([action, total]) => ({ action, total }));
}

/** Filtros: rango + tipo opcional */
export function applyFilters(
  rows: PkmEvent[],
  from: string,
  to: string,
  opts?: { type?: string; region?: string }
) {
  const f = new Date(from).getTime();
  const t = new Date(to).getTime();
  return rows.filter(r => {
    const ts = new Date(r.ts).getTime();
    const inRange = ts >= f && ts <= t;
    const byType = !opts?.type || r.pokemon.type === opts.type;
    const byRegion = !opts?.region || r.region === opts.region;
    return inRange && byType && byRegion;
  });
}
