export type Trait = 'Openness' | 'Conscientiousness' | 'Extraversion' | 'Agreeableness' | 'Neuroticism';

export interface Question {
  id: number;
  text: string;
  trait: Trait;
  reverse: boolean;
}

export const questions: Question[] = [
  // Openness
  { id: 1, text: "I enjoy exploring new ideas and unconventional approaches to problems.", trait: "Openness", reverse: false },
  { id: 2, text: "I have a strong interest in art, music, or other creative activities.", trait: "Openness", reverse: false },
  { id: 3, text: "I prefer familiar routines over trying new experiences.", trait: "Openness", reverse: true },
  { id: 4, text: "I like thinking about abstract concepts and theories.", trait: "Openness", reverse: false },

  // Conscientiousness
  { id: 5, text: "I complete tasks thoroughly and pay close attention to detail.", trait: "Conscientiousness", reverse: false },
  { id: 6, text: "I plan ahead and organize my work before starting.", trait: "Conscientiousness", reverse: false },
  { id: 7, text: "I often leave tasks unfinished or postpone them until the last moment.", trait: "Conscientiousness", reverse: true },
  { id: 8, text: "I keep my commitments and follow through on responsibilities.", trait: "Conscientiousness", reverse: false },

  // Extraversion
  { id: 9, text: "I feel energized when I am around other people.", trait: "Extraversion", reverse: false },
  { id: 10, text: "I enjoy being the centre of attention in social settings.", trait: "Extraversion", reverse: false },
  { id: 11, text: "I prefer spending time alone rather than in groups.", trait: "Extraversion", reverse: true },
  { id: 12, text: "I find it easy to start conversations with new people.", trait: "Extraversion", reverse: false },

  // Agreeableness
  { id: 13, text: "I try to be considerate and cooperative with others.", trait: "Agreeableness", reverse: false },
  { id: 14, text: "I trust that most people have good intentions.", trait: "Agreeableness", reverse: false },
  { id: 15, text: "I often argue or compete with others rather than cooperate.", trait: "Agreeableness", reverse: true },
  { id: 16, text: "I enjoy helping others solve their problems.", trait: "Agreeableness", reverse: false },

  // Neuroticism
  { id: 17, text: "I often feel anxious or worried about things.", trait: "Neuroticism", reverse: false },
  { id: 18, text: "My mood changes quickly and unpredictably.", trait: "Neuroticism", reverse: false },
  { id: 19, text: "I remain calm and composed even under pressure.", trait: "Neuroticism", reverse: true },
  { id: 20, text: "I get stressed easily by minor setbacks.", trait: "Neuroticism", reverse: false },
];
