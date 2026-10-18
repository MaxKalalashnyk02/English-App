export type Appearance = 'dark' | 'light';

export type Palette = {
  background: string;
  text: string;
  muted: string;
  card: string;
  elevated: string;
  separator: string;
  track: string;
  border: string;
  accent: string;
  invertedMuted: string;
  statusBar: 'light' | 'dark';
  keyboard: 'light' | 'dark';
};

export const PALETTES: Record<Appearance, Palette> = {
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    muted: '#8E8E93',
    card: '#121212',
    elevated: '#1C1C1E',
    separator: '#2A2A2A',
    track: '#2A2A2A',
    border: '#3A3A3C',
    accent: '#E5E4E2',
    invertedMuted: '#3A3A3C',
    statusBar: 'light',
    keyboard: 'dark',
  },
  light: {
    background: '#FFFFFF',
    text: '#000000',
    muted: '#6E6E73',
    card: '#F2F2F7',
    elevated: '#E5E5EA',
    separator: '#D1D1D6',
    track: '#E5E5EA',
    border: '#C7C7CC',
    accent: '#3A3A3C',
    invertedMuted: '#AEAEB2',
    statusBar: 'dark',
    keyboard: 'light',
  },
};
