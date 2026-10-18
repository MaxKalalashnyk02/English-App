import { useEffect, useEffectEvent } from 'react';
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { motion } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';

export type PaintedElement = {
  d: string;
  length: number;
  fill?: string;
  opacity?: number;
  line?: string;
  lineWidth?: number;
};

export type PaintedDrawingData = {
  backdrop: PaintedElement;
  elements: PaintedElement[];
};

type PaintedDrawingProps = {
  data: PaintedDrawingData;
  id: string;
  viewBoxSize: number;
  size: number;
  penColor?: string;
  delay?: number;
  stagger?: number;
  strokeDuration?: number;
  fillDuration?: number;
  onDone?: () => void;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

export function PaintedDrawing({
  data,
  id,
  viewBoxSize,
  size,
  penColor,
  delay: rawDelay = 0,
  stagger: rawStagger = 70,
  strokeDuration: rawStrokeDuration = 600,
  fillDuration: rawFillDuration = 450,
  onDone,
}: PaintedDrawingProps) {
  const palette = usePalette();
  const progress = useSharedValue(0);
  const delay = motion(rawDelay);
  const stagger = motion(rawStagger);
  const strokeDuration = motion(rawStrokeDuration);
  const fillDuration = motion(rawFillDuration);
  const elements = [data.backdrop, ...data.elements];
  const fillStart = strokeDuration * 0.55;
  const total = (elements.length - 1) * stagger + fillStart + fillDuration;
  const clipId = `painted-clip-${id}`;

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

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
      <Defs>
        <ClipPath id={clipId}>
          <Path d={data.backdrop.d} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${clipId})`}>
        {elements.map((element, i) => {
          const start = i * stagger;
          return (
            <PaintedLayer
              key={i}
              element={element}
              penColor={penColor ?? palette.text}
              progress={progress}
              strokeWindow={[start / total, (start + strokeDuration) / total]}
              fillWindow={[(start + fillStart) / total, (start + fillStart + fillDuration) / total]}
            />
          );
        })}
      </G>
    </Svg>
  );
}

type Window = [start: number, end: number];

function PaintedLayer({
  element,
  penColor,
  progress,
  strokeWindow,
  fillWindow,
}: {
  element: PaintedElement;
  penColor: string;
  progress: SharedValue<number>;
  strokeWindow: Window;
  fillWindow: Window;
}) {
  const isLine = !!element.line;

  const strokeProps = useAnimatedProps(() => {
    const drawn = Easing.inOut(Easing.cubic)(
      interpolate(progress.value, strokeWindow, [0, 1], 'clamp')
    );
    const faded = isLine ? 0 : interpolate(progress.value, fillWindow, [0, 1], 'clamp');
    return {
      strokeDashoffset: element.length * (1 - drawn),
      strokeOpacity: drawn > 0 ? 1 - faded : 0,
    };
  });

  const fillProps = useAnimatedProps(() => ({
    fillOpacity:
      Easing.out(Easing.quad)(interpolate(progress.value, fillWindow, [0, 1], 'clamp')) *
      (element.opacity ?? 1),
  }));

  return (
    <G>
      <AnimatedPath
        d={element.d}
        fill="none"
        stroke={element.line ?? penColor}
        strokeWidth={element.lineWidth ?? 1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={[element.length, element.length]}
        animatedProps={strokeProps}
      />
      {element.fill && <AnimatedPath d={element.d} fill={element.fill} animatedProps={fillProps} />}
    </G>
  );
}
