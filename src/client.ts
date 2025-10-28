import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { XMLParser } from "fast-xml-parser";

export class SoundTouchApiClient {
  private client: AxiosInstance;
  private xmlParser: XMLParser;

  constructor(baseURL: string, apiKey?: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        Accept: "application/xml, text/xml, */*;q=0.8",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      transformResponse: [], // prevent axios from auto-parsing JSON
    });

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
    const res = await this.client.get(path, config);
    return this.parseResponse<T>(res);
  }
}
