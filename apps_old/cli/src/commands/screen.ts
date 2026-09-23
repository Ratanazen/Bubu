import { sendCommand } from '../ipc-client';

export async function screenCommand(subArgs: string[]): Promise<void> {
    const cmd = subArgs[0] || 'list';
    
    if (cmd === 'list') {
        try {
            const displays = await sendCommand('get-all-displays');
            if (displays && Array.isArray(displays)) {
                displays.forEach(d => {
                    console.log(`Monitor: ${d.name} (${d.id}) - ${d.bounds?.width}x${d.bounds?.height} @ ${d.bounds?.x},${d.bounds?.y} ${d.isPrimary ? '[PRIMARY]' : ''}`);
                });
            }
        } catch {
            console.log('Bubu daemon is offline.');
        }
    } else if (cmd === 'map') {
        console.log('Screen map visualization...');
        try {
            const displays = await sendCommand('get-all-displays');
            if (displays && Array.isArray(displays)) {
                console.log('┌──────────────────────┐');
                console.log('│      Monitors        │');
                displays.forEach(d => {
                     console.log(`│ ${d.name.padEnd(20)} │`);
                });
                console.log('└──────────────────────┘');
            }
        } catch {}
    } else {
        console.log(`Unknown screen command: ${cmd}`);
    }
}
