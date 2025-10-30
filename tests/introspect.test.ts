import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.js";
import { IntrospectRequest, IntrospectSource, IntrospectState } from "../src/types.js";
import { mock } from "node:test";

const mockXML_response = `<?xml version="1.0" encoding="UTF-8" ?>
<spotifyAccountIntrospectResponse state="InactiveUnselected" user="SpotifyConnectUserName" isPlaying="false" tokenLastChangedTimeSeconds="1702566495" tokenLastChangedTimeMicroseconds="427884" shuffleMode="OFF" playStatusState="2" currentUri="" receivedPlaybackRequest="false" subscriptionType="">
  <cachedPlaybackRequest />
  <nowPlaying skipPreviousSupported="false" seekSupported="false" resumeSupported="true" collectData="true" />
  <contentItemHistory maxSize="10" />
</spotifyAccountIntrospectResponse>`;

describe("SoundTouchAPI /introspect endpoint", () => {
  const baseURL = "http://localhost:8090";
  let api: SoundTouchApiClient;

  beforeEach(() => {
    api = new SoundTouchApiClient(baseURL);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });



   it("parses /introspect response correctly", async () => {

    const expected_request = `<introspect source="SPOTIFY" sourceAccount="SpotifyConnectUserName" />`;


    nock(baseURL)
      .post("/introspect", expected_request)
      .matchHeader("Content-Type", "application/xml")
      .reply(200, mockXML_response, { "Content-Type": "application/xml" });


    const samplerequest: IntrospectRequest = {
        source: IntrospectSource.Spotify,
        sourceAccount: "SpotifyConnectUserName",
    };

    const introspectInfo = await api.getIntrospect(samplerequest);
    // Ensure the mocked endpoint was called
    expect(nock.isDone()).toBe(true);

    // The XML parser returns attributes as properties on the parsed object.
    // When an element has attributes and text, the parser usually yields an
    // object for the element. So we assert the parsed `status` contains the
    // BluetoothMACAddress attribute.
    expect(introspectInfo).toMatchObject({
      spotifyAccountIntrospectResponse: {
        state: IntrospectState.InactiveUnselected,
        user: "SpotifyConnectUserName",
        isPlaying: false,
        tokenLastChangedTimeSeconds: 1702566495,
        tokenLastChangedTimeMicroseconds: 427884,
        shuffleMode: "OFF",
        playStatusState: 2,
        currentUri: "",
        receivedPlaybackRequest: false,
        subscriptionType: "",
        cachedPlaybackRequest: "",
        nowPlaying: {
          "skipPreviousSupported": false,
          "seekSupported": false,
          "resumeSupported": true,
          "collectData": true,
        },
        contentItemHistory: {
          "maxSize": 10,
        },
      },
    });
    }); 
});
