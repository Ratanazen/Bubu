export interface BubuIntegration {
    id: string;
    name: string;
    initialize(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    isAvailable(): boolean;
}

export class IntegrationManager {
    private integrations: Map<string, BubuIntegration> = new Map();

    register(integration: BubuIntegration) {
        this.integrations.set(integration.id, integration);
    }

    async initializeAll() {
        for (const [id, integration] of this.integrations) {
            try {
                if (integration.isAvailable()) {
                    await integration.initialize();
                    await integration.start();
                    console.log(`Integration ${id} started.`);
                }
            } catch (e) {
                console.error(`Failed to initialize integration ${id}`, e);
            }
        }
    }

    async stopAll() {
        for (const [_, integration] of this.integrations) {
            await integration.stop();
        }
    }
}
