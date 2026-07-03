import { site, socials } from '@/lib/data';
import Reveal from './Reveal';

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="section">
      <Reveal>
        <div className="glass relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-14 sm:py-20">
          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-accent-cyan/20 blur-[100px]"
            aria-hidden
          />

          <p className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-accent-cyan">
            Contact
          </p>
          <h2
            id="contact-heading"
            className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight sm:text-5xl"
          >
            Let&apos;s build something{' '}
            <span className="text-gradient">worth shipping.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-ink-muted">
            Have a project, a role, or just want to say hi? My inbox is always open.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${site.email}`}
              className="rounded-full bg-gradient-to-r from-accent-cyan to-accent-violet px-8 py-4 font-semibold text-[#05060a] transition-transform hover:scale-[1.03]"
            >
              {site.email}
            </a>
            <a
              href={site.resumeUrl}
              className="rounded-full border border-white/15 px-8 py-4 font-medium text-ink transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan"
            >
              Download résumé
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.label === 'Email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="text-ink-muted transition-colors hover:text-accent-cyan"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
