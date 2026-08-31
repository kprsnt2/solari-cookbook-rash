export interface AgentMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface SandboxSessionOptions {
  template?: string;
  timeoutMs?: number;
}

export interface CommandOutput {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export interface QAAssertion {
  type: "title" | "element_text" | "element_visible" | "input_value" | "click" | "type" | "screenshot" | "custom_eval";
  selector?: string;
  expected?: string | boolean;
  value?: string;
  name?: string;
}

export interface QAResult {
  passed: boolean;
  assertions: {
    assertion: QAAssertion;
    passed: boolean;
    actual?: unknown;
    error?: string;
  }[];
  consoleLogs: { type: string; text: string }[];
  pageTitle?: string;
  screenshotBase64?: string;
  sessionId?: string;
  replayEventsCount?: number;
  durationMs: number;
}

export interface AgentStepEvent {
  step: number;
  timestamp: string;
  phase: "plan" | "sandbox_code" | "sandbox_build" | "sandbox_preview" | "browser_qa" | "desktop_inspect" | "complete" | "error";
  action: string;
  details?: Record<string, unknown>;
  output?: string;
}

export interface AutonomousRunResult {
  taskId: string;
  task: string;
  success: boolean;
  steps: AgentStepEvent[];
  sandboxId?: string;
  previewUrl?: string;
  qaResult?: QAResult;
  desktopSessionId?: string;
  desktopStreamUrl?: string;
  replayEvents?: Array<Record<string, unknown>>;
  finalArtifact?: string;
  durationMs: number;
  error?: string;
}
