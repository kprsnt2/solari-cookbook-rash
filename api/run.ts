import type { IncomingMessage, ServerResponse } from "node:http";
import { AutonomousEngineer, type LLMProvider } from "../projects/solari-autonomous-engineer/src/agent/orchestrator.js";

interface CustomRequest extends IncomingMessage {
  body?: Record<string, unknown>;
}

interface CustomResponse extends ServerResponse {
  json: (data: unknown) => void;
  status: (statusCode: number) => CustomResponse;
}

export default async function handler(req: CustomRequest, res: CustomResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  // Parse body if not pre-parsed by Vercel
  let bodyData: Record<string, unknown> = req.body || {};
  if (!req.body) {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }
      const rawText = Buffer.concat(chunks).toString("utf-8");
      if (rawText) {
        bodyData = JSON.parse(rawText);
      }
    } catch {
      bodyData = {};
    }
  }

  const { task, provider = "openai", model, maxSteps = 15 } = bodyData;

  if (!task || typeof task !== "string") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Task description is required" }));
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
    model: typeof model === "string" ? model : (provider === "openai" ? "gpt-5.4-mini" : undefined),
    maxSteps: Number(maxSteps) || 15,
    solariApiKey: process.env.SOLARI_API_KEY,
    apiKey: getProviderApiKey(String(provider)),
  });

  try {
    const result = await engineer.runTask(task);
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    res.end(JSON.stringify({ error: errMsg }));
  }
}
