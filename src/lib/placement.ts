import type { CefrLevel, PlacementQuestion, Skill } from '@/constants/placement-questions';

export const TEST_LENGTH = 7;

const DISCRIMINATION = 1.3;
const GUESSING = 0.25;
const PRIOR_MEAN = -0.3;
const PRIOR_SD = 1.4;
const MAX_READING_ITEMS = 2;

const GRID = Array.from({ length: 161 }, (_, i) => -4 + i * 0.05);

const CEFR_CUTS: [CefrLevel, number][] = [
  ['C2', 2.0],
  ['C1', 1.0],
  ['B2', 0.0],
  ['B1', -1.0],
  ['A2', -2.0],
  ['A1', -Infinity],
];

export type Response = {
  question: PlacementQuestion;
  correct: boolean | null;
};

export type AbilityEstimate = { theta: number; se: number };

function probability(theta: number, difficulty: number, guessing: number) {
  return guessing + (1 - guessing) / (1 + Math.exp(-DISCRIMINATION * (theta - difficulty)));
}

function likelihood(theta: number, response: Response) {
  const { difficulty } = response.question;
  if (response.correct === null) return 1 - probability(theta, difficulty, 0);
  const p = probability(theta, difficulty, GUESSING);
  return response.correct ? p : 1 - p;
}

export function estimateAbility(responses: Response[]): AbilityEstimate {
  const weights = GRID.map((theta) => {
    const z = (theta - PRIOR_MEAN) / PRIOR_SD;
    let w = Math.exp(-0.5 * z * z);
    for (const r of responses) w *= likelihood(theta, r);
    return w;
  });
  const total = weights.reduce((sum, w) => sum + w, 0);
  const theta = GRID.reduce((sum, t, i) => sum + t * weights[i], 0) / total;
  const variance = GRID.reduce((sum, t, i) => sum + (t - theta) ** 2 * weights[i], 0) / total;
  return { theta, se: Math.sqrt(variance) };
}

function information(theta: number, difficulty: number) {
  const p = probability(theta, difficulty, GUESSING);
  const ratio = (p - GUESSING) / (1 - GUESSING);
  return DISCRIMINATION ** 2 * ratio * ratio * ((1 - p) / p);
}

export function nextQuestion(
  bank: PlacementQuestion[],
  responses: Response[],
  theta: number,
  random: () => number = Math.random
): PlacementQuestion | null {
  const used = new Set(responses.map((r) => r.question.id));
  const readingCount = responses.filter((r) => r.question.skill === 'reading').length;
  const lastSkill: Skill | undefined = responses[responses.length - 1]?.question.skill;

  const candidates = bank
    .filter((q) => !used.has(q.id))
    .filter((q) => q.skill !== 'reading' || readingCount < MAX_READING_ITEMS)
    .map((q) => ({
      q,
      score: information(theta, q.difficulty) * (q.skill === lastSkill ? 0.8 : 1),
    }))
    .sort((x, y) => y.score - x.score);

  if (candidates.length === 0) return null;
  const top = candidates.slice(0, Math.min(3, candidates.length));
  return top[Math.floor(random() * top.length)].q;
}

export function cefrLevel(theta: number): CefrLevel {
  return CEFR_CUTS.find(([, cut]) => theta >= cut)![0];
}

export const CEFR_INFO: Record<CefrLevel, { name: string; description: string }> = {
  A1: {
    name: 'Beginner',
    description: 'You know basic words and phrases. We will build your foundation step by step.',
  },
  A2: {
    name: 'Elementary',
    description: 'You can handle simple everyday situations. Time to grow your confidence.',
  },
  B1: {
    name: 'Intermediate',
    description: 'You can talk about familiar topics and get by when travelling.',
  },
  B2: {
    name: 'Upper intermediate',
    description: 'You can discuss many topics fluently and follow most conversations.',
  },
  C1: {
    name: 'Advanced',
    description: 'You use English flexibly for work, study and social life.',
  },
  C2: {
    name: 'Proficient',
    description: 'You understand almost everything and express yourself with precision.',
  },
};
