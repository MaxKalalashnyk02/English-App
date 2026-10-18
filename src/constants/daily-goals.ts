export type DailyGoal = { minutes: number; label: string };

export const DAILY_GOALS: DailyGoal[] = [
  { minutes: 5, label: 'Casual' },
  { minutes: 10, label: 'Regular' },
  { minutes: 15, label: 'Serious' },
  { minutes: 20, label: 'Intense' },
  { minutes: 30, label: 'Unstoppable' },
];

export const DEFAULT_DAILY_GOAL = 10;
