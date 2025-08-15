"use client";
import { PkmEvent } from "@/lib/types";

export default function DrilldownTable({ rows, title }: { rows: PkmEvent[]; title: string }) {
  if (!rows.length) return null;
  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ margin: "4px 0" }}>{title}</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Fecha</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Pokémon</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Tipo</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Región</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Acción</th>
              <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 6 }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id}>
                <td style={{ padding: 6 }}>{new Date(r.ts).toLocaleString()}</td>
                <td style={{ padding: 6 }}>{r.pokemon.name}</td>
                <td style={{ padding: 6 }}>{r.pokemon.type}</td>
                <td style={{ padding: 6 }}>{r.region}</td>
                <td style={{ padding: 6 }}>{r.action}</td>
                <td style={{ padding: 6, textAlign: "right" }}>{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
