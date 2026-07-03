import { experience } from '@/lib/data';
import Reveal from './Reveal';

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="exp-heading" className="section">
      <Reveal>
        <p className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-accent-cyan">
          Journey
        </p>
        <h2 id="exp-heading" className="font-display text-3xl font-bold sm:text-4xl">
          Where I&apos;ve worked
        </h2>
      </Reveal>

      <div className="relative mt-12">
        {/* Vertical line */}
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-accent-cyan/60 via-accent-violet/40 to-transparent md:left-[9px]"
          aria-hidden
        />

        <ol className="space-y-10">
          {experience.map((job, i) => (
            <Reveal key={`${job.company}-${i}`} as="li" delay={0.05 * i}>
              <div className="relative pl-10 md:pl-14">
                {/* Dot */}
                <span
                  className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-base ring-2 ring-accent-cyan/70 md:h-5 md:w-5"
                  aria-hidden
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                </span>

                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {job.role}
                  </h3>
                  <span className="font-mono text-sm text-ink-faint">{job.period}</span>
                </div>
                <p className="mt-0.5 text-accent-cyan">
                  {job.company}
                  <span className="text-ink-faint"> · {job.location}</span>
                </p>
                <ul className="mt-3 space-y-1.5">
                  {job.points.map((p, j) => (
                    <li key={j} className="flex gap-2 text-ink-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-violet" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
