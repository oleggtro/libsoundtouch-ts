import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";

const mockXML = `<?xml version="1.0" encoding="UTF-8" ?>
<clockDisplay>
  <clockConfig timezoneInfo="America/Chicago" userEnable="false" timeFormat="TIME_FORMAT_12HOUR_ID" userOffsetMinute="0" brightnessLevel="70" userUtcTime="0" />
</clockDisplay>>`;

describe("SoundTouchAPI /clockDisplay endpoint", () => {
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
      .get("/clockDisplay")
      .reply(200, mockXML, { "Content-Type": "application/xml" });

    const info = await api.getClockDisplay();

    expect(info).toMatchObject({
      clockDisplay: {
        clockConfig: {
          timezoneInfo: "America/Chicago",
          userEnable: false,
          timeFormat: "TIME_FORMAT_12HOUR_ID",
          userOffsetMinute: 0,
          brightnessLevel: 70,
          userUtcTime: 0,
        },
      },
    });
  });
});
