import React from 'react';
import { Home, Images, Sliders, Info } from 'lucide-react';
import { ThemePalette, DEFAULT_EMERALD_THEME } from '../utils/colorExtractor';

export type NavTab = 'home' | 'gallery' | 'settings' | 'info';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  theme?: ThemePalette;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  theme = DEFAULT_EMERALD_THEME,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'gallery', label: 'Galeri', icon: <Images className="w-5 h-5" /> },
    { id: 'settings', label: 'Pengaturan', icon: <Sliders className="w-5 h-5" /> },
    { id: 'info', label: 'Info', icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-[#050e0a]/90 backdrop-blur-xl border-t px-3 py-2 transition-colors duration-500"
      style={{ borderColor: theme.border }}
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all relative font-medium"
              style={{
                color: isActive ? theme.primary : '#94A3B8',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              <div
                className={`transition-transform duration-200 ${
                  isActive ? 'scale-110' : ''
                }`}
                style={
                  isActive
                    ? { filter: `drop-shadow(0 0 10px ${theme.glowStrong})` }
                    : {}
                }
              >
                {tab.icon}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <div
                  className="w-1.5 h-1.5 rounded-full mt-0.5 transition-all"
                  style={{
                    backgroundColor: theme.primary,
                    boxShadow: `0 0 8px ${theme.glowStrong}`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
