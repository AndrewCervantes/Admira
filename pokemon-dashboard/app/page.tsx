"use client";
import { useEffect, useMemo, useState } from "react";
import Filters from "./components/Filters";
import Charts from "./components/Charts";
import DrilldownTable from "./components/DrilldownTable";
import { PkmEvent } from "@/lib/types";
import { aggregateByDay, pctChange, rolling7, topNByType, seriesByRegion, distributionByAction, applyFilters } from "@/lib/transforms";
import { toISODate } from "@/lib/utils";

type ApiEvents = { items: PkmEvent[] };

export default function Page() {
  const [raw, setRaw] = useState<PkmEvent[]>([]);
  const [status, setStatus] = useState<"idle"|"loading"|"error"|"ready">("idle");
  const [errMsg, setErrMsg] = useState<string>("");
  const [filters, setFilters] = useState<{from: string; to: string; type?: string; region?: string}>(() => {
    const today = new Date(); const from = new Date(); from.setDate(today.getDate() - 29);
    return { from: toISODate(from), to: toISODate(today) };
  });
  const [drillType, setDrillType] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      setStatus("loading");
      try {
        const ev = await fetch("/api/mock/events").then(r=>r.json() as Promise<ApiEvents>);
        setRaw(ev.items);
        setStatus("ready");
        fetch("/api/trace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "app_loaded", counts: { events: ev.items.length }})
        }).catch(()=>{});
      } catch (e: any) {
        setErrMsg(e?.message || "error");
        setStatus("error");
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => applyFilters(raw, filters.from, filters.to, { type: filters.type, region: filters.region }), [raw, filters]);

  const seriesDaily = useMemo(()=>aggregateByDay(filtered), [filtered]);
  const seriesPct   = useMemo(()=>pctChange(seriesDaily), [seriesDaily]);
  const seriesMA7   = useMemo(()=>rolling7(seriesDaily), [seriesDaily]);
  const topTypes    = useMemo(()=>topNByType(filtered, 5), [filtered]);
  const regionSeries= useMemo(()=>seriesByRegion(filtered), [filtered]);
  const actionDist  = useMemo(()=>distributionByAction(filtered), [filtered]);

  const drillRows = useMemo(()=>{
    if (!drillType) return [];
    return filtered.filter(r=>r.pokemon.type === drillType).sort((a,b)=> b.value - a.value).slice(0, 25);
  }, [filtered, drillType]);

  if (status === "loading") return <p>Cargando datos…</p>;
  if (status === "error")   return <p>Ocurrió un error: {errMsg}. Intenta recargar.</p>;
  if (status === "ready" && raw.length === 0) return <p>No hay datos para mostrar.</p>;

  return (
    <main>
      <Filters initialFrom={filters.from} initialTo={filters.to} onChange={setFilters} />
      <Charts
        seriesDaily={seriesDaily}
        seriesPct={seriesPct}
        seriesMA7={seriesMA7}
        topTypes={topTypes}
        regionSeries={regionSeries}
        actionDist={actionDist}
        onBarClick={setDrillType}
      />
      <DrilldownTable title={drillType ? `Top eventos del tipo: ${drillType}` : ""} rows={drillRows} />
      <p style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
        Estados: {status}. Mostrando {filtered.length.toLocaleString()} eventos.
      </p>
    </main>
  );
}
