export type Skill = 'grammar' | 'vocabulary' | 'reading';
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type PlacementQuestion = {
  id: string;
  level: CefrLevel;
  difficulty: number;
  skill: Skill;
  passage?: string;
  prompt: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
};

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  { id: 'a1-1', level: 'A1', difficulty: -2.9, skill: 'grammar', prompt: 'She ___ a teacher.', options: ['is', 'are', 'am', 'be'], answer: 0 },
  { id: 'a1-2', level: 'A1', difficulty: -2.8, skill: 'grammar', prompt: 'I ___ from Spain.', options: ['am', 'is', 'are', 'be'], answer: 0 },
  { id: 'a1-3', level: 'A1', difficulty: -2.7, skill: 'vocabulary', prompt: 'What is the opposite of "hot"?', options: ['cold', 'warm', 'big', 'wet'], answer: 0 },
  { id: 'a1-4', level: 'A1', difficulty: -2.5, skill: 'grammar', prompt: 'There ___ two cats in the garden.', options: ['are', 'is', 'am', 'be'], answer: 0 },
  { id: 'a1-5', level: 'A1', difficulty: -2.4, skill: 'vocabulary', prompt: 'We eat ___ in the morning.', options: ['breakfast', 'dinner', 'lunch', 'supper'], answer: 0 },
  { id: 'a1-6', level: 'A1', difficulty: -2.3, skill: 'grammar', prompt: '___ you like coffee?', options: ['Do', 'Does', 'Are', 'Is'], answer: 0 },
  { id: 'a1-7', level: 'A1', difficulty: -2.2, skill: 'vocabulary', prompt: "My mother's brother is my ___.", options: ['uncle', 'cousin', 'nephew', 'aunt'], answer: 0 },
  { id: 'a1-8', level: 'A1', difficulty: -2.1, skill: 'grammar', prompt: 'He ___ to school every day.', options: ['goes', 'go', 'going', 'gone'], answer: 0 },

  { id: 'a2-1', level: 'A2', difficulty: -1.9, skill: 'grammar', prompt: 'Yesterday I ___ to the cinema.', options: ['went', 'go', 'have gone', 'was go'], answer: 0 },
  { id: 'a2-2', level: 'A2', difficulty: -1.8, skill: 'grammar', prompt: 'She is ___ than her sister.', options: ['taller', 'more tall', 'tallest', 'the taller'], answer: 0 },
  { id: 'a2-3', level: 'A2', difficulty: -1.6, skill: 'vocabulary', prompt: "He's very ___. He never shares anything.", options: ['selfish', 'generous', 'honest', 'friendly'], answer: 0 },
  { id: 'a2-4', level: 'A2', difficulty: -1.5, skill: 'grammar', prompt: "There isn't ___ milk in the fridge.", options: ['any', 'some', 'many', 'a'], answer: 0 },
  { id: 'a2-5', level: 'A2', difficulty: -1.4, skill: 'grammar', prompt: 'I ___ TV when you called me.', options: ['was watching', 'watched', 'am watching', 'watch'], answer: 0 },
  { id: 'a2-6', level: 'A2', difficulty: -1.3, skill: 'vocabulary', prompt: "I need to ___ an appointment with the dentist.", options: ['make', 'do', 'take', 'go'], answer: 0 },
  { id: 'a2-7', level: 'A2', difficulty: -1.2, skill: 'grammar', prompt: 'Have you ever ___ to London?', options: ['been', 'was', 'go', 'being'], answer: 0 },
  { id: 'a2-8', level: 'A2', difficulty: -1.1, skill: 'reading', passage: 'Anna works in a hospital. She starts at 7 a.m., so she gets up very early. After work, she likes to swim.', prompt: 'Why does Anna get up early?', options: ['She starts work at 7 a.m.', 'She likes to swim', 'She lives far away', 'She is a student'], answer: 0 },

  { id: 'b1-1', level: 'B1', difficulty: -0.9, skill: 'grammar', prompt: 'If it rains tomorrow, we ___ at home.', options: ['will stay', 'would stay', 'stayed', 'had stayed'], answer: 0 },
  { id: 'b1-2', level: 'B1', difficulty: -0.8, skill: 'grammar', prompt: "I've lived here ___ 2015.", options: ['since', 'for', 'from', 'during'], answer: 0 },
  { id: 'b1-3', level: 'B1', difficulty: -0.7, skill: 'vocabulary', prompt: "Can you ___ after my dog while I'm away?", options: ['look', 'take', 'care', 'watch'], answer: 0 },
  { id: 'b1-4', level: 'B1', difficulty: -0.5, skill: 'grammar', prompt: "I ___ play football as a child, but now I don't.", options: ['used to', 'use to', 'was used to', 'am used to'], answer: 0 },
  { id: 'b1-5', level: 'B1', difficulty: -0.4, skill: 'grammar', prompt: 'You ___ wear a seatbelt. It is the law.', options: ['must', 'might', 'could', 'would'], answer: 0 },
  { id: 'b1-6', level: 'B1', difficulty: -0.3, skill: 'vocabulary', prompt: 'The meeting was ___ because the manager was ill.', options: ['cancelled', 'refused', 'denied', 'rejected'], answer: 0 },
  { id: 'b1-7', level: 'B1', difficulty: -0.2, skill: 'grammar', prompt: 'This book ___ by millions of people.', options: ['has been read', 'has read', 'is reading', 'have been read'], answer: 0 },
  { id: 'b1-8', level: 'B1', difficulty: -0.1, skill: 'reading', passage: 'Tom usually takes the bus to work, but today he walked because the drivers were on strike.', prompt: 'Why did Tom walk today?', options: ["The buses weren't running", 'He wanted some exercise', 'He missed the bus', 'He enjoys walking'], answer: 0 },

  { id: 'b2-1', level: 'B2', difficulty: 0.1, skill: 'grammar', prompt: 'If I ___ more time, I would learn Japanese.', options: ['had', 'have', 'would have', 'had had'], answer: 0 },
  { id: 'b2-2', level: 'B2', difficulty: 0.2, skill: 'grammar', prompt: 'By the time we arrived, the film ___.', options: ['had already started', 'already started', 'has already started', 'was already starting'], answer: 0 },
  { id: 'b2-3', level: 'B2', difficulty: 0.3, skill: 'grammar', prompt: "I'm not used to ___ up so early.", options: ['getting', 'get', 'got', 'have got'], answer: 0 },
  { id: 'b2-4', level: 'B2', difficulty: 0.5, skill: 'vocabulary', prompt: 'The company had to ___ 200 workers because sales were falling.', options: ['lay off', 'lay down', 'lay out', 'lay up'], answer: 0 },
  { id: 'b2-5', level: 'B2', difficulty: 0.6, skill: 'grammar', prompt: 'She denied ___ the money.', options: ['taking', 'to take', 'take', 'to have take'], answer: 0 },
  { id: 'b2-6', level: 'B2', difficulty: 0.7, skill: 'grammar', prompt: 'The report must ___ by Friday.', options: ['be finished', 'finish', 'have finish', 'finishing'], answer: 0 },
  { id: 'b2-7', level: 'B2', difficulty: 0.8, skill: 'vocabulary', prompt: 'His explanation was so ___ that nobody could follow it.', options: ['convoluted', 'concise', 'coherent', 'candid'], answer: 0 },
  { id: 'b2-8', level: 'B2', difficulty: 0.9, skill: 'reading', passage: 'Although the new policy was meant to reduce traffic, critics argue that it has merely shifted congestion to nearby streets.', prompt: 'What do the critics think?', options: ['The traffic moved rather than decreased', 'The policy reduced traffic', 'The nearby streets are now empty', 'The policy is working well'], answer: 0 },

  { id: 'c1-1', level: 'C1', difficulty: 1.1, skill: 'grammar', prompt: 'Had I known about the problem, I ___ something.', options: ['would have done', 'would do', 'had done', 'will have done'], answer: 0 },
  { id: 'c1-2', level: 'C1', difficulty: 1.2, skill: 'grammar', prompt: "It's high time we ___ a decision.", options: ['made', 'make', 'will make', 'are making'], answer: 0 },
  { id: 'c1-3', level: 'C1', difficulty: 1.3, skill: 'grammar', prompt: '___ the bad weather, the event went ahead as planned.', options: ['Despite', 'Although', 'In spite', 'Even though'], answer: 0 },
  { id: 'c1-4', level: 'C1', difficulty: 1.4, skill: 'vocabulary', prompt: 'The talks reached a ___, with neither side willing to compromise.', options: ['stalemate', 'milestone', 'breakthrough', 'consensus'], answer: 0 },
  { id: 'c1-5', level: 'C1', difficulty: 1.6, skill: 'grammar', prompt: 'Not only ___ late, but he also forgot the tickets.', options: ['was he', 'he was', 'he is', 'did he be'], answer: 0 },
  { id: 'c1-6', level: 'C1', difficulty: 1.7, skill: 'vocabulary', prompt: 'She has a real ___ for languages. She speaks six fluently.', options: ['flair', 'flare', 'flavour', 'fluke'], answer: 0 },
  { id: 'c1-7', level: 'C1', difficulty: 1.8, skill: 'vocabulary', prompt: 'The politician tried to ___ the question by changing the subject.', options: ['evade', 'invade', 'provoke', 'endorse'], answer: 0 },
  { id: 'c1-8', level: 'C1', difficulty: 1.9, skill: 'reading', passage: "The critic's praise for the novel is, at best, lukewarm: she concedes its ambition but laments its execution.", prompt: "What is the critic's opinion of the novel?", options: ['Mixed, but mostly negative', 'Very enthusiastic', 'Completely neutral', 'Entirely hostile'], answer: 0 },

  { id: 'c2-1', level: 'C2', difficulty: 2.1, skill: 'vocabulary', prompt: "Don't ___ the gun. Wait until we have all the facts.", options: ['jump', 'leap', 'run', 'fire'], answer: 0 },
  { id: 'c2-2', level: 'C2', difficulty: 2.2, skill: 'grammar', prompt: 'The proposal, ___ merits are obvious, was nevertheless rejected.', options: ['whose', 'which', 'of which', 'that'], answer: 0 },
  { id: 'c2-3', level: 'C2', difficulty: 2.4, skill: 'grammar', prompt: 'Scarcely ___ the house when it started to pour.', options: ['had we left', 'we had left', 'did we leave', 'we left'], answer: 0 },
  { id: 'c2-4', level: 'C2', difficulty: 2.5, skill: 'vocabulary', prompt: 'The evidence was merely ___. Nothing proved he had been there.', options: ['circumstantial', 'substantial', 'consequential', 'conclusive'], answer: 0 },
  { id: 'c2-5', level: 'C2', difficulty: 2.6, skill: 'grammar', prompt: '___ he to resign, the board would appoint a successor at once.', options: ['Were', 'Had', 'Did', 'Would'], answer: 0 },
  { id: 'c2-6', level: 'C2', difficulty: 2.7, skill: 'vocabulary', prompt: 'His argument was ___: it sounded convincing but was deeply flawed.', options: ['specious', 'judicious', 'auspicious', 'conspicuous'], answer: 0 },
  { id: 'c2-7', level: 'C2', difficulty: 2.8, skill: 'vocabulary', prompt: 'She was ___ in her praise, applauding every minor achievement.', options: ['effusive', 'reticent', 'terse', 'laconic'], answer: 0 },
  { id: 'c2-8', level: 'C2', difficulty: 2.9, skill: 'reading', passage: 'Far from being a panacea, the reform has, if anything, exacerbated the very inequalities it purported to address.', prompt: 'What does the writer suggest about the reform?', options: ['It made the problem worse', 'It solved most of the problems', 'It had no effect at all', 'It was never put into practice'], answer: 0 },
];
