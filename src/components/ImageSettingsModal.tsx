import React, { useState } from 'react';
import { WheelItem, AnchorPosition, ImageFramingSettings } from '../types';
import {
  ArrowLeft,
  RotateCcw,
  Check,
  ZoomIn,
  Move,
  Maximize2,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface ImageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: WheelItem[];
  selectedItemId: string | null;
  onSaveSettings: (
    itemId: string,
    settings: ImageFramingSettings,
    applyToAll: boolean
  ) => void;
  onResetSettings: (itemId: string, applyToAll: boolean) => void;
}

export const ImageSettingsModal: React.FC<ImageSettingsModalProps> = ({
  isOpen,
  onClose,
  items,
  selectedItemId,
  onSaveSettings,
  onResetSettings,
}) => {
  const currentItem = items.find((i) => i.id === selectedItemId) || items[0];

  const [activeItemId, setActiveItemId] = useState<string>(
    currentItem?.id || (items[0]?.id ?? '')
  );

  const activeItem = items.find((i) => i.id === activeItemId) || currentItem;

  // Local state for edits
  const [anchor, setAnchor] = useState<AnchorPosition>(
    activeItem?.settings?.anchor || 'center'
  );
  const [scale, setScale] = useState<number>(
    Math.round((activeItem?.settings?.scale || 1.0) * 100)
  );
  const [zoom, setZoom] = useState<number>(
    Math.round((activeItem?.settings?.zoom || 1.0) * 100)
  );
  const [rotation, setRotation] = useState<number>(
    activeItem?.settings?.rotation || 0
  );
  const [offsetX, setOffsetX] = useState<number>(
    activeItem?.settings?.offsetX || 0
  );
  const [offsetY, setOffsetY] = useState<number>(
    activeItem?.settings?.offsetY || 0
  );
  const [applyToAll, setApplyToAll] = useState<boolean>(false);

  // Sync state when active item switches
  const handleSelectItem = (item: WheelItem) => {
    setActiveItemId(item.id);
    setAnchor(item.settings?.anchor || 'center');
    setScale(Math.round((item.settings?.scale || 1.0) * 100));
    setZoom(Math.round((item.settings?.zoom || 1.0) * 100));
    setRotation(item.settings?.rotation || 0);
    setOffsetX(item.settings?.offsetX || 0);
    setOffsetY(item.settings?.offsetY || 0);
  };

  const handleReset = () => {
    setAnchor('center');
    setScale(100);
    setZoom(100);
    setRotation(0);
    setOffsetX(0);
    setOffsetY(0);
    if (activeItem) {
      onResetSettings(activeItem.id, applyToAll);
    }
  };

  const handleSave = () => {
    if (!activeItem) return;
    const newSettings: ImageFramingSettings = {
      anchor,
      scale: scale / 100,
      zoom: zoom / 100,
      rotation,
      offsetX,
      offsetY,
    };
    onSaveSettings(activeItem.id, newSettings, applyToAll);
    onClose();
  };

  if (!isOpen || !activeItem) return null;

  // 9 grid anchor items
  const anchorPoints: { id: AnchorPosition; label: string; icon: string }[] = [
    { id: 'top-left', label: 'Kiri Atas', icon: '◤' },
    { id: 'top', label: 'Tengah Atas', icon: '▲' },
    { id: 'top-right', label: 'Kanan Atas', icon: '◥' },
    { id: 'left', label: 'Kiri', icon: '◀' },
    { id: 'center', label: 'Tengah', icon: '●' },
    { id: 'right', label: 'Kanan', icon: '▶' },
    { id: 'bottom-left', label: 'Kiri Bawah', icon: '◣' },
    { id: 'bottom', label: 'Tengah Bawah', icon: '▼' },
    { id: 'bottom-right', label: 'Kanan Bawah', icon: '◢' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#07130e] border border-emerald-500/30 rounded-2xl shadow-[0_0_40px_rgba(0,230,118,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-500/20 bg-[#091b14]/70">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition-colors"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              Pengaturan Gambar
            </h2>
          </div>
          <span className="text-xs text-emerald-400/80 font-medium px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30">
            Tanpa Celah (Full)
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Item Selector Carousel */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Pilih Gambar Untuk Disesuaikan
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    item.id === activeItem.id
                      ? 'border-emerald-400 ring-2 ring-emerald-500/40 scale-105'
                      : 'border-emerald-900/60 opacity-60 hover:opacity-100 hover:border-emerald-700'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {item.id === activeItem.id && (
                    <div className="absolute inset-0 bg-emerald-500/15 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Live Preview & 9-Anchor Positioning */}
          <div className="bg-[#0b1d16] p-4 rounded-xl border border-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-emerald-300">
                Posisi Gambar & Fokus
              </span>
              <span className="text-xs text-slate-400 truncate max-w-[180px]">
                {activeItem.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Preview Box with Wedge Overlay Indicator */}
              <div className="relative aspect-square w-full max-w-[190px] mx-auto rounded-xl overflow-hidden bg-black/60 border border-emerald-500/40 flex items-center justify-center">
                {/* Transformed image preview */}
                <div
                  className="w-full h-full overflow-hidden flex items-center justify-center relative"
                  style={{
                    perspective: '1000px',
                  }}
                >
                  <img
                    src={activeItem.url}
                    alt={activeItem.name}
                    className="w-full h-full object-cover transition-transform duration-100"
                    style={{
                      transform: `scale(${(scale / 100) * (zoom / 100)}) rotate(${rotation}deg) translate(${offsetX}%, ${offsetY}%)`,
                      transformOrigin:
                        anchor === 'top-left'
                          ? '0% 0%'
                          : anchor === 'top'
                          ? '50% 0%'
                          : anchor === 'top-right'
                          ? '100% 0%'
                          : anchor === 'left'
                          ? '0% 50%'
                          : anchor === 'right'
                          ? '100% 50%'
                          : anchor === 'bottom-left'
                          ? '0% 100%'
                          : anchor === 'bottom'
                          ? '50% 100%'
                          : anchor === 'bottom-right'
                          ? '100% 100%'
                          : '50% 50%',
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Subtle Wedge Guideline Overlay */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
                  viewBox="0 0 100 100"
                >
                  <path
                    d="M 50 100 L 10 10 A 55 55 0 0 1 90 10 Z"
                    fill="none"
                    stroke="#00E676"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <circle cx="50" cy="50" r="3" fill="#00E676" />
                </svg>

                <div className="absolute bottom-1 right-1 text-[10px] bg-black/70 px-1.5 py-0.5 rounded text-emerald-400">
                  Preview Sektor
                </div>
              </div>

              {/* 9-Point Anchor Alignment Grid */}
              <div>
                <label className="text-xs text-slate-300 block mb-2 font-medium">
                  Titik Jangkar (Anchor Grid)
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-2 bg-[#06140e] rounded-xl border border-emerald-950">
                  {anchorPoints.map((pt) => {
                    const isSelected = anchor === pt.id;
                    return (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => setAnchor(pt.id)}
                        className={`h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(0,230,118,0.7)] scale-105'
                            : 'bg-emerald-950/40 text-emerald-300/70 hover:bg-emerald-900/50 hover:text-white'
                        }`}
                        title={pt.label}
                      >
                        {pt.icon}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 text-center">
                  Atur fokus gambar pada bagian roda
                </p>
              </div>
            </div>
          </div>

          {/* Sliders Section */}
          <div className="space-y-4 bg-[#091b14]/50 p-4 rounded-xl border border-emerald-500/15">
            {/* Ukuran Gambar (Scale) */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  Ukuran Gambar
                </span>
                <span className="font-mono text-emerald-400">{scale}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="180"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-emerald-950 rounded-lg"
              />
            </div>

            {/* Zoom */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                  Zoom
                </span>
                <span className="font-mono text-emerald-400">{zoom}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="250"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-emerald-950 rounded-lg"
              />
            </div>

            {/* Rotasi */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                  Rotasi
                </span>
                <span className="font-mono text-emerald-400">{rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-emerald-950 rounded-lg"
              />
            </div>

            {/* Geser Posisi (Offset X & Y) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Move className="w-3 h-3 text-emerald-400" />
                    Geser X
                  </span>
                  <span className="font-mono text-emerald-400">{offsetX}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={offsetX}
                  onChange={(e) => setOffsetX(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-emerald-950 rounded-lg"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Move className="w-3 h-3 text-emerald-400" />
                    Geser Y
                  </span>
                  <span className="font-mono text-emerald-400">{offsetY}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-emerald-950 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Toggle: Terapkan ke Semua Gambar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#091b14]/70 border border-emerald-500/20">
            <div>
              <span className="text-sm font-semibold text-white block">
                Terapkan ke Semua Gambar
              </span>
              <span className="text-xs text-slate-400">
                Gunakan format ukuran & zoom ini untuk seluruh gambar roda
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={applyToAll}
                onChange={(e) => setApplyToAll(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-emerald-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
            </label>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-emerald-500/20 bg-[#06140e]">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-emerald-500/10 font-semibold text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-bold text-sm shadow-[0_0_20px_rgba(0,230,118,0.4)] hover:shadow-[0_0_28px_rgba(0,230,118,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};
