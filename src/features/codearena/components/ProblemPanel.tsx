import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { CheckCircle2, XCircle, ChevronRight, Clock, Lightbulb, Terminal, Code2 } from 'lucide-react';
import { CATEGORIES, DIFFICULTY_META } from '../questions';
import { SchemaViewer } from '@/components/sql/SchemaViewer';
import { ResultTable } from '@/components/sql/ResultTable';
import type { ArenaQuestion, SubmissionResult } from '../types';

interface ProblemPanelProps {
  question: ArenaQuestion;
  result: SubmissionResult | null;
  running: boolean;
  solved: boolean;
}

const formatVal = (v: unknown): string => {
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'string') return `"${v}"`;
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
};

export function ProblemPanel({ question, result, running, solved }: ProblemPanelProps) {
  const catMeta = CATEGORIES[question.category] || { label: question.category, emoji: '📊', color: 'bg-amber-50 text-amber-800 border-amber-200' };
  const diffMeta = DIFFICULTY_META[question.difficulty];

  // Primary function return output (e.g. top-level return value or first test case actual output)
  const functionOutput = result?.returnValue !== undefined ? result.returnValue : result?.testResults?.[0]?.actual;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-cream-200 flex-shrink-0 bg-cream-50/50">
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${catMeta.color}`}>
            {catMeta.emoji} {catMeta.label}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${diffMeta.color}`}>
            {diffMeta.label}
          </span>
          {solved && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
              <CheckCircle2 size={12} /> Solved
            </span>
          )}
        </div>
        <h1 className="text-xl font-bold text-gray-900">{question.title}</h1>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {/* Schema Viewer if SQL question */}
        {question.schema_sql && (
          <SchemaViewer schemaSql={question.schema_sql} seedSql={question.seed_sql} />
        )}

        {/* Problem statement */}
        <div className="prose prose-sm max-w-none text-gray-800 prose-headings:text-gray-900 prose-code:bg-cream-100 prose-code:text-amber-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 prose-pre:text-gray-100">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{question.description}</ReactMarkdown>
        </div>

        {/* Hint */}
        {question.hint && (
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-amber-700 select-none list-none hover:text-amber-800">
              <Lightbulb size={14} className="text-amber-500" />
              Show Hint
              <ChevronRight size={14} className="transition-transform group-open:rotate-90" />
            </summary>
            <p className="mt-2 text-sm text-amber-900 bg-amber-50/80 border border-amber-200/80 rounded-xl px-3.5 py-2.5 leading-relaxed">
              {question.hint}
            </p>
          </details>
        )}

        {/* Running state */}
        {running && (
          <div className="flex items-center gap-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 animate-pulse">
            <Clock size={15} />
            Running your code & evaluating test cases...
          </div>
        )}

        {/* Results section */}
        {result && !running && (
          <div className="space-y-4 pt-2 border-t border-cream-200">
            {/* Overall verdict */}
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm shadow-sm ${
                result.passed
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {result.passed ? (
                <>
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  <span>All test cases passed! Fantastic work!</span>
                </>
              ) : (
                <>
                  <XCircle size={18} className="text-rose-600 flex-shrink-0" />
                  <span>{result.error ? 'Execution error in your code' : 'Some test cases failed. See details below.'}</span>
                </>
              )}
            </div>

            {/* SQL result table */}
            {result.sqlResult && (
              <ResultTable result={result.sqlResult} title="Your Query Results" />
            )}

            {/* Error output */}
            {result.error && (
              <div>
                <p className="text-xs font-bold text-rose-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <XCircle size={13} /> Execution Error
                </p>
                <div className="rounded-xl bg-rose-950 text-rose-300 font-mono text-xs p-3.5 whitespace-pre-wrap overflow-x-auto border border-rose-800/50 shadow-inner">
                  {result.error}
                </div>
              </div>
            )}

            {/* STD OUT block */}
            {result.stdout ? (
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Terminal size={13} className="text-amber-600" /> Console Output (STD OUT)
                </p>
                <div className="rounded-xl bg-gray-900 text-emerald-400 font-mono text-xs p-3.5 whitespace-pre-wrap overflow-x-auto border border-gray-800 shadow-inner">
                  {result.stdout}
                </div>
              </div>
            ) : null}

            {/* Function Output block */}
            {functionOutput !== undefined && !result.sqlResult && (
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Code2 size={13} className="text-indigo-600" /> Function Output
                </p>
                <div className="rounded-xl bg-slate-900 text-slate-100 font-mono text-xs p-3.5 whitespace-pre-wrap overflow-x-auto border border-slate-800 shadow-inner">
                  {formatVal(functionOutput)}
                </div>
              </div>
            )}

            {/* Test cases with Expected vs Code Returned */}
            {result.testResults.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Test Cases ({result.testResults.filter((t) => t.passed).length}/{result.testResults.length} passed)
                  </p>
                </div>
                <div className="space-y-3">
                  {result.testResults.map((tr, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-3.5 text-xs transition-all ${
                        tr.passed
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-rose-200 bg-rose-50/40 shadow-sm'
                      }`}
                    >
                      {/* Test title header */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {tr.passed ? (
                            <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                          ) : (
                            <XCircle size={15} className="text-rose-500 flex-shrink-0" />
                          )}
                          <span className={`font-semibold ${tr.passed ? 'text-emerald-900' : 'text-rose-900'}`}>
                            {tr.description}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            tr.passed
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {tr.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>

                      {/* Inputs if present */}
                      {tr.input !== undefined && tr.input.length > 0 && (
                        <div className="mb-2 text-[11px] text-gray-600 font-mono bg-white/70 rounded-md px-2.5 py-1 border border-gray-200/60">
                          <span className="font-semibold text-gray-500">Input: </span>
                          {JSON.stringify(tr.input)}
                        </div>
                      )}

                      {/* Expected vs Returned Comparison Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {/* Expected */}
                        <div className="rounded-lg bg-white border border-gray-200 p-2.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                            Expected
                          </div>
                          <code className="text-emerald-700 font-mono text-xs font-medium block whitespace-pre-wrap break-all">
                            {formatVal(tr.expected)}
                          </code>
                        </div>

                        {/* Code Returned */}
                        <div
                          className={`rounded-lg bg-white border p-2.5 ${
                            tr.passed ? 'border-emerald-200' : 'border-rose-200'
                          }`}
                        >
                          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                            Code Returned
                          </div>
                          <code
                            className={`font-mono text-xs font-medium block whitespace-pre-wrap break-all ${
                              tr.passed ? 'text-emerald-700' : 'text-rose-600 font-semibold'
                            }`}
                          >
                            {formatVal(tr.actual)}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
