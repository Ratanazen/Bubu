import { sendCommand } from '../ipc-client';
import { fmt, handleDaemonError, colors } from '../utils/colors';

/**
 * Handles 'bubu notification' subcommands: test.
 */
export async function notificationCommand(args: string[]): Promise<void> {
  const action = args[0]?.toLowerCase();

  switch (action) {
    case 'test': {
      const customTitle = args[1];
      const customMessage = args.slice(2).join(' ') || args[1];

      const title = customTitle && args.length > 2 ? customTitle : 'Bubu Desktop Companion';
      const message =
        customMessage && args.length > 2
          ? customMessage
          : customTitle || 'Hello! Bubu notification system is functioning properly 🐾';

      try {
        await sendCommand('notification:test', {
          action: 'test',
          title,
          message,
        });

        console.log(fmt.success('Test notification sent to Bubu!'));
        console.log(`  ${fmt.bold('Title:')}   ${colors.brightYellow}${title}${colors.reset}`);
        console.log(`  ${fmt.bold('Message:')} ${message}\n`);
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    default: {
      if (action) {
        console.error(fmt.error(`Unknown notification action: '${action}'`));
      } else {
        console.error(fmt.error('Notification action required.'));
      }
      console.error(`\n${fmt.bold('Usage:')}`);
      console.error(`  ${colors.brightCyan}bubu notification test${colors.reset}                   - Send default test notification`);
      console.error(`  ${colors.brightCyan}bubu notification test "<message>"${colors.reset}       - Send notification with custom message`);
      console.error(`  ${colors.brightCyan}bubu notification test "<title>" "<msg>"${colors.reset} - Send notification with custom title & message\n`);
      process.exitCode = 1;
      break;
    }
  }
}
