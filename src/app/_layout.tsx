import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SplashOverlay } from '@/components/splash-overlay';
import { OnboardingProvider, useOnboarding } from '@/hooks/use-onboarding';
import { usePalette } from '@/hooks/use-palette';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OnboardingProvider>
        <ThemedApp />
      </OnboardingProvider>
    </GestureHandlerRootView>
  );
}

function ThemedApp() {
  const { appearance } = useOnboarding();
  const c = usePalette();
  const theme = appearance === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={{ ...theme, colors: { ...theme.colors, background: c.background } }}>
      <RootNavigator />
      <SplashOverlay />
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { isOnboarded } = useOnboarding();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isOnboarded}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!isOnboarded}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>
    </Stack>
  );
}
