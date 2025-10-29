import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { XMLParser } from "fast-xml-parser";
import { AudioDSPControls, Bass, BassCapabilities, DeviceInfo } from "./types.js";

export class SoundTouchApiClient {
  private client: AxiosInstance;
  private xmlParser: XMLParser;
  private baseURL: string;

  constructor(baseURL_param: string, apiKey?: string) {
    this.client = axios.create({
      baseURL: baseURL_param,
      headers: {
        Accept: "application/xml, text/xml, */*;q=0.8",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      transformResponse: [], // prevent axios from auto-parsing JSON
    });

    this.baseURL = baseURL_param;

    this.xmlParser = new XMLParser({
      ignoreAttributes: false, // keep @attributes
      attributeNamePrefix: "", // cleaner property names
      ignoreDeclaration: true, // ignore XML declaration
    });
  }

  private parseResponse<T = any>(response: AxiosResponse): T {
    const contentType = response.headers["content-type"];
    const data = response.data;

    if (contentType?.includes("xml")) {
      return this.xmlParser.parse(data) as T;
    }

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as T;
    }
  }

  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.get(this.baseURL + path, config);
    return this.parseResponse<T>(res);
  }



  /**
   * Gets information about the connected soundtouch device.
   * @returns DeviceInfo about the selected unit
   */
    async getInfo(): Promise<DeviceInfo> {
      return this.get<DeviceInfo>("/info");
    }

    /**
     * Get the bass capabilities of the device.
     * @returns The devices BassCapabilities
     */
    async getBassCapabilities(): Promise<BassCapabilities> {
      return this.get<BassCapabilities>("/bassCapabilities");
    }


    /**
     * Gets the currently set bass level.
     * @returns The current Bass level.
     */
    async getBass(): Promise<Bass> {
      return this.get<Bass>("/bass");
    }


    /** 
     * Sets the Bass level to the specified value.
     * @param value The desired Bass level (must be between -9 and 0).
     */
    async setBass(value: number): Promise<void> {
      await this.client.post(this.baseURL + "/bass", `<bass>${value}</bass>`, {
        headers: { "Content-Type": "application/xml" },
      });
    }

    /**
     * Get the current Audio DSP Controls
     * @returns The current Audio DSP Controls
     */
    async getAudioDSPControls(): Promise<AudioDSPControls> {
      return this.get<AudioDSPControls>("/audiodspcontrols");
    }

}
