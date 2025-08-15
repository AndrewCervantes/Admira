import type { NextApiRequest, NextApiResponse } from "next";
const WEBHOOK_URL = process.env.WEBHOOK_URL || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const payload = { ts: new Date().toISOString(), ...req.body };
    if (WEBHOOK_URL) {
      await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "trace failed" });
  }
}
