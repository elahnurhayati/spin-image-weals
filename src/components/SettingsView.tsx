import React from 'react';
import { GlobalSettings, WheelItem } from '../types';
import {
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  Clock,
  Layers,
  Sliders,
  RotateCcw,
  Palette,
  Check,
} from 'lucide-react';

interface SettingsViewProps {
  settings: GlobalSettings;
  onUpdateSettings: (newSettings: Partial<GlobalSettings>) => void;
  activeBackgroundItem: WheelItem | null;
  onResetBackground: () => void;
  onOpenFramingModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  activeBackgroundItem,
  onResetBackground,
  onOpenFramingModal,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="border-b border-emerald-500/20 pb-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          Pengaturan Aplikasi & Roda
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Sesuaikan animasi roda, suara, efek selebrasi, dan tampilan visual latar belakang
        </p>
      </div>

      {/* Roda & Game Options */}
      <div className="bg-[#071710] p-4 sm:p-5 rounded-2xl border border-emerald-500/20 space-y-5">
        <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          Animasi Roda Putar
        </h3>

        {/* Spin Duration */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Durasi Putaran Roda
            </span>
            <span className="font-mono text-emerald-400">
              {settings.spinDuration} detik
            </span>
          </div>
          <input
            type="range"
            min="2.5"
            max="7.0"
            step="0.5"
            value={settings.spinDuration}
            onChange={(e) =>
              onUpdateSettings({ spinDuration: parseFloat(e.target.value) })
            }
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-emerald-950 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>Cepat (2.5s)</span>
            <span>Standar (4.5s)</span>
            <span>Dramatis (7.0s)</span>
          </div>
        </div>

        {/* Sound FX Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-emerald-500/15">
          <div className="flex items-center gap-2.5">
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
            <div>
              <span className="text-sm font-semibold text-white block">
                Efek Suara Sintetis (Web Audio)
              </span>
              <span className="text-xs text-slate-400">
                Suara detak putaran roda dan melodi kemenangan
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) =>
                onUpdateSettings({ soundEnabled: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-emerald-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
          </label>
        </div>
      </div>

      {/* Pengaturan Latar Belakang Adaptif */}
      <div className="bg-[#071710] p-4 sm:p-5 rounded-2xl border border-emerald-500/20 space-y-4">
        <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4 text-emerald-400" />
          Latar Belakang Adaptif
        </h3>

        {activeBackgroundItem ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <img
                src={activeBackgroundItem.url}
                alt={activeBackgroundItem.name}
                className="w-12 h-12 rounded-lg object-cover border border-emerald-400"
              />
              <div>
                <span className="text-xs text-emerald-400 block font-semibold">
                  Background Aktif Saat Ini
                </span>
                <span className="text-sm font-bold text-white truncate max-w-[180px] block">
                  {activeBackgroundItem.name}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onResetBackground}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Asal
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            Background saat ini menggunakan tema default obsidian neon. Saat Anda memutar roda, latar belakang akan otomatis berubah sesuai gambar yang terpilih.
          </p>
        )}

        {/* Background Dim slider */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="text-slate-300">Kegelapan Overlay Background (Dim)</span>
            <span className="font-mono text-emerald-400">
              {settings.backgroundDim}%
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="90"
            value={settings.backgroundDim}
            onChange={(e) =>
              onUpdateSettings({ backgroundDim: parseInt(e.target.value) })
            }
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-emerald-950 rounded-lg"
          />
        </div>

        {/* Background Blur slider */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="text-slate-300">Efek Blur Latar Belakang</span>
            <span className="font-mono text-emerald-400">
              {settings.backgroundBlur}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            value={settings.backgroundBlur}
            onChange={(e) =>
              onUpdateSettings({ backgroundBlur: parseInt(e.target.value) })
            }
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-emerald-950 rounded-lg"
          />
        </div>
      </div>

      {/* Button to Open Framing Settings */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c261c] to-[#071710] border border-emerald-500/30 flex items-center justify-between gap-4">
        <div>
          <span className="text-sm font-bold text-white block">
            Pengaturan Posisi & Ukuran Gambar
          </span>
          <span className="text-xs text-slate-400">
            Atur zoom, rotasi, titik jangkar 9 arah, dan pan tanpa celah untuk semua gambar
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenFramingModal}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(0,230,118,0.3)]"
        >
          <Sliders className="w-4 h-4" />
          Buka Atur Posisi
        </button>
      </div>
    </div>
  );
};
