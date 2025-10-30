import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { NetworkInterfaceType, NetworkMode, NetworkSignalStrength, NetworkState, RSSI } from "../src/types.js";

const mockXML_networkInfo = `<?xml version="1.0" encoding="UTF-8" ?>
<networkInfo wifiProfileCount="1">
  <interfaces>
    <interface type="WIFI_INTERFACE" name="wlan0" macAddress="3415131234CA" ipAddress="192.168.1.131" ssid="my_network_ssid" frequencyKHz="2452000" state="NETWORK_WIFI_CONNECTED" signal="MARGINAL_SIGNAL" mode="STATION" />
    <interface type="WIFI_INTERFACE" name="wlan1" macAddress="3415131234CB" state="NETWORK_WIFI_DISCONNECTED" />
  </interfaces>
</networkInfo>`;


const mockXML_networkStatus = `<?xml version="1.0" encoding="UTF-8" ?>
<network-data>
  <devices>
    <device deviceID="1004567890AA">
      <deviceSerialNumber>P7277179802731234567890</deviceSerialNumber>
      <interfaces>
        <interface>
          <name>eth0</name>
          <mac-addr>1004567890AA</mac-addr>
          <bindings>
            <ipv4address>192.168.1.131</ipv4address>
          </bindings>
          <running>true</running>
          <kind>Wireless</kind>
          <ssid>netlucas_ssid</ssid>
          <rssi>Good</rssi>
          <frequencyKHz>2452000</frequencyKHz>
        </interface>
      </interfaces>
    </device>
  </devices>
</network-data>`;

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


    it("gets /networkInfo correctly", async () => {

        nock(baseURL)
            .get("/networkInfo")
            .reply(200, mockXML_networkInfo, { "Content-Type": "application/xml" });

        const networkInfo = await api.getNetworkInfo();

        expect(networkInfo).toMatchObject({


            networkInfo: {
                interfaces: {
                    interface: [
                        {
                            type: NetworkInterfaceType.WifiInterface,
                            name: "wlan0",
                            macAddress: "3415131234CA",
                            ipAddress: "192.168.1.131",
                            ssid: "my_network_ssid",
                            frequencyKHz: 2452000,
                            state: NetworkState.WifiConnected,
                            signal: NetworkSignalStrength.Marginal,
                            mode: NetworkMode.Station,
                        },
                        {
                            type: NetworkInterfaceType.WifiInterface,
                            name: "wlan1",
                            macAddress: "3415131234CB",
                            state: NetworkState.WifiDisconnected,
                        },
                    ],
                },
                wifiProfileCount: 1,
            }
        });
    });


        it("gets /networkStatus correctly", async () => {

        nock(baseURL)
            .get("/networkStatus")
            .reply(200, mockXML_networkStatus, { "Content-Type": "application/xml" });

        const networkStatus = await api.getNetworkStatus();

        expect(networkStatus).toMatchObject({
            "network-data": {
                devices: {
                device: {
                    deviceID: "1004567890AA",
                    deviceSerialNumber: "P7277179802731234567890",
                    interfaces: {
                        interface: {
                            name: "eth0",
                            "mac-addr": "1004567890AA",
                            bindings: {
                                ipv4address: "192.168.1.131",
                            },
                            running: true,
                            kind: "Wireless",
                            ssid: "netlucas_ssid",
                            rssi: RSSI.Good,
                            frequencyKHz: 2452000,
                        },
                    },
                },
            },}
        });
    });




});
