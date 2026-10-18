import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { usePalette } from '@/hooks/use-palette';

type BackButtonProps = {
  onPress?: () => void;
};

export function BackButton({ onPress }: BackButtonProps) {
  const c = usePalette();

  if (!onPress && !router.canGoBack()) return null;

  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Back"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Svg width={14} height={24} viewBox="0 0 14 24">
        <Path
          d="M12 2L2 12L12 22"
          stroke={c.text}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
});
