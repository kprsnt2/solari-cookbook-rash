# 🚀 LAUNCH: Solari-Agent — Autonomous Cloud AI Software Engineer & Live Verification Platform

Built by **Prashanth Kumar Kadasi** ([kprsnt.in](https://kprsnt.in) | [@kprsnt2](https://github.com/kprsnt2)) for the **Pinetree Research $300K SWE Challenge**.

---

## 🐦 X (Twitter) Launch Thread (Ready to Post)

### Tweet 1 (The Hook) 🧵
> Building autonomous AI engineers is broken: local execution destroys machines, datacenter browsers get blocked by anti-bot systems, and computer-use agents lack live visibility.
>
> Today, I'm open-sourcing **Solari-Agent**: an Autonomous Cloud Software Engineer powered by @getsolari's 3 cloud primitives: MicroVM Sandboxes, Stealth Cloud Browsers, and Cloud Desktops.
>
> 🌐 Live Web Studio: https://solari-cookbook-rash.vercel.app  
> 🔗 Code: https://github.com/kprsnt2/solari-cookbook-rash  
>
> CC @harrychow_ #AI #Solari #BuildInPublic

---

### Tweet 2 (The Evolution: From MyLocalCLI to Cloud-Native)
> Over the past year building **MyLocalCLI** (26 developer tools, 6 LLM providers) and fine-tuning **BrandXY (20B LLM with +51% safety steering)** on https://kprsnt.in, I realized agents hit a wall when validating their own code:
>
> ❌ Running untrusted code locally is dangerous  
> ❌ Datacenter browsers fail Cloudflare / Turnstile  
> ❌ Headless testing misses responsive DOM layout bugs  
> 
> Solari fixes all three with instant cloud compute primitives.

---

### Tweet 3 (The 3 Cloud Primitives in Action)
> Here is how Solari-Agent unifies Solari:
>
> 1️⃣ **MicroVM Sandboxes** (`@solarisdk/sdk`): Boots clean root Linux VMs in ~920ms from memory snapshots. Compiles code and exposes instant public URLs via `sandbox.previewUrl(port)`.
>
> 2️⃣ **Stealth Browsers** (`@solarisdk/browser`): Anti-bot stealth + US residential proxies + Playwright assertions. Captures DOM-level `rrweb` replays (182× smaller than MP4).
>
> 3️⃣ **Cloud Desktops** (`@solarisdk/desktop`): X11 GUI with live embeddable VNC streams for human review and computer-use debugging.

---

### Tweet 4 (Architecture Diagram)
> ```text
> ┌─────────────────────────────────────────────────────────────┐
> │                 SOLARI AUTONOMOUS AGENT                     │
> │     (Claude 3.7 / GPT-5.4-mini / Gemini 2.5 / Groq / OpenAI) │
> └──────┬───────────────────────┬───────────────────────┬──────┘
>        │                       │                       │
>        ▼                       ▼                       ▼
> ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
> │   SANDBOX    │       │   BROWSER    │       │   DESKTOP    │
> │   MicroVM    │       │   Stealth    │       │   X11 GUI    │
> │  (~920ms)    │       │  (Anti-Bot)  │       │  (VNC Live)  │
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

### Tweet 5 (Real-World Case: CareerOps Autopilot)
> We built a real-world flagship workflow: **CareerOps Autopilot** (`npm run career`)!
>
> • Evaluates AI Engineer roles (Greenhouse, Lever, ApplyToJob)  
> • MicroVM dynamically compiles tailored resumes addressing skill gaps  
> • Stealth Browser bypasses anti-bot checks to fill application forms  
> • Captures `rrweb` DOM recordings as verifiable proof of submission! 🎯

---

### Tweet 6 (Model Context Protocol / MCP Server)
> We also released `@solari/mcp-server` to connect Solari directly to **Claude Desktop**, **Claude Code**, and **Cursor**!
>
> Exposes 6 native MCP tools:
> • `solari_sandbox_exec`  
> • `solari_sandbox_file_write` / `file_read`  
> • `solari_sandbox_preview_port`  
> • `solari_browser_stealth_test`  
> • `solari_desktop_launch`  

---

### Tweet 7 (Try it Live & Upstream Cookbook)
> Try the live Web Studio, inspect the benchmarks, or fork the repository:
>
> 🌐 **Live Web Studio**: https://solari-cookbook-rash.vercel.app  
> 🔗 **GitHub Fork**: https://github.com/kprsnt2/solari-cookbook-rash  
> 📊 **Benchmarks**: Sub-second boot, 100% CreepJS score, 182x smaller replays  
> 👨‍💻 **Portfolio**: https://kprsnt.in  
>
> Huge thanks to @harrychow_ and the @getsolari team for building the future of cloud computing for AI agents! 🌲🚀

---

## 💼 LinkedIn Post (Ready to Publish)

```text
🚀 Announcing Solari-Agent: Autonomous Cloud AI Software Engineer & Live Verification Platform

I am excited to open-source Solari-Agent, a production-grade autonomous cloud software engineer that unifies all 3 Solari cloud primitives (MicroVM Sandboxes, Stealth Cloud Browsers, and Cloud Desktops) into a single autonomous loop.

Over the past year building MyLocalCLI (26 developer tools, 6 LLM providers) and fine-tuning BrandXY (20B LLM on brand alignment research), I found that agents hit a wall when testing their own code:
1. Running untrusted code on local machines is dangerous.
2. Datacenter-based headless browsers get blocked by Cloudflare/Turnstile anti-bot systems.
3. Agents cannot visually inspect or live-stream desktop applications during computer-use tasks.

Solari-Agent solves this by orchestrating Solari's cloud infrastructure:

🌲 1. MicroVM Sandboxes (@solarisdk/sdk)
Instantaneous root Linux VM provisioned in ~920ms from memory snapshots. Solari-Agent writes code, compiles projects, starts background servers, and exposes them instantly on public URLs (*.preview.getsolari.com).

🌲 2. Stealth Cloud Browsers (@solarisdk/browser)
Runs full Playwright browser tests with US residential proxy routing and anti-bot stealth bypass (100% CreepJS trust score). It validates DOM elements, clicks buttons, tests responsive viewports, and downloads deterministic rrweb DOM session recordings (182× smaller than MP4 video).

🌲 3. Cloud Desktops (@solarisdk/desktop)
Launches full X11 desktop environments with live embeddable VNC streams for real-time human observation and computer-use actions.

🌟 Real-World Flagship: CareerOps Autopilot
We also integrated an autonomous job application copilot (`npm run career`) that takes candidate credentials, tailors application materials inside a microVM sandbox, and uses stealth browsers to navigate Greenhouse, Lever, and ApplyToJob portals with rrweb session recording audit trails.

Additionally contributed:
• @solari/mcp-server: Model Context Protocol server exposing Solari to Claude Desktop & Cursor.
• Interactive Web Studio: Live real-time dashboard with terminal streaming, iframe previews, and rrweb replay player.
• 4 New TypeScript Cookbook Quickstarts.

🌐 Live Web Studio: https://solari-cookbook-rash.vercel.app
🔗 GitHub Repository: https://github.com/kprsnt2/solari-cookbook-rash
📊 Performance Benchmarks: https://github.com/kprsnt2/solari-cookbook-rash/blob/main/BENCHMARKS.md
👨‍💻 Portfolio & Projects: https://kprsnt.in

Special thanks to Harry Chow (@harrychow_) and the team at Pinetree / Solari (@getsolari)!

#ArtificialIntelligence #CloudComputing #SoftwareEngineering #Solari #Playwright #MCP #OpenSource #Pinetree
```
