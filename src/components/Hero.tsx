'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { site, stats } from '../lib/data';
import { useState, useEffect } from 'react';
import Hero3D from './Hero3D';

// Variants for premium staggered letter entries
const letterContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.15,
    },
  },
};

const letterItem = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 140,
      damping: 12,
    },
  },
};

export default function Hero() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative flex min-h-screen items-center justify-center py-20">
        <div className="text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight text-ink">{site.name}</h1>
          <p className="mt-4 text-xl text-ink-muted">{site.role}</p>
        </div>
      </section>
    );
  }

  // Helper to split a string into letters for staggered entry
  const renderStaggeredText = (text: string, isGradient: boolean = false) => {
    return (
      <motion.span
        variants={letterContainer}
        initial="hidden"
        animate="show"
        className="inline-block"
      >
        {Array.from(text).map((char, index) => (
          <motion.span
            key={index}
            variants={letterItem}
            className={`inline-block origin-center ${isGradient ? 'text-gradient' : ''}`}
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );
  };

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* 3D layer */}
      <div className="absolute inset-0 opacity-90" aria-hidden="true">
        {!reduce && <Hero3D />}
      </div>

      {/* Readability gradient over the 3D */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-base/40 via-base/10 to-base"
        aria-hidden="true"
      />

      <div className="section relative z-10 w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-ink-muted backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan" />
          </span>
          Available for work · {site.location}
        </motion.p>

        <h1
          id="hero-heading"
          className="font-display text-[clamp(2.75rem,9vw,7rem)] font-bold leading-[0.95] tracking-tight"
        >
          {renderStaggeredText(site.name.split(' ')[0], false)}
          <br />
          {renderStaggeredText(site.name.split(' ').slice(1).join(' '), true)}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-xl text-lg text-ink-muted sm:text-xl"
        >
          <span className="text-ink">{site.role}.</span> {site.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <a
            href="#projects"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-accent-cyan to-accent-violet px-7 py-3.5 font-medium text-base transition-transform hover:scale-[1.03]"
          >
            <span className="relative z-10 text-base font-semibold text-[#05060a]">
              View my work
            </span>
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/15 px-7 py-3.5 font-medium text-ink transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan"
          >
            Get in touch
          </a>
        </motion.div>

        {/* Stats */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.75 }}
          className="mt-16 flex flex-wrap gap-x-10 gap-y-6"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="font-display text-3xl font-bold text-ink sm:text-4xl">
                {s.value}
              </dt>
              <dd className="mt-1 text-sm text-ink-faint">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2" aria-hidden="true">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-accent-cyan" />
        </div>
      </div>
    </section>
  );
}
