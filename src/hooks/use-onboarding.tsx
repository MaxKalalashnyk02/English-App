import { createContext, use, useState, type PropsWithChildren } from 'react';

import { DEFAULT_PERSONALITY, type Personality, type TraitId } from '@/constants/personality';
import { DEFAULT_DAILY_GOAL } from '@/constants/daily-goals';
import type { Appearance } from '@/constants/palette';
import type { CefrLevel } from '@/constants/placement-questions';
import { DEFAULT_NOTIFICATIONS, type NotificationSettings } from '@/constants/reminders';
import type { TopicId } from '@/constants/topics';
import type { TutorId } from '@/constants/tutors';

export type PlacementResult = { level: CefrLevel; theta: number; se: number };

type SavedOnboarding = {
  isOnboarded: boolean;
  name: string;
  notifications: NotificationSettings;
  dailyGoalMinutes: number;
  minutesToday: number;
  appearance: Appearance;
  tutorId: TutorId | null;
  topics: TopicId[];
  personality: Personality;
  placement: PlacementResult | null;
  hasPremium: boolean;
};

type OnboardingState = SavedOnboarding & {
  setName: (name: string) => void;
  setDailyGoalMinutes: (minutes: number) => void;
  setAppearance: (appearance: Appearance) => void;
  setNotifications: (patch: Partial<NotificationSettings>) => void;
  setTutorId: (id: TutorId) => void;
  toggleTopic: (id: TopicId) => void;
  setTrait: (id: TraitId, level: number) => void;
  setPlacement: (result: PlacementResult) => void;
  setHasPremium: (value: boolean) => void;
  completeOnboarding: () => void;
};

const DEFAULTS: SavedOnboarding = {
  isOnboarded: false,
  name: '',
  notifications: DEFAULT_NOTIFICATIONS,
  dailyGoalMinutes: DEFAULT_DAILY_GOAL,
  minutesToday: 0,
  appearance: 'dark',
  tutorId: null,
  topics: [],
  personality: DEFAULT_PERSONALITY,
  placement: null,
  hasPremium: false,
};

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<SavedOnboarding>(DEFAULTS);

  const update = (patch: Partial<SavedOnboarding>) =>
    setState((current) => ({ ...current, ...patch }));

  return (
    <OnboardingContext
      value={{
        ...state,
        setName: (name) => update({ name }),
        setDailyGoalMinutes: (dailyGoalMinutes) => update({ dailyGoalMinutes }),
        setAppearance: (appearance) => update({ appearance }),
        setNotifications: (patch) =>
          setState((current) => ({
            ...current,
            notifications: { ...current.notifications, ...patch },
          })),
        setTutorId: (tutorId) => update({ tutorId }),
        toggleTopic: (id) =>
          setState((current) => ({
            ...current,
            topics: current.topics.includes(id)
              ? current.topics.filter((t) => t !== id)
              : [...current.topics, id],
          })),
        setTrait: (id, level) =>
          setState((current) => ({
            ...current,
            personality: { ...current.personality, [id]: level },
          })),
        setPlacement: (placement) => update({ placement }),
        setHasPremium: (hasPremium) => update({ hasPremium }),
        completeOnboarding: () => update({ isOnboarded: true }),
      }}>
      {children}
    </OnboardingContext>
  );
}

export function useOnboarding() {
  const context = use(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
