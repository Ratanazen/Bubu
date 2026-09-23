export type UpdateChannel = 'stable' | 'beta' | 'nightly';

export type UpdateState = 
  | 'IDLE'
  | 'CHECKING'
  | 'AVAILABLE'
  | 'DOWNLOADING'
  | 'VERIFYING'
  | 'READY'
  | 'INSTALLING'
  | 'RESTARTING'
  | 'HEALTH_CHECK'
  | 'SUCCESS'
  | 'FAILED'
  | 'ROLLBACK';

export interface UpdateManifest {
  version: string;
  channel: UpdateChannel;
  release_date: string;
  minimum_supported_version: string;
  mandatory: boolean;
  artifacts: {
    linux?: UpdateArtifact;
    windows?: UpdateArtifact;
    macos?: UpdateArtifact;
  };
}

export interface UpdateArtifact {
  url: string;
  sha256: string;
  signature: string;
}

export interface UpdateConfig {
  enabled: boolean;
  channel: UpdateChannel;
  checkOnStartup: boolean;
  checkIntervalHours: number;
  downloadAutomatically: boolean;
  installAutomatically: boolean;
  allowDowngrade: boolean;
  trustedPublicKey: string;
}
