import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SoundTouchApiClient } from "../src/client.js";
import nock from "nock";

const mockXML = `<?xml version="1.0" encoding="UTF-8" ?>
<bass deviceID="1004567890AA">
  <targetbass>0</targetbass>
  <actualbass>0</actualbass>
</bass>`;

describe("SoundTouchAPI /bass endpoint", () => {
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
      .get("/bass")
      .reply(200, mockXML, { "Content-Type": "application/xml" });

    const bass = await api.getBass();

    expect(bass).toMatchObject({
      bass: {
        deviceID: "1004567890AA",
        targetbass: 0,
        actualbass: 0,
      },
    });
  });

  it("setBass sends XML body and Content-Type header", async () => {
    // Expect a POST to /bass with XML body and proper header
    nock(baseURL)
      .post("/bass", "<bass>-9</bass>")
      .matchHeader("Content-Type", "application/xml")
      .reply(200);

    await api.setBass(-9);

    // Ensure the mocked endpoint was called
    expect(nock.isDone()).toBe(true);
  });
});
