import { describe, it, expect } from "vitest";
import { SolariClient } from "@solarisdk/sdk";
import { Solari } from "@solarisdk/browser";

describe("Solari MCP Server Tools Suite", () => {
  it("should initialize Solari SDK and Browser clients properly", () => {
    const client = new SolariClient({ apiKey: "mock_key" });
    expect(client).toBeDefined();
    expect(client.sandboxes).toBeDefined();
    expect(client.desktops).toBeDefined();

    const browser = new Solari({ apiKey: "mock_key" });
    expect(browser).toBeDefined();
    expect(browser.sessions).toBeDefined();
  });
});
