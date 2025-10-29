import { SoundTouchApiClient } from "../client.js";
import { Bass } from "../types.js";

export class BassCapabilitiesAPI {
  constructor(private client: SoundTouchApiClient) {}

  async getBass(): Promise<Bass> {
    return this.client.get<Bass>("/bass");
  }
}
