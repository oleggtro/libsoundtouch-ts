import { SoundTouchApiClient } from "../client.js";
import { DeviceInfo } from "../types.js";

export class InfoAPI {
  constructor(private client: SoundTouchApiClient) {}

  async getInfo(): Promise<DeviceInfo> {
    return this.client.get<DeviceInfo>("/info");
  }
}
