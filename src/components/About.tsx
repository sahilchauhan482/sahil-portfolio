'use client';

import { about, education } from '@/lib/data';
import Reveal from './Reveal';
import ProfilePhoto from './ProfilePhoto';

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="section">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        {/* Photo */}
        <Reveal className="relative mx-auto w-full max-w-xs md:sticky md:top-28 md:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <ProfilePhoto />
          </div>
          {/* Glow frame */}
          <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-tr from-accent-cyan/30 to-accent-violet/30 blur-2xl" />
        </Reveal>

        {/* Text */}
        <div>
          <Reveal>
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-accent-cyan">
              About
            </p>
            <h2
              id="about-heading"
              className="font-display text-3xl font-bold leading-tight sm:text-4xl"
            >
              {about.heading}
            </h2>
          </Reveal>

          <div className="mt-6 space-y-4">
            {about.body.map((para, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="text-ink-muted leading-relaxed">{para}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                Education
              </p>
              {education.map((e) => (
                <div key={e.school} className="text-ink">
                  <span className="font-medium">{e.degree}</span>
                  <span className="text-ink-muted"> · {e.school}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
