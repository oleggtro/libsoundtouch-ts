import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { GroupRoleRole, GroupStatus, SoundTouchConfigurationStatus } from "../src/types.js";

const mockXML = `<?xml version='1.0' encoding='utf-8'?>
<group id="1115893">
  <name>Bose-ST10-1 + Bose-ST10-4</name>
  <masterDeviceId>9070658C9D4A</masterDeviceId>
  <roles>
    <groupRole>
      <deviceId>9070658C9D4A</deviceId>
      <role>LEFT</role>
      <ipAddress>192.168.1.131</ipAddress>
    </groupRole>
    <groupRole>
      <deviceId>F45EAB3115DA</deviceId>
      <role>RIGHT</role>
      <ipAddress>192.168.1.134</ipAddress>
    </groupRole>
  </roles>
  <senderIPAddress>192.168.1.131</senderIPAddress>
  <status>GROUP_OK</status>
</group>`;

describe("SoundTouchAPI /group endpoint", () => {
  const baseURL = "http://localhost:8090";
  let api: SoundTouchApiClient;

  beforeEach(() => {
    api = new SoundTouchApiClient(baseURL);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("parses /group response correctly", async () => {
    nock(baseURL)
      .get("/group")
      .reply(200, mockXML, { "Content-Type": "application/xml" });

    const dsp = await api.getGroup();

    expect(dsp).toMatchObject({
      group: {
        name: "Bose-ST10-1 + Bose-ST10-4",
        masterDeviceId: "9070658C9D4A",
        roles: {
          groupRole: [
          {
            deviceId: "9070658C9D4A",
            role: GroupRoleRole.Left,
            ipAddress: "192.168.1.131"
          },
          {
            deviceId: "F45EAB3115DA",
            role: GroupRoleRole.Right,
            ipAddress: "192.168.1.134"
          }
        ]},
        senderIPAddress: "192.168.1.131",
        status: GroupStatus.Ok
      }
    });
  });

});
