import { router, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaintedDrawing } from '@/components/painted-drawing';
import { AVATAR_VIEWBOX, AVATARS } from '@/constants/avatars';
import { DAILY_GOALS } from '@/constants/daily-goals';
import { TRAITS } from '@/constants/personality';
import { REMINDER_TIMES } from '@/constants/reminders';
import { Inter, Spacing } from '@/constants/theme';
import { ALL_TUTORS } from '@/constants/tutors';
import { useOnboarding } from '@/hooks/use-onboarding';
import { CEFR_INFO } from '@/lib/placement';
import type { Appearance, Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';

const DEFAULT_NAME = 'Beautiful name';

const APPEARANCES: { id: Appearance; label: string }[] = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
];

export default function ProfileScreen() {
  const c = usePalette();
  const styles = createStyles(c);
  const {
    name,
    setName,
    tutorId,
    topics,
    personality,
    placement,
    notifications,
    dailyGoalMinutes,
    appearance,
    setAppearance,
  } = useOnboarding();
  const dailyGoal = DAILY_GOALS.find((g) => g.minutes === dailyGoalMinutes);
  const tutor = ALL_TUTORS.find((t) => t.id === tutorId);
  const reminder = REMINDER_TIMES.find((t) => t.id === notifications.reminderTime);
  const toughness = TRAITS.find((t) => t.id === 'toughness');

  const initials = (name || DEFAULT_NAME)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <View style={styles.container}>
      <StatusBar style={c.statusBar} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Profile</Text>

          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.identityText}>
              <View style={styles.nameRow}>
                <TextInput
                  keyboardAppearance={c.keyboard}
                  value={name}
                  onChangeText={setName}
                  placeholder={DEFAULT_NAME}
                  placeholderTextColor={c.text}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="name"
                  textContentType="name"
                  returnKeyType="done"
                  maxLength={40}
                  accessibilityLabel="Your name"
                  style={styles.nameInput}
                />
              </View>
              <Text style={styles.muted}>
                {placement
                  ? `English level: ${placement.level} · ${CEFR_INFO[placement.level].name}`
                  : 'English level: not tested yet'}
              </Text>
            </View>
          </View>

          {tutor && (
            <View style={styles.tutorCard}>
              <PaintedDrawing
                data={AVATARS[tutor.id]}
                id={`fun-${tutor.id}`}
                viewBoxSize={AVATAR_VIEWBOX}
                size={64}
              />
              <View style={styles.tutorText}>
                <Text style={styles.tutorName}>{tutor.name}</Text>
                <Text style={styles.muted}>{tutor.title}</Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.group}>
              <Row label="Tutor" value={tutor?.name ?? 'Choose'} href="/profile/tutor" />
              <Row
                label="Topics"
                value={topics.length > 0 ? `${topics.length} selected` : 'Choose'}
                href="/profile/topics"
              />
              <Row
                label="Tutor style"
                value={toughness ? toughness.levels[personality.toughness] : ''}
                href="/profile/style"
              />
              <Row
                label="Daily goal"
                value={
                  dailyGoal ? `${dailyGoal.minutes} min · ${dailyGoal.label}` : `${dailyGoalMinutes} min`
                }
                href="/profile/daily-goal"
                last
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.group}>
              <Row
                label="Daily reminder"
                value={
                  notifications.enabled && reminder ? `${reminder.label} · ${reminder.time}` : 'Off'
                }
                href="/profile/notifications"
                last
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <View style={styles.segmented} accessibilityRole="radiogroup">
              {APPEARANCES.map((option) => {
                const selected = option.id === appearance;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => setAppearance(option.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    style={[styles.segment, selected && styles.segmentSelected]}>
                    <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
                      {option.label}
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

function Row({
  label,
  value,
  href,
  last,
}: {
  label: string;
  value: string;
  href: Href;
  last?: boolean;
}) {
  const c = usePalette();
  const styles = createStyles(c);
  return (
    <Pressable
      onPress={() => router.push(href)}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${value}`}
      style={({ pressed }) => [styles.row, !last && styles.rowDivider, pressed && styles.rowPressed]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
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
  title: {
    color: c.text,
    fontSize: 32,
    fontFamily: Inter.bold,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  identityText: {
    flex: 1,
    gap: Spacing.one,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  nameInput: {
    flex: 1,
    color: c.text,
    fontSize: 24,
    fontFamily: Inter.bold,
    paddingVertical: 0,
  },
  editIcon: {
    color: c.muted,
    fontSize: 18,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: c.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: c.background,
    fontSize: 28,
    fontFamily: Inter.bold,
  },
  muted: {
    color: c.muted,
    fontSize: 15,
    fontFamily: Inter.regular,
  },
  tutorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: c.card,
    borderRadius: 18,
    padding: Spacing.three,
  },
  tutorText: {
    flex: 1,
    gap: Spacing.half,
  },
  tutorName: {
    color: c.text,
    fontSize: 18,
    fontFamily: Inter.semiBold,
  },
  section: {
    gap: Spacing.two,
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
  rowPressed: {
    backgroundColor: c.elevated,
  },
  rowLabel: {
    color: c.text,
    fontSize: 17,
    fontFamily: Inter.regular,
  },
  rowRight: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rowValue: {
    flexShrink: 1,
    color: c.muted,
    fontSize: 16,
    fontFamily: Inter.regular,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: c.card,
    borderRadius: 14,
    padding: Spacing.one,
    gap: Spacing.one,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three - 4,
    borderRadius: 10,
  },
  segmentSelected: {
    backgroundColor: c.text,
  },
  segmentText: {
    color: c.muted,
    fontSize: 16,
    fontFamily: Inter.semiBold,
  },
  segmentTextSelected: {
    color: c.background,
  },
  chevron: {
    color: c.muted,
    fontSize: 22,
    fontFamily: Inter.regular,
  },
});
