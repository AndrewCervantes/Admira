import type { NextApiRequest, NextApiResponse } from "next";
import { PkmEvent, Region, Action } from "@/lib/types";

// Subconjunto de pokémon (id, name, type) — puedes ampliar si quieres
const PKM_BASE = [
  { id: 6,   name: "charizard",  type: "fire" },
  { id: 3,   name: "venusaur",   type: "grass" },
  { id: 9,   name: "blastoise",  type: "water" },
  { id: 25,  name: "pikachu",    type: "electric" },
  { id: 94,  name: "gengar",     type: "ghost" },
  { id: 149, name: "dragonite",  type: "dragon" },
  { id: 150, name: "mewtwo",     type: "psychic" },
  { id: 131, name: "lapras",     type: "water" },
  { id: 38,  name: "ninetales",  type: "fire" },
  { id: 65,  name: "alakazam",   type: "psychic" },
  { id: 143, name: "snorlax",    type: "normal" }
];

const REGIONS: Region[] = ["Kanto","Johto","Hoenn","Sinnoh","Unova"];
const ACTIONS: Action[] = ["battle","catch","trade"];

function seededRng(seed = 1234) {
  let s = seed;
  return (n: number) => { s = (s * 9301 + 49297) % 233280; return Math.floor((s / 233280) * n); };
}

// Valor base “poder” aproximado por especie (puedes sustituir por stats reales via proxy)
const POWER_BASE = new Map(PKM_BASE.map(p => [p.name, 60 + (p.id % 40)]));

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const rng = seededRng(2025);
  const out: PkmEvent[] = [];

  const start = new Date();
  start.setDate(start.getDate() - 59);

  for (let d = 0; d < 60; d++) {
    const day = new Date(start);
    day.setDate(start.getDate() + d);
    const perDay = 40 + rng(20); // 40-60 eventos/día
    for (let i = 0; i < perDay; i++) {
      const pk = PKM_BASE[rng(PKM_BASE.length)];
      const region = REGIONS[rng(REGIONS.length)];
      const action = ACTIONS[rng(ACTIONS.length)];
      const hour = rng(24), min = rng(60);
      const ts = new Date(day); ts.setHours(hour, min, 0, 0);

      // Cálculos de tasa según acción (ej. battle multiplica un poco más)
      const base = POWER_BASE.get(pk.name) ?? 50;
      const modifier = action === "battle" ? 1.2 : action === "catch" ? 0.9 : 0.7;
      const value = Math.round(base * modifier + rng(15));

      out.push({
        id: `evt_${d}_${i}_${pk.id}`,
        ts: ts.toISOString(),
        pokemon: { id: pk.id, name: pk.name, type: pk.type },
        region,
        action,
        value
      });
    }
  }

  res.status(200).json({ items: out });
}
