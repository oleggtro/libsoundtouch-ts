import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { PlaybackSource, PowerState } from "../src/types.js";

const mockXML_presetResponse = `<?xml version="1.0" encoding="UTF-8"?>
<presets>
  <preset id="1">
    <ContentItem source="TUNEIN" type="stationurl" location="/v1/playback/station/s33828" isPresetable="true">
      <itemName>K-LOVE Radio</itemName>
      <containerArt>http://cdn-profiles.tunein.com/s33828/images/logog.png?t=637986894890000000</containerArt>
    </ContentItem>
  </preset>
  <preset id="2">
    <ContentItem source="TUNEIN" type="stationurl" location="/v1/playback/station/s309606" isPresetable="true">
      <itemName>K-LOVE 2000s</itemName>
      <containerArt>http://cdn-profiles.tunein.com/s309606/images/logog.png?t=637986893640000000</containerArt>
    </ContentItem>
  </preset>
  <preset id="3" createdOn="1701220500" updatedOn="1701220500">
    <ContentItem source="TUNEIN" type="stationurl" location="/v1/playback/station/s309605" isPresetable="true">
      <itemName>My Copy K-Love 90s</itemName>
      <containerArt>http://cdn-profiles.tunein.com/s309605/images/logog.png?t=637986891960000000</containerArt>
    </ContentItem>
  </preset>
  <preset id="5">
    <ContentItem source="TUNEIN" type="stationurl" location="/v1/playback/station/s258421" isPresetable="true">
      <itemName>K-LOVE Christmas Radio</itemName>
      <containerArt>http://cdn-profiles.tunein.com/s258421/images/logog.png?t=637986893260000000</containerArt>
    </ContentItem>
  </preset>
  <preset id="6">
    <ContentItem source="TUNEIN" type="stationurl" location="/v1/playback/station/s320961" isPresetable="true">
      <itemName>K-LOVE Birthday Blend</itemName>
      <containerArt>http://cdn-profiles.tunein.com/s320961/images/logog.png?t=637986892470000000</containerArt>
    </ContentItem>
  </preset>
</presets>`;

describe("SoundTouchAPI /presets endpoint", () => {
    const baseURL = "http://localhost:8090";
    let api: SoundTouchApiClient;

    beforeEach(() => {
        api = new SoundTouchApiClient(baseURL);
        nock.cleanAll();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it("parses /presets response correctly", async () => {
        nock(baseURL)
            .get("/presets")
            .reply(200, mockXML_presetResponse, { "Content-Type": "application/xml" });

        const presets = await api.getPresets();

        expect(presets).toMatchObject({
            presets: {
                preset: [
                    {
                        id: 1,
                        ContentItem: {
                            source: PlaybackSource.TuneIN,
                            type: "stationurl",
                            location: "/v1/playback/station/s33828",
                            isPresetable: true,
                            itemName: "K-LOVE Radio",
                            containerArt: "http://cdn-profiles.tunein.com/s33828/images/logog.png?t=637986894890000000",
                        },
                    },
                    {
                        id: 2,
                        ContentItem: {
                            source: PlaybackSource.TuneIN,
                            type: "stationurl",
                            location: "/v1/playback/station/s309606",
                            isPresetable: true,
                            itemName: "K-LOVE 2000s",
                            containerArt: "http://cdn-profiles.tunein.com/s309606/images/logog.png?t=637986893640000000",
                        },
                    },
                    {
                        id: 3,
                        createdOn: 1701220500,
                        updatedOn: 1701220500,
                        ContentItem: {
                            source: PlaybackSource.TuneIN,
                            type: "stationurl",
                            location: "/v1/playback/station/s309605",
                            isPresetable: true,
                            itemName: "My Copy K-Love 90s",
                            containerArt: "http://cdn-profiles.tunein.com/s309605/images/logog.png?t=637986891960000000",
                        },
                    },
                    {
                        id: 5,
                        ContentItem: {
                            source: PlaybackSource.TuneIN,
                            type: "stationurl",
                            location: "/v1/playback/station/s258421",
                            isPresetable: true,
                            itemName: "K-LOVE Christmas Radio",
                            containerArt: "http://cdn-profiles.tunein.com/s258421/images/logog.png?t=637986893260000000",
                        },
                    },
                    {
                        id: 6,
                        ContentItem: {
                            source: PlaybackSource.TuneIN,
                            type: "stationurl",
                            location: "/v1/playback/station/s320961",
                            isPresetable: true,
                            itemName: "K-LOVE Birthday Blend",
                            containerArt: "http://cdn-profiles.tunein.com/s320961/images/logog.png?t=637986892470000000",
                        },
                    },
                ]
            },
        });

    });

});
