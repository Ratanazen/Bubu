import { sendCommand } from '../ipc-client';
import { colors, fmt } from '../utils/colors';

export async function openSettings() {
    try {
        console.log(fmt.info('Opening Bubu Control Center...'));
        await sendCommand('settings');
    } catch (e) {
        console.error(fmt.error('Failed to open Control Center. Is Bubu running?'));
    }
}
