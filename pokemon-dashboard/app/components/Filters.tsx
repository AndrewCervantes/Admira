"use client";
import { useState } from "react";

type Props = {
  initialFrom: string;
  initialTo: string;
  onChange: (f: { from: string; to: string; type?: string; region?: string }) => void;
};

export default function Filters({ initialFrom, initialTo, onChange }: Props) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0,1fr))", gap: 12, alignItems: "end" }}>
      <div><label>Desde<br/><input type="date" value={from} onChange={e=>setFrom(e.target.value)} /></label></div>
      <div><label>Hasta<br/><input type="date" value={to} onChange={e=>setTo(e.target.value)} /></label></div>
      <div>
        <label>Tipo<br/>
          <select value={type} onChange={e=>setType(e.target.value)}>
            <option value="">Todos</option>
            <option>fire</option><option>water</option><option>grass</option><option>electric</option>
            <option>psychic</option><option>ghost</option><option>dragon</option><option>normal</option>
          </select>
        </label>
      </div>
      <div>
        <label>Región<br/>
          <select value={region} onChange={e=>setRegion(e.target.value)}>
            <option value="">Todas</option>
            <option>Kanto</option><option>Johto</option><option>Hoenn</option><option>Sinnoh</option><option>Unova</option>
          </select>
        </label>
      </div>
      <button onClick={()=>onChange({ from, to, type: type||undefined, region: region||undefined })}>Aplicar</button>
      <button onClick={()=>{ setType(""); setRegion(""); setFrom(initialFrom); setTo(initialTo); onChange({ from: initialFrom, to: initialTo });}}>Reset</button>
    </div>
  );
}
