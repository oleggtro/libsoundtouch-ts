import { SoundTouchApiClient } from "./client.ts";
import { InfoAPI } from "./endpoints/info.ts";

export class SoundTouchAPI {
  info: InfoAPI;

  constructor(baseURL: string) {
    const client = new SoundTouchApiClient(baseURL);
    this.info = new InfoAPI(client);
  }
}
