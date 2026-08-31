import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";
import { SolariClient } from "@solarisdk/sdk";
import { Solari, type BrowserSession } from "@solarisdk/browser";
import type { Sandbox, Desktop } from "@solarisdk/core";

dotenv.config();

const apiKey = process.env.SOLARI_API_KEY || "";
const isSimulated = !apiKey || apiKey === "mock" || apiKey.startsWith("mock_");

const server = new McpServer({
  name: "solari-mcp-server",
  version: "1.0.0",
});

// Reusable sessions
let activeSandboxClient: SolariClient | null = null;
let activeSandbox: Sandbox | null = null;
let activeSolariBrowserClient: Solari | null = null;
let activeDesktop: Desktop | null = null;

const simulatedFiles = new Map<string, string>();

function getSandboxClient(): SolariClient | null {
  if (isSimulated) return null;
  if (!activeSandboxClient) {
    activeSandboxClient = new SolariClient({ apiKey });
  }
  return activeSandboxClient;
}

async function getOrInitSandbox(): Promise<Sandbox> {
  if (!activeSandbox) {
    const client = getSandboxClient();
    if (!client) throw new Error("Solari API client is not initialized.");
    activeSandbox = await client.sandboxes.create({ template: "base", timeoutMs: 10 * 60_000 });
    await activeSandbox.connect();
  }
  return activeSandbox;
}

// 1. Tool: solari_sandbox_exec
server.registerTool(
  "solari_sandbox_exec",
  {
    title: "Execute Command in MicroVM Sandbox",
    description: "Runs a shell command inside a Solari microVM Linux sandbox.",
    inputSchema: {
      cmd: z.string().describe("Command to run (e.g. 'sh', 'node', 'python3', 'git')"),
      args: z.array(z.string()).optional().describe("Array of command arguments"),
    },
  },
  async ({ cmd, args = [] }) => {
    if (isSimulated) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              exitCode: 0,
              stdout: `[Simulated VM] Executed ${cmd} ${args.join(" ")}\n`,
              stderr: "",
            }, null, 2),
          },
        ],
      };
    }

    try {
      const sandbox = await getOrInitSandbox();
      const res = await sandbox.commands.run(cmd, { args });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              exitCode: res.exitCode,
              stdout: res.stdout,
              stderr: res.stderr,
            }, null, 2),
          },
        ],
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Execution failed: ${msg}` }],
        isError: true,
      };
    }
  }
);

// 2. Tool: solari_sandbox_file_write
server.registerTool(
  "solari_sandbox_file_write",
  {
    title: "Write File in MicroVM Sandbox",
    description: "Creates or overwrites a file inside the Solari microVM.",
    inputSchema: {
      path: z.string().describe("Absolute file path inside the sandbox"),
      content: z.string().describe("Text content to write"),
    },
  },
  async ({ path, content }) => {
    if (isSimulated) {
      simulatedFiles.set(path, content);
      return {
        content: [{ type: "text", text: `Wrote ${content.length} bytes to ${path} (simulated)` }],
      };
    }

    try {
      const sandbox = await getOrInitSandbox();
      await sandbox.files.write(path, content);
      return {
        content: [{ type: "text", text: `Successfully wrote ${content.length} bytes to ${path}` }],
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `File write failed: ${msg}` }],
        isError: true,
      };
    }
  }
);

// 3. Tool: solari_sandbox_file_read
server.registerTool(
  "solari_sandbox_file_read",
  {
    title: "Read File from MicroVM Sandbox",
    description: "Reads file text content from inside the Solari microVM.",
    inputSchema: {
      path: z.string().describe("Absolute file path to read"),
    },
  },
  async ({ path }) => {
    if (isSimulated) {
      const text = simulatedFiles.get(path) || "";
      return {
        content: [{ type: "text", text }],
      };
    }

    try {
      const sandbox = await getOrInitSandbox();
      const text = await sandbox.files.readText(path);
      return {
        content: [{ type: "text", text }],
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `File read failed: ${msg}` }],
        isError: true,
      };
    }
  }
);

// 4. Tool: solari_sandbox_preview_port
server.registerTool(
  "solari_sandbox_preview_port",
  {
    title: "Expose MicroVM Port to Public URL",
    description: "Exposes a background server port inside the sandbox to a public *.preview.getsolari.com URL.",
    inputSchema: {
      port: z.number().describe("In-guest port number (e.g. 3000, 8080)"),
    },
  },
  async ({ port }) => {
    if (isSimulated) {
      const mockUrl = `https://sbx_mcp_preview-p${port}.preview.getsolari.com`;
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              port,
              previewUrl: mockUrl,
              message: "Preview port exposed (simulated)",
            }, null, 2),
          },
        ],
      };
    }

    try {
      const sandbox = await getOrInitSandbox();
      const { url } = await sandbox.previewUrl(port);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              port,
              previewUrl: url,
            }, null, 2),
          },
        ],
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Port exposure failed: ${msg}` }],
        isError: true,
      };
    }
  }
);

// 5. Tool: solari_browser_stealth_test
server.registerTool(
  "solari_browser_stealth_test",
  {
    title: "Execute Stealth Browser E2E Test",
    description: "Launches a stealth cloud browser with Playwright, navigates to a URL, and performs UI checks.",
    inputSchema: {
      url: z.string().describe("Target URL to test"),
      stealth: z.boolean().optional().describe("Enable anti-bot stealth bypass"),
      recording: z.boolean().optional().describe("Record rrweb DOM events"),
    },
  },
  async ({ url, stealth = true, recording = true }) => {
    if (isSimulated) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              url,
              title: "Solari Application Preview",
              stealth,
              recording,
              eventsCaptured: 25,
            }, null, 2),
          },
        ],
      };
    }

    try {
      if (!activeSolariBrowserClient) {
        activeSolariBrowserClient = new Solari({ apiKey });
      }

      const browser = await activeSolariBrowserClient.launch({
        stealth,
        recording,
      });

      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      const title = await page.title();
      const screenshot = await page.screenshot({ fullPage: false });

      await browser.close();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              url,
              title,
              sessionId: browser.id,
              screenshotBytes: screenshot.length,
            }, null, 2),
          },
        ],
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Browser test failed: ${msg}` }],
        isError: true,
      };
    }
  }
);

// 6. Tool: solari_desktop_launch
server.registerTool(
  "solari_desktop_launch",
  {
    title: "Launch Cloud Desktop GUI Session",
    description: "Launches an X11 Linux Desktop session with live VNC streaming.",
    inputSchema: {
      appName: z.string().describe("Application name to launch, e.g. 'code', 'google-chrome'"),
      resolution: z.string().optional().describe("Resolution e.g. '1280x720'"),
    },
  },
  async ({ appName, resolution = "1280x720" }) => {
    if (isSimulated) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              ready: true,
              sessionId: "desk_mcp_sim",
              appName,
              streamUrl: "https://stream.preview.getsolari.com/vnc/desk_mcp_sim?token=sim",
            }, null, 2),
          },
        ],
      };
    }

    try {
      const client = getSandboxClient();
      if (!client) throw new Error("Client initialization failed");

      if (!activeDesktop) {
        activeDesktop = await client.desktops.create({
          template: "default",
          resolution,
          timeoutMs: 10 * 60_000,
        });
        await activeDesktop.connect();
      }

      const pid = await activeDesktop.open(appName);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              ready: true,
              sessionId: activeDesktop.sessionId,
              appName,
              pid,
              streamUrl: activeDesktop.streamUrl,
            }, null, 2),
          },
        ],
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Desktop launch failed: ${msg}` }],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error in Solari MCP server:", err);
  process.exit(1);
});
