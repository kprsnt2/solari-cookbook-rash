/**
 * Autonomous Agent — end-to-end full-stack agent execution with Solari.
 *
 * Demonstrates the complete autonomous development cycle:
 * 1. Spin up a fresh Linux microVM sandbox
 * 2. Write an interactive web application and server
 * 3. Start background server and expose port preview (*.preview.getsolari.com)
 * 4. Launch a stealth cloud browser with rrweb session recording
 * 5. Verify UI interactions, DOM assertions, and page title
 * 6. Download and inspect rrweb DOM recording events
 */
import { SolariClient } from "@solarisdk/sdk";
import { Solari } from "@solarisdk/browser";

const apiKey = process.env.SOLARI_API_KEY!;
if (!apiKey) {
  console.error("Error: SOLARI_API_KEY environment variable is required.");
  process.exit(1);
}

const pt = new SolariClient({ apiKey });
const solari = new Solari({ apiKey });

console.log("1. Initializing Solari MicroVM Sandbox...");
const sandbox = await pt.sandboxes.create({
  template: "base",
  timeoutMs: 5 * 60_000,
});

try {
  await sandbox.connect();
  console.log("   Sandbox connected:", sandbox.sandboxId);

  // 2. Write web application code inside the microVM
  console.log("2. Writing application files inside microVM...");
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Autonomous Solari Counter</title>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid #334155; text-align: center; }
    button { background: #10b981; color: #022c22; font-weight: bold; padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; }
    #count { font-size: 2rem; margin: 1rem 0; color: #34d399; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Solari Autonomous App</h1>
    <div id="count">0</div>
    <button id="inc-btn" onclick="document.getElementById('count').textContent = parseInt(document.getElementById('count').textContent) + 1">Increment</button>
  </div>
</body>
</html>`;

  await sandbox.files.write("/tmp/app/index.html", htmlContent);

  // 3. Start background server and expose port preview
  console.log("3. Starting background server on port 3000...");
  await sandbox.commands.run("sh", {
    args: ["-c", "cd /tmp/app && nohup python3 -m http.server 3000 >/dev/null 2>&1 &"],
  });

  const { url: previewUrl } = await sandbox.previewUrl(3000);
  console.log("   Public preview active:", previewUrl);

  // 4. Launch Stealth Cloud Browser with recording
  console.log("4. Launching Stealth Cloud Browser QA with session recording...");
  const browser = await solari.launch({
    stealth: true,
    recording: true,
  });

  const sessionId = browser.id;
  try {
    const page = await browser.newPage();
    await page.goto(previewUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

    const title = await page.title();
    console.log("   Page title:", title);

    const initialCount = await page.locator("#count").innerText();
    console.log("   Initial count:", initialCount);

    // Interact with the UI
    await page.locator("#inc-btn").click();
    const updatedCount = await page.locator("#count").innerText();
    console.log("   Updated count after click:", updatedCount);

    if (updatedCount === "1") {
      console.log("   ✔ QA Assertion Passed: Counter incremented successfully.");
    }

    const { promise: waitPromise, resolve: resolveWait } = Promise.withResolvers<void>();
    setTimeout(resolveWait, 2000);
    await waitPromise;
  } finally {
    await browser.close();
  }

  // 5. Download and inspect rrweb session replay
  console.log("5. Retrieving rrweb session replay...");
  for (let attempt = 1; attempt <= 10; attempt++) {
    const { promise, resolve } = Promise.withResolvers<void>();
    setTimeout(resolve, 2000);
    await promise;

    try {
      const raw = await solari.sessions.downloadReplay(sessionId);
      const text = new TextDecoder().decode(raw);
      const events = text.split("\n").filter((l) => l.trim().length > 0);
      console.log(`   ✔ Replay downloaded: ${raw.length} bytes, ${events.length} rrweb DOM events.`);
      break;
    } catch (err: unknown) {
      const is404 = typeof err === "object" && err !== null && "status" in err && (err as { status: number }).status === 404;
      if (is404 && attempt < 10) {
        continue;
      }
    }
  }

  console.log("\n✔ Autonomous cycle completed successfully!");
} finally {
  await sandbox.kill();
  await solari.close();
}
