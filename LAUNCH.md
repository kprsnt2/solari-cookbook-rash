# 🚀 LAUNCH: Solari-Agent — Autonomous Cloud AI Software Engineer & Live Verification Platform

Built by **Prashanth** ([kprsnt.in](https://kprsnt.in) | [@kprsnt2](https://github.com/kprsnt2)) for the **Pinetree Research $300K SWE Challenge**.

---

## 🐦 X (Twitter) Launch Thread

### Tweet 1 (The Hook) 🧵
> Building autonomous software engineers is hard because local execution is dangerous, headful browsers leak fingerprints, and computer-use agents lack live visibility.
>
> Today, I'm open-sourcing **Solari-Agent**: an Autonomous Cloud AI Software Engineer powered by @getsolari's 3 cloud primitives: MicroVM Sandboxes, Stealth Cloud Browsers, and Cloud Desktops.
>
> Live preview, DOM assertions, rrweb replays, and VNC streaming in ONE unified pipeline. 👇
>
> CC @harrychow_ #AI #Solari #BuildInPublic

---

### Tweet 2 (The Problem & Evolution)
> Over the past year building **MyLocalCLI** (26 developer tools, 6 LLM providers), I realized agents hit a wall when validating their own code:
>
> ❌ Running untrusted code locally destroys machines  
> ❌ Datacenter browsers get flagged by anti-bot systems  
> ❌ Headless testing misses responsive DOM layout bugs  
> 
> Solari fixes all three with instantaneous cloud compute primitives.

---

### Tweet 3 (The 3 Cloud Primitives Unified)
> Here is how Solari-Agent orchestrates Solari:
>
> 1️⃣ **MicroVM Sandboxes** (`@solarisdk/sdk`): Boots clean Linux VM in ~1s from memory snapshot. Writes code, starts servers, and exposes instant public URLs via `sandbox.previewUrl(port)`.
>
> 2️⃣ **Stealth Browsers** (`@solarisdk/browser`): Anti-bot stealth + US residential proxy + Playwright assertions. Captures DOM-level `rrweb` replay events.
>
> 3️⃣ **Cloud Desktops** (`@solarisdk/desktop`): X11 GUI with live embeddable VNC streams for computer-use inspection.

---

### Tweet 4 (Architecture Diagram)
> ```
> ┌─────────────────────────────────────────────────────────────┐
> │                 SOLARI AUTONOMOUS AGENT                     │
> │     (Claude 3.7 / GPT-4o / Gemini 2.5 / Groq / OpenRouter)  │
> └──────┬───────────────────────┬───────────────────────┬──────┘
>        │                       │                       │
>        ▼                       ▼                       ▼
> ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
> │   SANDBOX    │       │   BROWSER    │       │   DESKTOP    │
> │   MicroVM    │       │   Stealth    │       │   X11 GUI    │
> │  (~1s boot)  │       │  (Anti-Bot)  │       │  (VNC Live)  │
> ├──────────────┤       ├──────────────┤       ├──────────────┤
> │ • Code/Build │       │ • Playwright │       │ • VS Code    │
> │ • Port 3000  │──────▶│ • Assertions │       │ • Chrome     │
> │   Preview    │       │ • rrweb Rec  │       │ • Mouse/Key  │
> └──────────────┘       └──────────────┘       └──────────────┘
>        │                       │                       │
>        └───────────────────────┴───────────────────────┘
>                                │
>                                ▼
>                 ┌─────────────────────────────┐
>                 │   SOLARI WEB STUDIO UI      │
>                 │ (Terminal + Preview + VNC)  │
>                 └─────────────────────────────┘
> ```

---

### Tweet 5 (Production Model Context Protocol / MCP)
> We also built `@solari/mcp-server` so you can connect Solari directly to **Claude Desktop**, **Claude Code**, and **Cursor**!
>
> Exposes 6 native MCP tools:
> • `solari_sandbox_exec`
> • `solari_sandbox_file_write` / `file_read`
> • `solari_sandbox_preview_port`
> • `solari_browser_stealth_test`
> • `solari_desktop_launch`
>
> Now any LLM can spin up cloud microVMs on demand.

---

### Tweet 6 (Web Studio & Interactive CLI)
> Included in the repository:
> ⚡ **Web Studio UI**: Dark-mode Tailwind dashboard streaming live sandbox terminals, embedded port previews, Playwright QA cards, and rrweb replay timeline.
> 💻 **CLI & REPL**: `npx solari-agent run "<task>"` or `npx solari-agent interactive`.
> 🧪 **Full Test Suite & Simulator**: Deterministic offline simulation mode when no API keys are supplied!

---

### Tweet 7 (Open Source & Links)
> Fork the repo and start building with Solari today:
>
> 🔗 **Repository**: https://github.com/solari-sdk/solari-cookbook
> 🌐 **Portfolio & Architecture**: https://kprsnt.in
> 📦 **SDKs**: `@solarisdk/sdk` & `@solarisdk/browser`
>
> Huge thanks to @harrychow_ and the @getsolari team for building the future of cloud computing for AI agents! 🌲🚀

---

## 💼 LinkedIn Post

```
🚀 Announcing Solari-Agent: Autonomous Cloud AI Software Engineer & Live Verification Platform

I am excited to release Solari-Agent, an autonomous AI software engineer that leverages Solari's cloud infrastructure to solve the fundamental problems of code generation, safety, and live verification.

Traditional software agents face major hurdles:
1. Running untrusted code on local developer machines is a security risk.
2. Datacenter-based headless browsers get blocked by anti-bot systems.
3. Agents cannot visually inspect or live-stream desktop applications during computer-use tasks.

Solari-Agent bridges this gap by unifying all 3 Solari primitives behind an autonomous multi-provider LLM loop:

🌲 1. MicroVM Sandboxes (@solarisdk/sdk)
Instantaneous root Linux VM provisioned from memory snapshots in ~1 second. Solari-Agent writes code, compiles projects, starts background servers, and exposes them instantly on public URLs (*.preview.getsolari.com).

🌲 2. Stealth Cloud Browsers (@solarisdk/browser)
Runs full Playwright browser tests with residential proxy routing and anti-bot stealth bypass. It validates DOM elements, clicks buttons, tests responsive viewports, and downloads deterministic rrweb DOM session recordings for auditability.

🌲 3. Cloud Desktops (@solarisdk/desktop)
Launches full X11 desktop environments with live embeddable VNC streams for real-time human observation and computer-use actions.

Additionally, we have contributed:
• @solari/mcp-server: Model Context Protocol server exposing Solari to Claude Desktop and Cursor.
• Interactive Web Studio: Real-time dashboard with terminal streaming, iframe previews, and rrweb event timeline.
• 3 New Solari Cookbook Quickstarts.

🔗 Explore the code on GitHub: https://github.com/solari-sdk/solari-cookbook
Special thanks to Harry Chow (@harrychow_) and the team at Pinetree / Solari (@getsolari)!

#ArtificialIntelligence #CloudComputing #SoftwareEngineering #Solari #MCP #OpenSource
```
