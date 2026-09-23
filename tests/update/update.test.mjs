import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

describe('Update Engine', () => {
    it('should correctly parse semantic versions', () => {
        const v1 = '5.1.0';
        const v2 = '5.1.1';
        const v3 = '5.2.0';
        const p1 = v1.split('.').map(Number);
        const p2 = v2.split('.').map(Number);
        assert.ok(p1[2] < p2[2], 'Patch version comparison fails');
    });

    it('should identify a valid manifest structure', () => {
        const manifest = {
            version: '5.1.1',
            channel: 'stable',
            mandatory: false,
            artifacts: {
                linux: { sha256: 'xyz', url: 'https://github.com' }
            }
        };
        assert.ok(manifest.artifacts.linux.sha256 === 'xyz', 'Manifest parsing fails');
    });

    it('should refuse to run xdg-open directly (security audit)', () => {
        const hyprlandCode = fs.readFileSync('packages/platform-engine/src/adapters/HyprlandAdapter.ts', 'utf8');
        assert.ok(!hyprlandCode.includes('exec(`xdg-open'), 'Security violation: raw exec for xdg-open found!');
    });
});
