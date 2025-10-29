import { SoundTouchApiClient } from "../client.js";
import { BassCapabilities } from "../types.js";

export class BassCapabilitiesAPI {
  constructor(private client: SoundTouchApiClient) {}

  async getBassCapabilities(): Promise<BassCapabilities> {
    return this.client.get<BassCapabilities>("/bassCapabilities");
  }
}
