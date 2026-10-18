import { Stack } from 'expo-router';

import { usePalette } from '@/hooks/use-palette';

export const unstable_settings = {
  initialRouteName: 'welcome',
};

export default function OnboardingLayout() {
  const c = usePalette();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.background } }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="choose-tutor" />
      <Stack.Screen name="topics" />
      <Stack.Screen name="tutor-style" />
      <Stack.Screen name="meet-tutor" />
      <Stack.Screen name="placement-test" options={{ gestureEnabled: false }} />
      <Stack.Screen name="placement-result" options={{ gestureEnabled: false }} />
      <Stack.Screen name="save-progress" />
      <Stack.Screen name="sign-up-email" />
      <Stack.Screen name="secret-tutors" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
