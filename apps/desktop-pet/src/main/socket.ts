import * as net from 'net';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { BrowserWindow } from 'electron';

export function setupSocketServer(mainWindow: BrowserWindow) {
    const socketPath = process.env.XDG_RUNTIME_DIR 
        ? path.join(process.env.XDG_RUNTIME_DIR, 'bubu.sock')
        : path.join(os.tmpdir(), 'bubu.sock');

    if (fs.existsSync(socketPath)) {
        try { fs.unlinkSync(socketPath); } catch (e) {}
    }

    const server = net.createServer((client) => {
        let buffer = '';
        client.on('data', (data) => {
            buffer += data.toString();
            if (buffer.includes('\n')) {
                const command = buffer.trim();
                buffer = '';
                
                try {
                    let response = { status: 'ok', data: {} };
                    
                    if (command === 'status') {
                        response.data = { running: true, state: 'active' };
                    } else if (command === 'pet show') {
                        mainWindow.show();
                    } else if (command === 'pet hide') {
                        mainWindow.hide();
                    }
                    
                    client.write(JSON.stringify(response) + '\n');
                } catch (e) {
                    client.write(JSON.stringify({ status: 'error', error: String(e) }) + '\n');
                }
            }
        });
    });

    server.listen(socketPath, () => {
        // Ready
    });

    // Cleanup on exit
    process.on('exit', () => {
        try { fs.unlinkSync(socketPath); } catch (e) {}
    });
}
