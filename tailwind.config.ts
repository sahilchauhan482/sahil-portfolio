import type { Config } from 'tailwindcss';

// Colors reference CSS variables (RGB channels) so every theme in
// lib/themes.ts can swap the entire palette by changing --bg, --accent-1 etc.
// The `<alpha-value>` placeholder keeps opacity utilities (bg-base/40) working.
function withAlpha(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`;
}

const config: Config = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: withAlpha('--bg'),
          soft: withAlpha('--bg-soft'),
          raised: withAlpha('--bg-raised'),
        },
        ink: {
          DEFAULT: withAlpha('--text'),
          muted: withAlpha('--text-muted'),
          faint: withAlpha('--text-faint'),
        },
        accent: {
          cyan: withAlpha('--accent-1'),
          violet: withAlpha('--accent-2'),
          glow: withAlpha('--glow'),
        },
        line: withAlpha('--border'),
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        theme: 'var(--radius)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
