export const THEME_NAMES = [
  'swiss-minimal',
  'glass-morphism',
  'neo-brutalist',
  'dark-command',
  'monochrome-dense',
  'warm-editorial',
  'soft-gradient',
  'spatial-depth',
  'organic-nature',
  'bento-grid',
  'retro-y2k',
  'soft-emboss',
  'corporate-sharp',
  'luxury-amber',
] as const;

export type ThemeName = (typeof THEME_NAMES)[number];

export type Mode = 'light' | 'dark';

export const THEME_LABELS: Record<ThemeName, string> = {
  'swiss-minimal': 'Swiss Minimal',
  'glass-morphism': 'Glass Morphism',
  'neo-brutalist': 'Neo Brutalist',
  'dark-command': 'Dark Command',
  'monochrome-dense': 'Monochrome Dense',
  'warm-editorial': 'Warm Editorial',
  'soft-gradient': 'Soft Gradient',
  'spatial-depth': 'Spatial Depth',
  'organic-nature': 'Organic Nature',
  'bento-grid': 'Bento Grid',
  'retro-y2k': 'Retro Y2K',
  'soft-emboss': 'Soft Emboss',
  'corporate-sharp': 'Corporate Sharp',
  'luxury-amber': 'Luxury Amber',
};
