import React, { useState, useEffect, useCallback } from 'react';
import { WheelItem, ImageFramingSettings, GlobalSettings } from './types';
import { defaultPresets, defaultFramingSettings } from './data/defaultPresets';
import { AppBackground } from './components/AppBackground';
import { HomeView } from './components/HomeView';
import { GalleryView } from './components/GalleryView';
import { SettingsView } from './components/SettingsView';
import { InfoView } from './components/InfoView';
import { BottomNav, NavTab } from './components/BottomNav';
import { ImageSettingsModal } from './components/ImageSettingsModal';
import { AddImageModal } from './components/AddImageModal';
import { ResultModal } from './components/ResultModal';
import { soundManager } from './utils/audio';
import {
  ThemePalette,
  DEFAULT_EMERALD_THEME,
  extractThemeFromImage,
} from './utils/colorExtractor';

const STORAGE_KEY_ITEMS = 'image_picker_items_v1';
const STORAGE_KEY_SETTINGS = 'image_picker_settings_v1';
const STORAGE_KEY_BG = 'image_picker_active_bg_v1';

export default function App() {
  // Load saved items from localStorage or fallback to defaultPresets
  const [items, setItems] = useState<WheelItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
    return defaultPresets;
  });

  // Global settings
  const [settings, setSettings] = useState<GlobalSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return {
      spinDuration: 4.5,
      soundEnabled: true,
      confettiEnabled: true,
      backgroundDim: 50,
      backgroundBlur: 10,
      applyToAll: false,
    };
  });

  // Active Background Item (Dynamically adapts to the picked winner!)
  const [activeBackgroundItem, setActiveBackgroundItem] = useState<WheelItem | null>(() => {
    try {
      const savedBgId = localStorage.getItem(STORAGE_KEY_BG);
      if (savedBgId) {
        const found = items.find((i) => i.id === savedBgId);
        if (found) return found;
      }
    } catch {
      // Ignore
    }
    return null;
  });

  // Dynamic Theme Palette: automatically adapts to the chosen image
  const [currentTheme, setCurrentTheme] = useState<ThemePalette>(DEFAULT_EMERALD_THEME);

  // Navigation & Modal States
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<WheelItem | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isFramingModalOpen, setIsFramingModalOpen] = useState<boolean>(false);
  const [selectedFramingItemId, setSelectedFramingItemId] = useState<string | null>(null);

  // Extract theme colors whenever active background item changes
  useEffect(() => {
    if (activeBackgroundItem) {
      extractThemeFromImage(activeBackgroundItem.url, activeBackgroundItem.id).then((palette) => {
        setCurrentTheme(palette);
      });
    } else {
      setCurrentTheme(DEFAULT_EMERALD_THEME);
    }
  }, [activeBackgroundItem]);

  // Sync sound manager mute status with settings
  useEffect(() => {
    soundManager.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Persist items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch {
      // Ignore storage quota
    }
  }, [items]);

  // Persist settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // Handle spin start
  const handleSpinStart = useCallback(() => {
    const activeItems = items.filter((i) => i.isActive);
    if (activeItems.length < 2 || isSpinning) return;
    setIsSpinning(true);
    setIsResultModalOpen(false);
  }, [items, isSpinning]);

  // Handle spin end & winner chosen
  const handleSpinEnd = useCallback(
    (pickedWinner: WheelItem) => {
      setIsSpinning(false);
      setWinner(pickedWinner);

      // ADAPTIVE BACKGROUND: Update app's base background to the chosen image!
      setActiveBackgroundItem(pickedWinner);
      try {
        localStorage.setItem(STORAGE_KEY_BG, pickedWinner.id);
      } catch {
        // Ignore
      }

      // Buka tampilan hasil (hanya foto dan nama)
      setIsResultModalOpen(true);
    },
    []
  );

  // Keyboard shortcut listener (Space/Enter to spin, Escape to close modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        if (!isSpinning && !isResultModalOpen && !isAddModalOpen && !isFramingModalOpen && activeTab === 'home') {
          e.preventDefault();
          handleSpinStart();
        }
      } else if (e.code === 'Escape') {
        setIsResultModalOpen(false);
        setIsAddModalOpen(false);
        setIsFramingModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, isResultModalOpen, isAddModalOpen, isFramingModalOpen, activeTab, handleSpinStart]);

  // Image framing save
  const handleSaveFramingSettings = (
    itemId: string,
    newSettings: ImageFramingSettings,
    applyToAll: boolean
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (applyToAll || item.id === itemId) {
          return {
            ...item,
            settings: { ...newSettings },
          };
        }
        return item;
      })
    );
  };

  // Reset framing
  const handleResetFraming = (itemId: string, applyToAll: boolean) => {
    setItems((prev) =>
      prev.map((item) => {
        if (applyToAll || item.id === itemId) {
          return {
            ...item,
            settings: { ...defaultFramingSettings },
          };
        }
        return item;
      })
    );
  };

  // Add new image from modal
  const handleAddImage = (newItem: WheelItem) => {
    setItems((prev) => [newItem, ...prev]);
    // Switch to home view to see it on the wheel immediately
    setActiveTab('home');
  };

  // Toggle active in wheel
  const handleToggleActive = (id: string) => {
    setItems((prev) => {
      const activeCount = prev.filter((i) => i.isActive).length;
      return prev.map((item) => {
        if (item.id === id) {
          // Prevent deactivating if it would leave fewer than 2 active
          if (item.isActive && activeCount <= 2) {
            return item;
          }
          return { ...item, isActive: !item.isActive };
        }
        return item;
      });
    });
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  // Delete custom uploaded item
  const handleDeleteCustom = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (activeBackgroundItem?.id === id) {
      setActiveBackgroundItem(null);
      localStorage.removeItem(STORAGE_KEY_BG);
    }
  };

  // Select all items for wheel
  const handleSelectAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isActive: true })));
  };

  // Open Framing modal for a specific item
  const handleOpenFraming = (id?: string) => {
    setSelectedFramingItemId(id || items[0]?.id || null);
    setIsFramingModalOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between text-slate-100 overflow-x-hidden">
      {/* 1. Dynamic Adaptive Background */}
      <AppBackground
        activeBackgroundItem={activeBackgroundItem}
        settings={settings}
        theme={currentTheme}
      />

      {/* 2. Main Content View Router */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start w-full">
        {activeTab === 'home' && (
          <HomeView
            items={items}
            isSpinning={isSpinning}
            onSpinStart={handleSpinStart}
            onSpinEnd={handleSpinEnd}
            spinDuration={settings.spinDuration}
            soundEnabled={settings.soundEnabled}
            theme={currentTheme}
            onOpenSettings={() => setActiveTab('settings')}
            onOpenGallery={() => setActiveTab('gallery')}
            onOpenFramingModal={() => handleOpenFraming()}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryView
            items={items}
            onToggleActive={handleToggleActive}
            onToggleFavorite={handleToggleFavorite}
            onDeleteCustom={handleDeleteCustom}
            onOpenSettings={(id) => handleOpenFraming(id)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onSelectAll={handleSelectAll}
            theme={currentTheme}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={(updated) =>
              setSettings((prev) => ({ ...prev, ...updated }))
            }
            activeBackgroundItem={activeBackgroundItem}
            onResetBackground={() => {
              setActiveBackgroundItem(null);
              localStorage.removeItem(STORAGE_KEY_BG);
            }}
            onOpenFramingModal={() => handleOpenFraming()}
          />
        )}

        {activeTab === 'info' && <InfoView />}
      </main>

      {/* 3. Bottom Sticky Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (!isSpinning) {
            setActiveTab(tab);
          }
        }}
        theme={currentTheme}
      />

      {/* 4. Result Modal (Gambar Terpilih!) */}
      <ResultModal
        winner={winner}
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        onSpinAgain={() => {
          setIsResultModalOpen(false);
          setActiveTab('home');
          setTimeout(() => {
            handleSpinStart();
          }, 200);
        }}
        onOpenSettings={(id) => {
          setIsResultModalOpen(false);
          handleOpenFraming(id);
        }}
        theme={currentTheme}
      />

      {/* 5. Add Image Modal (+ Tambah Gambar) */}
      <AddImageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddImage={handleAddImage}
      />

      {/* 6. Image Settings Modal (Pengaturan Gambar 9-Anchor & Zoom) */}
      <ImageSettingsModal
        isOpen={isFramingModalOpen}
        onClose={() => setIsFramingModalOpen(false)}
        items={items}
        selectedItemId={selectedFramingItemId}
        onSaveSettings={handleSaveFramingSettings}
        onResetSettings={handleResetFraming}
      />
    </div>
  );
}
