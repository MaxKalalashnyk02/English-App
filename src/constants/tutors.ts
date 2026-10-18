export type TutorId = 'oliver' | 'sophie' | 'leo' | 'mia' | 'valentina' | 'jack';

export type Tutor = {
  id: TutorId;
  name: string;
  title: string;
};

export const TUTORS: Tutor[] = [
  { id: 'oliver', name: 'Oliver', title: 'Professor from London' },
  { id: 'sophie', name: 'Sophie', title: 'Doctor from Boston' },
  { id: 'leo', name: 'Leo', title: 'Charmer from LA' },
  { id: 'mia', name: 'Mia', title: 'Star from Sydney' },
];

export const SECRET_TUTORS: Tutor[] = [
  {
    id: 'valentina',
    name: 'Valentina',
    title: 'Charming Latina from Texas',
  },
  {
    id: 'jack',
    name: 'Jack',
    title: 'Hot businessman from NYC',
  },
];

export const ALL_TUTORS: Tutor[] = [...TUTORS, ...SECRET_TUTORS];

export const TUTOR_MODELS: Record<TutorId, number | null> = {
  oliver: null,
  sophie: null,
  leo: null,
  mia: null,
  valentina: null,
  jack: null,
};
