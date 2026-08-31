import type { SandboxSessionOptions, CommandOutput } from "../types.js";
export interface FileEntry {
    name: string;
    isDirectory: boolean;
    size?: number;
}
export declare class SandboxManager {
    private apiKey;
    private client;
    private sandbox;
    private sandboxId;
    private isSimulated;
    private simulatedFiles;
    private simulatedPorts;
    constructor(apiKey?: string);
    get id(): string | null;
    get simulated(): boolean;
    /**
     * Initializes a microVM sandbox session using SolariClient.sandboxes.create().
     */
    createSandboxSession(options?: SandboxSessionOptions): Promise<string>;
    /**
     * Executes a command with standard argv array formatting.
     * Does NOT interpret shell expansions unless executed via 'sh' / 'bash'.
     */
    execCommand(cmd: string, args?: string[]): Promise<CommandOutput>;
    /**
     * Convenience helper to run a full shell command line inside the microVM.
     */
    execShell(commandString: string): Promise<CommandOutput>;
    /**
     * Writes content to a file inside the microVM.
     */
    writeFile(path: string, content: string): Promise<void>;
    /**
     * Reads text content from a file inside the microVM.
     */
    readFile(path: string): Promise<string>;
    /**
     * Lists files and directories within a target path.
     */
    listFiles(dir: string): Promise<FileEntry[]>;
    /**
     * Exposes a port from inside the microVM to a public *.preview.getsolari.com URL with polling.
     */
    exposePort(port: number, pollForReady?: boolean): Promise<string>;
    /**
     * Releases and destroys the remote microVM compute resources.
     */
    destroy(): Promise<void>;
}
//# sourceMappingURL=sandbox-manager.d.ts.map