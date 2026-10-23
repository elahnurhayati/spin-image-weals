import React from 'react';
import { WheelItem } from '../types';
import { WheelCanvas } from './WheelCanvas';
import { ThemePalette, DEFAULT_EMERALD_THEME } from '../utils/colorExtractor';
import {
  Settings,
  Images,
  Play,
  RotateCw,
  Sliders,
  Maximize2,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface HomeViewProps {
  items: WheelItem[];
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinEnd: (winner: WheelItem) => void;
  spinDuration: number;
  soundEnabled: boolean;
  theme?: ThemePalette;
  onOpenSettings: () => void;
  onOpenGallery: () => void;
  onOpenFramingModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  items,
  isSpinning,
  onSpinStart,
  onSpinEnd,
  spinDuration,
  soundEnabled,
  theme = DEFAULT_EMERALD_THEME,
  onOpenSettings,
  onOpenGallery,
  onOpenFramingModal,
}) => {
  const activeItems = items.filter((i) => i.isActive);

  return (
    <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-3 sm:py-5 flex flex-col items-center pb-24">
      {/* Top Header Row (Zone 1: Settings, Zone 2: Title, Zone 3: Gallery) */}
      <div className="w-full flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={onOpenSettings}
          title="Buka Pengaturan"
          className="p-2.5 rounded-xl bg-black/60 border text-slate-200 hover:text-white transition-all backdrop-blur-md"
          style={{
            borderColor: theme.border,
            boxShadow: `0 0 12px ${theme.glow}`,
          }}
        >
          <Settings className="w-5 h-5" style={{ color: theme.primary }} />
        </button>

        {/* Title Lockup with dynamic theme glow */}
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <h1
              className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text tracking-wider font-display"
              style={{
                backgroundImage: `linear-gradient(to bottom, #FFFFFF 20%, ${theme.primaryLight} 70%, ${theme.primary} 100%)`,
                filter: `drop-shadow(0 0 16px ${theme.glowStrong})`,
              }}
            >
              IMAGE PICKER
            </h1>
            <svg
              className="w-5 h-5 animate-spin-slow inline"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.primary}
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
            </svg>
          </div>
          <span
            className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase -mt-0.5"
            style={{ color: theme.primary }}
          >
            RANDOM IMAGE WHEEL
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenGallery}
          title="Buka Galeri Gambar"
          className="p-2.5 rounded-xl bg-black/60 border text-slate-200 hover:text-white transition-all backdrop-blur-md"
          style={{
            borderColor: theme.border,
            boxShadow: `0 0 12px ${theme.glow}`,
          }}
        >
          <Images className="w-5 h-5" style={{ color: theme.primary }} />
        </button>
      </div>

      {/* Subtitle tag */}
      <p className="text-xs text-slate-300 text-center mb-3">
        Putar roda, pilih gambar, biarkan keberuntungan menentukan!
      </p>

      {/* Spinning Indicator Badge */}
      {isSpinning && (
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border text-xs font-bold animate-pulse mb-1"
          style={{
            borderColor: theme.primary,
            color: theme.primaryLight,
            boxShadow: `0 0 20px ${theme.glowStrong}`,
          }}
        >
          <RotateCw
            className="w-3.5 h-3.5 animate-spin"
            style={{ color: theme.primary }}
          />
          <span>Memutar... Tunggu sebentar ya!</span>
        </div>
      )}

      {/* Main Wheel Area */}
      {activeItems.length < 2 ? (
        <div
          className="w-full max-w-sm aspect-square my-6 rounded-3xl border-2 border-dashed bg-black/60 flex flex-col items-center justify-center p-6 text-center space-y-3"
          style={{ borderColor: theme.border }}
        >
          <Images
            className="w-12 h-12 opacity-60"
            style={{ color: theme.primary }}
          />
          <h3 className="text-base font-bold text-white">
            Paling sedikit butuh 2 gambar aktif
          </h3>
          <p className="text-xs text-slate-400">
            Aktifkan minimal 2 gambar di Galeri atau upload foto baru agar roda dapat berputar.
          </p>
          <button
            type="button"
            onClick={onOpenGallery}
            className="px-4 py-2 rounded-xl text-black font-bold text-xs"
            style={{ backgroundColor: theme.primary }}
          >
            Buka Galeri Gambar
          </button>
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <WheelCanvas
            items={activeItems}
            isSpinning={isSpinning}
            onSpinStart={onSpinStart}
            onSpinEnd={onSpinEnd}
            spinDuration={spinDuration}
            soundEnabled={soundEnabled}
            theme={theme}
          />
        </div>
      )}

      {/* Primary Action Button: Large prominent Spin CTA on Home (Hide "+ Tambah Gambar" from Home as requested) */}
      <div className="w-full max-w-sm mt-3 space-y-2">
        <button
          type="button"
          onClick={onSpinStart}
          disabled={isSpinning || activeItems.length < 2}
          className={`w-full py-4 px-6 rounded-2xl font-black text-base tracking-wide flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            isSpinning || activeItems.length < 2
              ? 'opacity-40 cursor-not-allowed bg-black/50 border border-white/10 text-slate-500'
              : 'hover:scale-[1.02] active:scale-[0.98]'
          }`}
          style={
            !isSpinning && activeItems.length >= 2
              ? {
                  background: theme.buttonGradient,
                  color: '#000000',
                  boxShadow: `0 0 28px ${theme.glowStrong}`,
                }
              : {}
          }
        >
          <Play className="w-5 h-5 fill-current stroke-none" />
          <span>{isSpinning ? 'Sedang Memutar Roda...' : 'PUTAR RODA SEKARANG'}</span>
        </button>

        <p className="text-[11px] text-slate-400 text-center">
          Tekan tombol atau klik lingkaran tengah SPIN untuk memutar
        </p>
      </div>

      {/* Features Bar (Matching the bottom strip in the collage) */}
      <div
        className="w-full mt-6 pt-5 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 text-left"
        style={{ borderColor: theme.border }}
      >
        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-black/40 border border-white/10">
          <Maximize2
            className="w-4 h-4 shrink-0 mt-0.5"
            style={{ color: theme.primary }}
          />
          <div>
            <h4 className="text-[11px] font-bold text-white">Full Gambar</h4>
            <p className="text-[10px] text-slate-400 leading-tight">
              Isi penuh roda & background tanpa celah
            </p>
          </div>
        </div>

        <div
          onClick={onOpenGallery}
          className="flex items-start gap-2.5 p-2 rounded-xl bg-black/40 border border-white/10 hover:border-white/30 cursor-pointer transition-colors"
        >
          <Images
            className="w-4 h-4 shrink-0 mt-0.5"
            style={{ color: theme.primary }}
          />
          <div>
            <h4 className="text-[11px] font-bold text-white">Kelola Gambar</h4>
            <p className="text-[10px] text-slate-400 leading-tight">
              Upload foto baru & atur gambar aktif
            </p>
          </div>
        </div>

        <div
          onClick={onOpenFramingModal}
          className="flex items-start gap-2.5 p-2 rounded-xl bg-black/40 border border-white/10 hover:border-white/30 cursor-pointer transition-colors"
        >
          <Sliders
            className="w-4 h-4 shrink-0 mt-0.5"
            style={{ color: theme.primary }}
          />
          <div>
            <h4 className="text-[11px] font-bold text-white flex items-center gap-1">
              Setting Posisi
            </h4>
            <p className="text-[10px] text-slate-400 leading-tight">
              Atur posisi, ukuran, zoom, rotasi
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-black/40 border border-white/10">
          <CheckCircle
            className="w-4 h-4 shrink-0 mt-0.5"
            style={{ color: theme.primary }}
          />
          <div>
            <h4 className="text-[11px] font-bold text-white">Warna Adaptif</h4>
            <p className="text-[10px] text-slate-400 leading-tight">
              Desain tema berubah mengikuti gambar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
