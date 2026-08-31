import { describe, it, expect } from "vitest";
import { SandboxManager } from "./sandbox-manager.js";
import { BrowserQA } from "./browser-qa.js";
import { DesktopInspector } from "./desktop-inspector.js";
import { AutonomousEngineer } from "../agent/orchestrator.js";
import { CareerAutopilot, PRASHANTH_PROFILE, SAMPLE_LIVE_JOB_TARGETS } from "../career/career-autopilot.js";

describe("Solari SDK Wrappers Suite", () => {
  it("should create sandbox, write/read files, execute commands, and expose preview port", async () => {
    const sandbox = new SandboxManager("mock_key");
    const id = await sandbox.createSandboxSession();
    expect(id).toBeDefined();
    expect(typeof id).toBe("string");

    await sandbox.writeFile("/tmp/test.txt", "Hello Solari Sandbox");
    const content = await sandbox.readFile("/tmp/test.txt");
    expect(content).toBe("Hello Solari Sandbox");

    const execRes = await sandbox.execCommand("node", ["-e", "console.log(1+1)"]);
    expect(execRes.exitCode).toBe(0);

    const previewUrl = await sandbox.exposePort(3000, false);
    expect(previewUrl).toContain("preview.getsolari.com");
    expect(previewUrl).toContain("3000");

    await sandbox.destroy();
    expect(sandbox.id).toBeNull();
  });

  it("should launch BrowserQA, verify assertions, and extract rrweb replay events", async () => {
    const qa = new BrowserQA("mock_key");
    const sessionId = await qa.launchQABrowser({ stealth: true, recording: true });
    expect(sessionId).toBeDefined();

    const result = await qa.verifyLivePreview("https://preview.getsolari.com", [
      { type: "title", expected: "Solari" },
      { type: "element_text", selector: "#title", expected: "Solari" },
      { type: "element_visible", selector: "#app" },
      { type: "screenshot" },
    ]);

    expect(result.passed).toBe(true);
    expect(result.assertions.length).toBe(4);
    expect(result.screenshotBase64).toBeDefined();

    const replayEvents = await qa.extractSessionReplay(sessionId);
    expect(Array.isArray(replayEvents)).toBe(true);
    expect(replayEvents.length).toBeGreaterThan(0);

    await qa.cleanup();
  });

  it("should create DesktopInspector session, verify health, and capture screenshot", async () => {
    const desktop = new DesktopInspector("mock_key");
    const session = await desktop.createDesktopSession({ resolution: "1280x720" });

    expect(session.ready).toBe(true);
    expect(session.streamUrl).toContain("preview.getsolari.com");

    const isHealthy = await desktop.checkHealth();
    expect(isHealthy).toBe(true);

    const pid = await desktop.launchApp("code");
    expect(typeof pid).toBe("number");

    const screenshot = await desktop.captureScreenshot();
    expect(Buffer.isBuffer(screenshot)).toBe(true);
    expect(screenshot.length).toBeGreaterThan(0);

    await desktop.cleanup();
  });
});

describe("AutonomousEngineer Orchestrator Suite", () => {
  it("should execute complete autonomous engineering loop and generate all artifacts", async () => {
    const engineer = new AutonomousEngineer({ provider: "simulator" });
    const result = await engineer.runTask("Build Markdown editor and test with browser QA");

    expect(result.success).toBe(true);
    expect(result.steps.length).toBeGreaterThan(3);
    expect(result.previewUrl).toContain("preview.getsolari.com");
    expect(result.qaResult).toBeDefined();
    expect(result.qaResult?.passed).toBe(true);
    expect(result.desktopStreamUrl).toBeDefined();
    expect(result.replayEvents).toBeDefined();
    expect(result.replayEvents?.length).toBeGreaterThan(0);
    expect(result.finalArtifact).toContain("Deployment Report");
  });
});

describe("CareerAutopilot Suite", () => {
  it("should evaluate candidate profile, tailor application in sandbox, and simulate stealth browser submission", async () => {
    const autopilot = new CareerAutopilot("mock_key", PRASHANTH_PROFILE);
    const result = await autopilot.applyToJob(SAMPLE_LIVE_JOB_TARGETS[0], true);

    expect(result.jobId).toBe(SAMPLE_LIVE_JOB_TARGETS[0].id);
    expect(result.status).toBe("dry_run_passed");
    expect(result.tailoredAnswers.fullName).toBe("Prashanth Kumar Kadasi");
    expect(result.tailoredAnswers.portfolio).toBe("https://kprsnt.in");
    expect(result.rrwebEventsCount).toBeGreaterThan(0);
  });
});
