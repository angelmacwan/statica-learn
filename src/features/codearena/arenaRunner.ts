import { runCode } from '@/lib/execution/runner';
import type { ArenaQuestion, SubmissionResult, Language } from './types';

export async function runArenaCode(
  question: ArenaQuestion,
  code: string,
  language: Language
): Promise<SubmissionResult> {
  const result = await runCode(
    {
      code,
      language,
      tests: question.tests.map((t) => ({
        description: t.description,
        input: t.input,
        expectedOutput: t.expectedOutput,
      })),
      schema_sql: question.schema_sql,
      seed_sql: question.seed_sql,
      answer_sql: question.answer_sql,
      ordered: question.ordered,
    },
    15000
  );

  const testResults = (result.testResults ?? []).map((tr, i) => ({
    description: tr.description ?? `Test ${i + 1}`,
    passed: tr.passed,
    input: question.tests[i]?.input,
    expected: question.tests[i]?.expectedOutput,
  }));

  const passed =
    testResults.length > 0 && testResults.every((t) => t.passed) && !result.error;

  return {
    passed,
    testResults,
    stdout: result.stdout ?? '',
    error: result.error ?? null,
    sqlResult: result.sqlResult,
    expectedSqlResult: result.expectedSqlResult,
  };
}
