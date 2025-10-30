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

export interface Capabilities {
  capabilities: {
    "@_deviceID"?: string;
    networkConfig?: {
      dualMode?: boolean;
      wsapiproxy?: boolean;
      allInterfacesSupported?: Record<string, unknown> | null;
      wlanInterfaces?: Record<string, unknown> | null;
      security?: Record<string, unknown> | null;
    };
    dspCapabilities?: {
      dspMonoStereo?: {
        "@_available"?: boolean;
      };
    };
    lightswitch?: boolean;
    clockDisplay?: boolean;
    capability?: Array<{
      "@_name"?: string;
      "@_url"?: string;
      "@_info"?: string;
    }>;
    lrStereoCapable?: boolean;
    bcoresetCapable?: boolean;
    disablePowerSaving?: boolean;
  };
}

// i dont know what other formats there are
export enum ClockTimeFormat {
  h12 = "TIME_FORMAT_12HOUR_ID",
  h24 = "TIME_FORMAT_24HOUR_ID",
}

export interface ClockDisplay {
  clockDisplay: {
    clockConfig: {
    "@_timezoneInfo": string;
    "@_userEnable": boolean;
    "@_timeFormat": ClockTimeFormat; 
    "@_userOffsetMinute": number; 
    "@_brightnessLevel": number; 
    "@_userUtcTime": number; 
  }};
}

export interface ClockTime {
  clockTime: {
    "@_utcTime": number;
    "@_cueMusic": number;
    "@_timeFormat": ClockTimeFormat;
    "@_brightness": number;
    "@_clockError": number;
    "@_utcSyncTime": number;
    localTime: {
      "@_year": number;
      "@_month": number;
      "@_dayOfMonth": number;
      "@_dayOfWeek": number;
      "@_hour": number;
      "@_minute": number;
      "@_second": number;
    };
  }
}

export enum SoundTouchConfigurationStatus {
  Configured = "SOUNDTOUCH_CONFIGURED",
  NotConfigured = "SOUNDTOUCH_NOT_CONFIGURED",
  Configuring = "SOUNDTOUCH_CONFIGURING",
}

export interface ConfigurationStatus {
  SoundTouchConfigurationStatus: {
    "@_status": SoundTouchConfigurationStatus;
  };
}


export interface DSPMonoStereo {
  DSPMonoStereo: {
    "@_deviceID": string;
    mono: {
    "@_enable": false;
    }
  }
}