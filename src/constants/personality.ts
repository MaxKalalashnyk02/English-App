export type TraitId = 'toughness' | 'fun' | 'professional' | 'flirting' | 'corrections' | 'pace';

export type Trait = {
  id: TraitId;
  title: string;
  levels: [string, string, string];
  defaultLevel: number;
};

export const LEVEL_COUNT = 3;

export const TRAITS: Trait[] = [
  { id: 'toughness', title: 'Toughness', levels: ['Gentle', 'Balanced', 'Tough'], defaultLevel: 1 },
  { id: 'fun', title: 'Fun', levels: ['Serious', 'Balanced', 'Fun'], defaultLevel: 1 },
  {
    id: 'professional',
    title: 'Professional',
    levels: ['Casual', 'Balanced', 'Professional'],
    defaultLevel: 1,
  },
  { id: 'flirting', title: 'Flirting', levels: ['None', 'Charming', 'Flirty'], defaultLevel: 0 },
  {
    id: 'corrections',
    title: 'Corrections',
    levels: ['Big mistakes only', 'Balanced', 'Every mistake'],
    defaultLevel: 1,
  },
  { id: 'pace', title: 'Pace', levels: ['Relaxed', 'Steady', 'Intense'], defaultLevel: 1 },
];

export type Personality = Record<TraitId, number>;

export const DEFAULT_PERSONALITY = Object.fromEntries(
  TRAITS.map((t) => [t.id, t.defaultLevel])
) as Personality;
