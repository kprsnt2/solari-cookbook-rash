import type { QAAssertion, QAResult } from "../types.js";
export interface BrowserQAOptions {
    stealth?: boolean;
    proxy?: string | {
        country: string;
        tier?: string;
        session?: string;
    };
    recording?: boolean;
    apiKey?: string;
    viewport?: {
        width: number;
        height: number;
    };
}
export declare class BrowserQA {
    private apiKey;
    private solari;
    private browser;
    private sessionId;
    private isSimulated;
    constructor(apiKey?: string);
    get id(): string | null;
    get simulated(): boolean;
    /**
     * Launches a stealth or standard cloud browser session with optional rrweb recording.
     */
    launchQABrowser(options?: BrowserQAOptions): Promise<string>;
    /**
     * Drives the cloud browser to navigate to a live preview URL, execute UI assertions,
     * collect console errors, and take visual snapshots.
     */
    verifyLivePreview(previewUrl: string, assertions?: QAAssertion[]): Promise<QAResult>;
    /**
     * Downloads and parses rrweb session replay NDJSON events after session is released.
     */
    extractSessionReplay(sessionId: string): Promise<Array<Record<string, unknown>>>;
    /**
     * Closes the active browser session and shuts down the loopback proxy server.
     */
    cleanup(): Promise<void>;
}
//# sourceMappingURL=browser-qa.d.ts.map