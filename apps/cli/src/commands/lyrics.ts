import { sendCommand } from '../ipc-client';
import { fmt, handleDaemonError, colors } from '../utils/colors';

/**
 * Format seconds into mm:ss format.
 */
function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Handles 'bubu lyrics' subcommands: show, hide, status.
 */
export async function lyricsCommand(args: string[]): Promise<void> {
  const action = args[0]?.toLowerCase();

  switch (action) {
    case 'show': {
      try {
        await sendCommand('lyrics:show', { action: 'show' });
        console.log(fmt.success('Lyrics overlay window is now visible.'));
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    case 'hide': {
      try {
        await sendCommand('lyrics:hide', { action: 'hide' });
        console.log(fmt.success('Lyrics overlay window is now hidden.'));
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    case 'status': {
      try {
        const res = await sendCommand('lyrics:status', { action: 'status' });
        console.log(`\n${fmt.bold(fmt.cyan('📜 Bubu Lyrics Status'))}`);
        console.log(`───────────────────────────────────────`);

        if (res && typeof res === 'object') {
          const available = res.available ? fmt.green('Yes') : fmt.dim('No');
          console.log(`  ${fmt.bold('Available:')}    ${available}`);

          if (Array.isArray(res.lines)) {
            console.log(`  ${fmt.bold('Total Lines:')}  ${res.lines.length}`);
          }

          if (res.currentLine !== undefined && res.currentLine >= 0 && Array.isArray(res.lines) && res.lines[res.currentLine]) {
            const cur = res.lines[res.currentLine];
            const timeTag = cur.time !== undefined ? `[${formatTime(cur.time)}] ` : '';
            console.log(`  ${fmt.bold('Current Line:')} #${res.currentLine + 1} of ${res.lines.length}`);
            console.log(`  ${fmt.bold('Current Lyric:')} ${colors.brightYellow}"${timeTag}${cur.text}"${colors.reset}`);
          } else if (res.available) {
            console.log(`  ${fmt.bold('Current Lyric:')} ${fmt.dim('(Waiting for synchronized line...)')}`);
          }
        } else {
          console.log(`  ${fmt.dim('No lyrics information available.')}`);
        }
        console.log('');
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    default: {
      if (action) {
        console.error(fmt.error(`Unknown lyrics action: '${action}'`));
      } else {
        console.error(fmt.error('Lyrics action required.'));
      }
      console.error(`\n${fmt.bold('Usage:')}`);
      console.error(`  ${colors.brightCyan}bubu lyrics show${colors.reset}    - Show lyrics overlay on desktop`);
      console.error(`  ${colors.brightCyan}bubu lyrics hide${colors.reset}    - Hide lyrics overlay`);
      console.error(`  ${colors.brightCyan}bubu lyrics status${colors.reset}  - Display lyrics synchronization status\n`);
      process.exitCode = 1;
      break;
    }
  }
}
