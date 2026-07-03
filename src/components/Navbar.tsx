'use client';

import { useState, useEffect } from 'react';
import { site } from '@/lib/data';
import { useTheme } from './ThemeProvider';
import { playMechanicalTick } from '../lib/audio';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Work', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { designId, soundEnabled } = useTheme();

  const playClick = () => {
    if (soundEnabled) playMechanicalTick();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getNavStyles = () => {
    switch (designId) {
      case 'cyberpunk':
        return {
          header: `fixed inset-x-0 top-0 z-50 border-b border-accent-cyan/30 py-2 font-mono transition-all ${scrolled ? 'bg-black/95 backdrop-blur-xl' : 'bg-black/85'}`,
          nav: 'section !py-0 flex items-center justify-between w-full text-accent-cyan',
          logo: 'text-base font-bold tracking-mono text-accent-cyan hover:text-accent-violet transition-colors',
          link: 'text-xs text-accent-cyan hover:text-white transition-colors relative before:content-["["] after:content-["]"] before:opacity-0 hover:before:opacity-100 after:opacity-0 hover:after:opacity-100 before:mr-0.5 after:ml-0.5 transition-all',
          talkBtn: 'border border-accent-cyan bg-transparent px-3 py-1.5 text-xs text-accent-cyan hover:bg-accent-cyan/10 hover:shadow-[0_0_12px_rgba(0,255,200,0.4)] transition-all',
          mobileMenu: 'border border-accent-cyan/30 bg-black/95 p-3 mt-1 text-accent-cyan font-mono',
        };
      case 'glassmorphism':
      case 'cosmic':
      default:
        return {
          header: `fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`,
          nav: `section !py-0 flex items-center justify-between rounded-full transition-all duration-300 ${
            scrolled ? 'glass !py-2 px-5 !bg-base-soft/90 backdrop-blur-xl shadow-lg border border-line/10' : ''
          }`,
          logo: 'font-display text-lg font-bold tracking-tight',
          link: 'text-sm text-ink-muted transition-colors hover:text-ink',
          talkBtn: 'rounded-full border border-accent-cyan/40 px-4 py-2 text-sm font-medium text-accent-cyan transition-all hover:bg-accent-cyan/10',
          mobileMenu: 'glass flex flex-col gap-1 rounded-2xl p-3 mt-3',
        };
    }
  };

  const navStyles = getNavStyles();

  return (
    <header className={navStyles.header}>
      <nav
        aria-label="Main navigation"
        className={navStyles.nav}
        style={designId !== 'cyberpunk' && scrolled ? { maxWidth: '960px' } : undefined}
      >
        <a href="#top" className={navStyles.logo} onClick={playClick}>
          {designId === 'cyberpunk' ? (
            <span>./sahil_chauhan.sh</span>
          ) : (
            <>
              SC<span className="text-accent-cyan">.</span>
            </>
          )}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={navStyles.link} onClick={playClick}>
                {designId === 'cyberpunk' ? l.label.toLowerCase() : l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href={`mailto:${site.email}`} className={navStyles.talkBtn} onClick={playClick}>
          {designId === 'cyberpunk' ? 'talk.sh' : "Let's talk"}
        </a>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => {
            playClick();
            setOpen((v) => !v);
          }}
          className="md:hidden text-ink"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-current transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div className="section !py-0 mt-3 md:hidden">
          <ul className={navStyles.mobileMenu}>
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => {
                    playClick();
                    setOpen(false);
                  }}
                  className="block rounded-xl px-4 py-3 text-ink-muted transition-colors hover:bg-white/5 hover:text-ink"
                >
                  {designId === 'cyberpunk' ? l.label.toLowerCase() : l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
