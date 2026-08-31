import { describe, it, expect, afterAll, beforeAll } from "vitest";
import http from "node:http";
import { once } from "node:events";
import { WebSocket } from "ws";
import { startWebStudioServer } from "./server.js";

describe("Web Studio Server Integration Smoke Test", () => {
  let server: http.Server;
  const PORT = 4299;

  beforeAll(async () => {
    server = startWebStudioServer(PORT);
    if (!server.listening) {
      await once(server, "listening");
    }
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  it("should respond with health status on GET /api/health", async () => {
    const res = await fetch(`http://localhost:${PORT}/api/health`);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { status: string; providers: Record<string, boolean> };
    expect(data.status).toBe("ok");
    expect(data.providers.simulator).toBe(true);
  });

  it("should handle WebSocket connection and broadcast agent steps during POST /api/run", async () => {
    const ws = new WebSocket(`ws://localhost:${PORT}`);
    const receivedMessages: Array<Record<string, unknown>> = [];

    ws.on("message", (raw) => {
      try {
        receivedMessages.push(JSON.parse(raw.toString()));
      } catch {}
    });

    await once(ws, "open");

    // Trigger task execution via REST API
    const res = await fetch(`http://localhost:${PORT}/api/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: "Smoke test task",
        provider: "simulator",
      }),
    });

    expect(res.status).toBe(200);
    const result = (await res.json()) as { success: boolean; previewUrl?: string };
    expect(result.success).toBe(true);
    expect(result.previewUrl).toBeDefined();

    expect(receivedMessages.length).toBeGreaterThan(1);
    const hasStep = receivedMessages.some((m) => m.type === "step");
    expect(hasStep).toBe(true);

    ws.close();
    await once(ws, "close");
  });
});
