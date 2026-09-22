/**
 * Connection state of the companion browser extension.
 */
export type BrowserConnectionState = 'connected' | 'disconnected' | 'connecting';

/**
 * Information describing the connected browser and installed extension.
 */
export interface BrowserInfo {
  name: string;
  version: string;
  extensionVersion: string;
}

/**
 * Message frame exchanged with the browser extension.
 */
export interface BrowserMessage<T = any> {
  type: string;
  payload: T;
  timestamp: number;
}
