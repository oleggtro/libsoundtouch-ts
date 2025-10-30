import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { SoundTouchConfigurationStatus } from "../src/types.js";

const mockXML = `<?xml version="1.0" encoding="UTF-8" ?>
<sysLanguage>3</sysLanguage>`;

describe("SoundTouchAPI /language endpoint", () => {
  const baseURL = "http://localhost:8090";
  let api: SoundTouchApiClient;

  beforeEach(() => {
    api = new SoundTouchApiClient(baseURL);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("parses /language response correctly", async () => {
    nock(baseURL)
      .get("/language")
      .reply(200, mockXML, { "Content-Type": "application/xml" });

    const language = await api.getLanguage();

    expect(language).toMatchObject({
        sysLanguage: 3,
    });
  });

});
