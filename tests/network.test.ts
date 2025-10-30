import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { NetworkInterfaceType, NetworkMode, NetworkSignalStrength, NetworkState } from "../src/types.js";

const mockXML = `<?xml version="1.0" encoding="UTF-8" ?>
<networkInfo wifiProfileCount="1">
  <interfaces>
    <interface type="WIFI_INTERFACE" name="wlan0" macAddress="3415131234CA" ipAddress="192.168.1.131" ssid="my_network_ssid" frequencyKHz="2452000" state="NETWORK_WIFI_CONNECTED" signal="MARGINAL_SIGNAL" mode="STATION" />
    <interface type="WIFI_INTERFACE" name="wlan1" macAddress="3415131234CB" state="NETWORK_WIFI_DISCONNECTED" />
  </interfaces>
</networkInfo>`;

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
            .reply(200, mockXML, { "Content-Type": "application/xml" });

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


});
