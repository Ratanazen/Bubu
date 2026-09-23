import { sendCommand } from '../ipc-client';
import { fmt, handleDaemonError, colors } from '../utils/colors';

interface SkinInfo {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

const FALLBACK_SKINS: SkinInfo[] = [
  { id: 'default', name: 'Default Bubu', description: 'Pastel pink classic companion', color: '#ffb7b2' },
  { id: 'night', name: 'Night Bubu', description: 'Dark theme midnight companion', color: '#4a4e69' },
  { id: 'sakura', name: 'Sakura Bubu', description: 'Blossom spring edition', color: '#ffc8dd' },
  { id: 'retro', name: 'Retro Bubu', description: 'Vintage pixel nostalgic style', color: '#f5ee9e' },
];

/**
 * Handles 'bubu skin' subcommands: list, use <name>.
 */
export async function skinCommand(args: string[]): Promise<void> {
  const action = args[0]?.toLowerCase();

  switch (action) {
    case 'list': {
      try {
        const res = await sendCommand('skin:list', { action: 'list' });
        const activeSkin = (res && typeof res === 'object' && res.activeSkin) || 'default';
        const skins: SkinInfo[] =
          res && typeof res === 'object' && Array.isArray(res.skins) && res.skins.length > 0
            ? res.skins
            : FALLBACK_SKINS;

        console.log(`\n${fmt.bold(fmt.cyan('Available Bubu Skins'))}`);
        console.log(`───────────────────────────────────────`);

        for (const skin of skins) {
          const isActive = skin.id.toLowerCase() === activeSkin.toLowerCase();
          const marker = isActive
            ? `${colors.brightGreen}* (active)${colors.reset} `
            : '           ';
          const idStr = fmt.bold(skin.id.padEnd(12));
          const nameStr = fmt.yellow(skin.name.padEnd(16));
          const descStr = skin.description ? fmt.dim(`- ${skin.description}`) : '';

          console.log(`  ${marker} ${idStr} ${nameStr} ${descStr}`);
        }

        console.log(`\n  Switch skin with: ${colors.brightCyan}bubu skin use <name>${colors.reset}\n`);
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    case 'use': {
      const skinName = args[1]?.trim();
      if (!skinName) {
        console.error(fmt.error('Skin name is required.'));
        console.error(`\n${fmt.bold('Usage:')}`);
        console.error(`  ${colors.brightCyan}bubu skin use <name>${colors.reset}  (e.g., bubu skin use sakura)\n`);
        console.error(`Run ${colors.brightCyan}bubu skin list${colors.reset} to see all available skins.\n`);
        process.exitCode = 1;
        return;
      }

      try {
        await sendCommand('skin:use', { skin: skinName, action: 'use' });
        console.log(fmt.success(`Active skin changed to ${fmt.yellow(skinName)}.`));
      } catch (err) {
        handleDaemonError(err);
        process.exitCode = 1;
      }
      break;
    }

    default: {
      if (action) {
        console.error(fmt.error(`Unknown skin action: '${action}'`));
      } else {
        console.error(fmt.error('Skin action required.'));
      }
      console.error(`\n${fmt.bold('Usage:')}`);
      console.error(`  ${colors.brightCyan}bubu skin list${colors.reset}        - List all installed skins`);
      console.error(`  ${colors.brightCyan}bubu skin use <name>${colors.reset}  - Switch to specified skin\n`);
      process.exitCode = 1;
      break;
    }
  }
}
