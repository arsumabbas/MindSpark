export enum AppView {
  HOME = 'HOME',
  FLASHCARDS = 'FLASHCARDS',
  QUIZ = 'QUIZ',
  DRILL = 'DRILL',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS'
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string; // The text of the correct option
  explanation: string;
}

export interface DrillItem {
  id: number;
  sentence: string;
  missingWord: string; // The word the user needs to guess
  displaySentence: string; // Sentence with _____ placeholder
}

export interface StudySession {
  topic: string;
  type: AppView;
  data: Flashcard[] | QuizQuestion[] | DrillItem[] | null;
}
