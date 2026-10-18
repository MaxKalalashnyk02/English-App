export const Inter = {
  regular: 'Inter_400Regular',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

const MOTION_SCALE = 0.5;

export const motion = (ms: number) => Math.round(ms * MOTION_SCALE);

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
} as const;

export const MaxContentWidth = 800;
