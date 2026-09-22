import { sendCommand } from '../ipc-client';

export async function platformCommand(subArgs: string[]): Promise<void> {
    const cmd = subArgs[0] || 'detect';
    
    if (cmd === 'detect' || cmd === 'status') {
        try {
            const status = await sendCommand('compositor-status');
            if (status) {
                console.log(`Bubu Platform Engine Status:`);
                console.log(JSON.stringify(status, null, 2));
            } else {
                console.log('Platform status unavailable.');
            }
        } catch {
            console.log('Bubu daemon is offline.');
        }
    } else {
        console.log(`Unknown platform command: ${cmd}`);
    }
}
