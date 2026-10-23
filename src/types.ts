export type AnchorPosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

export interface ImageFramingSettings {
  anchor: AnchorPosition;
  scale: number; // 0.5 to 2.5, default 1.0
  zoom: number; // 1.0 to 3.0, default 1.0
  rotation: number; // -180 to 180 deg
  offsetX: number; // -100 to 100 percent
  offsetY: number; // -100 to 100 percent
}

export interface WheelItem {
  id: string;
  name: string;
  url: string;
  isFavorite: boolean;
  isActive: boolean; // whether included in wheel
  isCustom: boolean; // uploaded by user
  settings: ImageFramingSettings;
}

export interface GlobalSettings {
  spinDuration: number; // in seconds, default 4.5
  soundEnabled: boolean;
  confettiEnabled: boolean;
  backgroundDim: number; // 0 to 100% dimming
  backgroundBlur: number; // 0 to 30px
  applyToAll: boolean;
}
