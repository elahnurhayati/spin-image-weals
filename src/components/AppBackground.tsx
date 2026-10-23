import React from 'react';
import { WheelItem, GlobalSettings } from '../types';
import { ThemePalette, DEFAULT_EMERALD_THEME } from '../utils/colorExtractor';

interface AppBackgroundProps {
  activeBackgroundItem: WheelItem | null;
  settings: GlobalSettings;
  theme?: ThemePalette;
}

export const AppBackground: React.FC<AppBackgroundProps> = ({
  activeBackgroundItem,
  settings,
  theme = DEFAULT_EMERALD_THEME,
}) => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Dynamic Chosen Image Background with crossfade transition */}
      {activeBackgroundItem ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform scale-105"
          style={{
            backgroundImage: `url(${activeBackgroundItem.url})`,
            filter: `blur(${settings.backgroundBlur}px)`,
          }}
        />
      ) : (
        /* Default Cyber Obsidian & Neon Shards Background with theme-adaptive ambient glow */
        <div className="absolute inset-0 bg-[#040907]">
          {/* Subtle Dynamic Ambient Glow Orbs */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-700 opacity-20"
            style={{ backgroundColor: theme.primary }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full blur-[100px] transition-colors duration-700 opacity-15"
            style={{ backgroundColor: theme.secondary }}
          />
          <div
            className="absolute top-1/2 -right-20 w-[350px] h-[350px] rounded-full blur-[90px] transition-colors duration-700 opacity-15"
            style={{ backgroundColor: theme.primaryLight }}
          />

          {/* Geometric cyber polygonal lines / shards overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="cyber-grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke={theme.primary}
                  strokeWidth="0.75"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cyber-grid)" />
          </svg>
        </div>
      )}

      {/* Dim Overlay based on user settings */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-500"
        style={{
          opacity: settings.backgroundDim / 100,
        }}
      />

      {/* Atmospheric Vignette & Contrast Scrim */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_0%,_rgba(0,0,0,0.85)_100%]" />
    </div>
  );
};
