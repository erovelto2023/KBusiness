
export interface Program {
  id: string;
  name: string;
  category: string;
  commission: string;
  platform: string;
  description: string;
  image?: string;
  sales?: number;
  earned?: number;
  isFavorite?: boolean;
}

export interface AffiliateLink {
  id: string;
  programName: string;
  link: string;
  notes?: string;
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  route?: string; // Optional route for navigation
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Benefit {
  id: string;
  text: string;
}

export interface BlogPost {
  id?: string; // Firestore document ID
  title: string;
  slug: string;
  content: string; // HTML or Quill Delta JSON
  tags: string[];
  author: string;
  date: string; // ISO string or formatted
  featuredImage?: string;
  status?: 'Draft' | 'Published';
  views?: number;
}

// --- QUIZ BUILDER TYPES ---

export type QuizQuestionType =
  | 'multiple_choice'
  | 'multiple_select'
  | 'true_false'
  | 'fill_blank'
  | 'matching'
  | 'short_answer'
  | 'essay'
  | 'numerical'
  | 'drag_drop'
  | 'hotspot'
  | 'ordering'
  | 'matrix';

export interface Quiz {
  id?: string;
  title: string;
  description?: string;
  sections: QuizSection[];
  settings: QuizSettings;
  questionBank?: QuizQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizSection {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  text: string;
  options?: QuizOption[]; // For MCQ, matching, etc.
  correctAnswers?: string[] | number[]; // IDs or values
  explanation?: string;
  points?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  meta?: Record<string, any>; // For extensibility (e.g., image, audio, etc.)
}

export interface QuizOption {
  id: string;
  text: string;
  matchId?: string; // For matching questions
  isCorrect?: boolean; // For MCQ
}

export interface QuizSettings {
  timeLimit?: number; // seconds
  attemptLimit?: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  visibility?: 'always' | 'scheduled' | 'hidden';
  password?: string;
  allowLateSubmission?: boolean;
  autoSubmitOnTime?: boolean;
  grading: 'auto' | 'manual' | 'mixed';
  feedback: 'instant' | 'delayed' | 'none';
  partialCredit?: boolean;
  rubric?: string; // For essay/manual grading
}

