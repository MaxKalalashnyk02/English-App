import { useAudioPlayer } from 'expo-audio';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaintedText } from '@/components/painted-text';
import { TutorCard } from '@/components/tutor-card';
import { secretTutors } from '@/constants/painted-words';
import { Inter, motion, Spacing } from '@/constants/theme';
import { SECRET_TUTORS, type TutorId } from '@/constants/tutors';
import { useOnboarding } from '@/hooks/use-onboarding';
import { PREMIUM_PRICE_LABEL, startPremiumTrial, TRIAL_DAYS } from '@/lib/purchases';
import type { Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';

const selectSound = require('@/assets/sounds/select.wav');

const COLUMNS = 2;
const COLUMN_GAP = Spacing.two;

export default function SecretTutorsScreen() {
  const c = usePalette();
  const styles = createStyles(c);
  const { setTutorId, hasPremium, setHasPremium } = useOnboarding();
  const selectPlayer = useAudioPlayer(selectSound);
  const { width } = useWindowDimensions();
  const cardWidth = Math.floor(
    (width - Spacing.three * 2 - COLUMN_GAP * (COLUMNS - 1)) / COLUMNS
  );
  const [selected, setSelected] = useState<TutorId | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const selectedTutor = SECRET_TUTORS.find((t) => t.id === selected);

  const select = (id: TutorId) => {
    if (id === selected) return;
    setSelected(id);
    selectPlayer.seekTo(0).then(() => selectPlayer.play());
  };

  const confirm = async () => {
    if (!selected) return;
    if (!hasPremium) {
      setIsPurchasing(true);
      const unlocked = await startPremiumTrial();
      setIsPurchasing(false);
      if (!unlocked) return;
      setHasPremium(true);
    }
    setTutorId(selected);
    router.replace('/topics');
  };

  const close = () => (router.canGoBack() ? router.back() : router.replace('/choose-tutor'));

  return (
    <View style={styles.container}>
      <StatusBar style={c.statusBar} />
      <SafeAreaView style={styles.safeArea}>
        <Pressable
          onPress={close}
          hitSlop={12}
          style={styles.close}
          accessibilityRole="button"
          accessibilityLabel="Close">
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        <View style={styles.header}>
          <Animated.Text entering={FadeIn.duration(motion(400))} style={styles.badge}>
            PREMIUM
          </Animated.Text>
          <PaintedText
            word={secretTutors}
            label="Premium tutors"
            fontSize={32}
            color={c.accent}
            delay={300}
          />
          <Animated.Text entering={FadeIn.delay(motion(1300)).duration(motion(600))} style={styles.subtitle}>
            Extra-charming and fun tutors who make every conversation feel like a date with English.
          </Animated.Text>
        </View>

        <View style={styles.row}>
          {SECRET_TUTORS.map((tutor, i) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              selected={tutor.id === selected}
              dimmed={selected !== null && tutor.id !== selected}
              delay={700 + i * 200}
              avatarSize={Math.min(124, cardWidth - Spacing.three)}
              width={cardWidth}
              accent={c.accent}
              onPress={() => select(tutor.id)}
            />
          ))}
        </View>

        <Animated.View entering={FadeIn.delay(motion(1800)).duration(motion(600))} style={styles.footer}>
          <Pressable
            disabled={!selected || isPurchasing}
            onPress={confirm}
            style={({ pressed }) => [
              styles.button,
              !selected && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}>
            {isPurchasing ? (
              <ActivityIndicator color={c.background} />
            ) : (
              <Text style={styles.buttonText}>
                {hasPremium
                  ? `Continue with ${selectedTutor?.name ?? 'your tutor'}`
                  : `Try free for ${TRIAL_DAYS} days`}
              </Text>
            )}
          </Pressable>
          {!hasPremium && (
            <Text style={styles.terms}>
              Free for {TRIAL_DAYS} days, then {PREMIUM_PRICE_LABEL}. Cancel anytime.
            </Text>
          )}
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
  close: {
    alignSelf: 'flex-end',
    padding: Spacing.three,
  },
  closeText: {
    color: c.muted,
    fontSize: 20,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  badge: {
    color: c.background,
    backgroundColor: c.accent,
    fontSize: 12,
    fontFamily: Inter.bold,
    letterSpacing: 1.5,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  subtitle: {
    color: c.muted,
    fontSize: 16,
    fontFamily: Inter.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    columnGap: COLUMN_GAP,
    rowGap: Spacing.three,
  },
  footer: {
    gap: Spacing.two,
  },
  button: {
    backgroundColor: c.accent,
    borderRadius: 16,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.35,
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
  terms: {
    color: c.muted,
    fontSize: 13,
    fontFamily: Inter.regular,
    textAlign: 'center',
  },
});
