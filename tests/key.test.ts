import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { IntrospectRequest, IntrospectSource, IntrospectState, Key, KeyPressState, KeySender } from "../src/types.js";
import { mock } from "node:test";

const mockXML_response = `<?xml version="1.0" encoding="UTF-8" ?>
<status>/key</status>`;

describe("SoundTouchAPI /key endpoint", () => {
  const baseURL = "http://localhost:8090";
  let api: SoundTouchApiClient;

  beforeEach(() => {
    api = new SoundTouchApiClient(baseURL);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

   it("parses /key response correctly", async () => {

    const expected_request = `<key state="press" sender="Gabbo">POWER</key>`;


    nock(baseURL)
      .post("/key", expected_request)
      .matchHeader("Content-Type", "application/xml")
      .reply(200, mockXML_response, { "Content-Type": "application/xml" });


    const keySendResponse = await api.sendKeyPress(Key.Power, KeyPressState.Press, KeySender.Gabbo);
    // Ensure the mocked endpoint was called
    expect(nock.isDone()).toBe(true);

    expect(keySendResponse).toMatchObject({
        status: "/key",
    });
    }); 
});
