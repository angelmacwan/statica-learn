import { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { Play, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { runCode } from '@/lib/execution/runner';
import { ResultTable } from '@/components/sql/ResultTable';
import { SchemaViewer } from '@/components/sql/SchemaViewer';
import type { ChallengeBlock as ChallengeBlockType, ExecutionResult } from '@/types';

interface Props {
  block: ChallengeBlockType;
  onComplete?: (passed: boolean) => void;
}

const langExtension = {
  python: [python()],
  javascript: [javascript({ jsx: false })],
  sql: [sql()],
};

export function ChallengeBlock({ block, onComplete }: Props) {
  const [code, setCode] = useState(block.starterCode);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [running, setRunning] = useState(false);

  const allPassed =
    Boolean(result?.testResults?.length) &&
    result!.testResults!.every((t) => t.passed) &&
    !result?.error;

  const handleRun = useCallback(async () => {
    setRunning(true);
    setResult(null);
    const res = await runCode({
      language: block.language,
      code,
      tests: block.tests,
      schema_sql: block.schema_sql,
      seed_sql: block.seed_sql,
      answer_sql: block.answer_sql,
      ordered: block.ordered,
    });
    setResult(res);
    setRunning(false);
    const passed = Boolean(res.testResults?.length) && res.testResults!.every((t) => t.passed) && !res.error;
    onComplete?.(passed);
  }, [block.language, block.tests, block.schema_sql, block.seed_sql, block.answer_sql, block.ordered, code, onComplete]);

  const handleReset = () => {
    setCode(block.starterCode);
    setResult(null);
  };

  return (
    <div className="card p-5 space-y-4">
      {/* Prompt */}
      <div className="space-y-1">
        <span className="pill pill-coral mb-2">Challenge</span>
        <p className="text-sm text-gray-700 leading-relaxed">{block.prompt}</p>
      </div>

      {/* Schema viewer if SQL challenge */}
      {block.language === 'sql' && block.schema_sql && (
        <SchemaViewer schemaSql={block.schema_sql} seedSql={block.seed_sql} />
      )}

      {/* Language badge + controls */}
      <div className="flex items-center justify-between">
        <span className="pill pill-mint capitalize">{block.language}</span>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="btn-ghost text-xs py-1.5 px-3">
            <RotateCcw size={12} />
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={running}
            className={`btn-primary text-xs py-1.5 px-4 ${allPassed ? 'bg-mint-400 hover:bg-mint-300' : ''}`}
          >
            <Play size={12} />
            {running ? 'Testing…' : allPassed ? ' All Passed' : 'Run Tests'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <CodeMirror
          value={code}
          onChange={setCode}
          extensions={langExtension[block.language]}
          theme={oneDark}
          className="text-sm"
          basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: true }}
        />
      </div>

      {/* SQL Result Table if available */}
      {result?.sqlResult && (
        <ResultTable result={result.sqlResult} title="Your Query Results" />
      )}

      {/* Error */}
      {result?.error && (
        <div className="bg-blush-50 text-red-700 border border-blush-200 rounded-xl p-3 font-mono text-xs whitespace-pre-wrap">
          {result.error}
        </div>
      )}

      {/* Non-SQL Stdout */}
      {result?.stdout && !result?.sqlResult && (
        <div className="bg-gray-900 text-gray-100 rounded-xl p-3 font-mono text-xs whitespace-pre-wrap">
          {result.stdout}
        </div>
      )}

      {/* Test results */}
      {result?.testResults && (
        <div className="space-y-1.5">
          {result.testResults.map((tr, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                tr.passed ? 'bg-mint-50 text-gray-700' : 'bg-blush-50 text-gray-700'
              }`}
            >
              {tr.passed ? (
                <CheckCircle2 size={15} className="text-mint-400 shrink-0" />
              ) : (
                <XCircle size={15} className="text-blush-300 shrink-0" />
              )}
              <span>{tr.description ?? `Test ${i + 1}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
