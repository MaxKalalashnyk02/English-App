import { useAudioPlayer } from 'expo-audio';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/back-button';
import { PaintedText } from '@/components/painted-text';
import { StepSlider } from '@/components/step-slider';
import { tutorStyle } from '@/constants/painted-words';
import { LEVEL_COUNT, TRAITS, type Trait } from '@/constants/personality';
import { Inter, motion, Spacing } from '@/constants/theme';
import { useOnboarding } from '@/hooks/use-onboarding';
import type { EditableScreenProps } from '@/screens/screen-mode';
import type { Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';

const tickSound = require('@/assets/sounds/select.wav');

export function TutorStyleScreen({ mode }: EditableScreenProps) {
  const c = usePalette();
  const styles = createStyles(c);
  const editing = mode === 'edit';
  const { personality, setTrait } = useOnboarding();
  const tickPlayer = useAudioPlayer(tickSound);

  const change = (trait: Trait, level: number) => {
    setTrait(trait.id, level);
    tickPlayer.seekTo(0).then(() => tickPlayer.play());
  };

  return (
    <View style={styles.container}>
      <StatusBar style={c.statusBar} />
      <SafeAreaView style={styles.safeArea}>
        <BackButton />
        <View style={styles.header}>
          <PaintedText word={tutorStyle} label="Your tutor's style" fontSize={30} color={c.text} />
          <Animated.Text
            entering={FadeIn.delay(motion(1400)).duration(motion(600))}
            style={styles.subtitle}>
            Set how your tutor teaches and talks with you.
          </Animated.Text>
        </View>

        <View style={styles.list}>
          {TRAITS.map((trait) => {
            const level = personality[trait.id];
            return (
              <View key={trait.id} style={styles.trait}>
                <View style={styles.traitHeader}>
                  <Text style={styles.traitTitle}>{trait.title}</Text>
                  <Text style={styles.traitValue}>{trait.levels[level]}</Text>
                </View>
                <StepSlider
                  value={level}
                  steps={LEVEL_COUNT}
                  onChange={(next) => change(trait, next)}
                  accessibilityLabel={trait.title}
                  accessibilityValue={trait.levels[level]}
                />
              </View>
            );
          })}
        </View>

        <Pressable
          onPress={() => (editing ? router.back() : router.push('/meet-tutor'))}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>{editing ? 'Save' : 'Continue'}</Text>
        </Pressable>
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
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  subtitle: {
    color: c.muted,
    fontSize: 16,
    fontFamily: Inter.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
  list: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  trait: {
    gap: Spacing.half,
  },
  traitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  traitTitle: {
    color: c.text,
    fontSize: 17,
    fontFamily: Inter.semiBold,
  },
  traitValue: {
    color: c.text,
    fontSize: 15,
    fontFamily: Inter.regular,
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
