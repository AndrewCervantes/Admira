import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const TRACE_FILE = path.join(process.cwd(), "http_trace.jsonl");
const ADMIRA_TOKEN = process.env.ADMIRA_TOKEN || ""; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: apiPath = "pokemon/ditto" } = req.query;
  const url = `https://pokeapi.co/api/v2/${apiPath}`;
  const start = Date.now();

  try {
    const r = await fetch(url, { headers: { "X-Admira-Token": ADMIRA_TOKEN } });
    const data = await r.json();
    fs.appendFileSync(TRACE_FILE, JSON.stringify({
      ts: new Date().toISOString(),
      route: "/api/poke/proxy",
      url_base: url,
      status: r.status,
      duration_ms: Date.now() - start
    }) + "\n");
    res.status(r.status).json(data);
  } catch (e: any) {
    fs.appendFileSync(TRACE_FILE, JSON.stringify({ ts: new Date().toISOString(), error: e?.message || "unknown" }) + "\n");
    res.status(500).json({ error: "proxy_failed" });
  }
}
