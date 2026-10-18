import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaintedText } from '@/components/painted-text';
import { yourLevel } from '@/constants/painted-words';
import type { CefrLevel } from '@/constants/placement-questions';
import { Inter, motion, Spacing } from '@/constants/theme';
import { useOnboarding } from '@/hooks/use-onboarding';
import { CEFR_INFO } from '@/lib/placement';
import type { Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';

const LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function PlacementResultScreen() {
  const c = usePalette();
  const styles = createStyles(c);
  const { placement } = useOnboarding();

  if (!placement) {
    return <Redirect href="/placement-test" />;
  }

  const info = CEFR_INFO[placement.level];

  return (
    <View style={styles.container}>
      <StatusBar style={c.statusBar} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <PaintedText word={yourLevel} label="Your English level" fontSize={28} color={c.text} />
        </View>

        <View style={styles.result}>
          <Animated.Text
            entering={FadeInDown.delay(motion(1100)).duration(motion(600))}
            style={styles.level}>
            {placement.level}
          </Animated.Text>
          <Animated.View
            entering={FadeIn.delay(motion(1500)).duration(motion(600))}
            style={styles.details}>
            <Text style={styles.name}>{info.name}</Text>
            <Text style={styles.description}>{info.description}</Text>

            <View style={styles.scale}>
              {LEVELS.map((level) => {
                const active = level === placement.level;
                return (
                  <View key={level} style={[styles.step, active && styles.stepActive]}>
                    <Text style={[styles.stepText, active && styles.stepTextActive]}>{level}</Text>
                  </View>
                );
              })}
            </View>

            <Text style={styles.note}>
              Your tutor will fine-tune this as you learn together.
            </Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeIn.delay(motion(2000)).duration(motion(500))}>
          <Pressable
            onPress={() => router.push('/save-progress')}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.five,
  },
  result: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  level: {
    color: c.text,
    fontSize: 112,
    lineHeight: 124,
    fontFamily: Inter.bold,
    letterSpacing: -2,
  },
  details: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  name: {
    color: c.text,
    fontSize: 24,
    fontFamily: Inter.semiBold,
  },
  description: {
    color: c.muted,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Inter.regular,
    textAlign: 'center',
  },
  scale: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  step: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two + 2,
    borderRadius: 10,
    backgroundColor: c.track,
  },
  stepActive: {
    backgroundColor: c.text,
  },
  stepText: {
    color: c.muted,
    fontSize: 14,
    fontFamily: Inter.semiBold,
  },
  stepTextActive: {
    color: c.background,
  },
  note: {
    color: c.muted,
    fontSize: 13,
    fontFamily: Inter.regular,
    marginTop: Spacing.three,
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
