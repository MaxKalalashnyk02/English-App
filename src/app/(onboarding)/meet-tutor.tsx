import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { lazy, Suspense } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/back-button';
import { PaintedDrawing } from '@/components/painted-drawing';
import { AVATAR_VIEWBOX, AVATARS } from '@/constants/avatars';
import { Inter, motion, Spacing } from '@/constants/theme';
import { TOPICS } from '@/constants/topics';
import { ALL_TUTORS, TUTOR_MODELS } from '@/constants/tutors';
import { useOnboarding } from '@/hooks/use-onboarding';
import type { Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';

const LivingTutor = lazy(() =>
  import('@/components/living-tutor').then((m) => ({ default: m.LivingTutor }))
);

export default function MeetTutorScreen() {
  const c = usePalette();
  const styles = createStyles(c);
  const { tutorId, topics } = useOnboarding();
  const tutor = ALL_TUTORS.find((t) => t.id === tutorId);
  const topicLabels = TOPICS.filter((t) => topics.includes(t.id))
    .slice(0, 3)
    .map((t) => t.label.charAt(0).toLowerCase() + t.label.slice(1));

  if (!tutor) {
    return <Redirect href="/choose-tutor" />;
  }

  const model = TUTOR_MODELS[tutor.id];

  return (
    <View style={styles.container}>
      <StatusBar style={c.statusBar} />
      <SafeAreaView style={styles.safeArea}>
        <BackButton />
        <View style={styles.stage}>
          {model ? (
            <Suspense fallback={null}>
              <LivingTutor source={model} style={styles.canvas} />
            </Suspense>
          ) : (
            <PaintedDrawing
              data={AVATARS[tutor.id]}
              id={`meet-${tutor.id}`}
              viewBoxSize={AVATAR_VIEWBOX}
              size={260}
              delay={200}
            />
          )}
        </View>

        <Animated.View entering={FadeInDown.delay(motion(900)).duration(motion(600))} style={styles.intro}>
          <Text style={styles.name}>{tutor.name}</Text>
          <Text style={styles.title}>{tutor.title}</Text>
          <Text style={styles.greeting}>
            Hi!{' '}
            {topicLabels.length > 0
              ? `Let's learn English through ${formatList(topicLabels)}. But first, a quick quiz to understand your level.`
              : "Let's learn English together. But first, a quick quiz to understand your level."}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(motion(1500)).duration(motion(500))}>
          <Pressable
            onPress={() => router.push('/placement-test')}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>Let&apos;s start with a quiz</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

function formatList(items: string[]) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
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
    paddingBottom: Spacing.four,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  intro: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingBottom: Spacing.five,
  },
  name: {
    color: c.text,
    fontSize: 32,
    fontFamily: Inter.bold,
  },
  title: {
    color: c.muted,
    fontSize: 16,
    fontFamily: Inter.regular,
  },
  greeting: {
    color: c.text,
    fontSize: 18,
    fontFamily: Inter.regular,
    textAlign: 'center',
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
