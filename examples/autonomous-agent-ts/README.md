# Solari Autonomous Agent (TypeScript)

A complete end-to-end example demonstrating how an autonomous AI software engineer uses Solari to:
1. Initialize a root Linux microVM sandbox
2. Write application code and backend HTTP server
3. Expose port 3000 to a public URL via `sandbox.previewUrl(3000)`
4. Launch a stealth Cloud Browser with `recording: true`
5. Execute end-to-end user actions and assertions using Playwright
6. Download and inspect the resulting `rrweb` DOM session recording

## Setup & Run

```bash
cp .env.example .env
# Add your SOLARI_API_KEY
npm install
npm start
```
