import { sendCommand } from '../ipc-client';
import { fmt, handleDaemonError } from '../utils/colors';

export async function sayCommand(args: string[]): Promise<void> {
  const message = args.join(' ');
  if (!message) {
    console.error(fmt.error('Please provide a message. Example: bubu say "Hello world!"'));
    process.exitCode = 1;
    return;
  }

  try {
    await sendCommand('notification:test', { title: '', message });
    console.log(fmt.success(`Bubu said: "${message}"`));
  } catch (err) {
    handleDaemonError(err);
    process.exitCode = 1;
  }
}
