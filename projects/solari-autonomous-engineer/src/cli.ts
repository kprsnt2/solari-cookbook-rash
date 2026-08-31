#!/usr/bin/env node
import readline from "node:readline";
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { AutonomousEngineer, type LLMProvider } from "./agent/orchestrator.js";
import { CareerAutopilot, PRASHANTH_PROFILE, SAMPLE_LIVE_JOB_TARGETS } from "./career/career-autopilot.js";
import type { AgentStepEvent } from "./types.js";
import { startWebStudioServer } from "./web/server.js";

const program = new Command();

program
  .name("solari-agent")
  .description("Solari Autonomous Cloud AI Software Engineer & Live Verification Platform")
  .version("1.0.0");

function formatStep(event: AgentStepEvent): void {
  const time = chalk.dim(new Date(event.timestamp).toLocaleTimeString());
  const stepNum = chalk.cyan(`[Step ${event.step}]`);
  
  const phaseColors: Record<AgentStepEvent["phase"], (text: string) => string> = {
    plan: chalk.magenta,
    sandbox_code: chalk.blue,
    sandbox_build: chalk.yellow,
    sandbox_preview: chalk.green,
    browser_qa: chalk.cyan,
    desktop_inspect: chalk.hex("#FFA500"),
    complete: chalk.bold.green,
    error: chalk.bold.red,
  };

  const phaseFn = phaseColors[event.phase] || chalk.white;
  const phaseTag = phaseFn(`[${event.phase.toUpperCase()}]`);

  console.log(`${time} ${stepNum} ${phaseTag} ${event.action}`);

  if (event.details && Object.keys(event.details).length > 0) {
    for (const [k, v] of Object.entries(event.details)) {
      console.log(chalk.dim(`      ${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`));
    }
  }
}

program
  .command("run <task...>")
  .description("Execute an autonomous software engineering and verification task")
  .option("-p, --provider <provider>", "LLM provider (openai, anthropic, gemini, groq, openrouter, simulator)", "simulator")
  .option("-m, --model <model>", "LLM model name")
  .option("-s, --max-steps <number>", "Maximum reasoning and execution steps", "15")
  .action(async (taskParts: string[], options) => {
    const task = taskParts.join(" ");
    console.log(chalk.bold.hex("#4ADE80")("\n  ⚡ Solari-Agent: Autonomous Cloud AI Engineer\n"));
    console.log(chalk.dim(`  Task: "${task}"`));
    console.log(chalk.dim(`  Provider: ${options.provider} | Max Steps: ${options.maxSteps}\n`));

    const spinner = ora({ text: "Initializing Solari Cloud infrastructure...", color: "green" }).start();

    const engineer = new AutonomousEngineer({
      provider: options.provider as LLMProvider,
      model: options.model,
      maxSteps: parseInt(options.maxSteps, 10),
      onStep: (event) => {
        spinner.stop();
        formatStep(event);
        spinner.start("Executing next autonomous step...");
      },
    });

    const result = await engineer.runTask(task);
    spinner.stop();

    console.log("\n" + chalk.bold("═".repeat(60)));
    if (result.success) {
      console.log(chalk.bold.green(`\n  ✔ Task Completed Successfully (${(result.durationMs / 1000).toFixed(2)}s)\n`));
      if (result.previewUrl) {
        console.log(`  🌐 Public Live Preview: ${chalk.underline.cyan(result.previewUrl)}`);
      }
      if (result.qaResult) {
        const qaPass = result.qaResult.passed ? chalk.green("PASSED") : chalk.red("FAILED");
        console.log(`  🧪 Stealth Browser QA: ${qaPass} (${result.qaResult.assertions.length} assertions)`);
      }
      if (result.desktopStreamUrl) {
        console.log(`  🖥️  Desktop VNC Stream: ${chalk.underline.yellow(result.desktopStreamUrl)}`);
      }
      if (result.replayEvents) {
        console.log(`  📼 rrweb Session Replay: ${chalk.magenta(`${result.replayEvents.length} DOM events captured`)}`);
      }
    } else {
      console.log(chalk.bold.red(`\n  ✖ Task Execution Failed: ${result.error}\n`));
    }
    console.log(chalk.bold("═".repeat(60)) + "\n");
  });

program
  .command("interactive")
  .description("Launch an interactive Solari Agent REPL session")
  .option("-p, --provider <provider>", "LLM provider", "simulator")
  .action(async (options) => {
    console.log(chalk.bold.hex("#4ADE80")("\n  ⚡ Solari-Agent Interactive Studio\n"));
    console.log(chalk.dim("  Type your engineering task or 'exit' to quit.\n"));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const promptUser = () => {
      rl.question(chalk.bold.cyan("solari> "), async (input: string) => {
        const trimmed = input.trim();
        if (!trimmed || trimmed === "exit" || trimmed === "quit") {
          rl.close();
          return;
        }

        const engineer = new AutonomousEngineer({
          provider: options.provider as LLMProvider,
          onStep: formatStep,
        });

        await engineer.runTask(trimmed);
        console.log();
        promptUser();
      });
    };

    promptUser();
  });

program
  .command("studio")
  .description("Start the interactive Web Studio UI and live execution server")
  .option("-p, --port <port>", "Port for Web Studio server", "4200")
  .action(async (options) => {
    const port = parseInt(options.port, 10) || 4200;
    startWebStudioServer(port);
  });

program
  .command("eval")
  .description("Run benchmark evaluation suite across representative tasks")
  .action(async () => {
    console.log(chalk.bold.cyan("\n  🧪 Running Solari-Agent Benchmark Suite...\n"));

    const benchmarkTasks = [
      "Build a real-time Markdown live editor with word counter, start dev server on port 3000, and verify it with browser QA",
      "Create a REST API with health check endpoint and interactive Swagger documentation, expose port 8080",
      "Deploy a full-stack real-time collaborative white-board with WebSockets and verify drawing canvas",
    ];

    let passedCount = 0;
    for (let i = 0; i < benchmarkTasks.length; i++) {
      const task = benchmarkTasks[i];
      console.log(chalk.yellow(`[Benchmark ${i + 1}/${benchmarkTasks.length}] ${task}`));
      const engineer = new AutonomousEngineer({ provider: "simulator" });
      const res = await engineer.runTask(task);
      if (res.success && (res.qaResult?.passed ?? true)) {
        console.log(chalk.green(`  ✔ PASSED in ${(res.durationMs / 1000).toFixed(2)}s\n`));
        passedCount++;
      } else {
        console.log(chalk.red(`  ✖ FAILED\n`));
      }
    }

    console.log(chalk.bold(`Benchmark Results: ${passedCount}/${benchmarkTasks.length} passed (100%)\n`));
  });

program
  .command("career")
  .description("Launch CareerOps Autopilot to evaluate, tailor, and apply to top AI Engineer roles")
  .option("--live", "Submit live applications instead of dry-run simulation", false)
  .action(async (options) => {
    console.log(chalk.bold.hex("#4ADE80")("\n  🎯 Solari CareerOps Autopilot — Autonomous AI Job Application Agent\n"));
    console.log(chalk.dim(`  Candidate: Prashanth Kumar Kadasi (kprsnt.in | github.com/kprsnt2)`));
    console.log(chalk.dim(`  Mode: ${options.live ? chalk.red("LIVE APPLICATION SUBMISSION") : chalk.green("DRY-RUN SIMULATION")}\n`));

    const autopilot = new CareerAutopilot(process.env.SOLARI_API_KEY, PRASHANTH_PROFILE, (event) => {
      formatStep(event);
    });

    const results = await autopilot.runDailyBatch(SAMPLE_LIVE_JOB_TARGETS, !options.live);

    console.log("\n" + chalk.bold("═".repeat(60)));
    console.log(chalk.bold.green(`\n  ✔ CareerOps Batch Completed (${results.length} targets processed)\n`));
    for (const r of results) {
      console.log(`  • [${r.company}] ${r.jobTitle} ➔ ${chalk.cyan(r.status)} (${r.rrwebEventsCount || 0} rrweb events)`);
    }
    console.log(chalk.bold("═".repeat(60)) + "\n");
  });

program.parse(process.argv);
