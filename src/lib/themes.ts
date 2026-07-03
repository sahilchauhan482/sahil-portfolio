export type ThreeShape =
  | 'ico'
  | 'box'
  | 'torus'
  | 'knot'
  | 'octa'
  | 'sphere'
  | 'dodeca';

export type Atmosphere =
  | 'aurora'
  | 'grid'
  | 'dots'
  | 'scanlines'
  | 'sunset'
  | 'noise'
  | 'none';

export type Surface = 'glass' | 'brutal' | 'outline' | 'soft' | 'solid';

export interface Design {
  id: string;
  name: string;
  blurb: string;
  surface: Surface;
  atmosphere: Atmosphere;
  radius: string;
  fontDisplay: string;
  fontBody: string;
  three: {
    shape: ThreeShape;
    wireframe: boolean;
    distort: number;
    metalness: number;
    roughness: number;
    particleCount: number;
  };
}

export interface ColorPalette {
  id: string;
  name: string;
  blurb: string;
  mode: 'dark' | 'light';
  vars: {
    bg: string;
    bgSoft: string;
    bgRaised: string;
    text: string;
    textMuted: string;
    textFaint: string;
    accent1: string;
    accent2: string;
    glow: string;
    border: string;
  };
  three: {
    color: string; // hex
    emissive: string; // hex
    particleColor: string; // hex
  };
  swatch: [string, string, string];
}

// Combined structure for compatibility with existing components
export interface Theme {
  id: string;
  name: string;
  blurb: string;
  mode: 'dark' | 'light';
  vars: {
    bg: string;
    bgSoft: string;
    bgRaised: string;
    text: string;
    textMuted: string;
    textFaint: string;
    accent1: string;
    accent2: string;
    glow: string;
    border: string;
  };
  fontDisplay: string;
  fontBody: string;
  surface: Surface;
  atmosphere: Atmosphere;
  radius: string;
  three: {
    shape: ThreeShape;
    color: string;
    emissive: string;
    wireframe: boolean;
    distort: number;
    metalness: number;
    roughness: number;
    particleColor: string;
    particleCount: number;
  };
  swatch: [string, string, string];
}

export const designs: Design[] = [
  {
    id: 'cosmic',
    name: 'Cosmic Galaxy',
    blurb: 'Interactive 3D solar system with colliding meteors and touch sparkles',
    surface: 'glass',
    atmosphere: 'none',
    radius: '1.5rem',
    fontDisplay: 'var(--font-space)',
    fontBody: 'var(--font-inter)',
    three: {
      shape: 'sphere',
      wireframe: false,
      distort: 0.0,
      metalness: 0.5,
      roughness: 0.2,
      particleCount: 900,
    },
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    blurb: 'Frosted glass cards with organic morphing 3D shape',
    surface: 'glass',
    atmosphere: 'aurora',
    radius: '1.5rem',
    fontDisplay: 'var(--font-space)',
    fontBody: 'var(--font-inter)',
    three: {
      shape: 'ico',
      wireframe: false,
      distort: 0.38,
      metalness: 0.85,
      roughness: 0.15,
      particleCount: 900,
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    blurb: 'Neon laser outlines, pink wireframe torus knot, scanlines',
    surface: 'outline',
    atmosphere: 'scanlines',
    radius: '8px',
    fontDisplay: 'var(--font-space)',
    fontBody: 'var(--font-inter)',
    three: {
      shape: 'knot',
      wireframe: true,
      distort: 0.2,
      metalness: 0.6,
      roughness: 0.3,
      particleCount: 800,
    },
  },
];

export const palettes: ColorPalette[] = [
  {
    id: 'cyberpunk',
    name: 'Cyber Neon',
    blurb: 'Futuristic · electric pink & cyber green',
    mode: 'dark',
    vars: {
      bg: '6 2 16',
      bgSoft: '14 6 30',
      bgRaised: '22 10 44',
      text: '236 255 252',
      textMuted: '150 200 210',
      textFaint: '96 130 140',
      accent1: '255 0 128',
      accent2: '0 255 200',
      glow: '255 0 128',
      border: '255 0 128',
    },
    three: {
      color: '#ff0080',
      emissive: '#00ffc8',
      particleColor: '#00ffc8',
    },
    swatch: ['#060210', '#ff0080', '#00ffc8'],
  },
  {
    id: 'aurora',
    name: 'Aurora Luxe',
    blurb: 'Dark luxury · cyan & violet glow',
    mode: 'dark',
    vars: {
      bg: '5 6 10',
      bgSoft: '10 12 20',
      bgRaised: '16 19 31',
      text: '238 241 249',
      textMuted: '154 163 184',
      textFaint: '91 100 120',
      accent1: '34 211 238',
      accent2: '139 92 246',
      glow: '56 189 248',
      border: '255 255 255',
    },
    three: {
      color: '#8b5cf6',
      emissive: '#22d3ee',
      particleColor: '#38bdf8',
    },
    swatch: ['#05060a', '#22d3ee', '#8b5cf6'],
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    blurb: 'Retro-future · sunset hot pink & orange',
    mode: 'dark',
    vars: {
      bg: '18 8 38',
      bgSoft: '28 12 54',
      bgRaised: '40 16 72',
      text: '255 240 250',
      textMuted: '210 170 210',
      textFaint: '150 110 160',
      accent1: '255 100 50',
      accent2: '220 40 180',
      glow: '255 100 50',
      border: '255 100 180',
    },
    three: {
      color: '#ff6432',
      emissive: '#dc28b4',
      particleColor: '#ff64b4',
    },
    swatch: ['#120826', '#ff6432', '#dc28b4'],
  },
  {
    id: 'terminal',
    name: 'Terminal Green',
    blurb: 'Matrix · classic green phosphors',
    mode: 'dark',
    vars: {
      bg: '2 10 6',
      bgSoft: '4 18 10',
      bgRaised: '8 26 16',
      text: '180 255 200',
      textMuted: '90 200 130',
      textFaint: '50 130 80',
      accent1: '0 255 100',
      accent2: '120 255 160',
      glow: '0 255 100',
      border: '0 255 100',
    },
    three: {
      color: '#00ff64',
      emissive: '#003300',
      particleColor: '#00ff64',
    },
    swatch: ['#020a06', '#00ff64', '#78ffa0'],
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave Dream',
    blurb: '90s nostalgia · pastel pink & turquoise',
    mode: 'dark',
    vars: {
      bg: '38 20 58',
      bgSoft: '52 28 78',
      bgRaised: '66 36 98',
      text: '255 245 252',
      textMuted: '214 186 220',
      textFaint: '158 130 168',
      accent1: '255 130 200',
      accent2: '100 230 220',
      glow: '255 130 200',
      border: '255 130 200',
    },
    three: {
      color: '#ff82c8',
      emissive: '#64e6dc',
      particleColor: '#64e6dc',
    },
    swatch: ['#26143a', '#ff82c8', '#64e6dc'],
  },
  {
    id: 'noir',
    name: 'Noir Mono',
    blurb: 'Monochrome · absolute high-contrast',
    mode: 'dark',
    vars: {
      bg: '8 8 8',
      bgSoft: '16 16 16',
      bgRaised: '24 24 24',
      text: '245 245 245',
      textMuted: '160 160 160',
      textFaint: '100 100 100',
      accent1: '245 245 245',
      accent2: '160 160 160',
      glow: '255 255 255',
      border: '245 245 245',
    },
    three: {
      color: '#f5f5f5',
      emissive: '#000000',
      particleColor: '#ffffff',
    },
    swatch: ['#080808', '#f5f5f5', '#a0a0a0'],
  },
];

export const defaultDesignId = 'cosmic';
export const defaultPaletteId = 'cyberpunk';

export function getDesign(id: string): Design {
  return designs.find((d) => d.id === id) ?? designs[0];
}

export function getPalette(id: string): ColorPalette {
  return palettes.find((p) => p.id === id) ?? palettes[0];
}

export function generateThemeCss(): string {
  const paletteCss = palettes
    .map((p) => {
      const v = p.vars;
      return `[data-palette="${p.id}"] {
  --bg: ${v.bg};
  --bg-soft: ${v.bgSoft};
  --bg-raised: ${v.bgRaised};
  --text: ${v.text};
  --text-muted: ${v.textMuted};
  --text-faint: ${v.textFaint};
  --accent-1: ${v.accent1};
  --accent-2: ${v.accent2};
  --glow: ${v.glow};
  --border: ${v.border};
}`;
    })
    .join('\n');

  const designCss = designs
    .map((d) => {
      return `[data-design="${d.id}"] {
  --font-display: ${d.fontDisplay};
  --font-body: ${d.fontBody};
  --radius: ${d.radius};
}`;
    })
    .join('\n');

  return `${paletteCss}\n${designCss}`;
}
