'use client';

import { projects } from '@/lib/data';
import Reveal from './Reveal';

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17L17 7M17 7H8M17 7V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 2.5-.34c.85 0 1.71.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="proj-heading" className="section">
      <Reveal>
        <p className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-accent-cyan">
          Selected work
        </p>
        <h2 id="proj-heading" className="font-display text-3xl font-bold sm:text-4xl">
          Projects
        </h2>
        <p className="mt-3 max-w-lg text-ink-muted">
          A few things I&apos;ve built. Each one is a placeholder for now — swap in your
          real projects in <code className="text-accent-cyan">lib/data.ts</code>.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal
            key={p.title}
            as="article"
            delay={0.06 * i}
            className={`${p.featured ? 'md:col-span-1' : 'md:col-span-1'} group`}
          >
            <div className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-all duration-300 group-hover:-translate-y-1.5">
              {/* Accent corner glow */}
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-violet/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />

              {p.image ? (
                <div className="mb-5 overflow-hidden rounded-xl aspect-video w-full">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div
                  className="mb-5 grid aspect-video w-full place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-accent-violet/10"
                  aria-hidden="true"
                >
                  <span className="font-display text-4xl font-bold text-white/10">
                    {p.title.charAt(0)}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {p.title}
                </h3>
                <div className="flex gap-2 text-ink-faint">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.title} on GitHub`}
                      className="transition-colors hover:text-accent-cyan"
                    >
                      <GithubIcon />
                    </a>
                  )}
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.title} live site`}
                      className="transition-colors hover:text-accent-cyan"
                    >
                      <ArrowIcon />
                    </a>
                  )}
                </div>
              </div>

              <p className="mt-2 flex-1 text-ink-muted">{p.description}</p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-xs text-ink-muted"
                  >
                    {t}
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
