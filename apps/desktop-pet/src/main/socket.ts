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
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                
                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const parsed = JSON.parse(line);
                        const command = typeof parsed === 'string' ? parsed : (parsed.command || '');
                        
                        let response = { status: 'ok', data: {} };
                        
                        if (command === 'status') {
                            response.data = { running: true, state: 'active' };
                        } else if (command === 'pet:show' || command === 'pet show') {
                            mainWindow.show();
                        } else if (command === 'pet:hide' || command === 'pet hide') {
                            mainWindow.hide();
                        } else if (command === 'notification:test') {
                            mainWindow.webContents.send('show-notification', parsed.args);
                        } else if (command === 'settings' || command === 'config') {
                            const { openSettingsWindow } = require('./settingsWindow');
                            openSettingsWindow();
                            mainWindow.hide();
                        }
                        
                        client.write(JSON.stringify(response) + '\n');
                        client.end();
                    } catch (e) {
                        client.write(JSON.stringify({ status: 'error', error: String(e) }) + '\n');
                        client.end();
                    }
                }
            }
        });
    });

    server.listen(socketPath, () => {});

    process.on('exit', () => {
        try { fs.unlinkSync(socketPath); } catch (e) {}
    });
}
