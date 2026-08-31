import type { VercelRequest, VercelResponse } from "@vercel/node";
import { AutonomousEngineer, type LLMProvider } from "../projects/solari-autonomous-engineer/src/agent/orchestrator.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { task, provider = "openai", model, maxSteps = 15 } = req.body || {};

  if (!task || typeof task !== "string") {
    res.status(400).json({ error: "Task description is required" });
    return;
  }

  const engineer = new AutonomousEngineer({
    provider: provider as LLMProvider,
    model,
    maxSteps: Number(maxSteps),
    solariApiKey: process.env.SOLARI_API_KEY,
    apiKey: provider === "openai" ? process.env.OPENAI_API_KEY : undefined,
  });

  try {
    const result = await engineer.runTask(task);
    res.status(200).json(result);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errMsg });
  }
}
