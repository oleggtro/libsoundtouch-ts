import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { SoundTouchConfigurationStatus } from "../src/types.js";

const mockXML = `<?xml version="1.0" encoding="UTF-8" ?>
<ListMediaServersResponse>
  <media_server id="2f402f80-da50-11e1-9b23-123456789012" mac="0017886e13fe" ip="192.168.1.4" manufacturer="Signify" model_name="Philips hue bridge 2015" friendly_name="Hue Bridge (192.168.1.4)" model_description="Philips hue Personal Wireless Lighting" location="http://192.168.1.4:80/description.xml" />
  <media_server id="d09708a1-5953-44bc-a413-123456789012" mac="S-1-5-21-240303764-901663538-1234567890-1001" ip="192.168.1.5" manufacturer="Microsoft Corporation" model_name="Windows Media Player Sharing" friendly_name="My NAS Media Library" model_description="" location="http://192.168.1.5:2869/upnphost/udhisapi.dll?content=uuid:d09708a1-5953-44bc-a413-123456789012" />
</ListMediaServersResponse>`;

describe("SoundTouchAPI /listMediaServers endpoint", () => {
  const baseURL = "http://localhost:8090";
  let api: SoundTouchApiClient;

  beforeEach(() => {
    api = new SoundTouchApiClient(baseURL);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("parses /listMediaServers response correctly", async () => {
    nock(baseURL)
      .get("/listMediaServers")
      .reply(200, mockXML, { "Content-Type": "application/xml" });

    const mediaServers = await api.getMediaServersList();

    expect(mediaServers).toMatchObject({
        ListMediaServersResponse: {
            media_server: [
                {
                    id: "2f402f80-da50-11e1-9b23-123456789012",
                    mac: "0017886e13fe",
                    ip: "192.168.1.4",
                    manufacturer: "Signify",
                    model_name: "Philips hue bridge 2015",
                    friendly_name: "Hue Bridge (192.168.1.4)"
                },
                {
                    id: "d09708a1-5953-44bc-a413-123456789012",
                    mac: "S-1-5-21-240303764-901663538-1234567890-1001",
                    ip: "192.168.1.5",
                    manufacturer: "Microsoft Corporation",
                    model_name: "Windows Media Player Sharing",
                    friendly_name: "My NAS Media Library"
                }
            ]
        }
    });
  });

});
