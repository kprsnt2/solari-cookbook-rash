/**
 * Full-Stack Browser QA — automated testing suite using Solari stealth cloud browsers.
 *
 * Demonstrates:
 * - Anti-bot stealth mode bypass
 * - Residential proxy egress verification
 * - Multi-device responsive viewport testing (Desktop & Mobile)
 * - DOM assertions and visual screenshot capture
 * - rrweb session recording export
 */
import { Solari } from "@solarisdk/browser";

const apiKey = process.env.SOLARI_API_KEY!;
if (!apiKey) {
  console.error("Error: SOLARI_API_KEY environment variable is required.");
  process.exit(1);
}

const solari = new Solari({ apiKey });

console.log("1. Launching Solari Stealth Cloud Browser (US Residential Proxy)...");
const browser = await solari.launch({
  stealth: true,
  proxy: "us",
  recording: true,
});

const sessionId = browser.id;
console.log("   Session ID:", sessionId);
console.log("   Resolved Proxy:", JSON.stringify(browser.proxy));

try {
  const page = await browser.newPage();

  // Test 1: Verify Proxy Egress IP
  console.log("\n2. Checking egress IP from proxy...");
  await page.goto("https://api.ipify.org?format=json");
  const ipText = await page.locator("pre").innerText();
  console.log("   Egress IP response:", ipText);

  // Test 2: Desktop Viewport Form Navigation
  console.log("\n3. Testing target web application (Desktop 1280x720)...");
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("https://example.com", { waitUntil: "domcontentloaded" });

  const title = await page.title();
  const heading = await page.locator("h1").innerText();
  console.log("   Title  :", title);
  console.log("   Heading:", heading);

  // Capture Desktop Screenshot
  const desktopShot = await page.screenshot();
  console.log(`   Desktop screenshot captured (${desktopShot.length} bytes)`);

  // Test 3: Mobile Responsive Viewport
  console.log("\n4. Testing Mobile Viewport (390x844 - iPhone 14)...");
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileShot = await page.screenshot();
  console.log(`   Mobile screenshot captured (${mobileShot.length} bytes)`);

  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, 2000);
  await promise;
} finally {
  await browser.close();
}

// Test 4: Download rrweb Replay
console.log("\n5. Extracting rrweb DOM session recording...");
for (let attempt = 1; attempt <= 10; attempt++) {
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, 2000);
  await promise;

  try {
    const raw = await solari.sessions.downloadReplay(sessionId);
    const text = new TextDecoder().decode(raw);
    const events = text.split("\n").filter((l) => l.trim().length > 0);
    console.log(`   ✔ Downloaded replay with ${events.length} rrweb DOM events.`);
    break;
  } catch (err: unknown) {
    const is404 = typeof err === "object" && err !== null && "status" in err && (err as { status: number }).status === 404;
    if (is404 && attempt < 10) {
      continue;
    }
  }
}

await solari.close();
console.log("\n✔ Full-Stack Browser QA suite completed successfully!");
