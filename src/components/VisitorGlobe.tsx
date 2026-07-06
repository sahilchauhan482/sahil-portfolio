'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { playAlienBlip } from '../lib/audio';
import { logVisitor, getAllVisitors } from '@/lib/visitor-tracker';
import { supabase, type VisitorRow } from '@/lib/supabase';

// =========================================================================
//  Live Visitor Globe — real visitor geo data via Supabase
// =========================================================================

// Convert lat/lng to CSS position on a 2D circle (orthographic projection)
function latLngToCSS(lat: number, lng: number, radius: number): { x: number; y: number } {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: -radius * Math.cos(phi),
  };
}

function GlobeDot({ country, city, lat, lng, isYou = false }: {
  country: string;
  city: string;
  lat: number;
  lng: number;
  isYou?: boolean;
}) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="absolute"
        style={{
          transform: `translate(${latLngToCSS(lat, lng, 70).x}px, ${latLngToCSS(lat, lng, 70).y}px)`,
        }}
      >
        {/* Dot */}
        <span
          className={`block rounded-full transition-all duration-500 ${
            isYou ? 'w-2.5 h-2.5 bg-accent-cyan shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'w-1.5 h-1.5 bg-accent-violet/80'
          } ${pulse ? 'scale-150' : 'scale-100'}`}
        />
        {/* Pulse ring for "You" */}
        {isYou && pulse && (
          <span className="absolute -inset-1 rounded-full bg-accent-cyan/30 animate-ping" />
        )}
      </div>
    </div>
  );
}

export default function VisitorGlobe() {
  const { soundEnabled } = useTheme();
  const [open, setOpen] = useState(false);
  const [visitors, setVisitors] = useState<VisitorRow[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ country: string; city: string; lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const init = async () => {
      setLoading(true);

      // Log this visitor + get their location
      const location = await logVisitor();
      if (location) {
        setCurrentLocation(location);
      }

      // Fetch all visitors from Supabase
      const all = await getAllVisitors();
      if (all.length > 0) {
        setVisitors(all);
      }

      setLoading(false);
    };

    init();

    // Refresh every 30 seconds
    const interval = setInterval(async () => {
      const fresh = await getAllVisitors();
      if (fresh.length > 0) setVisitors(fresh);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = useCallback(() => {
    if (soundEnabled) playAlienBlip();
    setOpen(o => !o);
  }, [soundEnabled]);

  if (!mounted) return null;

  const hasVisitors = visitors.length > 0;
  const displayVisitors = hasVisitors ? visitors : [];
  const totalCount = displayVisitors.length + (currentLocation && !displayVisitors.some(v =>
    v.city === currentLocation.city && v.country === currentLocation.country
  ) ? 1 : 0);

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={handleToggle}
        aria-label="Toggle visitor globe"
        className="fixed bottom-20 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-base-raised/80 text-lg shadow-xl backdrop-blur-md transition-all hover:border-accent-cyan/50 hover:scale-105"
      >
        {loading ? '⏳' : '🌍'}
      </motion.button>

      {/* Globe Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-36 right-4 z-50 w-[300px] rounded-2xl border border-white/15 bg-base-raised/95 p-4 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-ink">🌍 Live Visitors</h3>
                <p className="text-[10px] text-ink-faint">
                  {hasVisitors ? `${totalCount} real visitors` : 'Fetching visitors...'}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-ink-muted hover:bg-white/5 hover:text-ink transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Globe visualization */}
            <div className="relative mx-auto h-[160px] w-[160px] rounded-full bg-gradient-to-br from-accent-cyan/5 to-accent-violet/5 border border-white/10 overflow-hidden">
              {/* Globe grid lines */}
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-[15%] rounded-full border border-white/5" />
              <div className="absolute inset-[30%] rounded-full border border-white/5" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />

              {/* No data state */}
              {!hasVisitors && !currentLocation && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] text-ink-faint">🌍 Waiting for visitors...</span>
                </div>
              )}

              {/* Visitor dots from Supabase */}
              {displayVisitors.map((v, i) => (
                <GlobeDot
                  key={`${v.country}-${v.city}-${i}`}
                  country={v.country}
                  city={v.city}
                  lat={v.lat}
                  lng={v.lng}
                  isYou={currentLocation?.city === v.city && currentLocation?.country === v.country}
                />
              ))}

              {/* "You" dot if not already in visitors list */}
              {currentLocation && !displayVisitors.some(v => v.city === currentLocation.city && v.country === currentLocation.country) && (
                <GlobeDot
                  country={currentLocation.country}
                  city={currentLocation.city}
                  lat={currentLocation.lat}
                  lng={currentLocation.lng}
                  isYou
                />
              )}
            </div>

            {/* Visitor list */}
            <div className="mt-3 max-h-[140px] overflow-y-auto space-y-1 scrollbar-thin">
              {displayVisitors.length > 0 ? (
                displayVisitors.slice(0, 10).map((v, i) => (
                  <div
                    key={`${v.country}-${v.city}-${i}`}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-white/5"
                  >
                    <span className="text-ink-muted">
                      {v.city}, {v.country}
                      {currentLocation?.city === v.city && currentLocation?.country === v.country && (
                        <span className="ml-1 text-[9px] text-accent-cyan">(You)</span>
                      )}
                    </span>
                    <span className="text-[10px] text-ink-faint">
                      {new Date(v.visited_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : currentLocation ? (
                <div className="text-center text-xs text-ink-faint py-2">
                  You're the first visitor! 🎉
                </div>
              ) : (
                <div className="text-center text-xs text-ink-faint py-2">
                  Loading...
                </div>
              )}
            </div>

            {/* Status footer */}
            <p className="mt-2 text-[9px] text-center text-ink-faint">
              {currentLocation
                ? `📍 You: ${currentLocation.city}, ${currentLocation.country}`
                : '📍 Locating you...'}
              {!supabase && ' · ⚠️ Supabase not configured'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
