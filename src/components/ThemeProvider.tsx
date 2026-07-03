'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  designs,
  palettes,
  getDesign,
  getPalette,
  defaultDesignId,
  defaultPaletteId,
  type Theme,
  type Design,
  type ColorPalette,
} from '@/lib/themes';

interface ThemeContextValue {
  designId: string;
  paletteId: string;
  design: Design;
  palette: ColorPalette;
  theme: Theme;
  setDesignId: (id: string) => void;
  setPaletteId: (id: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const DESIGN_STORAGE_KEY = 'portfolio-design';
export const PALETTE_STORAGE_KEY = 'portfolio-palette';

// Applies design and palette attributes to <html>
function applyTheme(designId: string, paletteId: string) {
  const d = getDesign(designId);
  const p = getPalette(paletteId);
  const root = document.documentElement;

  root.setAttribute('data-design', d.id);
  root.setAttribute('data-palette', p.id);
  root.setAttribute('data-atmosphere', d.atmosphere);
  root.setAttribute('data-surface', d.surface);
  root.style.colorScheme = p.mode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [designId, setDesignIdState] = useState(defaultDesignId);
  const [paletteId, setPaletteIdState] = useState(defaultPaletteId);
  const [soundEnabled, setSoundEnabledState] = useState(true);

  // Sync state on mount (inline script handles first paint)
  useEffect(() => {
    const savedDesign = localStorage.getItem(DESIGN_STORAGE_KEY);
    const savedPalette = localStorage.getItem(PALETTE_STORAGE_KEY);
    const savedSound = localStorage.getItem('portfolio-sound');

    let currentDesign = defaultDesignId;
    let currentPalette = defaultPaletteId;

    if (savedDesign && designs.some((d) => d.id === savedDesign)) {
      setDesignIdState(savedDesign);
      currentDesign = savedDesign;
    }
    if (savedPalette && palettes.some((p) => p.id === savedPalette)) {
      setPaletteIdState(savedPalette);
      currentPalette = savedPalette;
    }
    if (savedSound !== null) {
      setSoundEnabledState(savedSound === 'true');
    }

    applyTheme(currentDesign, currentPalette);
  }, []);

  const setDesignId = useCallback((id: string) => {
    setDesignIdState(id);
    localStorage.setItem(DESIGN_STORAGE_KEY, id);
    applyTheme(id, paletteId);
  }, [paletteId]);

  const setPaletteId = useCallback((id: string) => {
    setPaletteIdState(id);
    localStorage.setItem(PALETTE_STORAGE_KEY, id);
    applyTheme(designId, id);
  }, [designId]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem('portfolio-sound', String(enabled));
  }, []);

  // Combine design and palette for backwards-compatibility with Hero3D etc.
  const theme = useMemo(() => {
    const d = getDesign(designId);
    const p = getPalette(paletteId);
    return {
      id: `${d.id}-${p.id}`,
      name: `${d.name} (${p.name})`,
      blurb: d.blurb,
      mode: p.mode,
      vars: p.vars,
      fontDisplay: d.fontDisplay,
      fontBody: d.fontBody,
      surface: d.surface,
      atmosphere: d.atmosphere,
      radius: d.radius,
      three: {
        ...d.three,
        ...p.three,
      },
      swatch: p.swatch,
    } as Theme;
  }, [designId, paletteId]);

  const contextValue = useMemo(() => {
    const d = getDesign(designId);
    const p = getPalette(paletteId);
    return {
      designId,
      paletteId,
      design: d,
      palette: p,
      theme,
      setDesignId,
      setPaletteId,
      soundEnabled,
      setSoundEnabled,
    };
  }, [designId, paletteId, theme, setDesignId, setPaletteId, soundEnabled, setSoundEnabled]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
