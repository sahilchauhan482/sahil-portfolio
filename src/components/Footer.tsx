import { site } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="section flex flex-col items-center justify-between gap-4 !py-8 text-sm text-ink-faint sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name}. Built with Next.js &amp; Three.js.
        </p>
        <p>
          Designed &amp; coded in {site.location.split(',')[0]}.
        </p>
      </div>
    </footer>
  );
}
