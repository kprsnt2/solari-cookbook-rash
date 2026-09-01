import type { IncomingMessage, ServerResponse } from "node:http";

interface CustomResponse extends ServerResponse {
  json: (data: unknown) => void;
  status: (statusCode: number) => CustomResponse;
}

export default function handler(_req: IncomingMessage, res: CustomResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (_req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  const responseData = {
    status: "ok",
    runtime: "Vercel Serverless Function",
    solariConfigured: Boolean(process.env.SOLARI_API_KEY),
    providers: {
      openai: Boolean(process.env.OPENAI_API_KEY),
      anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
      gemini: Boolean(process.env.GEMINI_API_KEY),
      groq: Boolean(process.env.GROQ_API_KEY),
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
      simulator: true,
    },
  };

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(JSON.stringify(responseData));
}
