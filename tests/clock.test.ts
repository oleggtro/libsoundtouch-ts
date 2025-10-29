import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { ClockTimeFormat } from "../src/types.js";

const mockXML_clockDisplay = `<?xml version="1.0" encoding="UTF-8" ?>
<clockDisplay>
  <clockConfig timezoneInfo="America/Chicago" userEnable="false" timeFormat="TIME_FORMAT_12HOUR_ID" userOffsetMinute="0" brightnessLevel="70" userUtcTime="0" />
</clockDisplay>>`;

const mockXML_clockTime = `<?xml version="1.0" encoding="UTF-8" ?>
<clockTime utcTime="1701824606" cueMusic="0" timeFormat="TIME_FORMAT_12HOUR_ID" brightness="70" clockError="0" utcSyncTime="1701820350">
  <localTime year="2023" month="11" dayOfMonth="5" dayOfWeek="2" hour="19" minute="3" second="26" />
</clockTime>`;

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

  it("parses ClockDisplay response correctly", async () => {
    nock(baseURL)
      .get("/clockDisplay")
      .reply(200, mockXML_clockDisplay, { "Content-Type": "application/xml" });

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


    it("parses clockTime response correctly", async () => {
    nock(baseURL)
      .get("/clockTime")
      .reply(200, mockXML_clockTime, { "Content-Type": "application/xml" });

    const info = await api.getClockTime();

    expect(info).toMatchObject({
      clockTime: {
        utcTime: 1701824606,
        cueMusic: 0,
        timeFormat: ClockTimeFormat.h12,
        brightness: 70,
        clockError: 0,
        utcSyncTime: 1701820350,
        localTime: {
          year: 2023,
          month: 11,
          dayOfMonth: 5,
          dayOfWeek: 2,
          hour: 19,
          minute: 3,
          second: 26,
        },
      },
    });
  });
});
