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
export declare class DesktopInspector {
    private apiKey;
    private client;
    private desktop;
    private sessionId;
    private streamUrl;
    private isSimulated;
    constructor(apiKey?: string);
    get id(): string | null;
    get stream(): string | null;
    get simulated(): boolean;
    /**
     * Initializes a Cloud Desktop session with X11 GUI and live VNC streaming.
     */
    createDesktopSession(options?: DesktopSessionOptions): Promise<DesktopStatus>;
    /**
     * Polls desktop readiness until X11, VNC, and Agent report healthy.
     */
    checkHealth(maxAttempts?: number): Promise<boolean>;
    /**
     * Launches a GUI application (e.g., "code", "google-chrome", "mousepad", "xterm") inside the desktop.
     */
    launchApp(appName: string, args?: string[]): Promise<number>;
    /**
     * Clicks at specified desktop coordinate with humanized path bezier movement.
     */
    click(x: number, y: number): Promise<void>;
    /**
     * Types text into active X11 focused window.
     */
    typeText(text: string): Promise<void>;
    /**
     * Captures PNG screenshot of the live X11 display.
     */
    captureScreenshot(): Promise<Buffer>;
    /**
     * Closes local channel and releases remote desktop session.
     */
    cleanup(): Promise<void>;
}
//# sourceMappingURL=desktop-inspector.d.ts.map