import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Inter, Spacing } from '@/constants/theme';
import { TOPICS } from '@/constants/topics';
import { useOnboarding } from '@/hooks/use-onboarding';
import { CEFR_INFO } from '@/lib/placement';
import type { Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';

const PRACTICE = [
  { id: 'listening', emoji: '🎧', title: 'Practice listening', detail: 'Understand real accents' },
  { id: 'speaking', emoji: '🗣️', title: 'Practice speaking', detail: 'Talk with your tutor' },
  { id: 'words', emoji: '📚', title: 'Practice words & idioms', detail: 'Learn how natives say it' },
];

const comingSoon = () => Alert.alert('Coming soon', 'This practice is on its way.');

export default function FunScreen() {
  const c = usePalette();
  const styles = createStyles(c);
  const { name, placement, topics, dailyGoalMinutes, minutesToday } = useOnboarding();
  const firstTopic = TOPICS.find((t) => topics.includes(t.id));
  const progress = Math.min(1, minutesToday / dailyGoalMinutes);

  return (
    <View style={styles.container}>
      <StatusBar style={c.statusBar} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={styles.greeting}>{name ? `Hi, ${name}!` : 'Hi there!'}</Text>
              <Text style={styles.progressText}>
                {minutesToday} / {dailyGoalMinutes} min
              </Text>
            </View>
            <View
              style={styles.track}
              accessibilityRole="progressbar"
              accessibilityLabel="Today's goal"
              accessibilityValue={{ min: 0, max: dailyGoalMinutes, now: minutesToday }}>
              <View style={[styles.fill, { width: `${progress * 100}%` }]} />
            </View>
          </View>

          <Pressable
            onPress={comingSoon}
            accessibilityRole="button"
            style={({ pressed }) => [styles.dailyCard, pressed && styles.pressed]}>
            <Text style={styles.dailyEyebrow}>Start daily fun</Text>
            <Text style={styles.dailyTitle}>
              {firstTopic ? `English through ${firstTopic.label}` : 'Your first conversation'}
            </Text>
            <Text style={styles.dailyDetail}>
              {placement
                ? `${dailyGoalMinutes} min · made for your ${placement.level} · ${CEFR_INFO[placement.level].name} level`
                : `${dailyGoalMinutes} min · made for your level`}
            </Text>
            <View style={styles.dailyButton}>
              <Text style={styles.dailyButtonText}>Start</Text>
            </View>
          </Pressable>

          <View style={styles.practiceList}>
            {PRACTICE.map((item) => (
              <Pressable
                key={item.id}
                onPress={comingSoon}
                accessibilityRole="button"
                style={({ pressed }) => [styles.practiceCard, pressed && styles.pressed]}>
                <Text style={styles.practiceEmoji}>{item.emoji}</Text>
                <View style={styles.practiceText}>
                  <Text style={styles.practiceTitle}>{item.title}</Text>
                  <Text style={styles.muted}>{item.detail}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
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
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  progressBlock: {
    gap: Spacing.three - 4,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  greeting: {
    flexShrink: 1,
    color: c.text,
    fontSize: 32,
    fontFamily: Inter.bold,
  },
  progressText: {
    color: c.muted,
    fontSize: 15,
    fontFamily: Inter.semiBold,
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: c.track,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: c.text,
  },
  dailyCard: {
    backgroundColor: c.text,
    borderRadius: 24,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  dailyEyebrow: {
    color: c.invertedMuted,
    fontSize: 13,
    fontFamily: Inter.semiBold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  dailyTitle: {
    color: c.background,
    fontSize: 26,
    lineHeight: 32,
    fontFamily: Inter.bold,
  },
  dailyDetail: {
    color: c.invertedMuted,
    fontSize: 14,
    lineHeight: 19,
    fontFamily: Inter.regular,
  },
  dailyButton: {
    marginTop: Spacing.three,
    backgroundColor: c.background,
    borderRadius: 16,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  dailyButtonText: {
    color: c.text,
    fontSize: 18,
    fontFamily: Inter.semiBold,
  },
  practiceList: {
    gap: Spacing.three - 4,
  },
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: c.card,
    borderRadius: 18,
    padding: Spacing.three,
  },
  practiceEmoji: {
    fontSize: 28,
  },
  practiceText: {
    flex: 1,
    gap: Spacing.half,
  },
  practiceTitle: {
    color: c.text,
    fontSize: 17,
    fontFamily: Inter.semiBold,
  },
  muted: {
    color: c.muted,
    fontSize: 14,
    fontFamily: Inter.regular,
  },
  chevron: {
    color: c.muted,
    fontSize: 22,
    fontFamily: Inter.regular,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
