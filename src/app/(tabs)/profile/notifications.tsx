import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/back-button';
import { REMINDER_TIMES } from '@/constants/reminders';
import { Inter, Spacing } from '@/constants/theme';
import { useOnboarding } from '@/hooks/use-onboarding';
import type { Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';

const TRACK_ON = '#34C759';

export default function NotificationsScreen() {
  const c = usePalette();
  const styles = createStyles(c);
  const { notifications, setNotifications } = useOnboarding();

  return (
    <View style={styles.container}>
      <StatusBar style={c.statusBar} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.back}>
          <BackButton />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Notifications</Text>

          <View style={styles.group}>
            <View style={[styles.row, styles.rowDivider]}>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Daily reminder</Text>
                <Text style={styles.rowHint}>A nudge from your tutor to practise.</Text>
              </View>
              <Switch
                value={notifications.enabled}
                onValueChange={(enabled) => setNotifications({ enabled })}
                trackColor={{ true: TRACK_ON }}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Streak alerts</Text>
                <Text style={styles.rowHint}>A heads-up before you lose your streak.</Text>
              </View>
              <Switch
                value={notifications.streakAlerts}
                onValueChange={(streakAlerts) => setNotifications({ streakAlerts })}
                trackColor={{ true: TRACK_ON }}
              />
            </View>
          </View>

          <View style={[styles.section, !notifications.enabled && styles.disabled]}>
            <Text style={styles.sectionTitle}>Reminder time</Text>
            <View style={styles.group}>
              {REMINDER_TIMES.map((option, i) => {
                const selected = option.id === notifications.reminderTime;
                return (
                  <Pressable
                    key={option.id}
                    disabled={!notifications.enabled}
                    onPress={() => setNotifications({ reminderTime: option.id })}
                    accessibilityRole="radio"
                    accessibilityState={{ selected, disabled: !notifications.enabled }}
                    style={[
                      styles.row,
                      i < REMINDER_TIMES.length - 1 && styles.rowDivider,
                      selected && styles.optionSelected,
                    ]}>
                    <Text style={[styles.rowLabel, selected && styles.optionTextSelected]}>
                      {option.label}
                    </Text>
                    <Text style={[styles.rowValue, selected && styles.optionTextSelected]}>
                      {option.time}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
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
  title: {
    color: c.text,
    fontSize: 32,
    fontFamily: Inter.bold,
  },
  section: {
    gap: Spacing.two,
  },
  disabled: {
    opacity: 0.4,
  },
  sectionTitle: {
    color: c.muted,
    fontSize: 13,
    fontFamily: Inter.semiBold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginLeft: Spacing.one,
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
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.separator,
  },
  rowText: {
    flex: 1,
    gap: Spacing.half,
  },
  rowLabel: {
    color: c.text,
    fontSize: 17,
    fontFamily: Inter.regular,
  },
  rowHint: {
    color: c.muted,
    fontSize: 13,
    fontFamily: Inter.regular,
  },
  rowValue: {
    color: c.muted,
    fontSize: 16,
    fontFamily: Inter.regular,
  },
  optionSelected: {
    backgroundColor: c.text,
  },
  optionTextSelected: {
    color: c.background,
    fontFamily: Inter.semiBold,
  },
});
