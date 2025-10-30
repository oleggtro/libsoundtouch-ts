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
    }
  };
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

export enum GroupRoleRole {
  Left = "LEFT",
  Right = "RIGHT",
}

export interface GroupRole {
  deviceId: string;
  role: GroupRoleRole;
  ipAddress: string;
}


export interface Group {
  group: {
    "@_id"?: string;
    name: string;
    masterDeviceId: string;
    roles: Array<GroupRole>;
    senderIPAddress?: string;
    status?: GroupStatus
  }
}


export enum GroupStatus {
  Ok = "GROUP_OK",
  // Dont know what other states there are
}


export interface RemoveGroup {
  group?: string;
}

/**
 * @todo find other Introspect Responses
 */
export interface SpotifyAccountIntrospectResponse {
  "@_state": IntrospectState;
  "@_user": string;
  "@_isPlaying": boolean;
  "@_tokenLastChangedTimeSeconds": number;
  "@_tokenLastChangedTimeMicroseconds": number;
  "@_shuffleMode": boolean;
  "@_playStatusState": number;
  "@_currentUri": string;
  "@_receivedPlaybackRequest": boolean;
  "@_subscriptionType": string;
  cachedPlaybackRequest: CachedPlaybackRequest;
  nowPlaying: NowPlaying;
  contentItemHistory: ContentItemHistory;
}

export interface NowPlaying {
  "@_skipPreviousSupported": boolean;
  "@_seekSupported": boolean;
  "@_resumeSupported": boolean;
  "@_collectData": boolean;
}
export interface ContentItemHistory {
  "@_maxSize": number;
}

export interface CachedPlaybackRequest {
}


/**
 * @todo find out what other Introspect states there are
 */
export enum IntrospectState {
  InactiveUnselected = "InactiveUnselected",
  // dont know what other states there are
}

export interface IntrospectRequest {
  source: IntrospectSource;
  sourceAccount: string;
}

export enum IntrospectSource {
  Spotify = "SPOTIFY",
  Pandora = "PANDORA",
  STORED_MUSIC = "STORED_MUSIC",
}

export enum Key {
  AddFavorite = "ADD_FAVORITE",
  AuxInput = "AUX_INPUT",
  Bookmark = "BOOKMARK",
  Mute = "MUTE",
  NextTrack = "NEXT_TRACK",
  Pause = "PAUSE",
  Play = "PLAY",
  PlayPause = "PLAY_PAUSE",
  Power = "POWER",
  Preset1 = "PRESET_1",
  Preset2 = "PRESET_2",
  Preset3 = "PRESET_3",
  Preset4 = "PRESET_4",
  Preset5 = "PRESET_5",
  Preset6 = "PRESET_6",
  PreviousTrack = "PREV_TRACK",
  RemoveFavorite = "REMOVE_FAVORITE",
  RepeatAll = "REPEAT_ALL",
  RepeatOff = "REPEAT_OFF",
  RepeatOne = "REPEAT_ONE",
  ShuffleOff = "SHUFFLE_OFF",
  ShuffleOn = "SHUFFLE_ON",
  Stop = "STOP",
  ThumbsDown = "THUMBS_DOWN",
  ThumbsUp = "THUMBS_UP",
  VolumeDown = "VOLUME_DOWN",
  VolumeUp = "VOLUME_UP",
}

export enum KeyPressState {
  Press = "press",
  Release = "release",
  Repeat = "repeat",
}

export enum KeySender {
  Gabbo = "Gabbo",
  IrRemote = "IrRemote",
  Console = "Console",
  LightswitchRemote = "LightswitchRemote",
  BoselinkRemote = "BoselinkRemote",
  Etap = "Etap",
}

export interface KeyPressResponse {
  status: string;
}

export interface Language {
  // i dont know what the numbers mean
  sysLanguage: number;
}


export interface ListMediaServersResponse {
  ListMediaServersResponse: {
    media_server: Array<MediaServer>;
  };
}
export interface MediaServer {
  "@_id": string;
  "@_mac": string;
  "@_ip": string;
  "@_manufacturer": string;
  "@_model_name": string;
  "@_friendly_name": string;
  "@_model_description": string;
  "@_location": string;
}
export interface GetName {
  name: string;
}