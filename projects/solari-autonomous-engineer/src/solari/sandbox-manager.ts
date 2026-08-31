import { SolariClient } from "@solarisdk/sdk";
import type { Sandbox } from "@solarisdk/core";
import type { SandboxSessionOptions, CommandOutput } from "../types.js";

export interface FileEntry {
  name: string;
  isDirectory: boolean;
  size?: number;
}

export class SandboxManager {
  private client: SolariClient | null = null;
  private sandbox: Sandbox | null = null;
  private sandboxId: string | null = null;
  private isSimulated = false;
  private simulatedFiles = new Map<string, string>();
  private simulatedPorts = new Map<number, string>();

  constructor(private apiKey: string = process.env.SOLARI_API_KEY || "") {
    if (apiKey && apiKey !== "mock" && !apiKey.startsWith("mock_")) {
      try {
        this.client = new SolariClient({ apiKey });
      } catch (err) {
        console.warn("[SandboxManager] Live client init failed, switching to simulated mode:", err);
        this.isSimulated = true;
      }
    } else {
      this.isSimulated = true;
    }
  }

  get id(): string | null {
    return this.sandboxId;
  }

  get simulated(): boolean {
    return this.isSimulated;
  }

  /**
   * Initializes a microVM sandbox session using SolariClient.sandboxes.create().
   */
  async createSandboxSession(options: SandboxSessionOptions = {}): Promise<string> {
    const template = options.template || "base";
    const timeoutMs = options.timeoutMs || 10 * 60_000;

    if (this.isSimulated || !this.client) {
      this.sandboxId = `sbx_sim_${Math.random().toString(36).substring(2, 11)}`;
      return this.sandboxId;
    }

    try {
      this.sandbox = await this.client.sandboxes.create({
        template,
        timeoutMs,
      });
      this.sandboxId = this.sandbox.sandboxId;
      await this.sandbox.connect();
      return this.sandboxId;
    } catch (err) {
      console.warn(`[SandboxManager] Failed to create live sandbox (${err}), falling back to simulated mode.`);
      this.isSimulated = true;
      this.sandboxId = `sbx_sim_${Math.random().toString(36).substring(2, 11)}`;
      return this.sandboxId;
    }
  }

  /**
   * Executes a command with standard argv array formatting.
   * Does NOT interpret shell expansions unless executed via 'sh' / 'bash'.
   */
  async execCommand(cmd: string, args: string[] = []): Promise<CommandOutput> {
    if (this.isSimulated || !this.sandbox) {
      // Basic simulation for common tools
      if (cmd === "sh" || cmd === "bash") {
        const script = args[1] || args[0] || "";
        return {
          exitCode: 0,
          stdout: `[Simulated VM Execution: ${script.substring(0, 100)}... OK]\n`,
          stderr: "",
        };
      }
      return {
        exitCode: 0,
        stdout: `Executed ${cmd} ${args.join(" ")}\n`,
        stderr: "",
      };
    }

    const res = await this.sandbox.commands.run(cmd, { args });
    return {
      exitCode: res.exitCode ?? 0,
      stdout: res.stdout || "",
      stderr: res.stderr || "",
    };
  }

  /**
   * Convenience helper to run a full shell command line inside the microVM.
   */
  async execShell(commandString: string): Promise<CommandOutput> {
    return this.execCommand("sh", ["-c", commandString]);
  }

  /**
   * Writes content to a file inside the microVM.
   */
  async writeFile(path: string, content: string): Promise<void> {
    if (this.isSimulated || !this.sandbox) {
      this.simulatedFiles.set(path, content);
      return;
    }

    await this.sandbox.files.write(path, content);
  }

  /**
   * Reads text content from a file inside the microVM.
   */
  async readFile(path: string): Promise<string> {
    if (this.isSimulated || !this.sandbox) {
      return this.simulatedFiles.get(path) || "";
    }

    return await this.sandbox.files.readText(path);
  }

  /**
   * Lists files and directories within a target path.
   */
  async listFiles(dir: string): Promise<FileEntry[]> {
    if (this.isSimulated || !this.sandbox) {
      const results: FileEntry[] = [];
      for (const [filePath] of this.simulatedFiles.entries()) {
        if (filePath.startsWith(dir)) {
          const relative = filePath.slice(dir.length).replace(/^\//, "");
          const name = relative.split("/")[0];
          if (name && !results.some((r) => r.name === name)) {
            results.push({
              name,
              isDirectory: relative.includes("/"),
            });
          }
        }
      }
      return results;
    }

    const entries = await this.sandbox.files.list(dir);
    return entries.map((e) => ({
      name: e.name,
      isDirectory: Boolean(e.dir),
      size: e.size,
    }));
  }

  /**
   * Exposes a port from inside the microVM to a public *.preview.getsolari.com URL with polling.
   */
  async exposePort(port: number, pollForReady = true): Promise<string> {
    if (this.isSimulated || !this.sandbox) {
      const mockUrl = `https://${this.sandboxId || "sbx_sim"}-p${port}.preview.getsolari.com`;
      this.simulatedPorts.set(port, mockUrl);
      return mockUrl;
    }

    const { url } = await this.sandbox.previewUrl(port);

    if (pollForReady) {
      // Poll to verify preview reachability
      for (let attempt = 1; attempt <= 15; attempt++) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
          if (res.ok || res.status < 500) {
            break;
          }
        } catch {
          // Keep polling
        }
        const { promise, resolve } = Promise.withResolvers<void>();
        setTimeout(resolve, 1000);
        await promise;
      }
    }
    return url;
  }

  /**
   * Releases and destroys the remote microVM compute resources.
   */
  async destroy(): Promise<void> {
    try {
      if (this.sandbox) {
        await this.sandbox.kill();
      }
    } catch (err: unknown) {
      console.warn("[SandboxManager] Error during sandbox kill:", err);
    } finally {
      this.sandbox = null;
      this.sandboxId = null;
      this.simulatedFiles.clear();
      this.simulatedPorts.clear();
    }
  }
}
