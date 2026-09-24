import { z } from 'zod';

// ─── Path ───────────────────────────────────────────────────────────────────

export const PathSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(['programming', 'data', 'ai', 'software-engineering', 'thinking']),
  difficulty: z.enum(['beginner', 'intermediate', 'advance']),
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
  language: z.enum(['python', 'javascript', 'sql']),
  starterCode: z.string(),
  solutionCode: z.string().optional(),
  schema_sql: z.string().optional(),
  seed_sql: z.string().optional(),
});

export const ChallengeBlockSchema = z.object({
  type: z.literal('challenge'),
  language: z.enum(['python', 'javascript', 'sql']),
  prompt: z.string(),
  starterCode: z.string(),
  tests: z.array(CodeTestSchema).optional().default([]),
  schema_sql: z.string().optional(),
  seed_sql: z.string().optional(),
  answer_sql: z.string().optional(),
  ordered: z.boolean().optional(),
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
  difficulty: z.enum(['beginner', 'intermediate', 'advance']),
  estimatedMinutes: z.number().int().positive(),
  concepts: z.array(z.string()),
  blocks: z.array(LessonBlockSchema),
});

export type Lesson = z.infer<typeof LessonSchema>;

// ─── Execution ───────────────────────────────────────────────────────────────

export interface ExecutionRequest {
  language: 'python' | 'javascript' | 'sql';
  code: string;
  tests?: CodeTest[];
  schema_sql?: string;
  seed_sql?: string;
  answer_sql?: string;
  ordered?: boolean;
}

export interface SqlQueryResult {
  columns: string[];
  rows: unknown[][];
  totalRows: number;
  truncated: boolean;
}

export interface ExecutionResult {
  stdout: string;
  error: string | null;
  testResults?: { passed: boolean; description?: string; actual?: unknown }[];
  sqlResult?: SqlQueryResult;
  expectedSqlResult?: { columns: string[]; rows: unknown[][] };
  returnValue?: unknown;
}

// ─── Firestore user data ─────────────────────────────────────────────────────

export type ContentWidthSetting = 'small' | 'normal' | 'large' | 'xl';

export const CONTENT_WIDTH_CLASSES: Record<ContentWidthSetting, string> = {
  small: 'max-w-xl',
  normal: 'max-w-3xl',
  large: 'max-w-5xl',
  xl: 'max-w-7xl',
};

export interface UserProfile {
  displayName: string;
  avatarUrl: string;
  avatarEmoji: string;
  contentWidth?: ContentWidthSetting;
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
