export type Region = "Kanto" | "Johto" | "Hoenn" | "Sinnoh" | "Unova";
export type Action = "battle" | "catch" | "trade";

export type PkmEvent = {
  id: string;
  ts: string;               // ISO date-time
  pokemon: { id: number; name: string; type: string };
  region: Region;
  action: Action;
  value: number;            // “poder” (derivado de stats base)
};
