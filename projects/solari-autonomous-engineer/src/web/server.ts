import express from "express";
import cors from "cors";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer, WebSocket } from "ws";
import { AutonomousEngineer, type LLMProvider } from "../agent/orchestrator.js";
import type { AgentStepEvent } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function startWebStudioServer(port = 4200): http.Server {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Static files
  const publicDir = path.join(__dirname, "public");
  app.use(express.static(publicDir));

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  const activeSockets = new Set<WebSocket>();

  wss.on("connection", (ws) => {
    activeSockets.add(ws);
    ws.send(JSON.stringify({ type: "connection", status: "connected" }));

    ws.on("close", () => {
      activeSockets.delete(ws);
    });
  });

  const broadcast = (data: Record<string, unknown>) => {
    const payload = JSON.stringify(data);
    for (const ws of activeSockets) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    }
  };

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      solariConfigured: Boolean(process.env.SOLARI_API_KEY),
      providers: {
        openai: Boolean(process.env.OPENAI_API_KEY),
        anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
        gemini: Boolean(process.env.GEMINI_API_KEY),
        groq: Boolean(process.env.GROQ_API_KEY),
        openrouter: Boolean(process.env.OPENROUTER_API_KEY),
        simulator: true,
      },
    });
  });

  app.post("/api/run", async (req, res) => {
    const { task, provider = "simulator", model, maxSteps = 15 } = req.body;

    if (!task || typeof task !== "string") {
      res.status(400).json({ error: "Task description is required" });
      return;
    }

    broadcast({ type: "run_start", task, provider });

    const engineer = new AutonomousEngineer({
      provider: provider as LLMProvider,
      model,
      maxSteps: Number(maxSteps),
      onStep: (event: AgentStepEvent) => {
        broadcast({ type: "step", event });
      },
    });

    try {
      const result = await engineer.runTask(task);
      broadcast({ type: "run_complete", result });
      res.json(result);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      broadcast({ type: "run_error", error: errMsg });
      res.status(500).json({ error: errMsg });
    }
  });

  server.listen(port, () => {
    console.log(`\n  ⚡ Solari-Agent Web Studio running at: http://localhost:${port}\n`);
  });

  return server;
}

// Auto-start if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = parseInt(process.env.PORT || "4200", 10);
  startWebStudioServer(port);
}
