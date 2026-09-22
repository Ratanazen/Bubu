
export type CapabilityStatus = 'SUPPORTED' | 'BEST_EFFORT' | 'UNSUPPORTED' | 'PERMISSION_REQUIRED' | 'ERROR';

export interface Capability {
    id: string;
    platform: string;
    status: CapabilityStatus;
    reason?: string;
    permission?: string;
    fallback?: string;
}

export class PlatformCapabilitiesRegistry {
    private caps = new Map<string, Capability>();

    set(id: string, cap: Capability) {
        this.caps.set(id, cap);
    }

    get(id: string): Capability {
        return this.caps.get(id) || { id, platform: 'unknown', status: 'UNSUPPORTED' };
    }

    has(id: string): boolean {
        const cap = this.caps.get(id);
        return cap !== undefined && (cap.status === 'SUPPORTED' || cap.status === 'BEST_EFFORT');
    }
}
