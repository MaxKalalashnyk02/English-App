import { useEffect, useEffectEvent } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { UNITS_PER_FONT_SIZE } from '@/constants/painted-words';
import { motion } from '@/constants/theme';

export type PaintedWord = {
  viewBox: [number, number, number, number];
  glyphs: { d: string; contours: { d: string; length: number }[] }[];
};

type PaintedTextProps = {
  word: PaintedWord;
  label: string;
  fontSize: number;
  color: string;
  delay?: number;
  stagger?: number;
  strokeDuration?: number;
  fillDuration?: number;
  onDone?: () => void;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

export function PaintedText({
  word,
  label,
  fontSize,
  color,
  delay: rawDelay = 0,
  stagger: rawStagger = 110,
  strokeDuration: rawStrokeDuration = 750,
  fillDuration: rawFillDuration = 500,
  onDone,
}: PaintedTextProps) {
  const progress = useSharedValue(0);
  const delay = motion(rawDelay);
  const stagger = motion(rawStagger);
  const strokeDuration = motion(rawStrokeDuration);
  const fillDuration = motion(rawFillDuration);
  const fillStart = strokeDuration * 0.55;
  const total = (word.glyphs.length - 1) * stagger + fillStart + fillDuration;

  const handleDone = useEffectEvent(() => onDone?.());

  useEffect(() => {
    const notifyDone = () => handleDone();
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: total, easing: Easing.linear }, (finished) => {
        if (finished) scheduleOnRN(notifyDone);
      })
    );
  }, [delay, total, progress]);

  const [, , vbWidth, vbHeight] = word.viewBox;
  const scale = fontSize / UNITS_PER_FONT_SIZE;

  return (
    <View accessible accessibilityRole="text" accessibilityLabel={label}>
      <Svg width={vbWidth * scale} height={vbHeight * scale} viewBox={word.viewBox.join(' ')}>
        {word.glyphs.map((glyph, i) => {
          const start = i * stagger;
          return (
            <PaintedGlyph
              key={i}
              glyph={glyph}
              color={color}
              progress={progress}
              strokeWindow={[start / total, (start + strokeDuration) / total]}
              fillWindow={[(start + fillStart) / total, (start + fillStart + fillDuration) / total]}
            />
          );
        })}
      </Svg>
    </View>
  );
}

type Window = [start: number, end: number];

function PaintedGlyph({
  glyph,
  color,
  progress,
  strokeWindow,
  fillWindow,
}: {
  glyph: PaintedWord['glyphs'][number];
  color: string;
  progress: SharedValue<number>;
  strokeWindow: Window;
  fillWindow: Window;
}) {
  const fillProps = useAnimatedProps(() => ({
    fillOpacity: Easing.out(Easing.quad)(
      interpolate(progress.value, fillWindow, [0, 1], 'clamp')
    ),
  }));

  return (
    <G>
      {glyph.contours.map((contour, i) => (
        <TracedContour
          key={i}
          contour={contour}
          color={color}
          progress={progress}
          strokeWindow={strokeWindow}
          fillWindow={fillWindow}
        />
      ))}
      <AnimatedPath d={glyph.d} fill={color} animatedProps={fillProps} />
    </G>
  );
}

function TracedContour({
  contour,
  color,
  progress,
  strokeWindow,
  fillWindow,
}: {
  contour: { d: string; length: number };
  color: string;
  progress: SharedValue<number>;
  strokeWindow: Window;
  fillWindow: Window;
}) {
  const strokeProps = useAnimatedProps(() => {
    const drawn = Easing.inOut(Easing.cubic)(
      interpolate(progress.value, strokeWindow, [0, 1], 'clamp')
    );
    const faded = interpolate(progress.value, [fillWindow[0], fillWindow[1]], [0, 1], 'clamp');
    return {
      strokeDashoffset: contour.length * (1 - drawn),
      strokeOpacity: drawn > 0 ? 1 - faded : 0,
    };
  });

  return (
    <AnimatedPath
      d={contour.d}
      fill="none"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={[contour.length, contour.length]}
      animatedProps={strokeProps}
    />
  );
}
