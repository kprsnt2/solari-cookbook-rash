# 🌲 Upstream Solari Cookbook Contribution Guide

Submitting your 4 new cookbook examples directly to the official [solari-sdk/solari-cookbook](https://github.com/solari-sdk/solari-cookbook) repository is one of the highest-visibility actions to put your work in front of **Harry Chow** and the **Pinetree/Solari core engineering team**.

---

## 📦 What We Are Contributing Upstream

The official `solari-sdk/solari-cookbook` welcomes self-contained examples that:
- Run in under 15 seconds
- Have zero unnecessary frameworks or boilerplate
- Highlight real developer gotchas in comments (e.g. `await solari.close()`, `sandbox.kill()`, `nohup` backgrounding)
- Are MIT licensed

We have prepared 4 production-ready TypeScript cookbook examples:

1. **`examples/autonomous-agent-ts`**: Full autonomous software engineer loop (Sandbox build ➔ port preview ➔ stealth browser Playwright assertions ➔ rrweb replay download).
2. **`examples/browser-fullstack-qa-ts`**: Anti-bot stealth mode bypass, US residential proxy egress verification, responsive viewports, and screenshot capture.
3. **`examples/sandbox-dynamic-compiler-ts`**: Isolated TypeScript compilation, Python AST analysis, and performance benchmarking inside microVM.
4. **`examples/solari-career-autopilot-ts`**: Real-world autonomous ATS job application agent with verified candidate credentials and rrweb audit logging.

---

## 🚀 Step-by-Step PR Submission Instructions

### Step 1: Open Pull Request on GitHub
Navigate directly to:
👉 **[https://github.com/solari-sdk/solari-cookbook/compare/main...kprsnt2:solari-cookbook-rash:main](https://github.com/solari-sdk/solari-cookbook/compare/main...kprsnt2:solari-cookbook-rash:main)**

### Step 2: Set the PR Title
```text
feat(examples): add autonomous agent, fullstack QA, dynamic compiler, and career autopilot TypeScript examples
```

### Step 3: Copy & Paste this PR Description:

```markdown
## Summary

This PR adds 4 new high-value TypeScript cookbook examples demonstrating advanced Solari primitives in real-world autonomous workflows:

1. **`examples/autonomous-agent-ts`**: Full autonomous software engineer loop (MicroVM sandbox build ➔ `sandbox.previewUrl` port exposure ➔ stealth browser Playwright assertions ➔ `solari.sessions.downloadReplay` rrweb download).
2. **`examples/browser-fullstack-qa-ts`**: Anti-bot stealth mode bypass (`stealth: true`), US residential proxy egress verification (`proxy: "us"`), multi-device responsive viewports (Desktop & Mobile iPhone 14), and screenshot capture.
3. **`examples/sandbox-dynamic-compiler-ts`**: Dynamic TypeScript matrix multiplication benchmarking, Python AST syntax tree extraction, and performance analysis inside an isolated microVM sandbox.
4. **`examples/solari-career-autopilot-ts`**: Real-world autonomous ATS job application agent (Greenhouse, Lever, ApplyToJob) with candidate credentials tailoring and `rrweb` DOM recording audit trails.

## Architectural Notes & Gotchas Handled
- Proper loopback proxy teardown via `await solari.close()` to prevent Node.js event loop hanging.
- Proper VM compute slot teardown via `await sandbox.kill()`.
- Non-blocking server startup using background `nohup` execution.
- All examples execute end-to-end in under 15 seconds.

## Live Showcase
- **Live Web Studio**: https://solari-cookbook-rash.vercel.app
- **Benchmarks**: https://github.com/kprsnt2/solari-cookbook-rash/blob/main/BENCHMARKS.md

Created with passion for the Pinetree / Solari ecosystem by @kprsnt2 (https://kprsnt.in).
```
