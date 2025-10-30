import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { IntrospectRequest, IntrospectSource, IntrospectState } from "../src/types.js";
import { mock } from "node:test";

const mockXML_notificationBeep = `<?xml version="1.0" encoding="UTF-8" ?>
<status>/playNotification</status>`;

describe("SoundTouchAPI /playNotification endpoint", () => {
  const baseURL = "http://localhost:8090";
  let api: SoundTouchApiClient;

  beforeEach(() => {
    api = new SoundTouchApiClient(baseURL);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("gets /playNotification correctly", async () => {

    nock(baseURL)
      .get("/playNotification")
      .reply(200, mockXML_notificationBeep, { "Content-Type": "application/xml" });

    const status = await api.playNotificationBeep();

    expect(status).toBe("/playNotification");
  });

});
