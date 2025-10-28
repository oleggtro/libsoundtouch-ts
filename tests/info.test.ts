import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchAPI } from "../src/index.js";

const mockXML = `<?xml version="1.0" encoding="UTF-8"?>
<info deviceID="606405FA8761">
  <name>SoundTouch 10 Küche</name>
  <type>SoundTouch 10</type>
  <countryCode>GB</countryCode>
</info>`;

describe("SoundTouchAPI /info endpoint", () => {
  const baseURL = "http://localhost:8090";
  let api: SoundTouchAPI;

  beforeEach(() => {
    api = new SoundTouchAPI(baseURL);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("parses XML response correctly", async () => {
    nock(baseURL)
      .get("/info")
      .reply(200, mockXML, { "Content-Type": "application/xml" });

    const info = await api.info.getInfo();

    expect(info).toMatchObject({
      info: {
        deviceID: "606405FA8761",
        name: "SoundTouch 10 Küche",
        type: "SoundTouch 10",
        countryCode: "GB",
      },
    });
  });
});
