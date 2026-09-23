import { colors, fmt } from './utils/colors';
import { startCommand, stopCommand, restartCommand, statusCommand } from './commands/daemon';
import { petCommand } from './commands/pet';
import { skinCommand } from './commands/skin';
import { musicCommand } from './commands/music';
import { lyricsCommand } from './commands/lyrics';
import { browserCommand } from './commands/browser';
import { notificationCommand } from './commands/notification';
import {
  waybarCommand,
  swaybarCommand,
  niriCommand,
  hyprlandCommand,
  swayCommand,
  i3Command,
} from './commands/integration';
import { runDoctor } from './commands/doctor';
import { screenCommand } from './commands/screen';
import { compositorCommand } from './commands/compositor';
import { workspaceCommand } from './commands/workspace';
import { platformCommand } from './commands/platform';

const VERSION = '2.0.0';

/**
 * Print the Bubu CLI banner and help menu.
 */
function printHelp(): void {
  console.log(`
${colors.brightMagenta}   BUBU DESKTOP COMPANION CLI  v${VERSION}${colors.reset}
${colors.dim}  ────────────────────────────────────────────────────────${colors.reset}

${fmt.bold('USAGE:')}
  ${colors.brightCyan}bubu${colors.reset} <command> [subcommand] [arguments...]

${fmt.bold('DAEMON LIFECYCLE:')}
  ${colors.brightCyan}bubu start${colors.reset}                         Start Bubu Desktop Companion daemon
  ${colors.brightCyan}bubu stop${colors.reset}                          Stop Bubu Desktop Companion daemon
  ${colors.brightCyan}bubu restart${colors.reset}                       Restart Bubu Desktop Companion daemon
  ${colors.brightCyan}bubu status${colors.reset}                        Show daemon, pet, music & companion health

${fmt.bold('DESKTOP PET:')}
  ${colors.brightCyan}bubu pet show${colors.reset}                      Show Bubu desktop pet window
  ${colors.brightCyan}bubu pet hide${colors.reset}                      Hide Bubu desktop pet window
  ${colors.brightCyan}bubu pet pause${colors.reset}                     Pause pet movement and animations
  ${colors.brightCyan}bubu pet resume${colors.reset}                    Resume pet movement and animations

${fmt.bold('SKINS:')}
  ${colors.brightCyan}bubu skin list${colors.reset}                     List all installed skins with active indicator
  ${colors.brightCyan}bubu skin use <name>${colors.reset}               Switch companion skin (default, night, sakura, retro)

${fmt.bold('MUSIC INTEGRATION:')}
  ${colors.brightCyan}bubu music status${colors.reset}                  Display current playback progress and track
  ${colors.brightCyan}bubu music play${colors.reset}                    Resume music playback
  ${colors.brightCyan}bubu music pause${colors.reset}                   Pause music playback
  ${colors.brightCyan}bubu music next${colors.reset}                    Skip to next audio track
  ${colors.brightCyan}bubu music previous${colors.reset}                Jump back to previous audio track

${fmt.bold('LYRICS OVERLAY:')}
  ${colors.brightCyan}bubu lyrics show${colors.reset}                   Show floating desktop lyrics overlay
  ${colors.brightCyan}bubu lyrics hide${colors.reset}                   Hide desktop lyrics overlay
  ${colors.brightCyan}bubu lyrics status${colors.reset}                 Display synchronized lyrics status and current line

${fmt.bold('BROWSER EXTENSION:')}
  ${colors.brightCyan}bubu browser status${colors.reset}                Display browser connection status

${fmt.bold('NOTIFICATIONS:')}
  ${colors.brightCyan}bubu notification test [msg]${colors.reset}       Trigger a test speech bubble / notification

${fmt.bold('DESKTOP BAR / COMPOSITOR INTEGRATIONS:')}
  ${colors.brightCyan}bubu waybar${colors.reset}                        Output Waybar-compatible JSON
  ${colors.brightCyan}bubu swaybar${colors.reset}                       Output Swaybar / i3bar-compatible JSON
  ${colors.brightCyan}bubu niri${colors.reset}                          Output Niri Wayland status JSON
  ${colors.brightCyan}bubu hyprland${colors.reset}                      Output Hyprland workspace integration JSON
  ${colors.brightCyan}bubu sway${colors.reset}                          Alias for swaybar status
  ${colors.brightCyan}bubu i3${colors.reset}                            Alias for i3bar status

${fmt.bold('GENERAL:')}
  ${colors.brightCyan}bubu help, --help, -h${colors.reset}              Show this help documentation
  ${colors.brightCyan}bubu version, --version, -v${colors.reset}        Show CLI version
`);
}

/**
 * Print version information.
 */
function printVersion(): void {
  console.log(`bubu v${VERSION} (Bubu Desktop Companion CLI)`);
}

/**
 * Main command router.
 */
async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const command = argv[0]?.toLowerCase();
  const subArgs = argv.slice(1);

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  if (command === 'version' || command === '--version' || command === '-v') {
    printVersion();
    return;
  }

  switch (command) {
    case 'start':
      await startCommand();
      break;

    case 'stop':
      await stopCommand();
      break;

    case 'restart':
      await restartCommand();
      break;

    case 'status':
      await statusCommand();
      break;

    case 'pet':
      await petCommand(subArgs);
      break;

    case 'skin':
      await skinCommand(subArgs);
      break;

    case 'music':
      await musicCommand(subArgs);
      break;

    case 'lyrics':
      await lyricsCommand(subArgs);
      break;

    case 'browser':
      await browserCommand(subArgs);
      break;

    case 'notification':
      await notificationCommand(subArgs);
      break;

    case 'waybar':
      await waybarCommand();
      break;

    case 'swaybar':
      await swaybarCommand();
      break;

    case 'niri':
      await niriCommand();
      break;

    case 'hyprland':
      await hyprlandCommand();
      break;

    case 'sway':
      await swayCommand();
      break;

    case 'i3':
      await i3Command();
      break;

    case 'doctor':
    case 'diagnostics':
      await runDoctor();
      break;

    
    case 'screen':
      await screenCommand(subArgs);
      break;

    case 'compositor':
      await compositorCommand(subArgs);
      break;

    case 'workspace':
      await workspaceCommand(subArgs);
      break;

    
    case 'platform':
      await platformCommand(subArgs);
      break;

    default:
      console.error(fmt.error(`Unknown command: '${command}'`));
      console.error(`Run ${colors.brightCyan}bubu help${colors.reset} for a list of available commands.\n`);
      process.exitCode = 1;
      break;
  }
}

main().catch(err => {
  console.error(`\n${fmt.error(`Unexpected CLI error: ${err?.message || err}`)}\n`);
  process.exitCode = 1;
});
