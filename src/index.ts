import { SoundTouchApiClient } from "./client.ts";
import { InfoAPI } from "./endpoints/info.ts";
import { BassCapabilitiesAPI } from "./endpoints/bassCapabilities.ts";

export class SoundTouchAPI {
  info: InfoAPI;
  bassCapabilities: BassCapabilitiesAPI;

  constructor(baseURL: string) {
    const client = new SoundTouchApiClient(baseURL);
    this.info = new InfoAPI(client);
    this.bassCapabilities = new BassCapabilitiesAPI(client);
  }
}
