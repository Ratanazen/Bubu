/**
 * All IPC channel names used between Main and Renderer processes.
 */
export const IpcChannels = {
  // Pet window controls & state
  PET_GET_STATE: 'bubu:pet:get-state',
  PET_SET_STATE: 'bubu:pet:set-state',
  PET_SET_ANIMATION: 'bubu:pet:set-animation',
  PET_GET_POSITION: 'bubu:pet:get-position',
  PET_SET_POSITION: 'bubu:pet:set-position',
  PET_SHOW: 'bubu:pet:show',
  PET_HIDE: 'bubu:pet:hide',
  PET_PAUSE: 'bubu:pet:pause',
  PET_RESUME: 'bubu:pet:resume',
  PET_INTERACTION: 'bubu:pet:interaction',

  // Settings
  SETTINGS_GET: 'bubu:settings:get',
  SETTINGS_SET: 'bubu:settings:set',
  SETTINGS_RESET: 'bubu:settings:reset',
  SETTINGS_CHANGED: 'bubu:settings:changed',

  // Skin & Character
  SKIN_GET_CURRENT: 'bubu:skin:get-current',
  SKIN_SET: 'bubu:skin:set',
  SKIN_LIST: 'bubu:skin:list',
  SKIN_INSTALL: 'bubu:skin:install',
  SKIN_DELETE: 'bubu:skin:delete',

  // Style
  STYLE_GET_CURRENT: 'bubu:style:get-current',
  STYLE_SET: 'bubu:style:set',
  STYLE_LIST: 'bubu:style:list',

  // Music & Audio
  MUSIC_GET_STATE: 'bubu:music:get-state',
  MUSIC_COMMAND: 'bubu:music:command',
  MUSIC_STATE_CHANGED: 'bubu:music:state-changed',

  // Lyrics
  LYRICS_GET: 'bubu:lyrics:get',
  LYRICS_UPDATED: 'bubu:lyrics:updated',

  // Notifications
  NOTIFICATION_SEND: 'bubu:notification:send',
  NOTIFICATION_RECEIVED: 'bubu:notification:received',
  NOTIFICATION_DISMISS: 'bubu:notification:dismiss',

  // Browser Integration
  BROWSER_STATUS: 'bubu:browser:status',
  BROWSER_CONNECT: 'bubu:browser:connect',
  BROWSER_DISCONNECT: 'bubu:browser:disconnect',
  BROWSER_MESSAGE: 'bubu:browser:message',

  // Platform & System
  PLATFORM_GET_INFO: 'bubu:platform:get-info',
  PLATFORM_GET_DISPLAYS: 'bubu:platform:get-displays',

  // Window Management
  WINDOW_MINIMIZE: 'bubu:window:minimize',
  WINDOW_MAXIMIZE: 'bubu:window:maximize',
  WINDOW_CLOSE: 'bubu:window:close',
  WINDOW_SET_IGNORE_MOUSE: 'bubu:window:set-ignore-mouse',
  WINDOW_SET_ALWAYS_ON_TOP: 'bubu:window:set-always-on-top',

  // Event Broadcasting
  EVENT_BROADCAST: 'bubu:event:broadcast',
} as const;

export type IpcChannel = (typeof IpcChannels)[keyof typeof IpcChannels];

/**
 * Generic IPC request wrapper.
 */
export interface IpcRequest<T = any> {
  id?: string;
  channel: string;
  payload?: T;
  timestamp?: number;
}

/**
 * Generic IPC response wrapper.
 */
export interface IpcResponse<T = any> {
  id?: string;
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: number;
}
