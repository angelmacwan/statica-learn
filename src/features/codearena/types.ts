export type Language = 'python' | 'javascript';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Category =
  | 'math-magic'
  | 'string-sorcery'
  | 'list-adventures'
  | 'number-crunching'
  | 'prime-time'
  | 'loop-quest';

export interface TestCase {
  description: string;
  input: unknown[];
  expectedOutput: unknown;
}

export interface ArenaQuestion {
  id: string;
  slug: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  description: string; // markdown
  hint?: string;
  starterCode: {
    python: string;
    javascript: string;
  };
  tests: TestCase[];
  tags: string[];
}

export interface TestResult {
  description: string;
  passed: boolean;
  input?: unknown[];
  expected?: unknown;
  actual?: unknown;
}

export interface SubmissionResult {
  passed: boolean;
  testResults: TestResult[];
  stdout: string;
  error: string | null;
}

/** Firestore: users/{uid}/arena_attempts/{questionId} */
export interface ArenaAttempt {
  questionId: string;
  language: Language;
  status: 'pass' | 'fail' | 'error';
  submittedCode: string;
  testResults: TestResult[];
  stdout: string;
  error: string | null;
  attemptNumber: number;
  submittedAt: Date;
}

/** Firestore: users/{uid}/arena_progress/{questionId} */
export interface ArenaProgress {
  questionId: string;
  bestStatus: 'pass' | 'fail' | 'unsolved';
  totalAttempts: number;
  firstSolvedAt: Date | null;
  lastAttemptAt: Date;
  savedCode: { python: string; javascript: string };
}
