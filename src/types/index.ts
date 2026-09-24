import { z } from 'zod';

// ─── Path ───────────────────────────────────────────────────────────────────

export const PathSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(['programming', 'data', 'ai', 'software-engineering', 'thinking']),
  difficulty: z.enum(['intro', 'easy', 'medium', 'hard']),
  moduleIds: z.array(z.string()),
  published: z.boolean(),
});

export type Path = z.infer<typeof PathSchema>;

// ─── Lesson blocks ──────────────────────────────────────────────────────────

export const TextBlockSchema = z.object({
  type: z.literal('text'),
  content: z.string(),
});

export const MultipleChoiceBlockSchema = z.object({
  type: z.literal('multipleChoice'),
  question: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number().int().nonnegative(),
  explanation: z.string().optional(),
});

export const CodeTestSchema = z.object({
  input: z.unknown(),
  expectedOutput: z.unknown(),
  description: z.string().optional(),
});

export const CodeBlockSchema = z.object({
  type: z.literal('code'),
  language: z.enum(['python', 'javascript']),
  starterCode: z.string(),
  solutionCode: z.string().optional(),
});

export const ChallengeBlockSchema = z.object({
  type: z.literal('challenge'),
  language: z.enum(['python', 'javascript']),
  prompt: z.string(),
  starterCode: z.string(),
  tests: z.array(CodeTestSchema),
});

export const TerminalBlockSchema = z.object({
  type: z.literal('terminal'),
  prompt: z.string(),
  acceptedAnswers: z.array(z.string()),
  hint: z.string().optional(),
});

export const LessonBlockSchema = z.discriminatedUnion('type', [
  TextBlockSchema,
  MultipleChoiceBlockSchema,
  CodeBlockSchema,
  ChallengeBlockSchema,
  TerminalBlockSchema,
]);

export type TextBlock = z.infer<typeof TextBlockSchema>;
export type MultipleChoiceBlock = z.infer<typeof MultipleChoiceBlockSchema>;
export type CodeBlock = z.infer<typeof CodeBlockSchema>;
export type ChallengeBlock = z.infer<typeof ChallengeBlockSchema>;
export type TerminalBlock = z.infer<typeof TerminalBlockSchema>;
export type CodeTest = z.infer<typeof CodeTestSchema>;
export type LessonBlock = z.infer<typeof LessonBlockSchema>;

// ─── Lesson ─────────────────────────────────────────────────────────────────

export const LessonSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  pathId: z.string(),
  moduleId: z.string(),
  difficulty: z.enum(['intro', 'easy', 'medium', 'hard']),
  estimatedMinutes: z.number().int().positive(),
  concepts: z.array(z.string()),
  blocks: z.array(LessonBlockSchema),
});

export type Lesson = z.infer<typeof LessonSchema>;

// ─── Execution ───────────────────────────────────────────────────────────────

export interface ExecutionRequest {
  language: 'python' | 'javascript';
  code: string;
  tests?: CodeTest[];
}

export interface ExecutionResult {
  stdout: string;
  error: string | null;
  testResults?: { passed: boolean; description?: string }[];
}

// ─── Firestore user data ─────────────────────────────────────────────────────

export interface UserProfile {
  displayName: string;
  avatarUrl: string;
  avatarEmoji: string;
  createdAt: Date;
}

export type ProgressStatus = 'not_started' | 'started' | 'completed';

export interface LessonProgress {
  pathId: string;
  status: ProgressStatus;
  score: number | null;
  attempts: number;
  startedAt: Date | null;
  completedAt: Date | null;
  lastAccessedAt: Date;
}

export type ActivityType =
  | 'lesson_started'
  | 'lesson_completed'
  | 'question_answered'
  | 'code_run'
  | 'path_started';

export interface Activity {
  type: ActivityType;
  metadata: Record<string, unknown>;
  createdAt: Date;
}
