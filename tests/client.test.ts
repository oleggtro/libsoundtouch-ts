import { describe, it, expect, beforeEach, afterEach } from "vitest";
import nock from "nock";
import { SoundTouchApiClient } from "../src/client.ts"; // adjust if your path differs

const baseURL = "http://localhost:8090";

describe("SoundTouchApiClient", () => {
  let client: SoundTouchApiClient;

  beforeEach(() => {
    client = new SoundTouchApiClient(baseURL);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("should perform a GET request and return parsed JSON", async () => {
    const mockResponse = { success: true, name: "Test" };

    nock(baseURL)
      .get("/json")
      .reply(200, JSON.stringify(mockResponse), {
        "Content-Type": "application/json",
      });

    const result = await client.get<typeof mockResponse>("/json");

    expect(result).toEqual(mockResponse);
  });

  it("should parse XML responses correctly", async () => {
    const mockXML = `<?xml version="1.0" encoding="UTF-8"?>
      <info deviceID="123456">
        <name>Mock Device</name>
        <type>MockType</type>
      </info>`;

    nock(baseURL)
      .get("/xml")
      .reply(200, mockXML, { "Content-Type": "application/xml" });

    const result = await client.get<any>("/xml");

    expect(result).toEqual({
      info: {
        deviceID: "123456",
        name: "Mock Device",
        type: "MockType",
      },
    });
  });

  it("should include Authorization header when API key is provided", async () => {
    const apiKey = "abc123";
    client = new SoundTouchApiClient(baseURL, apiKey);

    const scope = nock(baseURL, {
      reqheaders: {
        authorization: `Bearer ${apiKey}`,
      },
    })
      .get("/auth-test")
      .reply(200, "<ok>true</ok>", { "Content-Type": "application/xml" });

    const res = await client.get<any>("/auth-test");
    expect(res).toEqual({ ok: true });
    scope.done(); // ensures the mock was actually hit
  });
});
