import * as http from 'http';
import * as net from 'net';
import * as crypto from 'crypto';
import { MusicEngine, MusicCommand, MusicPlaybackState } from '@bubu/music-engine';

/**
 * Payload structure for media update events received from browser extensions.
 */
export interface BrowserMediaUpdatePayload {
  state?: MusicPlaybackState;
  isPlaying?: boolean;
  title?: string;
  artist?: string;
  album?: string;
  duration?: number;
  position?: number;
  artworkUrl?: string;
  [key: string]: unknown;
}

/**
 * Inbound or outbound message format between browser extension and bridge.
 */
export interface BrowserMessage<T = unknown> {
  type: string;
  payload?: T;
  data?: T;
  timestamp?: number;
  command?: string;
}

/**
 * Payload structure for media commands sent to the browser extension.
 */
export interface BrowserCommandPayload {
  command: string;
  action?: string;
  value?: number;
  data?: unknown;
}

export type MessageCallback = (message: BrowserMessage) => void;
export type ConnectionCallback = () => void;

export interface BrowserBridgeOptions {
  host?: string;
  port?: number;
  musicEngine?: MusicEngine;
}

interface ClientConnection {
  socket: net.Socket;
  buffer: Buffer;
}

const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 19876;

/**
 * Lightweight, zero-dependency RFC 6455 WebSocket bridge for bidirectional communication
 * between Bubu Desktop Companion and browser extensions.
 * Binds strictly to 127.0.0.1:19876 for security.
 */
export class BrowserBridge {
  public readonly host: string;
  public readonly port: number;

  private server: http.Server | null = null;
  private readonly clients: Set<ClientConnection> = new Set();
  private musicEngine: MusicEngine | null = null;

  private readonly messageListeners: Set<MessageCallback> = new Set();
  private readonly connectListeners: Set<ConnectionCallback> = new Set();
  private readonly disconnectListeners: Set<ConnectionCallback> = new Set();

  constructor(options?: BrowserBridgeOptions) {
    this.host = options?.host ?? DEFAULT_HOST;
    this.port = options?.port ?? DEFAULT_PORT;

    if (options?.musicEngine) {
      this.setMusicEngine(options.musicEngine);
    }
  }

  /**
   * Associates a MusicEngine instance to forward media updates and receive control commands.
   */
  public setMusicEngine(engine: MusicEngine): void {
    this.musicEngine = engine;
    this.musicEngine.registerSourceHandler('browser', async (command: MusicCommand, value?: number) => {
      this.sendCommand(command, { value });
    });
  }

  /**
   * Starts the HTTP/WebSocket server on 127.0.0.1:19876.
   */
  public async start(): Promise<void> {
    if (this.server) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const srv = http.createServer((_req, res) => {
        // Only WebSocket upgrades allowed; regular HTTP requests rejected
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Bubu Browser Engine WebSocket Endpoint Only');
      });

      srv.on('upgrade', (req: http.IncomingMessage, socket: net.Socket) => {
        this.handleUpgrade(req, socket);
      });

      srv.on('error', (err) => {
        reject(err);
      });

      srv.listen(this.port, this.host, () => {
        this.server = srv;
        resolve();
      });
    });
  }

  /**
   * Stops the server and closes all active client connections.
   */
  public async stop(): Promise<void> {
    if (!this.server) {
      return;
    }

    return new Promise<void>((resolve) => {
      for (const client of this.clients) {
        try {
          this.sendCloseFrame(client.socket);
          client.socket.destroy();
        } catch {
          // ignore socket errors during shutdown
        }
      }
      this.clients.clear();

      this.server?.close(() => {
        this.server = null;
        resolve();
      });
    });
  }

  /**
   * Returns true if at least one browser extension client is currently connected.
   */
  public isConnected(): boolean {
    return this.clients.size > 0;
  }

  /**
   * Sends a command or message to all connected browser extension clients.
   */
  public sendCommand(cmd: string | BrowserCommandPayload, data?: unknown): void {
    let payload: Record<string, unknown>;

    if (typeof cmd === 'string') {
      payload = {
        type: 'COMMAND',
        command: cmd,
        data,
        timestamp: Date.now(),
      };
    } else {
      payload = {
        type: 'COMMAND',
        ...cmd,
        timestamp: Date.now(),
      };
    }

    this.broadcastJson(payload);
  }

  /**
   * Registers a listener for messages received from browser extensions.
   */
  public onMessage(callback: MessageCallback): () => void {
    this.messageListeners.add(callback);
    return () => {
      this.messageListeners.delete(callback);
    };
  }

  /**
   * Registers a listener for new extension client connections.
   */
  public onConnect(callback: ConnectionCallback): () => void {
    this.connectListeners.add(callback);
    return () => {
      this.connectListeners.delete(callback);
    };
  }

  /**
   * Registers a listener for client disconnections.
   */
  public onDisconnect(callback: ConnectionCallback): () => void {
    this.disconnectListeners.add(callback);
    return () => {
      this.disconnectListeners.delete(callback);
    };
  }

  private handleUpgrade(req: http.IncomingMessage, socket: net.Socket): void {
    const upgradeHeader = req.headers['upgrade'];
    const secKey = req.headers['sec-websocket-key'];

    if (
      !upgradeHeader ||
      upgradeHeader.toLowerCase() !== 'websocket' ||
      typeof secKey !== 'string'
    ) {
      socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
      socket.destroy();
      return;
    }

    // RFC 6455 Handshake
    const acceptKey = crypto
      .createHash('sha1')
      .update(secKey + WS_GUID)
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${acceptKey}`,
      '\r\n',
    ];

    socket.write(headers.join('\r\n'));

    const client: ClientConnection = {
      socket,
      buffer: Buffer.alloc(0),
    };

    this.clients.add(client);
    this.notifyConnect();

    socket.on('data', (chunk: Buffer) => {
      client.buffer = Buffer.concat([client.buffer, chunk]);
      this.processFrames(client);
    });

    socket.on('close', () => {
      this.removeClient(client);
    });

    socket.on('error', () => {
      this.removeClient(client);
    });
  }

  private removeClient(client: ClientConnection): void {
    if (this.clients.delete(client)) {
      this.notifyDisconnect();
    }
  }

  private processFrames(client: ClientConnection): void {
    while (client.buffer.length >= 2) {
      const byte0 = client.buffer[0];
      const byte1 = client.buffer[1];

      const opcode = byte0 & 0x0f;
      const isMasked = (byte1 & 0x80) !== 0;
      let payloadLength = byte1 & 0x7f;
      let headerOffset = 2;

      if (payloadLength === 126) {
        if (client.buffer.length < headerOffset + 2) {
          return; // need more data
        }
        payloadLength = client.buffer.readUInt16BE(headerOffset);
        headerOffset += 2;
      } else if (payloadLength === 127) {
        if (client.buffer.length < headerOffset + 8) {
          return; // need more data
        }
        const bigLen = client.buffer.readBigUInt64BE(headerOffset);
        if (bigLen > BigInt(Number.MAX_SAFE_INTEGER)) {
          client.socket.destroy();
          return;
        }
        payloadLength = Number(bigLen);
        headerOffset += 8;
      }

      const maskLength = isMasked ? 4 : 0;
      const totalFrameLength = headerOffset + maskLength + payloadLength;

      if (client.buffer.length < totalFrameLength) {
        return; // wait for remaining frame payload
      }

      let payload: Buffer;
      if (isMasked) {
        const maskKey = client.buffer.subarray(headerOffset, headerOffset + 4);
        const rawPayload = client.buffer.subarray(
          headerOffset + 4,
          headerOffset + 4 + payloadLength
        );
        payload = Buffer.alloc(payloadLength);
        for (let i = 0; i < payloadLength; i++) {
          payload[i] = rawPayload[i] ^ maskKey[i % 4];
        }
      } else {
        payload = client.buffer.subarray(headerOffset, headerOffset + payloadLength);
      }

      // Consume processed frame from buffer
      client.buffer = client.buffer.subarray(totalFrameLength);

      // Handle Opcode
      switch (opcode) {
        case 0x1: {
          // Text frame
          const text = payload.toString('utf8');
          this.handleInboundText(text, client);
          break;
        }
        case 0x8: {
          // Close frame
          this.sendCloseFrame(client.socket);
          client.socket.end();
          this.removeClient(client);
          break;
        }
        case 0x9: {
          // Ping frame -> send Pong
          this.sendPongFrame(client.socket, payload);
          break;
        }
        case 0xa: {
          // Pong frame
          break;
        }
        default:
          break;
      }
    }
  }

  private handleInboundText(text: string, client: ClientConnection): void {
    try {
      const message = JSON.parse(text) as BrowserMessage;
      if (!message || typeof message !== 'object') {
        return;
      }

      const type = (message.type || '').toUpperCase();

      if (type === 'HEARTBEAT') {
        this.sendJsonToClient(client.socket, {
          type: 'HEARTBEAT_ACK',
          timestamp: Date.now(),
        });
      } else if (type === 'MEDIA_UPDATE') {
        const payload = (message.payload || message.data || message) as BrowserMediaUpdatePayload;
        this.forwardMediaUpdate(payload);
      }

      this.notifyMessage(message);
    } catch (err) {
      console.warn('Failed to parse inbound browser message:', err);
    }
  }

  private forwardMediaUpdate(payload: BrowserMediaUpdatePayload): void {
    if (!this.musicEngine) {
      return;
    }

    let state: MusicPlaybackState = 'stopped';
    if (payload.state) {
      state = payload.state;
    } else if (payload.isPlaying !== undefined) {
      state = payload.isPlaying ? 'playing' : 'paused';
    }

    this.musicEngine.updateState(
      {
        state,
        title: typeof payload.title === 'string' ? payload.title : '',
        artist: typeof payload.artist === 'string' ? payload.artist : '',
        album: typeof payload.album === 'string' ? payload.album : '',
        duration: typeof payload.duration === 'number' ? payload.duration : 0,
        position: typeof payload.position === 'number' ? payload.position : 0,
        artworkUrl: typeof payload.artworkUrl === 'string' ? payload.artworkUrl : undefined,
      },
      'browser'
    );
  }

  private broadcastJson(obj: unknown): void {
    const frame = this.encodeTextFrame(JSON.stringify(obj));
    for (const client of this.clients) {
      try {
        client.socket.write(frame);
      } catch {
        // ignore dead socket write errors
      }
    }
  }

  private sendJsonToClient(socket: net.Socket, obj: unknown): void {
    try {
      socket.write(this.encodeTextFrame(JSON.stringify(obj)));
    } catch {
      // ignore
    }
  }

  private encodeTextFrame(text: string): Buffer {
    const payload = Buffer.from(text, 'utf8');
    const len = payload.length;
    let header: Buffer;

    if (len <= 125) {
      header = Buffer.alloc(2);
      header[0] = 0x81; // FIN + text opcode
      header[1] = len;  // unmasked (server to client)
    } else if (len <= 65535) {
      header = Buffer.alloc(4);
      header[0] = 0x81;
      header[1] = 126;
      header.writeUInt16BE(len, 2);
    } else {
      header = Buffer.alloc(10);
      header[0] = 0x81;
      header[1] = 127;
      header.writeBigUInt64BE(BigInt(len), 2);
    }

    return Buffer.concat([header, payload]);
  }

  private sendPongFrame(socket: net.Socket, payload: Buffer): void {
    const header = Buffer.from([0x8a, payload.length]);
    try {
      socket.write(Buffer.concat([header, payload]));
    } catch {
      // ignore
    }
  }

  private sendCloseFrame(socket: net.Socket): void {
    try {
      socket.write(Buffer.from([0x88, 0x00]));
    } catch {
      // ignore
    }
  }

  private notifyConnect(): void {
    for (const listener of this.connectListeners) {
      try {
        listener();
      } catch (err) {
        console.error('Error in onConnect listener:', err);
      }
    }
  }

  private notifyDisconnect(): void {
    for (const listener of this.disconnectListeners) {
      try {
        listener();
      } catch (err) {
        console.error('Error in onDisconnect listener:', err);
      }
    }
  }

  private notifyMessage(msg: BrowserMessage): void {
    for (const listener of this.messageListeners) {
      try {
        listener(msg);
      } catch (err) {
        console.error('Error in onMessage listener:', err);
      }
    }
  }
}
