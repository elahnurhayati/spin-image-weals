import React, { useState } from 'react';
import { WheelItem } from '../types';
import {
  Plus,
  Star,
  Check,
  Trash2,
  Sliders,
  Images,
  Sparkles,
  Info,
} from 'lucide-react';

import { ThemePalette, DEFAULT_EMERALD_THEME } from '../utils/colorExtractor';

interface GalleryViewProps {
  items: WheelItem[];
  onToggleActive: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteCustom: (id: string) => void;
  onOpenSettings: (id: string) => void;
  onOpenAddModal: () => void;
  onSelectAll: () => void;
  theme?: ThemePalette;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  items,
  onToggleActive,
  onToggleFavorite,
  onDeleteCustom,
  onOpenSettings,
  onOpenAddModal,
  onSelectAll,
  theme = DEFAULT_EMERALD_THEME,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'favorites' | 'custom'>('all');

  const filteredItems = items.filter((item) => {
    if (filterTab === 'favorites') return item.isFavorite;
    if (filterTab === 'custom') return item.isCustom;
    return true;
  });

  const activeCount = items.filter((i) => i.isActive).length;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-5 pb-24">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4"
        style={{ borderColor: theme.border }}
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
            <Images className="w-6 h-6" style={{ color: theme.primary }} />
            Galeri Gambar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola gambar yang akan tampil di roda putar keberuntungan
          </p>
        </div>

        {/* Status Counter */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-3 py-1.5 rounded-full bg-black/60 border font-semibold flex items-center gap-1.5"
            style={{
              borderColor: theme.border,
              color: theme.primaryLight,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: theme.primary }}
            />
            {activeCount} Aktif di Roda
          </span>
          <button
            type="button"
            onClick={onSelectAll}
            className="text-xs px-2.5 py-1.5 rounded-lg border hover:text-white transition-colors"
            style={{
              borderColor: theme.border,
              color: theme.primary,
            }}
          >
            Aktifkan Semua
          </button>
        </div>
      </div>

      {/* Filter Tabs (Interactive Segmented Control) */}
      <div
        className="flex items-center gap-1 p-1 bg-black/50 rounded-xl border"
        style={{ borderColor: theme.border }}
      >
        <button
          type="button"
          onClick={() => setFilterTab('all')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            filterTab === 'all'
              ? 'text-black'
              : 'text-slate-400 hover:text-white'
          }`}
          style={
            filterTab === 'all'
              ? {
                  backgroundColor: theme.primary,
                  boxShadow: `0 0 12px ${theme.glow}`,
                }
              : {}
          }
        >
          Semua ({items.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab('favorites')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            filterTab === 'favorites'
              ? 'text-black'
              : 'text-slate-400 hover:text-white'
          }`}
          style={
            filterTab === 'favorites'
              ? {
                  backgroundColor: theme.primary,
                  boxShadow: `0 0 12px ${theme.glow}`,
                }
              : {}
          }
        >
          Favorit ({items.filter((i) => i.isFavorite).length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab('custom')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            filterTab === 'custom'
              ? 'text-black'
              : 'text-slate-400 hover:text-white'
          }`}
          style={
            filterTab === 'custom'
              ? {
                  backgroundColor: theme.primary,
                  boxShadow: `0 0 12px ${theme.glow}`,
                }
              : {}
          }
        >
          Upload ({items.filter((i) => i.isCustom).length})
        </button>
      </div>

      {/* Images Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 p-6 rounded-2xl bg-[#071710]/50 border border-dashed border-emerald-500/20 space-y-3">
          <p className="text-slate-400 text-sm">
            {filterTab === 'favorites'
              ? 'Belum ada gambar favorit. Beri bintang pada gambar untuk menyimpannya di sini!'
              : filterTab === 'custom'
              ? 'Belum ada foto yang diupload. Klik tombol "Tambah Gambar" untuk upload foto Anda!'
              : 'Tidak ada gambar yang ditemukan.'}
          </p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
          >
            <Plus className="w-4 h-4" />
            Tambah Gambar Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                item.isActive
                  ? 'opacity-100'
                  : 'border-slate-800 opacity-60 hover:opacity-90'
              }`}
              style={
                item.isActive
                  ? {
                      borderColor: theme.primary,
                      boxShadow: `0 0 16px ${theme.glow}`,
                    }
                  : {}
              }
            >
              {/* Image full cover */}
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />

              {/* Top Controls: Active Checkmark & Favorite Star */}
              <div className="absolute top-2 inset-x-2 flex items-center justify-between z-10">
                {/* Active in Wheel Toggle Button */}
                <button
                  type="button"
                  onClick={() => onToggleActive(item.id)}
                  title={item.isActive ? 'Hapus dari roda' : 'Tambahkan ke roda'}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    item.isActive
                      ? 'text-black'
                      : 'bg-black/60 border border-white/30 text-white/40 hover:text-white'
                  }`}
                  style={
                    item.isActive
                      ? {
                          backgroundColor: theme.primary,
                          boxShadow: `0 0 10px ${theme.glowStrong}`,
                        }
                      : {}
                  }
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>

                <div className="flex items-center gap-1">
                  {/* Favorite Toggle Button */}
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(item.id)}
                    title={item.isFavorite ? 'Hapus favorit' : 'Jadikan favorit'}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-md transition-all ${
                      item.isFavorite
                        ? 'bg-amber-500/90 text-white shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                        : 'bg-black/50 text-white/60 hover:text-white'
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        item.isFavorite ? 'fill-white stroke-none' : ''
                      }`}
                    />
                  </button>

                  {/* Delete Button (Only for custom uploaded items) */}
                  {item.isCustom && (
                    <button
                      type="button"
                      onClick={() => onDeleteCustom(item.id)}
                      title="Hapus gambar kustom"
                      className="w-7 h-7 rounded-lg bg-black/50 hover:bg-red-600/90 text-white/70 hover:text-white flex items-center justify-center transition-colors backdrop-blur-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Label & Settings Shortcut */}
              <div className="absolute bottom-2 inset-x-2 flex items-center justify-between z-10">
                <span className="text-[11px] font-bold text-white truncate max-w-[70%] drop-shadow">
                  {item.name}
                </span>

                <button
                  type="button"
                  onClick={() => onOpenSettings(item.id)}
                  title="Atur posisi & framing gambar"
                  className="p-1 rounded-md bg-black/60 hover:text-black border transition-all backdrop-blur-md"
                  style={{
                    borderColor: theme.border,
                    color: theme.primary,
                  }}
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Primary Bottom Button: "+ Tambah Gambar" */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="w-full py-4 px-6 rounded-2xl text-black font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          style={{
            background: theme.buttonGradient,
            boxShadow: `0 0 26px ${theme.glowStrong}`,
          }}
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Tambah Gambar Baru</span>
        </button>
      </div>

      {/* Info Tip */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-slate-300">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          Semua gambar otomatis dioptimalkan agar tampil <strong>full tanpa celah</strong> di dalam roda dan background. Anda dapat mengatur titik fokus gambar melalui tombol pengaturan.
        </span>
      </div>
    </div>
  );
};
