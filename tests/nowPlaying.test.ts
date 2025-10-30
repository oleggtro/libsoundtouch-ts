import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { NetworkInterfaceType, NetworkMode, NetworkSignalStrength, NetworkState, PlaybackSource, PlayStatus, RepeatSetting, RSSI, ShuffleSetting, StreamType } from "../src/types.js";

const mockXML_networkInfo = `<?xml version="1.0" encoding="UTF-8" ?>
<networkInfo wifiProfileCount="1">
  <interfaces>
    <interface type="WIFI_INTERFACE" name="wlan0" macAddress="3415131234CA" ipAddress="192.168.1.131" ssid="my_network_ssid" frequencyKHz="2452000" state="NETWORK_WIFI_CONNECTED" signal="MARGINAL_SIGNAL" mode="STATION" />
    <interface type="WIFI_INTERFACE" name="wlan1" macAddress="3415131234CB" state="NETWORK_WIFI_DISCONNECTED" />
  </interfaces>
</networkInfo>`;


const mockXML_tunein = `<?xml version="1.0" encoding="UTF-8" ?>
<nowPlaying deviceID="1004567890AA" source="TUNEIN" sourceAccount="">
    <ContentItem source="TUNEIN" type="stationurl" location="/v1/playback/station/s33828" sourceAccount="" isPresetable="true">
        <itemName>K-LOVE Radio</itemName>
        <containerArt>http://cdn-profiles.tunein.com/s33828/images/logog.png?t=637986894890000000</containerArt>
    </ContentItem>
    <track>K-LOVE Radio</track>
    <artist>Cochren - Running Home (Running Home)</artist>
    <album></album>
    <stationName>K-LOVE Radio</stationName>
    <art artImageStatus="IMAGE_PRESENT">http://cdn-profiles.tunein.com/s33828/images/logog.png?t=1</art>
    <favoriteEnabled />
    <playStatus>PLAY_STATE</playStatus>
    <streamType>RADIO_STREAMING</streamType>
    <isFavorite />
</nowPlaying>`;

const mockXML_localMedia = `<?xml version="1.0" encoding="UTF-8" ?>
<nowPlaying deviceID="1004567890AA" source="LOCAL_MUSIC" sourceAccount="3f205110-4a57-4e91-810a-123456789012">
    <ContentItem source="LOCAL_MUSIC" type="album" location="album:983" sourceAccount="3f205110-4a57-4e91-810a-123456789012" isPresetable="true">
        <itemName>Welcome to the New</itemName>
        <containerArt>http://192.168.1.12:8085/v1/albums/983/image?_=1&amp;w=62</containerArt>
    </ContentItem>
    <track>Finish What He Started</track>
    <artist>MercyMe</artist>
    <album>Welcome to the New</album>
    <stationName></stationName>
    <art artImageStatus="IMAGE_PRESENT">http://192.168.1.12:8085/v1/albums/983/image?_=1</art>
    <time total="268">4</time>
    <skipEnabled />
    <playStatus>PLAY_STATE</playStatus>
    <shuffleSetting>SHUFFLE_OFF</shuffleSetting>
    <repeatSetting>REPEAT_OFF</repeatSetting>
    <skipPreviousEnabled />
    <streamType>TRACK_ONDEMAND</streamType>
    <artistID>31</artistID>
    <trackID>2579</trackID>
</nowPlaying>`;


const mockXML_storedMusic = `<?xml version="1.0" encoding="UTF-8" ?>
<nowPlaying deviceID="1004567890AA" source="STORED_MUSIC" sourceAccount="d09708a1-5953-44bc-a413-123456789012/0">
    <ContentItem source="STORED_MUSIC" location="6_a2874b5d_4f83d999" sourceAccount="d09708a1-5953-44bc-a413-123456789012/0" isPresetable="true">
        <itemName>MercyMe, It&apos;s Christmas!</itemName>
    </ContentItem>
    <track>A Holly Jolly Christmas</track>
    <artist>MercyMe</artist>
    <album>MercyMe, It&apos;s Christmas!</album>
    <offset>0</offset>
    <art artImageStatus="IMAGE_PRESENT">http://192.168.1.12:10243/WMPNSSv4/2050238549/0_Nl9hMjg3NGI1ZF80ZjgzZDk5OS04MDcz.jpg?albumArt=true</art>
    <time total="203">3</time>
    <skipEnabled />
    <playStatus>PLAY_STATE</playStatus>
    <shuffleSetting>SHUFFLE_OFF</shuffleSetting>
    <repeatSetting>REPEAT_OFF</repeatSetting>
    <skipPreviousEnabled />
</nowPlaying>`;

const mockXML_ad = `<?xml version="1.0" encoding="UTF-8" ?>
<nowPlaying deviceID="1004567890AA" source="PANDORA" sourceAccount="YourPandoraUserId">
  <ContentItem source="PANDORA" location="126740707481236361" sourceAccount="YourPandoraUserId" isPresetable="true">
    <itemName>Zach Williams Radio</itemName>
    <containerArt>https://content-images.p-cdn.com/images/68/88/0d/fb/aed34095a11118d2aa7b02a2/_500W_500H.jpg</containerArt>
  </ContentItem>
  <track></track>
  <artist></artist>
  <album></album>
  <stationName>Zach Williams Radio</stationName>
  <art artImageStatus="IMAGE_PRESENT">http://mediaserver-cont-usc-mp1-1-v4v6.pandora.com/images/public/devicead/e/l/i/t/daarv2audioprogtile_500W_500H.jpg</art>
  <rating>NONE</rating>
  <playStatus>PLAY_STATE</playStatus>
  <isAdvertisement />
</nowPlaying>`;

const mockXML_pandora = `<?xml version="1.0" encoding="UTF-8" ?>
<nowPlaying deviceID="1004567890AA" source="PANDORA" sourceAccount="YourPandoraUserId">
  <ContentItem source="PANDORA" location="126740707481236361" sourceAccount="YourPandoraUserId" isPresetable="true">
    <itemName>Zach Williams Radio</itemName>
    <containerArt>https://content-images.p-cdn.com/images/68/88/0d/fb/aed34095a11118d2aa7b02a2/_500W_500H.jpg</containerArt>
  </ContentItem>
  <track>Reckless Love</track>
  <artist>Cory Asbury</artist>
  <album>Reckless Love</album>
  <stationName>Zach Williams Radio</stationName>
  <art artImageStatus="IMAGE_PRESENT">http://mediaserver-cont-dc6-2-v4v6.pandora.com/images/b5/64/9a/55/983740f79c3ef30202ac2605/1080W_1080H.jpg</art>
  <time total="333">17</time>
  <rating>NONE</rating>
  <skipEnabled />
  <rateEnabled />
  <playStatus>PLAY_STATE</playStatus>
</nowPlaying>`;


describe("SoundTouchAPI /nowPlaying endpoint", () => {
    const baseURL = "http://localhost:8090";
    let api: SoundTouchApiClient;

    beforeEach(() => {
        api = new SoundTouchApiClient(baseURL);
        nock.cleanAll();
    });

    afterEach(() => {
        nock.cleanAll();
    });


        it("gets /nowPlaying tunein correctly", async () => {

        nock(baseURL)
            .get("/nowPlaying")
            .reply(200, mockXML_tunein, { "Content-Type": "application/xml" });

        const nowPlaying = await api.getNowPlaying();

        expect(nowPlaying).toMatchObject({
            nowPlaying: {
                deviceID: "1004567890AA",
                source: "TUNEIN",
                sourceAccount: "",
                ContentItem: {
                    source: PlaybackSource.TuneIN,
                    type: "stationurl",
                    location: "/v1/playback/station/s33828",
                    sourceAccount: "",
                    isPresetable: true,
                    itemName: "K-LOVE Radio",
                    containerArt: "http://cdn-profiles.tunein.com/s33828/images/logog.png?t=637986894890000000",
                },
                track: "K-LOVE Radio",
                artist: "Cochren - Running Home (Running Home)",
                album: "",
                stationName: "K-LOVE Radio",
                art: {
                    "artImageStatus": "IMAGE_PRESENT",
                    "#text": "http://cdn-profiles.tunein.com/s33828/images/logog.png?t=1",
                },
                favoriteEnabled: "",
                playStatus: PlayStatus.PlayState,
                streamType: StreamType.RadioStreaming,
                isFavorite: ""
        }});
    });

    it("gets /nowPlaying local media correctly", async () => {

        nock(baseURL)
            .get("/nowPlaying")
            .reply(200, mockXML_localMedia, { "Content-Type": "application/xml" });

        const nowPlaying = await api.getNowPlaying();

        expect(nowPlaying).toMatchObject({
            nowPlaying: {
                deviceID: "1004567890AA",
                source: PlaybackSource.LocalMusic,
                sourceAccount: "3f205110-4a57-4e91-810a-123456789012",
                ContentItem: {
                    source: PlaybackSource.LocalMusic,
                    type: "album",
                    location: "album:983",
                    sourceAccount: "3f205110-4a57-4e91-810a-123456789012",
                    isPresetable: true,
                    itemName: "Welcome to the New",
                    containerArt: "http://192.168.1.12:8085/v1/albums/983/image?_=1&w=62",
                },
                track: "Finish What He Started",
                artist: "MercyMe",
                album: "Welcome to the New",
                stationName: "",
                art: {
                    artImageStatus: "IMAGE_PRESENT",
                    "#text": "http://192.168.1.12:8085/v1/albums/983/image?_=1",
                },
                time: { total: 268, "#text": 4 },
                skipEnabled: "",
                playStatus: PlayStatus.PlayState,
                shuffleSetting: ShuffleSetting.ShuffleOff,
                repeatSetting: RepeatSetting.RepeatOff,
                skipPreviousEnabled: "",
                streamType: StreamType.TrackOnDemand,
                artistID: 31,
                trackID: 2579,
            },  
        });
    });

        it("gets /nowPlaying stored music correctly", async () => {

        nock(baseURL)
            .get("/nowPlaying")
            .reply(200, mockXML_storedMusic, { "Content-Type": "application/xml" });

        const nowPlaying = await api.getNowPlaying();

        expect(nowPlaying).toMatchObject({
            nowPlaying: {
                deviceID: "1004567890AA",
                source: PlaybackSource.StoredMusic,
                sourceAccount: "d09708a1-5953-44bc-a413-123456789012/0",
                ContentItem: {
                    source: PlaybackSource.StoredMusic,
                    location: "6_a2874b5d_4f83d999",
                    sourceAccount: "d09708a1-5953-44bc-a413-123456789012/0",
                    isPresetable: true,
                    itemName: "MercyMe, It's Christmas!",
                },
                track: "A Holly Jolly Christmas",
                artist: "MercyMe",
                album: "MercyMe, It's Christmas!",
                offset: 0,
                art: {
                    artImageStatus: "IMAGE_PRESENT",
                    "#text": "http://192.168.1.12:10243/WMPNSSv4/2050238549/0_Nl9hMjg3NGI1ZF80ZjgzZDk5OS04MDcz.jpg?albumArt=true",
                },
                time: { total: 203, "#text": 3 },
                skipEnabled: "",
                playStatus: PlayStatus.PlayState,
                shuffleSetting: ShuffleSetting.ShuffleOff,
                repeatSetting: RepeatSetting.RepeatOff,
                skipPreviousEnabled: "",
            },
        });
    });
    it("gets /nowPlaying music service ad correctly", async () => {

        nock(baseURL)
            .get("/nowPlaying")
            .reply(200, mockXML_ad, { "Content-Type": "application/xml" });

        const nowPlaying = await api.getNowPlaying();

        expect(nowPlaying).toMatchObject({
            nowPlaying: {
                deviceID: "1004567890AA",
                source: PlaybackSource.Pandora,
                sourceAccount: "YourPandoraUserId",
                ContentItem: {
                    source: PlaybackSource.Pandora,
                    location: "126740707481236361",
                    sourceAccount: "YourPandoraUserId",
                    isPresetable: true,
                    itemName: "Zach Williams Radio",
                    containerArt: "https://content-images.p-cdn.com/images/68/88/0d/fb/aed34095a11118d2aa7b02a2/_500W_500H.jpg",
                },
                track: "",
                artist: "",
                album: "",
                stationName: "Zach Williams Radio",
                art: {
                    artImageStatus: "IMAGE_PRESENT",
                    "#text": "http://mediaserver-cont-usc-mp1-1-v4v6.pandora.com/images/public/devicead/e/l/i/t/daarv2audioprogtile_500W_500H.jpg",
                },
                rating: "NONE",
                playStatus: PlayStatus.PlayState,
                isAdvertisement: "",
            },  
        });
    });


    it("gets /nowPlaying music streaming correctly", async () => {

        nock(baseURL)
            .get("/nowPlaying")
            .reply(200, mockXML_pandora, { "Content-Type": "application/xml" });

        const nowPlaying = await api.getNowPlaying();

        expect(nowPlaying).toMatchObject({
            nowPlaying: {
                deviceID: "1004567890AA",
                source: PlaybackSource.Pandora,
                sourceAccount: "YourPandoraUserId",
                ContentItem: {
                    source: PlaybackSource.Pandora,
                    location: "126740707481236361",
                    sourceAccount: "YourPandoraUserId",
                    isPresetable: true,
                    itemName: "Zach Williams Radio",
                    containerArt: "https://content-images.p-cdn.com/images/68/88/0d/fb/aed34095a11118d2aa7b02a2/_500W_500H.jpg",
                },
                track: "Reckless Love",
                artist: "Cory Asbury",
                album: "Reckless Love",
                stationName: "Zach Williams Radio",
                art: {
                    artImageStatus: "IMAGE_PRESENT",
                    "#text": "http://mediaserver-cont-dc6-2-v4v6.pandora.com/images/b5/64/9a/55/983740f79c3ef30202ac2605/1080W_1080H.jpg",
                },
                time: { total: 333, "#text": 17 },
                rating: "NONE",
                skipEnabled: "",
                rateEnabled: "",
                playStatus: PlayStatus.PlayState,
            },  
        });
    });
});
