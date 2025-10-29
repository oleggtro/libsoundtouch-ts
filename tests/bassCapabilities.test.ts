import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SoundTouchApiClient } from "../src/client.js";
import nock from "nock";

const mockXML = `<?xml version="1.0" encoding="UTF-8" ?>
<bassCapabilities deviceID="1004567890AA">
  <bassAvailable>true</bassAvailable>
  <bassMin>-9</bassMin>
  <bassMax>0</bassMax>
  <bassDefault>0</bassDefault>
</bassCapabilities>`;

describe("SoundTouchAPI /bassCapabilities endpoint", () => {
  const baseURL = "http://localhost:8090";
  let api: SoundTouchApiClient;

  beforeEach(() => {
    api = new SoundTouchApiClient(baseURL);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("parses XML response correctly", async () => {
    nock(baseURL)
      .get("/bassCapabilities")
      .reply(200, mockXML, { "Content-Type": "application/xml" });

    const bassCapabilities = await api.getBassCapabilities();

    expect(bassCapabilities).toMatchObject({
      bassCapabilities: {
        deviceID: "1004567890AA",
        bassAvailable: true,
        bassMin: -9,
        bassMax: 0,
        bassDefault: 0,
      },
    });
  });
});
