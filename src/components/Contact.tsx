import { site, socials } from '@/lib/data';
import Reveal from './Reveal';

const SOCIAL_STYLES: Record<string, {
  color: string;
  borderColor: string;
  bgColor: string;
  hoverBorderColor: string;
  hoverBgColor: string;
  glowColor: string;
}> = {
  LinkedIn: {
    color: '#0A66C2',
    borderColor: 'rgba(10, 102, 194, 0.25)',
    bgColor: 'rgba(10, 102, 194, 0.05)',
    hoverBorderColor: '#0A66C2',
    hoverBgColor: 'rgba(10, 102, 194, 0.15)',
    glowColor: 'rgba(10, 102, 194, 0.4)',
  },
  GitHub: {
    color: '#F0F6FC',
    borderColor: 'rgba(240, 246, 252, 0.25)',
    bgColor: 'rgba(240, 246, 252, 0.05)',
    hoverBorderColor: '#F0F6FC',
    hoverBgColor: 'rgba(240, 246, 252, 0.15)',
    glowColor: 'rgba(240, 246, 252, 0.4)',
  },
  Email: {
    color: '#EA4335',
    borderColor: 'rgba(234, 67, 53, 0.25)',
    bgColor: 'rgba(234, 67, 53, 0.05)',
    hoverBorderColor: '#EA4335',
    hoverBgColor: 'rgba(234, 67, 53, 0.15)',
    glowColor: 'rgba(234, 67, 53, 0.4)',
  },
  Instagram: {
    color: '#E1306C',
    borderColor: 'rgba(225, 48, 108, 0.25)',
    bgColor: 'rgba(225, 48, 108, 0.05)',
    hoverBorderColor: '#E1306C',
    hoverBgColor: 'rgba(225, 48, 108, 0.15)',
    glowColor: 'rgba(225, 48, 108, 0.4)',
  },
  Facebook: {
    color: '#1877F2',
    borderColor: 'rgba(24, 119, 242, 0.25)',
    bgColor: 'rgba(24, 119, 242, 0.05)',
    hoverBorderColor: '#1877F2',
    hoverBgColor: 'rgba(24, 119, 242, 0.15)',
    glowColor: 'rgba(24, 119, 242, 0.4)',
  },
  WhatsApp: {
    color: '#25D366',
    borderColor: 'rgba(37, 211, 102, 0.25)',
    bgColor: 'rgba(37, 211, 102, 0.05)',
    hoverBorderColor: '#25D366',
    hoverBgColor: 'rgba(37, 211, 102, 0.15)',
    glowColor: 'rgba(37, 211, 102, 0.4)',
  },
  Snapchat: {
    color: '#FFFC00',
    borderColor: 'rgba(255, 252, 0, 0.25)',
    bgColor: 'rgba(255, 252, 0, 0.05)',
    hoverBorderColor: '#FFFC00',
    hoverBgColor: 'rgba(255, 252, 0, 0.15)',
    glowColor: 'rgba(255, 252, 0, 0.4)',
  },
};

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  LinkedIn: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  GitHub: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  Email: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Instagram: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <defs>
        <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="15%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="65%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#instagram-gradient)" strokeWidth="2.2" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#instagram-gradient)" strokeWidth="2.2" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="url(#instagram-gradient)" />
    </svg>
  ),
  Facebook: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  WhatsApp: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.46h.005c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  Snapchat: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2.25c-4.045 0-6.19 2.92-6.19 6.223 0 1.233.513 2.534.82 3.018a.386.386 0 0 1 .054.348c-.05.155-.262.338-.636.338-.266 0-.583-.092-.937-.272a.49.49 0 0 0-.573.064c-.161.161-.202.408-.103.612.35 0.72 1.077 1.218 1.968 1.218.156 0 .313-.016.467-.047a.382.382 0 0 1 .425.26c.15.5.706 2.057 2.128 2.057.195 0 .385-.03.565-.087a.379.379 0 0 1 .432.22c.28.618 1.053 2.03 2.007 2.03 0.954 0 1.728-1.412 2.007-2.03a.38.38 0 0 1 .432-.22c.18.057.37.087.565.087 1.422 0 1.978-1.557 2.128-2.058a.382.382 0 0 1 .425-.26c.154.03.311.047.467.047 0.89 0 1.618-.498 1.968-1.218a.434.434 0 0 0-.103-.612c-.354-.18-.67-.272-.937-.272-.374 0-.586.183-.636.338a.386.386 0 0 1 .054-.348c.307-.484.82-1.785.82-3.018 0-3.303-2.145-6.223-6.19-6.223z"/>
    </svg>
  ),
};

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

          <style>{`
            .social-icon-btn {
              color: var(--brand-color);
              border-color: var(--brand-border);
              background-color: var(--brand-bg);
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .social-icon-btn:hover {
              border-color: var(--brand-hover-border);
              background-color: var(--brand-hover-bg);
              transform: translateY(-3px) scale(1.1);
              box-shadow: 0 0 20px var(--brand-glow);
            }
          `}</style>

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

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-5">
            {socials.map((s) => {
              const cfg = SOCIAL_STYLES[s.label] || {
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.1)',
                bgColor: 'rgba(255,255,255,0.03)',
                hoverBorderColor: '#fff',
                hoverBgColor: 'rgba(255,255,255,0.1)',
                glowColor: 'rgba(255,255,255,0.2)',
              };
              const style = {
                '--brand-color': cfg.color,
                '--brand-border': cfg.borderColor,
                '--brand-bg': cfg.bgColor,
                '--brand-hover-border': cfg.hoverBorderColor,
                '--brand-hover-bg': cfg.hoverBgColor,
                '--brand-glow': cfg.glowColor,
              } as React.CSSProperties;

              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.label === 'Email' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full border social-icon-btn"
                    title={s.label}
                    aria-label={s.label}
                    style={style}
                  >
                    {SOCIAL_ICONS[s.label] || <span>{s.label}</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
