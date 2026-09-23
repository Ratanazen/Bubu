import { sendCommand } from '../ipc-client';

interface DaemonStatus {
  pet?: {
    visible?: boolean;
    paused?: boolean;
    state?: string;
    direction?: string;
  };
  music?: {
    state?: string;
    title?: string;
    artist?: string;
  };
  settings?: {
    skin?: string;
  };
}

/**
 * Safely queries current daemon status or returns null if offline.
 */
async function fetchDaemonStatus(): Promise<DaemonStatus | null> {
  try {
    const res = await sendCommand('status');
    if (res && typeof res === 'object') {
      return res as DaemonStatus;
    }
    return {};
  } catch {
    return null;
  }
}

/**
 * Handles Waybar integration output (JSON).
 */
export async function waybarCommand(): Promise<void> {
  try {
    // Attempt dedicated waybar payload first
    const directRes = await sendCommand('waybar');
    if (directRes && typeof directRes === 'object' && directRes.text) {
      console.log(JSON.stringify(directRes));
      return;
    }
  } catch {
    // Fall back to general status query or offline format
  }

  const status = await fetchDaemonStatus();

  if (!status) {
    console.log(
      JSON.stringify({
        text: 'Bubu',
        tooltip: 'Bubu Desktop Companion\nStatus: Offline (Not Running)\nStart with: bubu start',
        class: 'bubu-offline',
      })
    );
    return;
  }

  const petState = status.pet?.state || 'Idle';
  const petVisible = status.pet?.visible !== false;
  const isPlaying = status.music?.state === 'playing';
  const musicText = isPlaying && status.music?.title
    ? `${status.music.title}${status.music.artist ? ` - ${status.music.artist}` : ''}`
    : 'Not Playing';

  const barText = isPlaying && status.music?.title
    ? `Bubu [Playing] ${status.music.title}`
    : 'Bubu';

  const tooltip = [
    'Bubu Desktop Companion',
    `Status: ${petVisible ? petState : 'Hidden'}`,
    `Music: ${musicText}`,
  ].join('\n');

  const classes = ['bubu'];
  if (isPlaying) classes.push('playing');
  if (status.pet?.paused) classes.push('paused');

  console.log(
    JSON.stringify({
      text: barText,
      tooltip: tooltip,
      class: classes.join(' '),
    })
  );
}

/**
 * Handles Swaybar / i3bar integration output (i3bar-compatible JSON).
 */
export async function swaybarCommand(): Promise<void> {
  const status = await fetchDaemonStatus();

  if (!status) {
    console.log(
      JSON.stringify({
        full_text: 'Bubu (offline)',
        short_text: 'Bubu',
        color: '#707880',
        text: 'Bubu (offline)',
        tooltip: 'Bubu Desktop Companion\nStatus: Offline\nStart with: bubu start',
        class: 'bubu-offline',
      })
    );
    return;
  }

  const petState = status.pet?.state || 'Idle';
  const isPlaying = status.music?.state === 'playing';
  const musicText = isPlaying && status.music?.title
    ? `${status.music.title}${status.music.artist ? ` - ${status.music.artist}` : ''}`
    : 'Not Playing';

  const displayText = isPlaying && status.music?.title
    ? `Bubu: [Playing] ${status.music.title}`
    : `Bubu: ${petState}`;

  const tooltip = [
    'Bubu Desktop Companion',
    `Status: ${petState}`,
    `Music: ${musicText}`,
  ].join('\n');

  console.log(
    JSON.stringify({
      full_text: displayText,
      short_text: 'Bubu',
      color: isPlaying ? '#a3be8c' : '#88c0d0',
      text: displayText,
      tooltip: tooltip,
      class: isPlaying ? 'bubu bubu-playing' : 'bubu',
    })
  );
}

/**
 * Handles Hyprland compositor integration status (JSON).
 */
export async function hyprlandCommand(): Promise<void> {
  const instance = process.env.HYPRLAND_INSTANCE_SIGNATURE;
  const isHyprland = Boolean(instance);
  const status = await fetchDaemonStatus();

  const isOnline = status !== null;
  const petState = status?.pet?.state || 'offline';
  const isPlaying = status?.music?.state === 'playing';

  const output = {
    status: isOnline ? 'online' : 'offline',
    compositor: 'hyprland',
    hyprland: {
      active: isHyprland,
      instanceSignature: instance || null,
    },
    pet: {
      state: petState,
      visible: status?.pet?.visible ?? false,
      paused: status?.pet?.paused ?? false,
    },
    music: {
      state: status?.music?.state || 'stopped',
      title: status?.music?.title || null,
      artist: status?.music?.artist || null,
    },
    text: isOnline ? (isPlaying ? `Bubu [Playing] ${status?.music?.title}` : 'Bubu') : 'Bubu (offline)',
    tooltip: isOnline
      ? `Bubu Hyprland Integration\nStatus: Active\nCompositor: ${isHyprland ? 'Hyprland' : 'Other'}`
      : 'Bubu Desktop Companion\nStatus: Offline',
    class: isOnline ? (isPlaying ? 'bubu playing' : 'bubu') : 'bubu-offline',
  };

  console.log(JSON.stringify(output, null, 2));
}

/**
 * Handles Niri Wayland compositor integration status (JSON).
 */
export async function niriCommand(): Promise<void> {
  const socket = process.env.NIRI_SOCKET;
  const isNiri = Boolean(socket);
  const status = await fetchDaemonStatus();

  const isOnline = status !== null;
  const petState = status?.pet?.state || 'offline';
  const isPlaying = status?.music?.state === 'playing';

  const output = {
    status: isOnline ? 'online' : 'offline',
    compositor: 'niri',
    niri: {
      active: isNiri,
      socketPath: socket || null,
    },
    pet: {
      state: petState,
      visible: status?.pet?.visible ?? false,
      paused: status?.pet?.paused ?? false,
    },
    music: {
      state: status?.music?.state || 'stopped',
      title: status?.music?.title || null,
      artist: status?.music?.artist || null,
    },
    text: isOnline ? (isPlaying ? `Bubu [Playing] ${status?.music?.title}` : 'Bubu') : 'Bubu (offline)',
    tooltip: isOnline
      ? `Bubu Niri Integration\nStatus: Active\nCompositor: ${isNiri ? 'Niri' : 'Other'}`
      : 'Bubu Desktop Companion\nStatus: Offline',
    class: isOnline ? (isPlaying ? 'bubu playing' : 'bubu') : 'bubu-offline',
  };

  console.log(JSON.stringify(output, null, 2));
}

/**
 * Handles sway alias (routes to swaybar).
 */
export async function swayCommand(): Promise<void> {
  await swaybarCommand();
}

/**
 * Handles i3 alias (routes to swaybar i3bar format).
 */
export async function i3Command(): Promise<void> {
  await swaybarCommand();
}
