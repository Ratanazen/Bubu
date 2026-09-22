export interface IntegrationStatus {
    id: string;
    name: string;
    status: 'available' | 'not-installed' | 'unsupported' | 'configured' | 'active';
    configSnippet?: string;
    description?: string;
}

export interface IntegrationAdapter {
    id: string;
    name: string;
    detect(): Promise<IntegrationStatus>;
    generateConfig(): string;
    getInstructions(): string;
}

export class IntegrationEngine {
    private adapters: Map<string, IntegrationAdapter> = new Map();

    register(adapter: IntegrationAdapter): void {
        this.adapters.set(adapter.id, adapter);
    }

    async detectAll(): Promise<IntegrationStatus[]> {
        const results: IntegrationStatus[] = [];
        for (const [_, adapter] of this.adapters) {
            try {
                const status = await adapter.detect();
                results.push(status);
            } catch (e) {
                results.push({
                    id: adapter.id,
                    name: adapter.name,
                    status: 'unsupported',
                    description: `Detection failed: ${(e as Error).message}`
                });
            }
        }
        return results;
    }

    getAdapter(id: string): IntegrationAdapter | undefined {
        return this.adapters.get(id);
    }

    generateConfig(id: string): string | null {
        const adapter = this.adapters.get(id);
        return adapter ? adapter.generateConfig() : null;
    }

    getInstructions(id: string): string | null {
        const adapter = this.adapters.get(id);
        return adapter ? adapter.getInstructions() : null;
    }

    listAll(): IntegrationAdapter[] {
        return Array.from(this.adapters.values());
    }
}
