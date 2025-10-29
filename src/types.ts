export interface DeviceInfo {
  info: {
    "@_deviceID"?: string;
    name: string;
    type: string;
    margeAccountUUID: string;
    components: {
      component: Array<{
        componentCategory: string;
        softwareVersion: string;
        serialNumber: string;
      }>;
    };
    margeURL: string;
    networkInfo: Array<{
      "@_type"?: string;
      macAddress: string;
      ipAddress: string;
    }>;
    moduleType: string;
    variant: string;
    variantMode: string;
    countryCode: string;
    regionCode: string;
  };
}


export interface BassCapabilities {
  bassCapabilities: {
    "@_deviceID"?: string;
    bassAvailable: boolean;
    bassMin: number;
    bassMax: number;
    bassDefault: number;
  };
}

export interface Bass {
  bassCapabilities: {
    "@_deviceID"?: string;
    targetbass: number;
    actualbass: number;
  };
}

export enum AudioDSPMode {
  Normal = "AUDIO_MODE_NORMAL",
  Dialog = "AUDIO_MODE_DIALOG"
}

export interface AudioDSPControls {
  audiodspcontrols: {
    "@_audiomode": AudioDSPMode;
    "@_videosyncaudiodelay": string;
    "@_supportedaudiomodes": string;
  };
}

export interface BluetoothInfo {
  "@_BluetoothMACAddress"?: string
  status?: string;
}