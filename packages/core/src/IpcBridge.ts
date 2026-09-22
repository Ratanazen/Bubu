/**
 * IpcBridge - Local IPC communication bridge for CLI, Control Center, and Daemons.
 * Uses Unix domain sockets on Linux/macOS and Named Pipes on Windows.
 * Implements newline-delimited JSON RPC message exchange with timeouts and error handling.
 */

import * as net from 'net';
import * as path from 'path';
import * as fs from 'fs';

export interface IpcRequest {
  id: string;
  command: string;
  data?: any;
}

export interface IpcResponse<T = any> {
  id: string;
  command?: string;
  success: boolean;
  data?: T;
  error?: string;
}

export type IpcCommandHandler<TInput = any, TOutput = any> = (data: TInput) => Promise<TOutput> | TOutput;

/**
 * Resolves the default socket or named pipe path for an application name.
 */
export function resolveSocketPath(appName?: string): string {
  if (process.platform === 'win32') {
    const pipeName = appName ? appName.replace(/[^a-zA-Z0-9_-]/g, '-') : 'bubu-desktop-companion';
    return `\\\\.\\pipe\\${pipeName}`;
  }
  const runtimeDir = process.env.XDG_RUNTIME_DIR || '/tmp';
  const socketFileName = appName ? `${appName}.sock` : 'bubu.sock';
  return path.join(runtimeDir, socketFileName);
}

export class IpcBridge {
  private server: net.Server | null = null;
  private socketPath: string;
  private handlers: Map<string, (data: any) => Promise<any>> = new Map();

  constructor(appName?: string, customSocketPath?: string) {
    if (customSocketPath) {
      this.socketPath = customSocketPath;
    } else if (process.platform === 'win32') {
      this.socketPath = appName
        ? `\\\\.\\pipe\\${appName.replace(/[^a-zA-Z0-9_-]/g, '-')}`
        : `\\\\.\\pipe\\bubu-desktop-companion`;
    } else {
      const runtimeDir = process.env.XDG_RUNTIME_DIR || '/tmp';
      this.socketPath = path.join(runtimeDir, appName ? `${appName}.sock` : 'bubu.sock');
    }
  }

  /**
   * Returns the socket path or pipe path in use.
   */
  getSocketPath(): string {
    return this.socketPath;
  }

  /**
   * Checks whether the IPC server is currently listening.
   */
  isListening(): boolean {
    return this.server !== null && this.server.listening;
  }

  /**
   * Registers a command handler.
   */
  registerHandler(command: string, handler: (data: any) => Promise<any>): void {
    if (!command || typeof command !== 'string') {
      throw new TypeError('Command name must be a non-empty string');
    }
    if (typeof handler !== 'function') {
      throw new TypeError('Command handler must be a function');
    }
    this.handlers.set(command, handler);
  }

  /**
   * Unregisters a command handler.
   */
  unregisterHandler(command: string): boolean {
    return this.handlers.delete(command);
  }

  /**
   * Returns a list of all registered commands.
   */
  getRegisteredCommands(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Starts the IPC server and listens on the configured socket or pipe.
   */
  async startServer(): Promise<void> {
    if (this.server) {
      throw new Error(`IPC server is already running on ${this.socketPath}`);
    }

    // On Unix platforms, check if the socket exists and if it's stale
    if (process.platform !== 'win32' && fs.existsSync(this.socketPath)) {
      const isStale = await this.isSocketStale(this.socketPath);
      if (isStale) {
        try {
          fs.unlinkSync(this.socketPath);
        } catch (err) {
          console.warn(`[IpcBridge] Failed to remove stale socket at "${this.socketPath}":`, err);
        }
      } else {
        throw new Error(`IPC socket "${this.socketPath}" is already in use by another active process`);
      }
    }

    return new Promise<void>((resolve, reject) => {
      const server = net.createServer((socket) => {
        let buffer = '';
        socket.setEncoding('utf-8');

        socket.on('data', async (chunk) => {
          buffer += chunk;
          let newlineIdx = buffer.indexOf('\n');
          while (newlineIdx !== -1) {
            const line = buffer.slice(0, newlineIdx).trim();
            buffer = buffer.slice(newlineIdx + 1);
            if (line.length > 0) {
              await this.processMessage(socket, line);
            }
            newlineIdx = buffer.indexOf('\n');
          }
        });

        socket.on('error', (err: any) => {
          if (err.code !== 'ECONNRESET' && err.code !== 'EPIPE') {
            console.error('[IpcBridge] Client socket error:', err);
          }
        });
      });

      const onInitialError = (err: Error) => {
        this.server = null;
        reject(err);
      };

      server.once('error', onInitialError);

      server.listen(this.socketPath, () => {
        server.removeListener('error', onInitialError);
        this.server = server;

        server.on('error', (runtimeErr) => {
          console.error(`[IpcBridge] Server runtime error on "${this.socketPath}":`, runtimeErr);
        });

        resolve();
      });
    });
  }

  /**
   * Stops the IPC server and cleans up the socket file if on POSIX.
   */
  async stopServer(): Promise<void> {
    if (!this.server) {
      return;
    }

    const currentServer = this.server;
    this.server = null;

    await new Promise<void>((resolve) => {
      currentServer.close(() => resolve());
    });

    if (process.platform !== 'win32' && fs.existsSync(this.socketPath)) {
      try {
        fs.unlinkSync(this.socketPath);
      } catch (err) {
        console.error(`[IpcBridge] Failed to cleanup socket file at "${this.socketPath}":`, err);
      }
    }
  }

  /**
   * Sends a command to the IPC server, waiting for a response with a timeout.
   */
  static async sendCommand(
    command: string,
    data?: any,
    options?: number | { appName?: string; socketPath?: string; timeoutMs?: number }
  ): Promise<any> {
    if (!command || typeof command !== 'string') {
      throw new TypeError('Command must be a non-empty string');
    }

    let socketPath: string;
    let timeoutMs = 5000;

    if (typeof options === 'number') {
      timeoutMs = options;
      socketPath = resolveSocketPath();
    } else if (options && typeof options === 'object') {
      if (typeof options.timeoutMs === 'number' && options.timeoutMs > 0) {
        timeoutMs = options.timeoutMs;
      }
      socketPath = options.socketPath || resolveSocketPath(options.appName);
    } else {
      socketPath = resolveSocketPath();
    }

    return new Promise<any>((resolve, reject) => {
      const client = net.connect({ path: socketPath });
      const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      let buffer = '';
      let timer: NodeJS.Timeout | null = null;
      let settled = false;

      const cleanup = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        client.removeAllListeners();
        if (!client.destroyed) {
          client.destroy();
        }
      };

      const settleReject = (err: Error) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(err);
      };

      const settleResolve = (val: any) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(val);
      };

      timer = setTimeout(() => {
        settleReject(new Error(`[IpcBridge] Command "${command}" timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      client.setEncoding('utf-8');

      client.once('connect', () => {
        const request: IpcRequest = {
          id: requestId,
          command,
          data
        };
        try {
          client.write(JSON.stringify(request) + '\n');
        } catch (err) {
          settleReject(err instanceof Error ? err : new Error(String(err)));
        }
      });

      client.on('data', (chunk) => {
        buffer += chunk;
        const newlineIdx = buffer.indexOf('\n');
        if (newlineIdx !== -1) {
          const line = buffer.slice(0, newlineIdx).trim();
          try {
            const response: IpcResponse = JSON.parse(line);
            if (response.id && response.id !== requestId) {
              return;
            }
            if (response.success) {
              settleResolve(response.data);
            } else {
              settleReject(new Error(response.error || `Command "${command}" failed`));
            }
          } catch (err) {
            settleReject(
              new Error(`Failed to parse IPC response: ${err instanceof Error ? err.message : String(err)}`)
            );
          }
        }
      });

      client.once('error', (err: any) => {
        if (err.code === 'ENOENT' || err.code === 'ECONNREFUSED') {
          settleReject(
            new Error(`Could not connect to IPC server at "${socketPath}". The application may not be running.`)
          );
        } else {
          settleReject(err);
        }
      });

      client.once('close', () => {
        if (!settled) {
          settleReject(new Error(`IPC connection closed before response was received for command "${command}"`));
        }
      });
    });
  }

  /**
   * Internal message processor for handling incoming requests from clients.
   */
  private async processMessage(socket: net.Socket, line: string): Promise<void> {
    let request: IpcRequest;
    try {
      request = JSON.parse(line);
    } catch (err) {
      this.sendResponse(socket, {
        id: 'unknown',
        success: false,
        error: `Invalid JSON payload: ${err instanceof Error ? err.message : String(err)}`
      });
      return;
    }

    const { id, command, data } = request;
    const handler = this.handlers.get(command);

    if (!handler) {
      this.sendResponse(socket, {
        id,
        command,
        success: false,
        error: `Unknown command: "${command}"`
      });
      return;
    }

    try {
      const result = await handler(data);
      this.sendResponse(socket, {
        id,
        command,
        success: true,
        data: result
      });
    } catch (err) {
      this.sendResponse(socket, {
        id,
        command,
        success: false,
        error: err instanceof Error ? err.message : String(err)
      });
    }
  }

  /**
   * Writes a response line to the client socket safely.
   */
  private sendResponse(socket: net.Socket, response: IpcResponse): void {
    if (!socket.writable) return;
    try {
      socket.write(JSON.stringify(response) + '\n');
    } catch (err) {
      console.error('[IpcBridge] Error sending response to client:', err);
    }
  }

  /**
   * Checks if an existing socket file on POSIX has an active listener or is stale.
   */
  private async isSocketStale(socketPath: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const probe = net.connect({ path: socketPath });
      probe.once('connect', () => {
        probe.end();
        resolve(false);
      });
      probe.once('error', (err: any) => {
        probe.destroy();
        if (err.code === 'ECONNREFUSED' || err.code === 'ENOENT') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}
