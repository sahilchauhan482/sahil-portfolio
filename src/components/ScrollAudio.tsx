'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';
import { playScrollTick, playSectionChime } from '../lib/audio';

// Pentatonic harmonious musical notes mapped to page sections
const SECTION_NOTES: { [key: string]: number } = {
  top: 261.63,        // C4 (Hero)
  about: 293.66,      // D4
  skills: 329.63,     // E4
  experience: 392.00, // G4
  projects: 440.00,   // A4
  contact: 523.25,    // C5
};

export default function ScrollAudio() {
  const { soundEnabled } = useTheme();
  const activeSectionRef = useRef<string>('top');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastScrollY = window.scrollY;
    let lastTickTime = 0;

    const handleScroll = () => {
      if (!soundEnabled) return;
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - lastScrollY);
      
      if (diff > 160) {
        const now = Date.now();
        if (now - lastTickTime > 140) {
          playScrollTick();
          lastScrollY = currentScrollY;
          lastTickTime = now;
        }
      }
    };

    // IntersectionObserver to detect which section is currently centered
    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -35% 0px', // triggers when section hits middle area of screen
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && soundEnabled) {
          const id = entry.target.id;
          if (id && id !== activeSectionRef.current && SECTION_NOTES[id]) {
            activeSectionRef.current = id;
            playSectionChime(SECTION_NOTES[id]);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sectionIds = ['top', 'about', 'skills', 'experience', 'projects', 'contact'];
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [soundEnabled]);

  return null;
}
