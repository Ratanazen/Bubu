import { sendCommand } from '../ipc-client';
import { fmt, handleDaemonError, colors } from '../utils/colors';

/**
 * Handles 'bubu pet' subcommands: show, hide, pause, resume.
 */
export async function petCommand(args: string[]): Promise<void> {
  const action = args[0]?.toLowerCase();

  switch (action) {
    case 'show': {
      try {
        await sendCommand('pet:show', { action: 'show' });
        console.log(fmt.success('Bubu pet window is now visible.'));
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    case 'hide': {
      try {
        await sendCommand('pet:hide', { action: 'hide' });
        console.log(fmt.success('Bubu pet window is now hidden.'));
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    case 'pause': {
      try {
        await sendCommand('pet:pause', { action: 'pause' });
        console.log(fmt.success('Bubu pet animation and roaming paused.'));
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    case 'resume': {
      try {
        await sendCommand('pet:resume', { action: 'resume' });
        console.log(fmt.success('Bubu pet animation and roaming resumed.'));
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    default: {
      if (action) {
        console.error(fmt.error(`Unknown pet action: '${action}'`));
      } else {
        console.error(fmt.error('Pet action required.'));
      }
      console.error(`\n${fmt.bold('Usage:')}`);
      console.error(`  ${colors.brightCyan}bubu pet show${colors.reset}    - Make Bubu pet visible on desktop`);
      console.error(`  ${colors.brightCyan}bubu pet hide${colors.reset}    - Hide Bubu pet window`);
      console.error(`  ${colors.brightCyan}bubu pet pause${colors.reset}   - Pause pet animations and movement`);
      console.error(`  ${colors.brightCyan}bubu pet resume${colors.reset}  - Resume pet animations and movement\n`);
      process.exitCode = 1;
      break;
    }
  }
}
