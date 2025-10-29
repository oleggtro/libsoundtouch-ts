// tests/integration/info.integration.test.ts
import { describe, it, expect } from "vitest";
import { SoundTouchApiClient } from "../../src/client.js";

describe.skipIf(!process.env.DEVICE_URL)("SoundTouch real integration", () => {
  it("fetches live /info data", async () => {
    const api = new SoundTouchApiClient(process.env.DEVICE_URL!);
    const info = await api.getInfo();

    expect(info.info.name).toMatch(/SoundTouch/);
  });
});
