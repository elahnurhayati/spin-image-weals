import React from 'react';
import { WheelItem } from '../types';
import { X } from 'lucide-react';
import { ThemePalette, DEFAULT_EMERALD_THEME } from '../utils/colorExtractor';

interface ResultModalProps {
  winner: WheelItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSpinAgain?: () => void;
  onOpenSettings?: (itemId: string) => void;
  theme?: ThemePalette;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  winner,
  isOpen,
  onClose,
  theme = DEFAULT_EMERALD_THEME,
}) => {
  if (!isOpen || !winner) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 cursor-pointer"
    >
      {/* Main Card Container showing ONLY photo and name */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md h-[85vh] max-h-[780px] rounded-3xl overflow-hidden border-2 flex flex-col justify-between shadow-2xl cursor-default"
        style={{
          borderColor: theme.border,
          boxShadow: `0 0 50px ${theme.glowStrong}`,
        }}
      >
        {/* Full Image Background (No gaps, edge to edge) */}
        <div className="absolute inset-0 z-0">
          <img
            src={winner.url}
            alt={winner.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient at top and bottom for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50" />
        </div>

        {/* Top Header - Only Close Button on top right */}
        <div className="relative z-10 p-4 sm:p-5 flex items-center justify-end">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/90 transition-all backdrop-blur-md cursor-pointer hover:scale-105"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom - ONLY the photo name */}
        <div className="relative z-10 px-6 py-8 text-center bg-gradient-to-t from-black/95 via-black/60 to-transparent">
          <h3
            className="text-2xl sm:text-3xl font-black text-white tracking-wide drop-shadow-[0_2px_16px_rgba(0,0,0,1)]"
            style={{
              textShadow: `0 0 20px ${theme.glowStrong}, 0 2px 10px rgba(0,0,0,0.9)`,
            }}
          >
            {winner.name}
          </h3>
        </div>
      </div>
    </div>
  );
};
