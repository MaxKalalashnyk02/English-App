import { useAudioPlayer } from 'expo-audio';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaintedText } from '@/components/painted-text';
import {
  englishApp,
  UNITS_PER_FONT_SIZE,
  WELCOME_BY_LANGUAGE,
} from '@/constants/painted-words';
import { Inter, motion, Spacing } from '@/constants/theme';
import WELCOME_COPY from '@/constants/welcome-i18n.json';
import type { Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';

const welcomeChime = require('@/assets/sounds/welcome-chime.wav');

const WELCOME_FONT_SIZE = 56;

type Copy = { welcome: string; getStarted: string };

function deviceLanguage() {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const code = locale.split('-')[0].toLowerCase();
  return code in WELCOME_COPY ? code : 'en';
}

export default function WelcomeScreen() {
  const c = usePalette();
  const styles = createStyles(c);
  const chimePlayer = useAudioPlayer(welcomeChime);
  const [isPaintingDone, setIsPaintingDone] = useState(false);
  const { width } = useWindowDimensions();

  const language = deviceLanguage();
  const copy = (WELCOME_COPY as Record<string, Copy>)[language];
  const paintedWelcome = WELCOME_BY_LANGUAGE[language];
  const maxWidth = width - Spacing.four * 2;
  const welcomeFontSize = paintedWelcome
    ? Math.min(WELCOME_FONT_SIZE, (maxWidth / paintedWelcome.viewBox[2]) * UNITS_PER_FONT_SIZE)
    : WELCOME_FONT_SIZE;

  return (
    <View style={styles.container}>
      <StatusBar style={c.statusBar} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.hero}>
          {paintedWelcome ? (
            <PaintedText
              word={paintedWelcome}
              label={copy.welcome}
              fontSize={welcomeFontSize}
              color={c.text}
              delay={900}
            />
          ) : (
            <Animated.Text
              entering={FadeIn.delay(motion(900)).duration(motion(900))}
              style={styles.welcomeText}
              adjustsFontSizeToFit
              numberOfLines={1}>
              {copy.welcome}
            </Animated.Text>
          )}

          <PaintedText
            word={englishApp}
            label="English-App"
            fontSize={30}
            color={c.text}
            delay={2000}
            stagger={80}
            onDone={() => {
              chimePlayer.seekTo(0).then(() => chimePlayer.play());
              setIsPaintingDone(true);
            }}
          />
        </View>

        {isPaintingDone && (
          <Animated.View entering={FadeIn.delay(motion(400)).duration(motion(600))} style={styles.footer}>
            <Pressable
              onPress={() => router.push('/choose-tutor')}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
              <Text style={styles.buttonText}>{copy.getStarted}</Text>
            </Pressable>
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
  welcomeText: {
    color: c.text,
    fontSize: WELCOME_FONT_SIZE,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  footer: {
    paddingBottom: Spacing.four,
  },
  button: {
    backgroundColor: c.text,
    borderRadius: 16,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: c.background,
    fontSize: 18,
    fontFamily: Inter.semiBold,
  },
});
