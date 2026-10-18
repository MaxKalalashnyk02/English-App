import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/back-button';
import { DAILY_GOALS } from '@/constants/daily-goals';
import { Inter, Spacing } from '@/constants/theme';
import { useOnboarding } from '@/hooks/use-onboarding';
import type { Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';

export default function DailyGoalScreen() {
  const c = usePalette();
  const styles = createStyles(c);
  const { dailyGoalMinutes, setDailyGoalMinutes } = useOnboarding();

  return (
    <View style={styles.container}>
      <StatusBar style={c.statusBar} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.back}>
          <BackButton />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heading}>
            <Text style={styles.title}>Daily goal</Text>
            <Text style={styles.subtitle}>How much time a day do you want to learn?</Text>
          </View>

          <View style={styles.group}>
            {DAILY_GOALS.map((goal, i) => {
              const selected = goal.minutes === dailyGoalMinutes;
              return (
                <Pressable
                  key={goal.minutes}
                  onPress={() => setDailyGoalMinutes(goal.minutes)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={[
                    styles.row,
                    i < DAILY_GOALS.length - 1 && styles.rowDivider,
                    selected && styles.rowSelected,
                  ]}>
                  <Text style={[styles.label, selected && styles.textSelected]}>{goal.label}</Text>
                  <Text style={[styles.value, selected && styles.textSelected]}>
                    {goal.minutes} min / day
                  </Text>
                </Pressable>
              );
            })}
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
  back: {
    paddingHorizontal: Spacing.three,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  heading: {
    gap: Spacing.two,
  },
  title: {
    color: c.text,
    fontSize: 32,
    fontFamily: Inter.bold,
  },
  subtitle: {
    color: c.muted,
    fontSize: 16,
    fontFamily: Inter.regular,
  },
  group: {
    backgroundColor: c.card,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.separator,
  },
  rowSelected: {
    backgroundColor: c.text,
  },
  label: {
    color: c.text,
    fontSize: 17,
    fontFamily: Inter.semiBold,
  },
  value: {
    color: c.muted,
    fontSize: 16,
    fontFamily: Inter.regular,
  },
  textSelected: {
    color: c.background,
  },
});
