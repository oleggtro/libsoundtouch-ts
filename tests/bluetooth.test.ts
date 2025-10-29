import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SoundTouchApiClient } from "../src/client.js";
import nock from "nock";
import { AudioDSPMode } from "../src/types.js";

const mockXML = `<?xml version="1.0" encoding="UTF-8" ?>
<status>/clearBluetoothPaired</status>`;

describe("SoundTouchAPI /bluetoothInfo endpoint", () => {
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
      .get("/bluetoothInfo")
      .reply(200, mockXML, { "Content-Type": "application/xml" });

    const bluetoothInfo = await api.getBluetoothInfo();

    expect(bluetoothInfo).toMatchObject({
      status: "/clearBluetoothPaired",
    });
  });

  it("clears Bluetooth Pairing Info", async () => {
    // Make the POST reply include an XML body with the Bluetooth MAC as an attribute
    const postMockXML = `<?xml version="1.0" encoding="UTF-8" ?>
    <status BluetoothMACAddress="34:15:13:45:2f:93">/clearBluetoothPaired</status>`;

    nock(baseURL)
      .post("/clearBluetoothPaired", undefined)
      .matchHeader("Content-Type", "application/xml")
      .reply(200, postMockXML, { "Content-Type": "application/xml" });

    const bluetoothInfo = await api.clearBluetoothPairingInfo();
    // Ensure the mocked endpoint was called
    expect(nock.isDone()).toBe(true);

    // The XML parser returns attributes as properties on the parsed object.
    // When an element has attributes and text, the parser usually yields an
    // object for the element. So we assert the parsed `status` contains the
    // BluetoothMACAddress attribute.
    expect(bluetoothInfo).toMatchObject({
      status: { BluetoothMACAddress: "34:15:13:45:2f:93" },
    });
    }); 

      it("enter Bluetooth Pairing Mode", async () => {
    // Make the POST reply include an XML body with the Bluetooth MAC as an attribute
    const postMockXML = `<?xml version="1.0" encoding="UTF-8" ?>
<status>/enterBluetoothPairing</status>`;

    nock(baseURL)
      .post("/enterBluetoothPairing", undefined)
      .matchHeader("Content-Type", "application/xml")
      .reply(200, postMockXML, { "Content-Type": "application/xml" });

    const bluetoothInfo = await api.enterBluetoothPairingMode();
    // Ensure the mocked endpoint was called
    expect(nock.isDone()).toBe(true);

    // The XML parser returns attributes as properties on the parsed object.
    // When an element has attributes and text, the parser usually yields an
    // object for the element. So we assert the parsed `status` contains the
    // BluetoothMACAddress attribute.
    expect(bluetoothInfo).toMatchObject({
      status: "/enterBluetoothPairing",
    });
    }); 


});
