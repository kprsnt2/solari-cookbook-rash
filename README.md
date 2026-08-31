# Solari Cookbook & Flagship Autonomous AI Engineer

> **Flagship submission for the Pinetree Research $300K SWE Challenge**  
> Developed by **Prashanth** ([kprsnt.in](https://kprsnt.in) | [@kprsnt2](https://github.com/kprsnt2))  
> Evolved from **MyLocalCLI** (26 developer tools, 6 LLM providers) into cloud-native autonomous compute orchestration on [Solari](https://getsolari.com).

---

## ⚡ Overview

This repository houses the official **Solari Cookbook Examples** and the flagship **Solari-Agent**: a production-grade autonomous cloud software engineer and live verification platform that orchestrates all 3 Solari cloud primitives:

1. 🌲 **MicroVM Sandboxes** (`@solarisdk/sdk`): Root Linux microVM booted from memory snapshot in ~1s. Builds projects, runs tests, and exposes live dev servers via `sandbox.previewUrl(port)`.
2. 🌲 **Stealth Cloud Browsers** (`@solarisdk/browser`): Anti-bot stealth bypass with residential proxy egress. Executes automated Playwright QA assertions, collects console errors, and downloads deterministic `rrweb` DOM session recordings.
3. 🌲 **Cloud Desktops** (`@solarisdk/desktop`): Full X11 desktop environment with embeddable live VNC streams for computer-use inspection and human-in-the-loop debugging.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       SOLARI AUTONOMOUS AGENT                           │
│       (Claude 3.7 / GPT-4o / Gemini 2.5 / Groq / OpenRouter)            │
└────────────┬────────────────────────────┬───────────────────────────────┘
             │                            │                               │
             ▼                            ▼                               ▼
  ┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
  │   MICROVM SANDBOX    │     │   STEALTH BROWSER    │     │    CLOUD DESKTOP     │
  │   (@solarisdk/sdk)   │     │ (@solarisdk/browser) │     │ (@solarisdk/desktop) │
  │                      │     │                      │     │                      │
  │ • Instant root VM    │     │ • Anti-bot stealth   │     │ • X11 Desktop GUI    │
  │ • File read/write    │     │ • Residential proxy  │     │ • VNC Live Streaming │
  │ • Dynamic compiler   │     │ • Playwright QA      │     │ • Computer Use       │
  │ • Port 3000 Preview  │────▶│ • rrweb Replay NDJSON│     │ • App launch (code)  │
  └──────────────────────┘     └──────────────────────┘     └──────────────────────┘
             │                            │                               │
             └────────────────────────────┼───────────────────────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │        SOLARI WEB STUDIO UI           │
                      │  • Real-time Terminal Stream (WS)     │
                      │  • Embedded Live Preview iframe       │
                      │  • Playwright QA Assertion Cards      │
                      │  • rrweb DOM Replay Timeline Player   │
                      │  • Embedded VNC Live Video Stream     │
                      └───────────────────────────────────────┘
```

---

## 📂 Repository Workspace Structure

```
.
├── projects/
│   ├── solari-autonomous-engineer/   # Flagship autonomous agent, CLI & Web Studio
│   │   ├── src/
│   │   │   ├── agent/                # Multi-provider LLM tool calling orchestrator
│   │   │   ├── solari/               # Sandbox, Browser QA & Desktop wrappers
│   │   │   ├── web/                  # Express + WebSocket Web Studio server & UI
│   │   │   └── cli.ts                # Commander interactive CLI & benchmark suite
│   │   └── package.json
│   └── solari-mcp-server/            # Model Context Protocol (MCP) server
│       ├── src/index.ts              # Native MCP tools for Claude Desktop & Cursor
│       └── package.json
├── examples/
│   ├── autonomous-agent-ts/          # 🌟 NEW: End-to-end autonomous agent workflow
│   ├── browser-fullstack-qa-ts/      # 🌟 NEW: Stealth QA with proxy & rrweb replay
│   ├── sandbox-dynamic-compiler-ts/  # 🌟 NEW: Dynamic TS/Python compilation
│   ├── browser-quickstart-ts/        # Upstream quickstarts
│   ├── browser-quickstart-py/
│   ├── browser-stealth-proxy-ts/
│   ├── browser-profiles-ts/
│   ├── browser-session-recording-py/
│   ├── sandbox-quickstart-ts/
│   ├── sandbox-code-interpreter-py/
│   ├── sandbox-port-preview-ts/
│   └── desktop-computer-use-py/
├── LAUNCH.md                         # Social thread (X/LinkedIn) & launch campaign
├── package.json                      # Root workspace configuration
└── README.md
```

---

## 🚀 Quick Start

### 1. Installation

```bash
git clone https://github.com/solari-sdk/solari-cookbook.git
cd solari-cookbook
npm install
```

### 2. Run the Autonomous Engineer (CLI)

```bash
# Run a single task
npm run agent -- "Build a real-time Markdown live editor with word counter, start dev server on port 3000, and verify it with browser QA"

# Launch the interactive REPL
npm run agent -- interactive

# Run the benchmark evaluation suite
npm run agent -- eval
```

*Note: If `SOLARI_API_KEY` is unset, the agent seamlessly operates in **Deterministic High-Fidelity Simulation Mode** for local testing, benchmarking, and CI.*

### 3. Launch the Interactive Web Studio UI

```bash
npm run studio
# Open http://localhost:4200 in your browser
```

Features included in Web Studio:
- **Live Terminal**: Streams sandbox shell commands and compile steps in real time over WebSockets.
- **Port Preview**: Directly embeds the generated application iframe from `*.preview.getsolari.com`.
- **Browser QA Inspector**: Visual breakdown of Playwright UI assertions, console logs, and full-page screenshots.
- **rrweb Replay Player**: Inspects DOM-level recording events.
- **Cloud Desktop Stream**: Live VNC view for multi-modal computer use.

### 4. Connect Solari to Claude Desktop & Cursor via MCP

```bash
npm run mcp
```

Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "solari": {
      "command": "node",
      "args": ["<path-to-repo>/projects/solari-mcp-server/dist/index.js"],
      "env": {
        "SOLARI_API_KEY": "slr_live_..."
      }
    }
  }
}
```

Available MCP Tools:
- `solari_sandbox_exec`: Execute shell commands inside Linux microVM.
- `solari_sandbox_file_write` / `solari_sandbox_file_read`: Read/write files in microVM.
- `solari_sandbox_preview_port`: Expose microVM port to internet URL.
- `solari_browser_stealth_test`: Execute Playwright tests with stealth anti-bot bypass.
- `solari_desktop_launch`: Launch GUI applications on cloud desktop with VNC stream.

---

## 📚 Complete Cookbook Examples Matrix

| Category | Example | Language | Key Features Demonstrated |
| :--- | :--- | :--- | :--- |
| **Agent** | [autonomous-agent-ts](examples/autonomous-agent-ts) | TypeScript | Full autonomous cycle: Sandbox + Port Preview + Browser QA + rrweb replay |
| **Browser** | [browser-fullstack-qa-ts](examples/browser-fullstack-qa-ts) | TypeScript | Stealth mode, US residential proxy, multi-viewport QA, screenshot capture |
| **Browser** | [browser-quickstart-ts](examples/browser-quickstart-ts) | TypeScript | Cloud browser initialization, navigation, and teardown |
| **Browser** | [browser-quickstart-py](examples/browser-quickstart-py) | Python | Python async Playwright browser launch |
| **Browser** | [browser-stealth-proxy-ts](examples/browser-stealth-proxy-ts) | TypeScript | Fingerprint patching + residential egress IP verification |
| **Browser** | [browser-profiles-ts](examples/browser-profiles-ts) | TypeScript | Persistent authenticated browser profiles across sessions |
| **Browser** | [browser-session-recording-py](examples/browser-session-recording-py) | Python | Opt-in session recording and NDJSON replay download |
| **Sandbox** | [sandbox-dynamic-compiler-ts](examples/sandbox-dynamic-compiler-ts) | TypeScript | Dynamic TypeScript compilation, Python AST analysis, benchmarking |
| **Sandbox** | [sandbox-quickstart-ts](examples/sandbox-quickstart-ts) | TypeScript | Command execution and file operations in ~1s microVM |
| **Sandbox** | [sandbox-port-preview-ts](examples/sandbox-port-preview-ts) | TypeScript | Public port forwarding to `*.preview.getsolari.com` |
| **Sandbox** | [sandbox-code-interpreter-py](examples/sandbox-code-interpreter-py) | Python | Stateful Python REPL kernel for agent loops |
| **Desktop** | [desktop-computer-use-py](examples/desktop-computer-use-py) | Python | X11 Linux GUI, mouse click/type, screenshot, VNC stream |

---

## 💡 Key Architectural Decisions & SDK Gotchas

1. **Graceful Proxy Cleanup in Node.js**: The `@solarisdk/browser` client maintains a local loopback proxy handle for connection retries. You must always invoke `await solari.close()` in a `finally` block to allow Node.js event loops to exit cleanly.
2. **Session Recording Opt-In**: Passing `recording: true` is strictly required at session launch time; replay URLs are generated asynchronously ~1-3s after release.
3. **VM Lifecycle vs Channel**: Calling `sandbox.kill()` permanently destroys the remote microVM, whereas `sandbox.close()` only terminates the local WebSocket channel.
4. **Argv Array Safety**: Solari Sandbox commands accept `args: string[]` rather than shell strings by default. Pipes and shell expansions require wrapping via `run("sh", { args: ["-c", script] })`.

---

## 🔗 Links & Resources

- **Launch Announcement**: [LAUNCH.md](LAUNCH.md)
- **Author Portfolio**: [kprsnt.in](https://kprsnt.in)
- **Solari Documentation**: [docs.getsolari.com](https://docs.getsolari.com)
- **Solari Console**: [console.getsolari.com](https://console.getsolari.com)

---

## 📜 License

MIT License. Created by Prashanth (@kprsnt2) for the Pinetree Research / Solari Community.
