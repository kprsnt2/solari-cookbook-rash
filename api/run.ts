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

  const getProviderApiKey = (p: string) => {
    if (p === "openai") return process.env.OPENAI_API_KEY;
    if (p === "anthropic") return process.env.ANTHROPIC_API_KEY;
    if (p === "gemini") return process.env.GEMINI_API_KEY;
    if (p === "groq") return process.env.GROQ_API_KEY;
    if (p === "openrouter") return process.env.OPENROUTER_API_KEY;
    return undefined;
  };

  const engineer = new AutonomousEngineer({
    provider: provider as LLMProvider,
    model,
    maxSteps: Number(maxSteps),
    solariApiKey: process.env.SOLARI_API_KEY,
    apiKey: getProviderApiKey(provider),
  });

  try {
    const result = await engineer.runTask(task);
    res.status(200).json(result);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errMsg });
  }
}
