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


const mockXML_playURLResponse = `<?xml version="1.0" encoding="UTF-8" ?>
<status>/speaker</status>`;


describe("SoundTouchAPI /speaker endpoint", () => {
  const baseURL = "http://localhost:8090";
  let api: SoundTouchApiClient;

  beforeEach(() => {
    api = new SoundTouchApiClient(baseURL);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

   it("parses /speaker current volume 1 response correctly", async () => {

    const expected_request = `<play_info>
  <url>https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_1MB_MP3.mp3</url>
  <app_key>Xp7YGBI9dh763Kj8sY8e86JPXtisddBa</app_key>
  <service>FreeTestData.com</service>
  <message>MP3 Test Data</message>
  <reason>Free_Test_Data_1MB_MP3</reason>
  </play_info>`;


    nock(baseURL)
      .post("/speaker", (body) => body.replace(/\s+/g, "") === expected_request.replace(/\s+/g, ""))
      .matchHeader("Content-Type", "application/xml")
      .reply(200, mockXML_playURLResponse, { "Content-Type": "application/xml" });

    const request = {
      url: "https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_1MB_MP3.mp3",
      app_key: "Xp7YGBI9dh763Kj8sY8e86JPXtisddBa",
      service: "FreeTestData.com",
      message: "MP3 Test Data",
      reason: "Free_Test_Data_1MB_MP3",
    };


    const playURLResponse = await api.playURL(request);
    // Ensure the mocked endpoint was called
    expect(nock.isDone()).toBe(true);

    expect(playURLResponse).toBe("/speaker");
    }); 
});

