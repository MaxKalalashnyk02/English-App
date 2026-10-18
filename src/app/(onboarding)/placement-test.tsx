import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  PLACEMENT_QUESTIONS,
  type PlacementQuestion,
} from '@/constants/placement-questions';
import { Inter, motion, Spacing } from '@/constants/theme';
import { useOnboarding } from '@/hooks/use-onboarding';
import type { Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';
import {
  cefrLevel,
  estimateAbility,
  nextQuestion,
  TEST_LENGTH,
  type Response,
} from '@/lib/placement';

const ADVANCE_DELAY = 250;

const SKILL_LABELS = { grammar: 'Grammar', vocabulary: 'Vocabulary', reading: 'Reading' };

type Current = {
  question: PlacementQuestion;
  order: number[];
};

function shuffledOrder() {
  const order = [0, 1, 2, 3];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function present(responses: Response[]): Current {
  const { theta } = estimateAbility(responses);
  const question = nextQuestion(PLACEMENT_QUESTIONS, responses, theta)!;
  return { question, order: shuffledOrder() };
}

export default function PlacementTestScreen() {
  const c = usePalette();
  const styles = createStyles(c);
  const { setPlacement } = useOnboarding();
  const [responses, setResponses] = useState<Response[]>([]);
  const [current, setCurrent] = useState<Current>(() => present([]));
  const [picked, setPicked] = useState<number | 'unknown' | null>(null);

  const answer = (choice: number | 'unknown') => {
    if (picked !== null) return;
    setPicked(choice);

    setTimeout(() => {
      const correct = choice === 'unknown' ? null : choice === current.question.answer;
      const next = [...responses, { question: current.question, correct }];

      if (next.length >= TEST_LENGTH) {
        const { theta, se } = estimateAbility(next);
        setPlacement({ level: cefrLevel(theta), theta, se });
        router.replace('/placement-result');
        return;
      }
      setResponses(next);
      setCurrent(present(next));
      setPicked(null);
    }, ADVANCE_DELAY);
  };

  const { question, order } = current;
  const number = responses.length + 1;

  return (
    <View style={styles.container}>
      <StatusBar style={c.statusBar} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.progressRow}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(responses.length / TEST_LENGTH) * 100}%` }]} />
          </View>
          <Text style={styles.counter}>
            {number} / {TEST_LENGTH}
          </Text>
        </View>

        <Animated.View
          key={question.id}
          entering={FadeIn.duration(motion(250))}
          style={styles.questionArea}>
          <Text style={styles.skill}>{SKILL_LABELS[question.skill]}</Text>
          {question.passage && (
            <View style={styles.passage}>
              <Text style={styles.passageText}>{question.passage}</Text>
            </View>
          )}
          <Text style={styles.prompt}>{question.prompt}</Text>

          <View style={styles.options}>
            {order.map((optionIndex) => {
              const selected = picked === optionIndex;
              return (
                <Pressable
                  key={optionIndex}
                  onPress={() => answer(optionIndex)}
                  accessibilityRole="button"
                  style={[styles.option, selected && styles.optionSelected]}>
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {question.options[optionIndex]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        <Pressable
          onPress={() => answer('unknown')}
          hitSlop={8}
          accessibilityRole="button"
          style={styles.unknown}>
          <Text style={[styles.unknownText, picked === 'unknown' && styles.unknownTextPicked]}>
            I don&apos;t know
          </Text>
        </Pressable>
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
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.three,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: c.track,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: c.text,
  },
  counter: {
    color: c.muted,
    fontSize: 14,
    fontFamily: Inter.semiBold,
    fontVariant: ['tabular-nums'],
  },
  questionArea: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.three,
  },
  skill: {
    color: c.muted,
    fontSize: 13,
    fontFamily: Inter.semiBold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  passage: {
    backgroundColor: c.card,
    borderRadius: 14,
    padding: Spacing.three,
  },
  passageText: {
    color: c.text,
    fontSize: 16,
    lineHeight: 23,
    fontFamily: Inter.regular,
  },
  prompt: {
    color: c.text,
    fontSize: 22,
    lineHeight: 30,
    fontFamily: Inter.semiBold,
  },
  options: {
    marginHorizontal: -Spacing.four,
    marginTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: c.separator,
  },
  option: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.separator,
  },
  optionSelected: {
    backgroundColor: c.text,
  },
  optionText: {
    color: c.text,
    fontSize: 17,
    fontFamily: Inter.regular,
  },
  optionTextSelected: {
    color: c.background,
    fontFamily: Inter.semiBold,
  },
  unknown: {
    alignSelf: 'center',
    paddingVertical: Spacing.three,
  },
  unknownText: {
    color: c.muted,
    fontSize: 16,
    fontFamily: Inter.semiBold,
  },
  unknownTextPicked: {
    color: c.text,
  },
});
