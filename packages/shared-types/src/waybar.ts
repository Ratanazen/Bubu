export interface WaybarConfig {
    enabled: boolean;
    position: 'left' | 'center' | 'right';
    icon: string;
    text: string;
    tooltip: string;
    clickAction: string;
    refreshInterval: number;
    customCss: string;
}

export interface WaybarStatus {
    running: boolean;
    configured: boolean;
    version?: string;
    moduleState: 'bubu-online' | 'bubu-offline' | 'bubu-sleeping' | 'bubu-dancing' | 'bubu-music' | 'bubu-alert';
}

export interface WaybarModuleOutput {
    text: string;
    tooltip: string;
    class: string;
}
