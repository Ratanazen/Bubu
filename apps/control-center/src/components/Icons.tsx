/**
 * Bubu V5 — Professional Icon System
 * All icons sourced from lucide-react (SVG, consistent stroke, scalable, theme-aware).
 * NO emoji used as UI icons.
 */
export {
  // Navigation
  House as HomeIcon,
  UserRound as CharacterIcon,
  Clapperboard as AnimationIcon,
  Shirt as StyleIcon,
  Music2 as MusicIcon,
  Bell as NotificationIcon,
  Globe as BrowserIcon,
  Monitor as MonitorIcon,
  Monitor as ScreenIcon,
  Terminal as CliIcon,
  Activity as DiagnosticIcon,
  Settings as SettingsIcon,
  Settings as IntegrationIcon,
  LayoutGrid as WorkspaceIcon,
  AppWindow as WindowIcon,
  Layers as CompositorIcon,
  BarChart2 as WaybarIcon,
  Search as SearchIcon,

  // Actions
  Plus as PlusIcon,
  Upload as UploadIcon,
  FolderOpen as FolderOpenIcon,
  Trash2 as TrashIcon,
  Copy as CopyIcon,
  RefreshCw as RefreshIcon,
  GripVertical as GripIcon,
  Save as SaveIcon,
  Undo2 as UndoIcon,
  Redo2 as RedoIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Check as CheckIcon,
  X as CloseIcon,
  ChevronLeft,
  ChevronRight,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,

  // Media / Transport
  Play as PlayIcon,
  Pause as PauseIcon,
  Square as StopIcon,
  Repeat as RepeatIcon,
  SkipBack as SkipBackIcon,
  SkipForward as SkipForwardIcon,
  Volume2 as VolumeIcon,

  // Animation tools
  Crop as CropIcon,
  Maximize2 as MaximizeIcon,
  RotateCw as RotateIcon,
  FlipHorizontal as FlipHIcon,
  FlipVertical as FlipVIcon,
  AlignCenter as AlignCenterIcon,

  // System
  Power as PowerIcon,
  Sparkles as SparklesIcon,
  Moon as MoonIcon,
  Move as MoveIcon,
  Info as InfoIcon,
  AlertTriangle as WarningIcon,
  Palette as PaletteIcon,
  Shield as ShieldIcon,
} from 'lucide-react';

// Custom Bubu pet icon (brand icon — simple bear face with ears)
import React from 'react';
import type { LucideProps } from 'lucide-react';

export function PetIcon({ size = 18, color = 'currentColor', ...rest }: LucideProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {/* Ears */}
      <path d="M7 4 C5 2 3 4 4 7" />
      <path d="M17 4 C19 2 21 4 20 7" />
      {/* Head */}
      <circle cx="12" cy="13" r="7" />
      {/* Eyes */}
      <circle cx="9.5" cy="11.5" r="1" fill={color} stroke="none" />
      <circle cx="14.5" cy="11.5" r="1" fill={color} stroke="none" />
      {/* Smile */}
      <path d="M9.5 15.5 Q12 17.5 14.5 15.5" />
    </svg>
  );
}
