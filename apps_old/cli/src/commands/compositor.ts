import { sendCommand } from '../ipc-client';

export async function compositorCommand(subArgs: string[]): Promise<void> {
    const cmd = subArgs[0] || 'status';
    
    if (cmd === 'status') {
        try {
            const status = await sendCommand('compositor-status');
            if (status) {
                console.log(JSON.stringify(status, null, 2));
            } else {
                console.log('Compositor status unavailable.');
            }
        } catch {
            console.log('Bubu daemon is offline.');
        }
    } else {
        console.log(`Unknown compositor command: ${cmd}`);
    }
}
