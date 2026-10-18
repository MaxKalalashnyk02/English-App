import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

import { TutorAvatar } from '@/components/tutor-avatar';
import { Inter, motion, Spacing } from '@/constants/theme';
import type { Tutor } from '@/constants/tutors';
import type { Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';

const DIM_DURATION = motion(250);
const BORDER_DURATION = motion(200);

type TutorCardProps = {
  tutor: Tutor;
  selected: boolean;
  dimmed: boolean;
  delay: number;
  avatarSize: number;
  accent?: string;
  width?: number | `${number}%`;
  onPress: () => void;
};

export function TutorCard({
  tutor,
  selected,
  dimmed,
  delay,
  avatarSize,
  accent,
  width = '48%',
  onPress,
}: TutorCardProps) {
  const c = usePalette();
  const styles = createStyles(c);
  const selectedBorder = accent ?? c.text;
  const idleBorder = c.separator;
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(selected ? 1.04 : 1, { damping: 14, stiffness: 180 }) }],
    opacity: withTiming(dimmed ? 0.45 : 1, { duration: DIM_DURATION }),
    borderColor: withTiming(selected ? selectedBorder : idleBorder, { duration: BORDER_DURATION }),
  }));

  return (
    <Pressable
      onPress={onPress}
      style={{ width }}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${tutor.name}, ${tutor.title}`}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <TutorAvatar
          tutor={tutor}
          size={avatarSize}
          delay={delay}
        />
        <Animated.View entering={FadeIn.delay(motion(delay + 600)).duration(motion(500))} style={styles.text}>
          <Text style={styles.name}>{tutor.name}</Text>
          <Text style={styles.title} numberOfLines={3}>
            {tutor.title}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: c.card,
  },
  text: {
    alignItems: 'center',
    gap: Spacing.half,
  },
  name: {
    color: c.text,
    fontSize: 17,
    fontFamily: Inter.semiBold,
  },
  title: {
    color: c.muted,
    fontSize: 13,
    fontFamily: Inter.regular,
    textAlign: 'center',
  },
});
