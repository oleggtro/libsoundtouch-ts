import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { Group, GroupRoleRole, GroupStatus, SoundTouchConfigurationStatus } from "../src/types.js";

const mockXML_group = `<?xml version='1.0' encoding='utf-8'?>
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


const mockXML_addGroup = `<?xml version='1.0' encoding='utf-8'?>
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

const updateGroup_response = `<?xml version='1.0' encoding='utf-8'?>
<group id="1116267">
  <name>Bose-ST10-1 + Bose-ST10-4 Group</name>
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
</group>`;


const mockXML_removeGroup = `<?xml version='1.0' encoding='utf-8'?>
<group />`;

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
      .reply(200, mockXML_group, { "Content-Type": "application/xml" });

    const dsp = await api.getGroup();

    expect(dsp).toMatchObject({
      group: {
        id: 1115893,
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

  it("parses /addGroup response correctly", async () => {


    const addGroup_response = `<?xml version='1.0' encoding='utf-8'?>
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

    nock(baseURL)
      .post("/addGroup", undefined)
      .matchHeader("Content-Type", "application/xml")
      .reply(200, addGroup_response, { "Content-Type": "application/xml" });


    const sampleAddGroup: Group = { group: {
        name: "Bose-ST10-1 + Bose-ST10-4",
        masterDeviceId: "9070658C9D4A",
        roles: [
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
        ],
        senderIPAddress: "192.168.1.131",
        status: GroupStatus.Ok
      }};

    const addGroupInfo = await api.addGroup(sampleAddGroup);
    // Ensure the mocked endpoint was called
    expect(nock.isDone()).toBe(true);

    // The XML parser returns attributes as properties on the parsed object.
    // When an element has attributes and text, the parser usually yields an
    // object for the element. So we assert the parsed `status` contains the
    // BluetoothMACAddress attribute.
    expect(addGroupInfo).toMatchObject({
      group: {
        id: 1115893,
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

  it("parses /removeGroup response correctly", async () => {
    nock(baseURL)
      .get("/removeGroup")
      .reply(200, mockXML_removeGroup, { "Content-Type": "application/xml" });

    const removeGroup = await api.removeGroup();

    expect(removeGroup).toMatchObject({
      group: ""
    });
  });

    it("parses /updateGroup response correctly", async () => {

      const updateGroup_expectedBody = `<group id="1116267">
  <name>Bose-ST10-1 + Bose-ST10-4 Group</name>
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
</group>`;

    nock(baseURL)
      .post("/updateGroup", updateGroup_expectedBody)
      .matchHeader("Content-Type", "application/xml")
      .reply(200, updateGroup_response, { "Content-Type": "application/xml" });


    const sampleUpdateGroup: Group = { group: {
        "@_id": "1116267",
        name: "Bose-ST10-1 + Bose-ST10-4 Group",
        masterDeviceId: "9070658C9D4A",
        roles: [
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
        ],
        senderIPAddress: "192.168.1.131"
      }};

    const updateGroupInfo = await api.updateGroup(sampleUpdateGroup);
    // Ensure the mocked endpoint was called
    expect(nock.isDone()).toBe(true);

    // The XML parser returns attributes as properties on the parsed object.
    // When an element has attributes and text, the parser usually yields an
    // object for the element. So we assert the parsed `status` contains the
    // BluetoothMACAddress attribute.
    expect(updateGroupInfo).toMatchObject({
      group: {
        id: 1116267,
        name: "Bose-ST10-1 + Bose-ST10-4 Group",
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
        senderIPAddress: "192.168.1.131"
      }
    });
    }); 

});
