import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CheckCircle2, XCircle, ChevronRight, Clock, Lightbulb } from 'lucide-react';
import { CATEGORIES, DIFFICULTY_META } from '../questions';
import type { ArenaQuestion, SubmissionResult } from '../types';

interface ProblemPanelProps {
  question: ArenaQuestion;
  result: SubmissionResult | null;
  running: boolean;
  solved: boolean;
}

export function ProblemPanel({ question, result, running, solved }: ProblemPanelProps) {
  const catMeta = CATEGORIES[question.category];
  const diffMeta = DIFFICULTY_META[question.difficulty];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${catMeta.color}`}>
            {catMeta.emoji} {catMeta.label}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${diffMeta.color}`}>
            {diffMeta.label}
          </span>
          {solved && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              <CheckCircle2 size={12} /> Solved
            </span>
          )}
        </div>
        <h1 className="text-xl font-bold text-gray-900">{question.title}</h1>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {/* Problem statement */}
        <div className="prose prose-sm max-w-none prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{question.description}</ReactMarkdown>
        </div>

        {/* Hint */}
        {question.hint && (
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-amber-700 select-none list-none">
              <Lightbulb size={14} />
              Show Hint
              <ChevronRight size={14} className="transition-transform group-open:rotate-90" />
            </summary>
            <p className="mt-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              {question.hint}
            </p>
          </details>
        )}

        {/* Results section */}
        {running && (
          <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
            <Clock size={14} />
            Running your code...
          </div>
        )}

        {result && !running && (
          <div className="space-y-3">
            {/* Overall verdict */}
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm ${
                result.passed
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : result.error
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {result.passed ? (
                <>
                  <CheckCircle2 size={16} />
                  All tests passed! Great job!
                </>
              ) : (
                <>
                  <XCircle size={16} />
                  {result.error ? 'Error in your code' : 'Some tests failed'}
                </>
              )}
            </div>

            {/* Error */}
            {result.error && (
              <div className="rounded-lg bg-gray-900 text-red-400 font-mono text-xs px-4 py-3 whitespace-pre-wrap overflow-x-auto">
                {result.error}
              </div>
            )}

            {/* stdout */}
            {result.stdout && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Output</p>
                <div className="rounded-lg bg-gray-900 text-green-300 font-mono text-xs px-4 py-3 whitespace-pre-wrap overflow-x-auto">
                  {result.stdout}
                </div>
              </div>
            )}

            {/* Test cases */}
            {result.testResults.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Test Cases ({result.testResults.filter((t) => t.passed).length}/{result.testResults.length} passed)
                </p>
                <div className="space-y-2">
                  {result.testResults.map((tr, i) => (
                    <div
                      key={i}
                      className={`rounded-lg border px-3 py-2.5 text-sm ${
                        tr.passed
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tr.passed ? (
                          <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle size={14} className="text-red-500 flex-shrink-0" />
                        )}
                        <span className={`font-medium ${tr.passed ? 'text-green-800' : 'text-red-800'}`}>
                          {tr.description}
                        </span>
                      </div>
                      {!tr.passed && tr.input !== undefined && (
                        <div className="mt-1.5 pl-6 space-y-0.5 font-mono text-xs text-gray-600">
                          <div>Input: {JSON.stringify(tr.input)}</div>
                          <div>Expected: {JSON.stringify(tr.expected)}</div>
                        </div>
                      )}
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
