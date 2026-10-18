import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { usePalette } from '@/hooks/use-palette';

const THUMB = 26;
const TRACK = 4;

type StepSliderProps = {
  value: number;
  steps: number;
  onChange: (step: number) => void;
  color?: string;
  trackColor?: string;
  accessibilityLabel: string;
  accessibilityValue: string;
};

export function StepSlider({
  value,
  steps,
  onChange,
  color,
  trackColor,
  accessibilityLabel,
  accessibilityValue,
}: StepSliderProps) {
  const palette = usePalette();
  const thumbColor = color ?? palette.text;
  const lineColor = trackColor ?? palette.track;
  const width = useSharedValue(0);
  const position = useSharedValue(value);
  const current = useSharedValue(value);

  useEffect(() => {
    current.set(value);
    position.set(value);
  }, [value, current, position]);

  const stepAt = (x: number) => {
    'worklet';
    const usable = Math.max(1, width.get() - THUMB);
    const raw = ((x - THUMB / 2) / usable) * (steps - 1);
    return Math.min(steps - 1, Math.max(0, raw));
  };

  const commit = (step: number) => {
    'worklet';
    if (step !== current.get()) {
      current.set(step);
      scheduleOnRN(onChange, step);
    }
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-4, 4])
    .failOffsetY([-12, 12])
    .onUpdate((e) => {
      const step = Math.round(stepAt(e.x));
      position.set(step);
      commit(step);
    });

  const tap = Gesture.Tap().onEnd((e) => {
    const step = Math.round(stepAt(e.x));
    position.set(step);
    commit(step);
  });

  const thumbStyle = useAnimatedStyle(() => {
    const usable = Math.max(0, width.get() - THUMB);
    return { transform: [{ translateX: (position.get() / (steps - 1)) * usable }] };
  });

  const fillStyle = useAnimatedStyle(() => {
    const usable = Math.max(0, width.get() - THUMB);
    return { width: (position.get() / (steps - 1)) * usable + THUMB / 2 };
  });

  return (
    <GestureDetector gesture={Gesture.Race(pan, tap)}>
      <View
        style={styles.hitArea}
        onLayout={(e) => {
          width.set(e.nativeEvent.layout.width);
        }}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: accessibilityValue }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => {
          if (e.nativeEvent.actionName === 'increment') onChange(Math.min(steps - 1, value + 1));
          if (e.nativeEvent.actionName === 'decrement') onChange(Math.max(0, value - 1));
        }}>
        <View style={[styles.track, { backgroundColor: lineColor }]}>
          {Array.from({ length: steps }, (_, i) => (
            <View key={i} style={[styles.stop, { backgroundColor: lineColor }]} />
          ))}
        </View>
        <Animated.View style={[styles.fill, { backgroundColor: thumbColor }, fillStyle]} />
        <Animated.View style={[styles.thumb, { backgroundColor: thumbColor }, thumbStyle]} />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    height: 36,
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    left: THUMB / 2,
    right: THUMB / 2,
    height: TRACK,
    borderRadius: TRACK / 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stop: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: -5,
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: TRACK,
    borderRadius: TRACK / 2,
  },
  thumb: {
    position: 'absolute',
    left: 0,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
