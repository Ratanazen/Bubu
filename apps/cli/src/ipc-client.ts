import * as net from 'net';
import * as path from 'path';

/**
 * Returns the platform-specific IPC socket path or named pipe.
 */
export function getSocketPath(): string {
    return process.platform === 'win32'
        ? '\\\\.\\pipe\\bubu-desktop-companion'
        : path.join(process.env.XDG_RUNTIME_DIR || '/tmp', 'bubu.sock');
}

/**
 * Sends a command with optional arguments to the running Bubu daemon.
 *
 * @param command - Command name (e.g., 'pet:show', 'music:play', 'status')
 * @param args - Optional payload data or parameters
 * @returns Response from the daemon (parsed JSON or raw string)
 */
export async function sendCommand(command: string, args?: any): Promise<any> {
    const socketPath = getSocketPath();

    return new Promise((resolve, reject) => {
        let settled = false;

        const timer = setTimeout(() => {
            if (!settled) {
                settled = true;
                client.destroy();
                reject(new Error('Timeout'));
            }
        }, 5000);

        const client = net.createConnection(socketPath, () => {
            client.write(JSON.stringify({ command, args }) + '\n');
        });

        let data = '';
        client.on('data', chunk => {
            data += chunk;
        });

        client.on('end', () => {
            if (!settled) {
                settled = true;
                clearTimeout(timer);
                try {
                    resolve(JSON.parse(data));
                } catch {
                    resolve(data);
                }
            }
        });

        client.on('error', err => {
            if (!settled) {
                settled = true;
                clearTimeout(timer);
                reject(err);
            }
        });
    });
}
