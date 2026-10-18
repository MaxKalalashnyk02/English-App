export type TopicId =
  | 'humor'
  | 'movies'
  | 'music'
  | 'tech'
  | 'art'
  | 'travel'
  | 'food'
  | 'sports'
  | 'business'
  | 'science'
  | 'gaming'
  | 'fashion'
  | 'books'
  | 'nature'
  | 'history'
  | 'psychology';

export type Topic = { id: TopicId; label: string; emoji: string };

export const TOPICS: Topic[] = [
  { id: 'humor', label: 'Humor', emoji: '😂' },
  { id: 'movies', label: 'Movies & TV', emoji: '🎬' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'tech', label: 'Tech', emoji: '💻' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'business', label: 'Business', emoji: '💼' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'books', label: 'Books', emoji: '📚' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'history', label: 'History', emoji: '🏛️' },
  { id: 'psychology', label: 'Psychology', emoji: '🧠' },
];

export const MIN_TOPICS = 3;
