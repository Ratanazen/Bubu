import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';

// Engines to test
import { EventBus } from '../packages/core/dist/EventBus.js';
import { StateManager } from '../packages/core/dist/StateManager.js';
import { SettingsStore } from '../packages/core/dist/SettingsStore.js';
import { BehaviorEngine } from '../packages/behavior-engine/dist/BehaviorEngine.js';
import { AnimationPlayer } from '../packages/animation-engine/dist/AnimationPlayer.js';
import { SkinManager } from '../packages/skin-engine/dist/SkinManager.js';
import { StyleManager } from '../packages/style-engine/dist/StyleManager.js';
import { MusicEngine } from '../packages/music-engine/dist/MusicEngine.js';
import { LrcParser } from '../packages/lyrics-engine/dist/LrcParser.js';
import { LyricsSynchronizer } from '../packages/lyrics-engine/dist/LyricsSynchronizer.js';
import { NotificationManager } from '../packages/notification-engine/dist/NotificationManager.js';
import { PrivacyEngine } from '../packages/privacy-engine/dist/PrivacyEngine.js';
import { PerformanceEngine } from '../packages/performance-engine/dist/PerformanceEngine.js';
import { PluginEngine } from '../packages/plugin-engine/dist/PluginEngine.js';
import { PlatformDetector } from '../packages/platform-engine/dist/PlatformDetector.js';

describe('🐾 BUBU V2 — CORE ENGINE TEST SUITE', () => {

  describe('1. Core: EventBus & StateManager', () => {
    test('EventBus pub/sub delivers typed events with history', () => {
      const bus = new EventBus();
      let received = null;
      bus.subscribe('DANCE_TRIGGERED', (event) => {
        received = event.payload;
      });

      bus.emit('DANCE_TRIGGERED', { song: 'Sakura Theme' });
      assert.deepEqual(received, { song: 'Sakura Theme' });
      assert.equal(bus.getHistory().length, 1);
    });

    test('StateManager merges partial states and alerts subscribers', () => {
      const sm = new StateManager();
      let lastMood = '';
      sm.subscribe('pet', (val) => {
        lastMood = val.state;
      });

      sm.update('pet', { state: 'HAPPY' });
      assert.equal(sm.get('pet').state, 'HAPPY');
      assert.equal(lastMood, 'HAPPY');
    });
  });

  describe('2. BehaviorEngine: State Transitions & Personalities', () => {
    test('Switches personalities and weights', () => {
      const behavior = new BehaviorEngine({ personality: 'energetic' });
      assert.equal(behavior.getPersonality(), 'energetic');

      behavior.setPersonality('sleepy');
      assert.equal(behavior.getPersonality(), 'sleepy');
    });

    test('Reacts to music changes', () => {
      const behavior = new BehaviorEngine();
      behavior.reactToMusic(true);
      const state = behavior.getCurrentState();
      assert.ok(['DANCE', 'HAPPY', 'IDLE'].includes(state));
    });

    test('Game mode suppresses high-energy states', () => {
      const behavior = new BehaviorEngine();
      behavior.setGameMode(true);
      const state = behavior.getCurrentState();
      assert.ok(['IDLE', 'SIT'].includes(state));
    });
  });

  describe('3. AnimationEngine: Timeline Player', () => {
    test('AnimationPlayer step and frame tracking', () => {
      const player = new AnimationPlayer();
      player.play({
        frames: ['frame0.png', 'frame1.png', 'frame2.png'],
        fps: 10,
        loop: true
      });

      assert.equal(player.getCurrentFrame(), 'frame0.png');
      player.update(120); // 120ms at 10fps should advance to frame 1
      assert.equal(player.getCurrentFrame(), 'frame1.png');
    });
  });

  describe('4. Skin & Style Engines: Manifests & Theme Presets', () => {
    test('StyleManager contains all 23 required built-in styles', () => {
      const styles = new StyleManager();
      const list = styles.listStyles();
      assert.ok(list.length >= 23);
      assert.ok(styles.getStyle('sakura'));
      assert.ok(styles.getStyle('cyber'));
      assert.ok(styles.getStyle('pixel'));
    });

    test('SkinManager validates skin manifest structure', () => {
      const skinMgr = new SkinManager('./assets/skins');
      const loaded = skinMgr.listSkins();
      assert.ok(loaded.length >= 1);
      assert.ok(skinMgr.getSkin('bubu-default') || skinMgr.getSkin('default'));
    });
  });

  describe('5. Music & Lyrics Engine: LRC Parsing & Synced Matching', () => {
    test('LrcParser parses standard timestamps and refrains', () => {
      const lrcContent = `
[ti:Never Gonna Give You Up]
[ar:Rick Astley]
[00:01.00]First line
[00:05.50]Second line
[00:10.00]Third line
      `;
      const lines = LrcParser.parse(lrcContent);
      assert.equal(lines.length, 3);
      assert.equal(lines[0].time, 1);
      assert.equal(lines[0].text, 'First line');
      assert.equal(lines[1].time, 5.5);
    });

    test('LyricsSynchronizer identifies active line accurately', () => {
      const lines = [
        { time: 0, text: 'Intro' },
        { time: 5, text: 'Chorus' },
        { time: 10, text: 'Outro' }
      ];
      const syncer = new LyricsSynchronizer(lines);
      assert.equal(syncer.getCurrentLineIndex(3), 0);
      assert.equal(syncer.getCurrentLineIndex(6), 1);
      assert.equal(syncer.getCurrentLineIndex(12), 2);
    });
  });

  describe('6. Privacy & Performance Engines', () => {
    test('PrivacyEngine redacts sensitive credentials and tokens', () => {
      const privacy = new PrivacyEngine();
      const text = 'Logging in with apiKey="sk-secret12345" and password="supersecret"';
      const safe = privacy.redactSensitiveData(text);
      assert.ok(!safe.includes('sk-secret12345'));
      assert.ok(!safe.includes('supersecret'));
      assert.ok(safe.includes('[REDACTED]'));
    });

    test('PerformanceEngine adjusts targets by power profile', () => {
      const perf = new PerformanceEngine('normal');
      assert.equal(perf.getProfileConfig('normal').targetFps, 60);
      assert.equal(perf.getProfileConfig('battery-saver').targetFps, 15);
      assert.equal(perf.getProfileConfig('game-mode').targetFps, 10);
    });
  });

  describe('7. Plugin Engine: Sandboxing & Permissions', () => {
    test('PluginEngine allows declared safe permissions and rejects unauthorized ones', () => {
      const plugins = new PluginEngine();
      const safePlugin = plugins.registerPlugin({
        id: 'custom-lyrics',
        name: 'Custom Lyrics',
        version: '1.0.0',
        author: 'Community',
        category: 'lyrics',
        description: 'Lyrics reader',
        permissions: ['lyrics.read'],
        capabilities: ['lyrics-feed']
      });
      assert.equal(safePlugin.success, true);

      const unsafePlugin = plugins.registerPlugin({
        id: 'bad-actor',
        name: 'Root Exec',
        version: '1.0.0',
        author: 'Unknown',
        category: 'integration',
        description: 'Tries root access',
        permissions: ['shell.unrestricted_exec'],
        capabilities: []
      });
      assert.equal(unsafePlugin.success, false);
      assert.ok(unsafePlugin.error?.includes('Unauthorized permission'));
    });
  });

  describe('8. Platform Engine: Detection & Capabilities', () => {
    test('PlatformDetector identifies current OS and session', () => {
      const osName = PlatformDetector.getOS();
      assert.ok(['windows', 'macos', 'linux'].includes(osName));
    });
  });
});
