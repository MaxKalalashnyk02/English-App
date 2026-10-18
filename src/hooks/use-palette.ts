import { PALETTES } from '@/constants/palette';
import { useOnboarding } from '@/hooks/use-onboarding';

export function usePalette() {
  const { appearance } = useOnboarding();
  return PALETTES[appearance];
}
