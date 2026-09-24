import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Terminal } from 'lucide-react';
import type { TerminalBlock as TerminalBlockType } from '@/types';

interface Props {
  block: TerminalBlockType;
  onComplete?: (passed: boolean) => void;
}

/** Normalize a command string for comparison:
 *  - collapse internal whitespace to single spaces
 *  - trim surrounding whitespace
 *  - lowercase
 */
function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase();
}

function check(input: string, accepted: string[]): boolean {
  const norm = normalize(input);
  return accepted.some((a) => normalize(a) === norm);
}

type LineState = { cmd: string; correct: boolean | null };

export function TerminalBlock({ block, onComplete }: Props) {
  const [lines, setLines] = useState<LineState[]>([]);
  const [current, setCurrent] = useState('');
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Split accepted answers into individual command lines so we can check
  // multi-line answers line by line, or single-line answers as a whole.
  const expectedLines = block.acceptedAnswers[0]
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const isMultiLine = expectedLines.length > 1;
  const allCorrect = checked && lines.every((l) => l.correct);

  useEffect(() => {
    inputRef.current?.focus();
  }, [lines]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitLine();
    }
  };

  function submitLine() {
    if (!current.trim()) return;

    if (isMultiLine) {
      const lineIndex = lines.length;
      const expected = expectedLines[lineIndex];
      const correct = expected ? check(current, [expected, ...block.acceptedAnswers.map(a => a.split('\n')[lineIndex]).filter(Boolean)]) : false;
      const newLines = [...lines, { cmd: current, correct }];
      setLines(newLines);
      setCurrent('');

      if (newLines.length >= expectedLines.length) {
        const passed = newLines.every((l) => l.correct);
        setChecked(true);
        onComplete?.(passed);
      }
    } else {
      const correct = check(current, block.acceptedAnswers);
      const newLines = [{ cmd: current, correct }];
      setLines(newLines);
      setCurrent('');
      setChecked(true);
      onComplete?.(correct);
    }
  }

  function reset() {
    setLines([]);
    setCurrent('');
    setChecked(false);
    setShowHint(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div className="card p-5 space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="pill pill-lavender flex items-center gap-1">
            <Terminal size={12} />
            Terminal
          </span>
          {allCorrect && (
            <span className="pill pill-mint flex items-center gap-1">
              <CheckCircle2 size={12} />
              Correct
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{block.prompt}</p>
      </div>

      {/* Terminal window */}
      <div
        className="bg-gray-950 rounded-xl p-4 font-mono text-sm space-y-1 cursor-text min-h-[80px]"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Submitted lines */}
        {lines.map((line, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-green-400 shrink-0">$</span>
            <span className="text-gray-100 flex-1">{line.cmd}</span>
            {line.correct === true && (
              <CheckCircle2 size={14} className="text-green-400 shrink-0 mt-0.5" />
            )}
            {line.correct === false && (
              <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
            )}
          </div>
        ))}

        {/* Active input line */}
        {!checked && (
          <div className="flex items-center gap-2">
            <span className="text-green-400 shrink-0">$</span>
            <input
              ref={inputRef}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-gray-100 outline-none caret-green-400 placeholder-gray-600"
              placeholder="type your command and press Enter"
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="none"
            />
          </div>
        )}

        {/* Feedback after check */}
        {checked && !allCorrect && (
          <div className="text-red-400 text-xs pt-1">
            Not quite. Click Reset to try again.
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button onClick={reset} className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1">
          <RotateCcw size={12} />
          Reset
        </button>
        {!checked && (
          <button
            onClick={submitLine}
            disabled={!current.trim()}
            className="btn-primary text-xs py-1.5 px-4"
          >
            Submit
          </button>
        )}
        {block.hint && !allCorrect && (
          <button
            onClick={() => setShowHint((v) => !v)}
            className="btn-ghost text-xs py-1.5 px-3 ml-auto"
          >
            {showHint ? 'Hide hint' : 'Hint'}
          </button>
        )}
      </div>

      {/* Hint */}
      {showHint && block.hint && (
        <div className="bg-lavender-50 border border-lavender-200 rounded-xl px-4 py-3 text-sm text-gray-600">
          {block.hint}
        </div>
      )}
    </div>
  );
}
