import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SoundTouchApiClient } from "../src/client.js";
import nock from "nock";
import { AudioDSPMode } from "../src/types.js";

const mockXML = `<?xml version="1.0" encoding="UTF-8" ?>
<audiodspcontrols audiomode="AUDIO_MODE_NORMAL" videosyncaudiodelay="0" supportedaudiomodes="AUDIO_MODE_NORMAL|AUDIO_MODE_DIALOG" />`;

describe("SoundTouchAPI /audiodspcontrols endpoint", () => {
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
      .get("/audiodspcontrols")
      .reply(200, mockXML, { "Content-Type": "application/xml" });

    const audioDSPControls = await api.getAudioDSPControls();

    expect(audioDSPControls).toMatchObject({
      audiodspcontrols: {
        audiomode: AudioDSPMode.Normal,
        videosyncaudiodelay: "0",
        supportedaudiomodes: "AUDIO_MODE_NORMAL|AUDIO_MODE_DIALOG",
      },
    });
  });

  it("test setAudioDSPMode to Normal", async () => {
    nock(baseURL)
      .post("/audiodspcontrols", "<audiodspcontrols audiomode=\"AUDIO_MODE_NORMAL\" />")
      .matchHeader("Content-Type", "application/xml")
      .reply(200);

    await api.setAudioDSPControls(AudioDSPMode.Normal);
    // Ensure the mocked endpoint was called
    expect(nock.isDone()).toBe(true);
  }); 
  
  it("test setAudioDSPMode to Dialog", async () => {
    nock(baseURL)
      .post("/audiodspcontrols", "<audiodspcontrols audiomode=\"AUDIO_MODE_DIALOG\" />")
      .matchHeader("Content-Type", "application/xml")
      .reply(200);

    await api.setAudioDSPControls(AudioDSPMode.Dialog);
    // Ensure the mocked endpoint was called
    expect(nock.isDone()).toBe(true);
  });

});
