"use client";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, AreaChart, Area
} from "recharts";
import { useMemo } from "react";

type Props = {
  seriesDaily: { day: string; total: number }[];
  seriesPct: { day: string; pct: number }[];
  seriesMA7: { day: string; ma7: number }[];
  topTypes: { type: string; total: number }[];
  regionSeries: Array<any>;
  actionDist: { action: string; total: number }[];
  onBarClick: (type: string) => void;
};

export default function Charts(p: Props) {
  const merged = useMemo(() => p.seriesDaily.map((d, i) => ({
    day: d.day, total: d.total, pct: p.seriesPct[i]?.pct ?? 0, ma7: p.seriesMA7[i]?.ma7 ?? 0
  })), [p.seriesDaily, p.seriesPct, p.seriesMA7]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0,1fr))", gap: 16, marginTop: 16 }}>
      <div style={{ gridColumn: "span 7" }}>
        <h3 style={{ margin: "4px 0" }}>Valor diario & MA7</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={merged}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" name="Total" dot={false} />
            <Line type="monotone" dataKey="ma7" name="MA7" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ gridColumn: "span 5" }}>
        <h3 style={{ margin: "4px 0" }}>% cambio</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={merged}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="pct" name="% cambio" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ gridColumn: "span 6" }}>
        <h3 style={{ margin: "4px 0" }}>Top tipos</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={p.topTypes} onClick={(e: any)=>{ if (e && e.activeLabel) p.onBarClick(e.activeLabel); }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" name="Total por tipo" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ gridColumn: "span 6" }}>
        <h3 style={{ margin: "4px 0" }}>Serie por región</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={p.regionSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            {["Kanto","Johto","Hoenn","Sinnoh","Unova"].map(r=>(
              <Area key={r} type="monotone" dataKey={r} stackId="1" name={r} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ gridColumn: "span 4" }}>
        <h3 style={{ margin: "4px 0" }}>Acciones</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Tooltip />
            <Pie data={p.actionDist} dataKey="total" nameKey="action" innerRadius={60} outerRadius={100} label />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
