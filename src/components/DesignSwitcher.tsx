'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { designs, palettes, type Design, type ColorPalette } from '@/lib/themes';
import { playMechanicalTick, playDigitalChime } from '../lib/audio';

function PaletteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C6.5 2 2 6 2 11c0 4.5 3.5 7 7 7 1 0 1.5-.7 1.5-1.5 0-.4-.2-.7-.4-1-.2-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H13c3.3 0 6-2.5 6-6 0-3.6-3.1-5.5-7-5.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="11" r="1.3" fill="currentColor" />
      <circle cx="11" cy="7.5" r="1.3" fill="currentColor" />
      <circle cx="15.5" cy="9" r="1.3" fill="currentColor" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 3D Shape Icons
function ShapeIcon({ shape }: { shape: string }) {
  switch (shape) {
    case 'box':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" strokeWidth="1.5" />
          <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeWidth="1.5" />
        </svg>
      );
    case 'octa':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current">
          <path d="M12 2L4 12L12 22L20 12L12 2Z" strokeWidth="1.5" />
          <path d="M4 12H20M12 2V22" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      );
    case 'torus':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current">
          <ellipse cx="12" cy="12" rx="9" ry="5" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="4" ry="2" strokeWidth="1.5" />
        </svg>
      );
    case 'knot':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current">
          <path d="M12 3a9 9 0 0 1 9 9c0 2.5-1.5 4.5-4 5.5s-5.5 0-7-1.5S7.5 12 9 9.5s4.5-1 5.5.5S15 15.5 12 17s-6 0-7-1.5S4 11 6 8.5" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'sphere':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
          <path d="M3 12c0 4.97 4.03 9 9 9s9-4.03 9-9" strokeWidth="1.5" strokeDasharray="3 3" />
          <ellipse cx="12" cy="12" rx="9" ry="3" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      );
    case 'ico':
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current">
          <path d="M12 2L2 9l10 13 10-13L12 2Z" strokeWidth="1.5" />
          <path d="M12 2v20M2 9h20M12 9L2 9M12 9l10 0" strokeWidth="1.5" />
          <path d="M12 22L7.5 9.5M12 22l4.5-12.5" strokeWidth="1" strokeDasharray="1 1" />
        </svg>
      );
  }
}

export default function DesignSwitcher() {
  const { designId, paletteId, setDesignId, setPaletteId, theme, soundEnabled, setSoundEnabled } = useTheme();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'palette'>('design');
  const [mounted, setMounted] = useState(false);
  const [dockSide, setDockSide] = useState<'left' | 'right'>('right');
  const [isDragging, setIsDragging] = useState(false);

  const controls = useAnimation();
  const buttonRef = useRef<HTMLDivElement>(null);

  // Initialize and check window dimensions safely
  useEffect(() => {
    setMounted(true);
    const screenWidth = window.innerWidth;
    const initialX = screenWidth - 145 - 24; // width + margin
    const initialY = 120;
    controls.set({ x: initialX, y: initialY });

    // Handle viewport resize: keep inside bounds
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const nextX = dockSide === 'left' ? 16 : w - rect.width - 16;
        const nextY = Math.max(16, Math.min(h - rect.height - 16, rect.top));
        controls.start({ x: nextX, y: nextY, transition: { duration: 0.2 } });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [controls, dockSide]);

  // Close switcher on escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);



  if (!mounted) {
    return (
      <button className="fixed right-4 top-24 z-[60] flex items-center gap-2 rounded-full border border-line/20 bg-base-raised/80 px-4 py-2.5 text-sm font-medium text-ink shadow-lg backdrop-blur-md opacity-50 pointer-events-none">
        <PaletteIcon />
        <span>Customize</span>
      </button>
    );
  }

  const handleDragEnd = (_event: any, info: any) => {
    setTimeout(() => setIsDragging(false), 50); // slight timeout to prevent instant click triggers
    if (!buttonRef.current) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const rect = buttonRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Center point of the dragged button
    const currentY = info.point.y - height / 2;

    const isLeft = info.point.x < screenWidth / 2;
    const targetX = isLeft ? 16 : screenWidth - width - 16;
    // Y bounds clamp - constrained below the header/navbar area (Y >= 96)
    const targetY = Math.max(96, Math.min(screenHeight - height - 16, currentY));

    setDockSide(isLeft ? 'left' : 'right');

    if (soundEnabled) playMechanicalTick();

    controls.start({
      x: targetX,
      y: targetY,
      transition: { type: 'spring', stiffness: 280, damping: 24 },
    });
  };

  const handleButtonClick = () => {
    if (!isDragging) {
      if (soundEnabled) playDigitalChime();
      setOpen((v) => !v);
    }
  };

  return (
    <>
      {/* Draggable Snapping floating button */}
      <motion.div
        ref={buttonRef}
        drag
        dragMomentum={false}
        animate={controls}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.08, shadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)' }}
        whileHover={{ scale: 1.05 }}
        style={{ position: 'fixed', left: 0, top: 0, zIndex: 60 }}
        className="touch-none select-none cursor-grab active:cursor-grabbing"
      >
        <button
          onClick={handleButtonClick}
          aria-label="Customize page aesthetics"
          aria-expanded={open}
          className="flex items-center gap-2 rounded-full border border-line/20 bg-base-raised/80 px-4 py-2.5 text-sm font-medium text-ink shadow-xl backdrop-blur-md transition-all hover:border-accent-cyan/50 hover:bg-base-raised"
        >
          <span className="text-accent-cyan animate-pulse">
            <PaletteIcon />
          </span>
          <span className="hidden xs:inline">Customize</span>
          <span className="flex gap-0.5 border border-line/10 rounded-full p-0.5 bg-black/15">
            {theme.swatch.map((c, i) => (
              <span
                key={i}
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: c }}
              />
            ))}
          </span>
        </button>
      </motion.div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[58] bg-black/30 backdrop-blur-xs"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Aesthetic Customizer Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Aesthetic settings panel"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`fixed z-[59] w-[min(92vw,400px)] rounded-2xl border border-line/15 bg-base-raised/95 p-4 shadow-2xl backdrop-blur-xl ${
              dockSide === 'left'
                ? 'left-4 top-24 origin-top-left'
                : 'right-4 top-24 origin-top-right'
            }`}
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-ink">Aesthetic Studio</h2>
                <p className="text-xs text-ink-faint">
                  Combine unique styles & colors · Saved automatically
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
                  aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
                  className={`rounded-lg p-1.5 transition-colors border ${
                    soundEnabled
                      ? 'text-accent-cyan border-accent-cyan/20 bg-accent-cyan/5 hover:bg-accent-cyan/15'
                      : 'text-ink-muted border-line/10 hover:bg-white/5'
                  }`}
                >
                  {soundEnabled ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <line x1="23" y1="9" x2="17" y2="15"></line>
                      <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close customizer"
                  className="rounded-lg p-1.5 text-ink-muted hover:bg-white/5 hover:text-ink transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Section tabs switcher */}
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl bg-black/15 p-1 text-sm">
              <button
                onClick={() => setActiveTab('design')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-medium transition-all ${
                  activeTab === 'design'
                    ? 'bg-base-raised text-ink shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <SettingsIcon />
                <span>📐 Styles</span>
              </button>
              <button
                onClick={() => setActiveTab('palette')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-medium transition-all ${
                  activeTab === 'palette'
                    ? 'bg-base-raised text-ink shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <PaletteIcon />
                <span>🎨 Palettes</span>
              </button>
            </div>

            {/* List Panels */}
            <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-2 scrollbar-thin">
              {activeTab === 'design' ? (
                // Designs Presets Selection
                designs.map((d: Design) => {
                  const active = d.id === designId;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setDesignId(d.id)}
                      className={`group relative flex w-full items-center gap-3.5 rounded-xl border p-3 text-left transition-all ${
                        active
                          ? 'border-accent-cyan bg-accent-cyan/10'
                          : 'border-line/10 hover:border-line/35 hover:bg-white/5'
                      }`}
                    >
                      {/* Geometric preview */}
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-all ${
                          active
                            ? 'border-accent-cyan/30 bg-accent-cyan/15 text-accent-cyan scale-105'
                            : 'border-line/10 bg-black/10 text-ink-muted group-hover:text-ink group-hover:bg-black/15'
                        }`}
                        aria-hidden="true"
                      >
                        <ShapeIcon shape={d.three.shape} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-ink">{d.name}</span>
                          {active && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-accent-cyan" aria-hidden="true">
                              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="block text-xs leading-normal text-ink-faint mt-0.5">{d.blurb}</span>
                      </span>
                    </button>
                  );
                })
              ) : (
                // Palette Presets Selection
                palettes.map((p: ColorPalette) => {
                  const active = p.id === paletteId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPaletteId(p.id)}
                      className={`group relative flex w-full items-center gap-3.5 rounded-xl border p-3 text-left transition-all ${
                        active
                          ? 'border-accent-cyan bg-accent-cyan/10'
                          : 'border-line/10 hover:border-line/35 hover:bg-white/5'
                      }`}
                    >
                      {/* Swatch dots preview */}
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line/10 bg-black/15"
                        aria-hidden="true"
                      >
                        <span className="grid grid-cols-2 gap-1">
                          {p.swatch.map((color, index) => (
                            <span
                              key={index}
                              className={`h-3 w-3 rounded-full border border-white/10 ${
                                index === 2 ? 'col-span-2 mx-auto h-2.5 w-7 rounded-sm' : ''
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-1.5">
                          <span className="font-semibold text-sm text-ink">{p.name}</span>
                          <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink-muted border border-line/5 shrink-0">
                            {p.mode}
                          </span>
                        </span>
                        <span className="block text-xs leading-normal text-ink-faint mt-0.5">{p.blurb}</span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Customizer Panel Status Footer */}
            <div className="mt-3 flex items-center justify-between border-t border-line/10 pt-2.5 text-[11px] text-ink-faint">
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active: {theme.name}
              </span>
              <span>78 Combinations Available</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
