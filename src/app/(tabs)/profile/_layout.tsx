import { Stack } from 'expo-router';

import { usePalette } from '@/hooks/use-palette';

export default function ProfileLayout() {
  const c = usePalette();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.background } }} />
  );
}
