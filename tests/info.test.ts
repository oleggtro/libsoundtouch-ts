import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";

const mockXML = `<?xml version="1.0" encoding="UTF-8"?>
<info deviceID="606405FA8761">
  <name>SoundTouch 10 Küche</name>
  <type>SoundTouch 10</type>
  <countryCode>GB</countryCode>
</info>`;



const mockXML_setNameResponse = `<?xml version="1.0" encoding="UTF-8" ?>
<info deviceID="1004567890AA">
  <name>SoundTouch Living Room</name>
  <type>SoundTouch 10</type>
  <margeAccountUUID>1234567</margeAccountUUID>
  <components>
    <component>
      <componentCategory>SCM</componentCategory>
      <softwareVersion>27.0.6.46330.5043500 epdbuild.trunk.hepdswbld04.2022-08-04T11:20:29</softwareVersion>
      <serialNumber>P7277179802731234567890</serialNumber>
    </component>
    <component>
      <componentCategory>PackagedProduct</componentCategory>
      <softwareVersion>27.0.6.46330.5043500 epdbuild.trunk.hepdswbld04.2022-08-04T11:20:29</softwareVersion>
      <serialNumber>069234P71234567AE</serialNumber>
    </component>
  </components>
  <margeURL>https://worldwide.bose.com/updates/soundtouch</margeURL>
  <networkInfo type="SCM">
    <macAddress>1004567890AA</macAddress>
    <ipAddress>192.168.1.131</ipAddress>
  </networkInfo>
  <networkInfo type="SMSC">
    <macAddress>3415131234CA</macAddress>
    <ipAddress>192.168.1.131</ipAddress>
  </networkInfo>
  <moduleType>sm2</moduleType>
  <variant>rhino</variant>
  <variantMode>normal</variantMode>
  <countryCode>US</countryCode>
  <regionCode>US</regionCode>
</info>`;

describe("SoundTouchAPI /info endpoint", () => {
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
      .get("/info")
      .reply(200, mockXML, { "Content-Type": "application/xml" });

    const info = await api.getInfo();

    expect(info).toMatchObject({
      info: {
        deviceID: "606405FA8761",
        name: "SoundTouch 10 Küche",
        type: "SoundTouch 10",
        countryCode: "GB",
      },
    });
  });

  it("gets /name correctly", async () => {


    const mockResponse = `<?xml version="1.0" encoding="UTF-8" ?>
      <name>SoundTouch 10 Bedroom</name>`;
    nock(baseURL)
      .get("/name")
      .reply(200, mockResponse, { "Content-Type": "application/xml" });

    const name = await api.getName();

    expect(name).toBe("SoundTouch 10 Bedroom");
  });



  it("sets a new name correctly", async () => {

    const expected_request = `<name>SoundTouch Living Room</name>`;


    nock(baseURL)
      .post("/name", expected_request)
      .matchHeader("Content-Type", "application/xml")
      .reply(200, mockXML_setNameResponse, { "Content-Type": "application/xml" });


    const keySendResponse = await api.setName("SoundTouch Living Room");
    // Ensure the mocked endpoint was called
    expect(nock.isDone()).toBe(true);

    expect(keySendResponse).toMatchObject({
      info: {
        deviceID: "1004567890AA",
        name: "SoundTouch Living Room",
        type: "SoundTouch 10",
        margeAccountUUID: 1234567,
        components: {
          component: [
            {
              componentCategory: "SCM",
              softwareVersion:
                "27.0.6.46330.5043500 epdbuild.trunk.hepdswbld04.2022-08-04T11:20:29",
              serialNumber: "P7277179802731234567890",
            },
            {
              componentCategory: "PackagedProduct",
              softwareVersion:
                "27.0.6.46330.5043500 epdbuild.trunk.hepdswbld04.2022-08-04T11:20:29",
              serialNumber: "069234P71234567AE",
            },
          ],
        },
        margeURL: "https://worldwide.bose.com/updates/soundtouch",
        networkInfo: [
          {
            type: "SCM",
            macAddress: "1004567890AA",
            ipAddress: "192.168.1.131",
          },
          {
            type: "SMSC",
            macAddress: "3415131234CA",
            ipAddress: "192.168.1.131",
          },
        ],
        moduleType: "sm2",
        variant: "rhino",
        variantMode: "normal",
        countryCode: "US",
        regionCode: "US",
      },
    });
  });


});
