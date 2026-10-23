// Dynamic Color Extractor and Theme Generator based on the selected image

export interface ThemePalette {
  name: string;
  primary: string; // Vibrant main color (e.g. #00E676, #00D2FF, #FF7A00)
  primaryLight: string; // Lighter tint
  secondary: string; // Complementary / secondary tone
  accent: string; // Bright neon highlight
  glow: string; // rgba for glow shadows
  glowStrong: string; // rgba for high-intensity glows
  border: string; // rgba for container borders
  cardBg: string; // rgba for glass cards
  buttonGradient: string; // CSS linear-gradient
}

// Default emerald theme
export const DEFAULT_EMERALD_THEME: ThemePalette = {
  name: 'Neon Emerald',
  primary: '#00E676',
  primaryLight: '#69F0AE',
  secondary: '#10B981',
  accent: '#A7F3D0',
  glow: 'rgba(0, 230, 118, 0.45)',
  glowStrong: 'rgba(0, 230, 118, 0.85)',
  border: 'rgba(0, 230, 118, 0.35)',
  cardBg: 'rgba(6, 20, 14, 0.85)',
  buttonGradient: 'linear-gradient(135deg, #00E676 0%, #10B981 100%)',
};

// Preset color maps for default images for crisp, instant thematic fidelity
export const PRESET_THEMES: Record<string, ThemePalette> = {
  'preset-1': {
    name: 'Electric Azure Cyan',
    primary: '#00E5FF',
    primaryLight: '#80D8FF',
    secondary: '#0288D1',
    accent: '#E0F7FA',
    glow: 'rgba(0, 229, 255, 0.45)',
    glowStrong: 'rgba(0, 229, 255, 0.9)',
    border: 'rgba(0, 229, 255, 0.35)',
    cardBg: 'rgba(5, 18, 28, 0.85)',
    buttonGradient: 'linear-gradient(135deg, #00E5FF 0%, #0091EA 100%)',
  },
  'preset-2': {
    name: 'Golden Sunset Sunset',
    primary: '#FF9100',
    primaryLight: '#FFD180',
    secondary: '#FF6D00',
    accent: '#FFF3E0',
    glow: 'rgba(255, 145, 0, 0.5)',
    glowStrong: 'rgba(255, 145, 0, 0.9)',
    border: 'rgba(255, 145, 0, 0.38)',
    cardBg: 'rgba(28, 14, 5, 0.85)',
    buttonGradient: 'linear-gradient(135deg, #FF9100 0%, #FF6D00 100%)',
  },
  'preset-3': {
    name: 'Warm Amber Honey',
    primary: '#FBBF24',
    primaryLight: '#FDE68A',
    secondary: '#D97706',
    accent: '#FEF3C7',
    glow: 'rgba(251, 191, 36, 0.45)',
    glowStrong: 'rgba(251, 191, 36, 0.85)',
    border: 'rgba(251, 191, 36, 0.35)',
    cardBg: 'rgba(24, 18, 8, 0.85)',
    buttonGradient: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)',
  },
  'preset-4': {
    name: 'Solar Crimson Gold',
    primary: '#FF5722',
    primaryLight: '#FFAB91',
    secondary: '#E64A19',
    accent: '#FBE9E7',
    glow: 'rgba(255, 87, 34, 0.48)',
    glowStrong: 'rgba(255, 87, 34, 0.9)',
    border: 'rgba(255, 87, 34, 0.38)',
    cardBg: 'rgba(28, 10, 6, 0.85)',
    buttonGradient: 'linear-gradient(135deg, #FF5722 0%, #E64A19 100%)',
  },
  'preset-5': {
    name: 'Alpine Crystal Rose',
    primary: '#F472B6',
    primaryLight: '#FBCFE8',
    secondary: '#EC4899',
    accent: '#FDF2F8',
    glow: 'rgba(244, 114, 182, 0.45)',
    glowStrong: 'rgba(244, 114, 182, 0.85)',
    border: 'rgba(244, 114, 182, 0.35)',
    cardBg: 'rgba(26, 8, 20, 0.85)',
    buttonGradient: 'linear-gradient(135deg, #F472B6 0%, #DB2777 100%)',
  },
  'preset-6': {
    name: 'Cyberpunk Neon Orchid',
    primary: '#D946EF',
    primaryLight: '#F0ABFC',
    secondary: '#A855F7',
    accent: '#FAE8FF',
    glow: 'rgba(217, 70, 239, 0.5)',
    glowStrong: 'rgba(217, 70, 239, 0.9)',
    border: 'rgba(217, 70, 239, 0.38)',
    cardBg: 'rgba(24, 6, 28, 0.85)',
    buttonGradient: 'linear-gradient(135deg, #D946EF 0%, #9333EA 100%)',
  },
  'preset-7': {
    name: 'Titanium Ice Blue',
    primary: '#38BDF8',
    primaryLight: '#BAE6FD',
    secondary: '#0284C7',
    accent: '#F0F9FF',
    glow: 'rgba(56, 189, 248, 0.45)',
    glowStrong: 'rgba(56, 189, 248, 0.85)',
    border: 'rgba(56, 189, 248, 0.35)',
    cardBg: 'rgba(6, 18, 28, 0.85)',
    buttonGradient: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
  },
  'preset-8': {
    name: 'Emerald Moss Forest',
    primary: '#10B981',
    primaryLight: '#6EE7B7',
    secondary: '#059669',
    accent: '#D1FAE5',
    glow: 'rgba(16, 185, 129, 0.45)',
    glowStrong: 'rgba(16, 185, 129, 0.85)',
    border: 'rgba(16, 185, 129, 0.35)',
    cardBg: 'rgba(5, 20, 14, 0.85)',
    buttonGradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
  },
};

// Helper: Convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// Helper: Convert HSL to HEX
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Dynamically extract vibrant dominant color from any image URL/Data URL
export function extractThemeFromImage(
  imageUrl: string,
  itemId?: string
): Promise<ThemePalette> {
  // Check preset themes first for instant fidelity
  if (itemId && PRESET_THEMES[itemId]) {
    return Promise.resolve(PRESET_THEMES[itemId]);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(DEFAULT_EMERALD_THEME);
          return;
        }

        const size = 64;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const imgData = ctx.getImageData(0, 0, size, size).data;
        const colorBuckets: Array<{ h: number; s: number; l: number; score: number }> = [];

        // Sample pixels every 4 pixels
        for (let i = 0; i < imgData.length; i += 16) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          if (a < 128) continue; // Skip transparent
          const [h, s, l] = rgbToHsl(r, g, b);

          // We want vibrant colors (saturation > 25%, lightness between 25% and 80%)
          if (s >= 25 && l >= 20 && l <= 85) {
            // Score by saturation and pleasant vibrancy
            const score = s * (1 - Math.abs(l - 55) / 55);
            colorBuckets.push({ h, s, l, score });
          }
        }

        if (colorBuckets.length === 0) {
          resolve(DEFAULT_EMERALD_THEME);
          return;
        }

        // Sort by score
        colorBuckets.sort((a, b) => b.score - a.score);
        const best = colorBuckets[0];

        // Generate matching palette
        const primary = hslToHex(best.h, Math.min(100, best.s + 15), 52);
        const primaryLight = hslToHex(best.h, Math.min(100, best.s), 75);
        const secondary = hslToHex((best.h + 20) % 360, best.s, 42);
        const accent = hslToHex(best.h, 40, 92);

        // Convert hex to rgb for rgba strings
        const r = parseInt(primary.slice(1, 3), 16);
        const g = parseInt(primary.slice(3, 5), 16);
        const b = parseInt(primary.slice(5, 7), 16);

        const theme: ThemePalette = {
          name: `Dynamic (${best.h}°)`,
          primary,
          primaryLight,
          secondary,
          accent,
          glow: `rgba(${r}, ${g}, ${b}, 0.45)`,
          glowStrong: `rgba(${r}, ${g}, ${b}, 0.85)`,
          border: `rgba(${r}, ${g}, ${b}, 0.35)`,
          cardBg: `rgba(${Math.round(r * 0.12)}, ${Math.round(g * 0.12)}, ${Math.round(
            b * 0.12
          )}, 0.85)`,
          buttonGradient: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
        };

        resolve(theme);
      } catch {
        resolve(DEFAULT_EMERALD_THEME);
      }
    };

    img.onerror = () => {
      resolve(DEFAULT_EMERALD_THEME);
    };

    img.src = imageUrl;
  });
}
