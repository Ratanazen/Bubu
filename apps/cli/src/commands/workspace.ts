import { sendCommand } from '../ipc-client';

export async function workspaceCommand(subArgs: string[]): Promise<void> {
    const cmd = subArgs[0] || 'list';
    
    if (cmd === 'list') {
        try {
            const workspaces = await sendCommand('get-workspaces');
            if (workspaces && Array.isArray(workspaces)) {
                workspaces.forEach((w: any) => {
                    console.log(`Workspace: ${w.name} (${w.id}) - Monitor: ${w.monitorId} ${w.isActive ? '[ACTIVE]' : ''}`);
                });
            } else {
                console.log('Workspace info unavailable for current compositor.');
            }
        } catch {
            console.log('Bubu daemon is offline.');
        }
    } else {
        console.log(`Unknown workspace command: ${cmd}`);
    }
}
