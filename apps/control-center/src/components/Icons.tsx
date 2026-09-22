import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const defaultProps = (props: IconProps) => ({
  width: props.size || 18,
  height: props.size || 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: props.color || 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props
});

export const HomeIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const PetIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="8" cy="10" r="1.5" fill="currentColor" />
    <circle cx="16" cy="10" r="1.5" fill="currentColor" />
    <path d="M9 15c1.5 1 4.5 1 6 0" />
  </svg>
);

export const ScreenIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

export const MonitorIcon = ScreenIcon;

export const WorkspaceIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

export const WindowIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="2" y1="9" x2="22" y2="9" />
  </svg>
);

export const CompositorIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

export const WaybarIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <rect x="2" y="2" width="20" height="6" rx="1" />
    <rect x="2" y="10" width="20" height="12" rx="2" />
  </svg>
);

export const CharacterIcon = PetIcon;

export const AnimationIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const StyleIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="8" r="2" fill="currentColor" />
    <circle cx="8" cy="14" r="2" fill="currentColor" />
    <circle cx="16" cy="14" r="2" fill="currentColor" />
  </svg>
);

export const MusicIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const NotificationIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const BrowserIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const IntegrationIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const CliIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

export const DiagnosticIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export const SettingsIcon = IntegrationIcon;

export const SearchIcon = (props: IconProps) => (
  <svg {...defaultProps(props)}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
