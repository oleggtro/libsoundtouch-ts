import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { SoundTouchConfigurationStatus } from "../src/types.js";

const mockXML = `<?xml version="1.0" encoding="UTF-8" ?>
<DSPMonoStereo deviceID="1004567890AA">
  <mono enable="false" />
</DSPMonoStereo>`;

describe("SoundTouchAPI /DSPMonoStereo endpoint", () => {
  const baseURL = "http://localhost:8090";
  let api: SoundTouchApiClient;

  beforeEach(() => {
    api = new SoundTouchApiClient(baseURL);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("parses /DSPMonoStereo response correctly", async () => {
    nock(baseURL)
      .get("/DSPMonoStereo")
      .reply(200, mockXML, { "Content-Type": "application/xml" });

    const dsp = await api.getDSPMonoStereo();

    expect(dsp).toMatchObject({
      DSPMonoStereo: {
        deviceID: "1004567890AA",
        mono: {
            enable: false
        }
      }
    });
  });

});
