import type { AgentStepEvent, AutonomousRunResult } from "../types.js";
export type LLMProvider = "openai" | "anthropic" | "gemini" | "groq" | "openrouter" | "simulator";
export interface OrchestratorOptions {
    provider?: LLMProvider;
    model?: string;
    apiKey?: string;
    solariApiKey?: string;
    maxSteps?: number;
    onStep?: (event: AgentStepEvent) => void;
}
export declare class AutonomousEngineer {
    private sandbox;
    private browserQA;
    private desktop;
    private provider;
    private model;
    private apiKey;
    private maxSteps;
    private onStep?;
    constructor(options?: OrchestratorOptions);
    private detectProvider;
    private defaultModelForProvider;
    private getApiKeyForProvider;
    private emitStep;
    /**
     * Main entry point to run an autonomous task end-to-end.
     */
    runTask(taskDescription: string): Promise<AutonomousRunResult>;
    private executeTool;
    /**
     * Deterministic pipeline simulator for offline, benchmark, and demo runs.
     */
    private runSimulatedPipeline;
    /**
     * Universal LLM invocation handler supporting OpenAI, Claude, Gemini, Groq, OpenRouter.
     */
    private callLLM;
}
//# sourceMappingURL=orchestrator.d.ts.map