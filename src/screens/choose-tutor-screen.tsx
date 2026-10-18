import { useAudioPlayer } from 'expo-audio';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/back-button';
import { PaintedText } from '@/components/painted-text';
import { TutorCard } from '@/components/tutor-card';
import { chooseTutor } from '@/constants/painted-words';
import { Inter, motion, Spacing } from '@/constants/theme';
import { SECRET_TUTORS, TUTORS, type Tutor } from '@/constants/tutors';
import { useOnboarding } from '@/hooks/use-onboarding';
import type { EditableScreenProps } from '@/screens/screen-mode';
import type { Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';

const selectSound = require('@/assets/sounds/select.wav');

export function ChooseTutorScreen({ mode }: EditableScreenProps) {
  const c = usePalette();
  const styles = createStyles(c);
  const { tutorId, setTutorId, hasPremium } = useOnboarding();
  const editing = mode === 'edit';
  const tutors = editing && hasPremium ? [...TUTORS, ...SECRET_TUTORS] : TUTORS;
  const selectPlayer = useAudioPlayer(selectSound);
  const selectedHere = tutors.some((t) => t.id === tutorId) ? tutorId : null;

  const select = (tutor: Tutor) => {
    if (tutor.id === tutorId) return;
    setTutorId(tutor.id);
    selectPlayer.seekTo(0).then(() => selectPlayer.play());
  };

  return (
    <View style={styles.container}>
      <StatusBar style={c.statusBar} />
      <SafeAreaView style={styles.safeArea}>
        <BackButton />
        <View style={styles.header}>
          <PaintedText word={chooseTutor} label="Choose your tutor" fontSize={30} color={c.text} />
          <Animated.Text entering={FadeIn.delay(motion(1600)).duration(motion(600))} style={styles.subtitle}>
            They&apos;ll guide you through every lesson.
          </Animated.Text>
        </View>

        <ScrollView
          style={styles.gridScroll}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}>
          {tutors.map((tutor, i) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              selected={tutor.id === selectedHere}
              dimmed={selectedHere !== null && tutor.id !== selectedHere}
              delay={1200 + i * 250}
              avatarSize={112}
              onPress={() => select(tutor)}
            />
          ))}
        </ScrollView>

        <Animated.View entering={FadeIn.delay(motion(2600)).duration(motion(600))} style={styles.actions}>
          {!editing && (
            <Pressable
              onPress={() => router.push('/secret-tutors')}
              style={({ pressed }) => [styles.secretButton, pressed && styles.buttonPressed]}>
              <Text style={styles.secretText}>{SECRET_TUTORS.length} premium tutors for free</Text>
            </Pressable>
          )}

          <Pressable
            disabled={!selectedHere}
            onPress={() => (editing ? router.back() : router.push('/topics'))}
            style={({ pressed }) => [
              styles.button,
              !selectedHere && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}>
            <Text style={styles.buttonText}>{editing ? 'Save' : 'Continue'}</Text>
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
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  subtitle: {
    color: c.muted,
    fontSize: 16,
    fontFamily: Inter.regular,
  },
  gridScroll: {
    marginHorizontal: -Spacing.two,
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'space-between',
    rowGap: Spacing.three,
    padding: Spacing.two,
  },
  actions: {
    gap: Spacing.three,
    paddingTop: Spacing.three,
  },
  secretButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: 16,
    paddingVertical: Spacing.three - 2,
  },
  secretText: {
    color: c.accent,
    fontSize: 17,
    fontFamily: Inter.semiBold,
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
