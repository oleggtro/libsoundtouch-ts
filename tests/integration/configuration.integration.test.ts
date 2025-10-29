// tests/integration/info.integration.test.ts
import { describe, it, expect } from "vitest";
import { SoundTouchApiClient } from "../../src/client.js";
import { SoundTouchConfigurationStatus } from "../../src/types.js";

describe.skipIf(!process.env.DEVICE_URL)("SoundTouch real integration", () => {
  it("fetches live configuration data", async () => {
    const api = new SoundTouchApiClient(process.env.DEVICE_URL!);
    const state = await api.getConfigurationStatus();

    // The parser used by the client exposes XML attributes as plain properties (e.g. `status`).
    // Use deep equality (toEqual / toMatchObject) rather than `toBe` which checks reference identity.
    expect(state).toMatchObject({
      SoundTouchConfigurationStatus: { status: SoundTouchConfigurationStatus.Configured },
    });
  });
});
