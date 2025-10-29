import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";

const mockXML_ST10 = `<?xml version="1.0" encoding="UTF-8" ?>
<capabilities deviceID="1004567890AA">
  <networkConfig>
    <dualMode>true</dualMode>
    <wsapiproxy>true</wsapiproxy>
    <allInterfacesSupported />
    <wlanInterfaces />
    <security />
  </networkConfig>
  <dspCapabilities>
    <dspMonoStereo available="false" />
  </dspCapabilities>
  <lightswitch>false</lightswitch>
  <clockDisplay>false</clockDisplay>
  <capability name="systemtimeout" url="/systemtimeout" info="" />
  <capability name="rebroadcastlatencymode" url="/rebroadcastlatencymode" info="" />
  <lrStereoCapable>true</lrStereoCapable>
  <bcoresetCapable>false</bcoresetCapable>
  <disablePowerSaving>true</disablePowerSaving>
</capabilities>`;


const mockXML_ST300 = `<?xml version="1.0" encoding="UTF-8" ?>
<capabilities deviceID="3004567890BB">
  <networkConfig>
    <dualMode>true</dualMode>
    <wsapiproxy>true</wsapiproxy>
    <allInterfacesSupported />
    <wlanInterfaces />
    <security />
  </networkConfig>
  <dspCapabilities>
    <dspMonoStereo available="false" />
  </dspCapabilities>
  <lightswitch>false</lightswitch>
  <clockDisplay>false</clockDisplay>
  <capability name="audiodspcontrols" url="/audiodspcontrols" info="" />
  <capability name="audiospeakerattributeandsetting" url="/audiospeakerattributeandsetting" info="" />
  <capability name="productcechdmicontrol" url="/productcechdmicontrol" info="" />
  <capability name="producthdmiassignmentcontrols" url="/producthdmiassignmentcontrols" info="" />
  <capability name="audioproducttonecontrols" url="/audioproducttonecontrols" info="" />
  <capability name="audioproductlevelcontrols" url="/audioproductlevelcontrols" info="" />
  <capability name="systemtimeoutcontrol" url="/systemtimeoutcontrol" info="" />
  <capability name="rebroadcastlatencymode" url="/rebroadcastlatencymode" info="" />
  <lrStereoCapable>false</lrStereoCapable>
  <bcoresetCapable>false</bcoresetCapable>
  <disablePowerSaving>false</disablePowerSaving>
</capabilities>`;

describe("SoundTouchAPI /capabilities endpoint", () => {
  const baseURL = "http://localhost:8090";
  let api: SoundTouchApiClient;

  beforeEach(() => {
    api = new SoundTouchApiClient(baseURL);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("parses XML response for ST-10 correctly", async () => {
    nock(baseURL)
      .get("/capabilities")
      .reply(200, mockXML_ST10, { "Content-Type": "application/xml" });

    const capabilities = await api.getCapabilities();

    expect(capabilities).toMatchObject({
      capabilities: {
        deviceID: "1004567890AA",
        networkConfig: {
          dualMode: true,
          wsapiproxy: true,
        },
        dspCapabilities: {
          dspMonoStereo: {
            available: false,
          },
        },
        lightswitch: false,
        clockDisplay: false,
        capability: expect.any(Array),
        lrStereoCapable: true,
        bcoresetCapable: false,
        disablePowerSaving: true,
      },
    });
  });


    it("parses XML response for ST-300 correctly", async () => {
    nock(baseURL)
      .get("/capabilities")
      .reply(200, mockXML_ST300, { "Content-Type": "application/xml" });

    const capabilities = await api.getCapabilities();

    expect(capabilities).toMatchObject({
      capabilities: {
        deviceID: "3004567890BB",
        networkConfig: {
          dualMode: true,
          wsapiproxy: true,
        },
        dspCapabilities: {
          dspMonoStereo: {
            available: false,
          },
        },
        lightswitch: false,
        clockDisplay: false,
        capability: expect.any(Array),
        lrStereoCapable: false,
        bcoresetCapable: false,
        disablePowerSaving: false,
      },
    });
  });
});
