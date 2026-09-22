import { sendCommand } from '../ipc-client';
import { fmt, handleDaemonError, colors } from '../utils/colors';

/**
 * Handles 'bubu browser' subcommands: status.
 */
export async function browserCommand(args: string[]): Promise<void> {
  const action = args[0]?.toLowerCase() || 'status';

  switch (action) {
    case 'status': {
      try {
        const res = await sendCommand('browser:status', { action: 'status' });
        console.log(`\n${fmt.bold(fmt.cyan('🌐 Bubu Browser Extension Integration'))}`);
        console.log(`───────────────────────────────────────`);

        if (res && typeof res === 'object') {
          const isConnected = Boolean(res.connected);
          const statusStr = isConnected
            ? `${colors.brightGreen}● Connected${colors.reset}`
            : `${colors.gray}○ Disconnected${colors.reset}`;

          console.log(`  ${fmt.bold('Status:')}     ${statusStr}`);
          if (isConnected) {
            console.log(`  ${fmt.bold('Browser:')}    ${fmt.yellow(res.browserName || res.browser || 'Chromium / Firefox')}`);
            if (res.tabTitle || res.title) {
              console.log(`  ${fmt.bold('Active Tab:')} ${res.tabTitle || res.title}`);
            }
            if (res.mediaDetected !== undefined) {
              console.log(`  ${fmt.bold('Media:')}      ${res.mediaDetected ? fmt.green('Detected') : fmt.dim('None')}`);
            }
          } else {
            console.log(`\n  ${fmt.info('Connect browser extension to sync YouTube, Spotify Web, and SoundCloud.')}`);
          }
        } else {
          console.log(`  ${fmt.dim('Browser integration is currently inactive.')}`);
        }
        console.log('');
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    default: {
      console.error(fmt.error(`Unknown browser action: '${action}'`));
      console.error(`\n${fmt.bold('Usage:')}`);
      console.error(`  ${colors.brightCyan}bubu browser status${colors.reset}  - Display browser extension connection status\n`);
      process.exitCode = 1;
      break;
    }
  }
}
