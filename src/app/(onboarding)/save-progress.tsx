import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/back-button';
import { Inter, motion, Spacing } from '@/constants/theme';
import { ALL_TUTORS } from '@/constants/tutors';
import { useOnboarding } from '@/hooks/use-onboarding';
import { signIn, type AuthProvider } from '@/lib/auth';
import { CEFR_INFO } from '@/lib/placement';
import type { Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';

export default function SaveProgressScreen() {
  const c = usePalette();
  const styles = createStyles(c);
  const { placement, tutorId, topics, completeOnboarding } = useOnboarding();
  const [busy, setBusy] = useState<AuthProvider | null>(null);
  const [confirmingSkip, setConfirmingSkip] = useState(false);
  const tutor = ALL_TUTORS.find((t) => t.id === tutorId);

  if (!placement) {
    return <Redirect href="/placement-test" />;
  }

  const saved = [
    `Your level: ${placement.level} · ${CEFR_INFO[placement.level].name}`,
    tutor ? `Your tutor: ${tutor.name}` : null,
    topics.length > 0 ? `Your ${topics.length} favourite topics` : null,
    'Your learning plan and progress',
  ].filter((item): item is string => item !== null);

  const continueWith = async (provider: AuthProvider) => {
    if (busy) return;
    setBusy(provider);
    await signIn(provider);
    setBusy(null);
    completeOnboarding();
  };

  return (
    <View style={styles.container}>
      <StatusBar style={c.statusBar} />
      <SafeAreaView style={styles.safeArea}>
        <BackButton />
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(motion(500))} style={styles.badge}>
            <Text style={styles.badgeText}>{placement.level}</Text>
          </Animated.View>

          <Animated.View
            entering={FadeIn.delay(motion(250)).duration(motion(500))}
            style={styles.heading}>
            <Text style={styles.title}>Save your {placement.level} level</Text>
            <Text style={styles.subtitle}>
              Create a free account to keep your progress safe and pick up on any device.
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeIn.delay(motion(500)).duration(motion(500))}
            style={styles.savedCard}>
            {saved.map((item) => (
              <View key={item} style={styles.savedRow}>
                <Text style={styles.check}>✓</Text>
                <Text style={styles.savedText}>{item}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeIn.delay(motion(800)).duration(motion(500))}
          style={styles.actions}>
          {Platform.OS === 'ios' && (
            <Pressable
              onPress={() => continueWith('apple')}
              accessibilityRole="button"
              accessibilityLabel="Sign in with Apple"
              style={({ pressed }) => [styles.appleButton, pressed && styles.pressed]}>
              <Text style={styles.appleText}>{''}  Sign in with Apple</Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => continueWith('google')}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}>
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleText}>Continue with Google</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/sign-up-email')}
            accessibilityRole="button"
            accessibilityLabel="Continue with email"
            style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}>
            <Text style={styles.googleText}>Continue with email</Text>
          </Pressable>
          <Pressable
            onPress={() => setConfirmingSkip(true)}
            hitSlop={8}
            accessibilityRole="button"
            style={styles.skip}>
            <Text style={styles.skipText}>Not now</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>

      <Modal
        visible={confirmingSkip}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmingSkip(false)}>
        <View style={styles.backdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Your level will be lost</Text>
            <Text style={styles.dialogText}>
              Without an account, your {placement.level} level, your tutor and your learning plan
              won&apos;t be saved. Next time, you&apos;ll start from the beginning.
            </Text>
            <Pressable
              onPress={() => setConfirmingSkip(false)}
              style={({ pressed }) => [styles.appleButton, pressed && styles.pressed]}>
              <Text style={styles.dialogPrimaryText}>Sign up</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setConfirmingSkip(false);
                completeOnboarding();
              }}
              hitSlop={8}
              style={styles.skip}>
              <Text style={styles.skipText}>Continue without saving</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    paddingBottom: Spacing.two,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
  },
  badge: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: c.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: c.background,
    fontSize: 40,
    fontFamily: Inter.bold,
    letterSpacing: -1,
  },
  heading: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    color: c.text,
    fontSize: 30,
    fontFamily: Inter.bold,
    textAlign: 'center',
  },
  subtitle: {
    color: c.muted,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Inter.regular,
    textAlign: 'center',
  },
  savedCard: {
    alignSelf: 'stretch',
    backgroundColor: c.card,
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.three - 4,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three - 4,
  },
  check: {
    color: c.text,
    fontSize: 16,
    fontFamily: Inter.bold,
  },
  savedText: {
    color: c.text,
    fontSize: 16,
    fontFamily: Inter.regular,
  },
  actions: {
    gap: Spacing.three - 4,
  },
  appleButton: {
    backgroundColor: c.text,
    borderRadius: 16,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  appleText: {
    color: c.background,
    fontSize: 18,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: c.border,
    paddingVertical: Spacing.three - 2,
  },
  googleG: {
    color: c.text,
    fontSize: 18,
    fontFamily: Inter.bold,
  },
  googleText: {
    color: c.text,
    fontSize: 18,
    fontFamily: Inter.semiBold,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  skip: {
    alignSelf: 'center',
    paddingVertical: Spacing.two,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  dialog: {
    backgroundColor: c.elevated,
    borderRadius: 22,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  dialogTitle: {
    color: c.text,
    fontSize: 22,
    fontFamily: Inter.bold,
    textAlign: 'center',
  },
  dialogText: {
    color: c.muted,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Inter.regular,
    textAlign: 'center',
  },
  dialogPrimaryText: {
    color: c.background,
    fontSize: 18,
    fontFamily: Inter.semiBold,
  },
  skipText: {
    color: c.muted,
    fontSize: 16,
    fontFamily: Inter.semiBold,
  },
});
