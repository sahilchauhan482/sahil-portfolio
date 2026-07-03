'use client';

import { skills } from '@/lib/data';
import Reveal from './Reveal';

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="section">
      <Reveal>
        <p className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-accent-cyan">
          Toolbox
        </p>
        <h2
          id="skills-heading"
          className="font-display text-3xl font-bold sm:text-4xl"
        >
          Technologies I work with
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((cat, i) => (
          <Reveal key={cat.group} delay={0.08 * i} as="article">
            <div className="glass h-full rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1">
              <h3 className="mb-4 font-display text-lg font-semibold text-ink">
                {cat.group}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-ink-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
