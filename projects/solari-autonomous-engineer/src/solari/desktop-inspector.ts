import { SolariClient } from "@solarisdk/sdk";
import type { Desktop } from "@solarisdk/core";

export interface DesktopSessionOptions {
  resolution?: "1280x720" | "1920x1080" | string;
  template?: string;
  timeoutMs?: number;
}

export interface DesktopStatus {
  ready: boolean;
  sessionId?: string;
  streamUrl?: string;
  recordingUrl?: string;
  displayReady?: boolean;
}

export class DesktopInspector {
  private client: SolariClient | null = null;
  private desktop: Desktop | null = null;
  private sessionId: string | null = null;
  private streamUrl: string | null = null;
  private isSimulated = false;

  constructor(private apiKey: string = process.env.SOLARI_API_KEY || "") {
    if (apiKey && apiKey !== "mock" && !apiKey.startsWith("mock_")) {
      try {
        this.client = new SolariClient({ apiKey });
      } catch (err) {
        console.warn("[DesktopInspector] Live client init failed, switching to simulated mode:", err);
        this.isSimulated = true;
      }
    } else {
      this.isSimulated = true;
    }
  }

  get id(): string | null {
    return this.sessionId;
  }

  get stream(): string | null {
    return this.streamUrl;
  }

  get simulated(): boolean {
    return this.isSimulated;
  }

  /**
   * Initializes a Cloud Desktop session with X11 GUI and live VNC streaming.
   */
  async createDesktopSession(options: DesktopSessionOptions = {}): Promise<DesktopStatus> {
    const resolution = options.resolution || "1280x720";
    const template = options.template || "default";
    const timeoutMs = options.timeoutMs || 10 * 60_000;

    if (this.isSimulated || !this.client) {
      this.sessionId = `desk_sim_${Math.random().toString(36).substring(2, 11)}`;
      this.streamUrl = `https://stream.preview.getsolari.com/vnc/${this.sessionId}?token=sim_tok`;
      return {
        ready: true,
        sessionId: this.sessionId,
        streamUrl: this.streamUrl,
        displayReady: true,
      };
    }

    try {
      this.desktop = await this.client.desktops.create({
        template,
        resolution,
        timeoutMs,
      });

      this.sessionId = this.desktop.sessionId;
      this.streamUrl = this.desktop.streamUrl;

      await this.desktop.connect();
      const isReady = await this.checkHealth();

      return {
        ready: isReady,
        sessionId: this.sessionId,
        streamUrl: this.streamUrl,
        recordingUrl: this.desktop.recordingUrl,
        displayReady: isReady,
      };
    } catch (err) {
      console.warn(`[DesktopInspector] Live desktop creation failed (${err}), falling back to simulation.`);
      this.isSimulated = true;
      this.sessionId = `desk_sim_${Math.random().toString(36).substring(2, 11)}`;
      this.streamUrl = `https://stream.preview.getsolari.com/vnc/${this.sessionId}?token=sim_tok`;
      return {
        ready: true,
        sessionId: this.sessionId,
        streamUrl: this.streamUrl,
        displayReady: true,
      };
    }
  }

  /**
   * Polls desktop readiness until X11, VNC, and Agent report healthy.
   */
  async checkHealth(maxAttempts = 30): Promise<boolean> {
    if (this.isSimulated || !this.desktop) {
      return true;
    }

    for (let i = 0; i < maxAttempts; i++) {
      try {
        const health = await this.desktop.health();
        if (health.ready) {
          return true;
        }
      } catch {
        // Probe retry
      }
      const { promise, resolve } = Promise.withResolvers<void>();
      setTimeout(resolve, 1000);
      await promise;
    }

    return false;
  }

  /**
   * Launches a GUI application (e.g., "code", "google-chrome", "mousepad", "xterm") inside the desktop.
   */
  async launchApp(appName: string, args: string[] = []): Promise<number> {
    if (this.isSimulated || !this.desktop) {
      return 1000 + Math.floor(Math.random() * 9000);
    }

    return await this.desktop.open(appName, args);
  }

  /**
   * Clicks at specified desktop coordinate with humanized path bezier movement.
   */
  async click(x: number, y: number): Promise<void> {
    if (this.isSimulated || !this.desktop) {
      return;
    }

    await this.desktop.mouse.click(x, y, { humanize: true });
  }

  /**
   * Types text into active X11 focused window.
   */
  async typeText(text: string): Promise<void> {
    if (this.isSimulated || !this.desktop) {
      return;
    }

    await this.desktop.keyboard.type(text);
  }

  /**
   * Captures PNG screenshot of the live X11 display.
   */
  async captureScreenshot(): Promise<Buffer> {
    if (this.isSimulated || !this.desktop) {
      // 1x1 transparent PNG buffer
      return Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
    }

    const uint8Array = await this.desktop.screenshot({ format: "png" });
    return Buffer.from(uint8Array);
  }

  /**
   * Closes local channel and releases remote desktop session.
   */
  async cleanup(): Promise<void> {
    if (this.desktop && this.client && this.sessionId) {
      try {
        await this.desktop.close();
        await this.client.desktops.destroy(this.sessionId);
      } catch (err) {
        console.warn("[DesktopInspector] Error during desktop cleanup:", err);
      } finally {
        this.desktop = null;
        this.sessionId = null;
        this.streamUrl = null;
      }
    }
  }
}
