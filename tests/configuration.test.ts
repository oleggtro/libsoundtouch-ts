import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { SoundTouchConfigurationStatus } from "../src/types.js";

const mockXML = `<?xml version="1.0" encoding="UTF-8" ?>
<SoundTouchConfigurationStatus status="SOUNDTOUCH_CONFIGURED" />`;

describe("SoundTouchAPI /soundTouchConfigurationStatus endpoint", () => {
  const baseURL = "http://localhost:8090";
  let api: SoundTouchApiClient;

  beforeEach(() => {
    api = new SoundTouchApiClient(baseURL);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("parses SoundTouchConfigurationStatus response correctly", async () => {
    nock(baseURL)
      .get("/soundTouchConfigurationStatus")
      .reply(200, mockXML, { "Content-Type": "application/xml" });

    const info = await api.getConfigurationStatus();

    expect(info).toMatchObject({
      SoundTouchConfigurationStatus: {
        status: SoundTouchConfigurationStatus.Configured,
      },
    });
  });

});
