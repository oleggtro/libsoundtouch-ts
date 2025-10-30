import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { PowerState } from "../src/types.js";

const mockXML_response = `<?xml version="1.0" encoding="UTF-8" ?>
<powerManagementResponse>
  <powerState>FullPower</powerState>
  <battery>
    <capable>false</capable>
  </battery>
</powerManagementResponse>`;

describe("SoundTouchAPI /powerManagement endpoint", () => {
  const baseURL = "http://localhost:8090";
  let api: SoundTouchApiClient;

  beforeEach(() => {
    api = new SoundTouchApiClient(baseURL);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("parses /powerMangement response correctly", async () => {
    nock(baseURL)
      .get("/powerManagement")
      .reply(200, mockXML_response, { "Content-Type": "application/xml" });

    const powerState = await api.getPowerState();

    expect(powerState).toMatchObject({
        powerManagementResponse: {
        powerState: PowerState.FullPower,
        battery: {
            capable: false
        }}
    });
  });

});
