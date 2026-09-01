# 🌲 Upstream Solari Cookbook Contribution Guide

Submitting your 4 new cookbook examples directly to the official [solari-sdk/solari-cookbook](https://github.com/solari-sdk/solari-cookbook) repository is one of the highest-visibility actions to put your work in front of **Harry Chow** and the **Pinetree/Solari core engineering team**.

---

## 📦 What to Submit Upstream

The official `solari-sdk/solari-cookbook` welcomes self-contained examples that:
- Run in under 1 minute
- Have zero unnecessary frameworks or boilerplate
- Highlight real developer gotchas in comments
- Are MIT licensed

We have prepared 4 production-ready examples ready for upstream contribution:

1. **`examples/autonomous-agent-ts`**: End-to-end full-stack agent cycle (Sandbox + Port Preview + Browser QA + rrweb replay).
2. **`examples/browser-fullstack-qa-ts`**: Stealth mode, US residential proxy validation, responsive multi-viewport testing.
3. **`examples/sandbox-dynamic-compiler-ts`**: Isolated TypeScript compilation & Python AST analysis in microVM.
4. **`examples/solari-career-autopilot-ts`**: Autonomous ATS job application form filler with `rrweb` audit replay.

---

## 🚀 Step-by-Step PR Submission Instructions

### Step 1: Push branch to your GitHub fork
```bash
git checkout -b feat/flagship-cookbook-examples
git push origin feat/flagship-cookbook-examples
```

### Step 2: Open Pull Request on GitHub
Navigate to:
`https://github.com/solari-sdk/solari-cookbook/compare/main...kprsnt2:solari-autonomous-platform-v2:main`

### Step 3: Copy & Paste this PR Description:

```markdown
## Summary

This PR adds 4 new high-value TypeScript cookbook examples demonstrating advanced Solari primitives in real-world autonomous workflows:

1. **`examples/autonomous-agent-ts`**: Full autonomous software engineer loop (Sandbox build ➔ port preview ➔ stealth browser Playwright assertions ➔ rrweb replay download).
2. **`examples/browser-fullstack-qa-ts`**: Anti-bot stealth mode bypass, US residential proxy egress verification, responsive viewports, and screenshot capture.
3. **`examples/sandbox-dynamic-compiler-ts`**: Isolated TypeScript compilation, Python AST analysis, and performance benchmarking inside microVM.
4. **`examples/solari-career-autopilot-ts`**: Real-world autonomous ATS job application agent with verified candidate credentials and rrweb audit logging.

## Verification
- All examples verified against `@solarisdk/sdk` (0.1.2) and `@solarisdk/browser` (0.1.1).
- Includes graceful loopback proxy teardown via `await solari.close()`.
- Includes sandbox lifecycle management via `await sandbox.kill()`.
- Run time for each example is under 15 seconds.

Created with passion for the Pinetree / Solari ecosystem by @kprsnt2 (https://kprsnt.in).
```
