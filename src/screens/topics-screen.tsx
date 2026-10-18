import { useAudioPlayer } from 'expo-audio';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/back-button';
import { PaintedText } from '@/components/painted-text';
import { whatYouLove } from '@/constants/painted-words';
import { Inter, motion, Spacing } from '@/constants/theme';
import { MIN_TOPICS, TOPICS, type Topic } from '@/constants/topics';
import { useOnboarding } from '@/hooks/use-onboarding';
import type { EditableScreenProps } from '@/screens/screen-mode';
import type { Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';

const selectSound = require('@/assets/sounds/select.wav');

export function TopicsScreen({ mode }: EditableScreenProps) {
  const c = usePalette();
  const styles = createStyles(c);
  const editing = mode === 'edit';
  const { topics, toggleTopic } = useOnboarding();
  const selectPlayer = useAudioPlayer(selectSound);
  const remaining = Math.max(0, MIN_TOPICS - topics.length);

  const toggle = (topic: Topic) => {
    toggleTopic(topic.id);
    selectPlayer.seekTo(0).then(() => selectPlayer.play());
  };

  return (
    <View style={styles.container}>
      <StatusBar style={c.statusBar} />
      <SafeAreaView style={styles.safeArea}>
        <BackButton />
        <View style={styles.header}>
          <PaintedText word={whatYouLove} label="What do you love?" fontSize={30} color={c.text} />
          <Animated.Text entering={FadeIn.delay(motion(1400)).duration(motion(600))} style={styles.subtitle}>
            Pick at least {MIN_TOPICS}. Your course will be built around them.
          </Animated.Text>
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.chips}
          showsVerticalScrollIndicator={false}>
          {TOPICS.map((topic, i) => {
            const selected = topics.includes(topic.id);
            return (
              <Animated.View key={topic.id} entering={FadeInDown.delay(motion(900 + i * 45)).duration(motion(400))}>
                <Pressable
                  onPress={() => toggle(topic)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  style={[styles.chip, selected && styles.chipSelected]}>
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {topic.label}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>

        <Pressable
          disabled={remaining > 0}
          onPress={() => (editing ? router.back() : router.push('/tutor-style'))}
          style={({ pressed }) => [
            styles.button,
            remaining > 0 && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.buttonText}>
            {remaining > 0 ? `Pick ${remaining} more` : editing ? 'Save' : 'Continue'}
          </Text>
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
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  subtitle: {
    color: c.muted,
    fontSize: 16,
    fontFamily: Inter.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
  list: {
    marginHorizontal: -Spacing.three,
  },
  chips: {
    paddingBottom: Spacing.four,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.separator,
  },
  chipSelected: {
    backgroundColor: c.text,
  },
  chipText: {
    color: c.text,
    fontSize: 16,
    fontFamily: Inter.semiBold,
  },
  chipTextSelected: {
    color: c.background,
  },
  button: {
    backgroundColor: c.text,
    borderRadius: 16,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.3,
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
