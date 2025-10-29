import { SoundTouchApiClient } from "./client.js";
export class SoundTouchAPI {

  constructor(baseURL: string) {
    const client = new SoundTouchApiClient(baseURL);
  }
}
