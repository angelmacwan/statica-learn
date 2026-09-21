import { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { Play, RotateCcw } from 'lucide-react';
import { runCode } from '@/lib/execution/runner';
import type { CodeBlock as CodeBlockType, ExecutionResult } from '@/types';

interface Props {
  block: CodeBlockType;
  onRun?: () => void;
}

const langExtension = {
  python: [python()],
  javascript: [javascript({ jsx: false })],
};

export function CodeBlock({ block, onRun }: Props) {
  const [code, setCode] = useState(block.starterCode);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setResult(null);
    onRun?.();
    const res = await runCode({ language: block.language, code });
    setResult(res);
    setRunning(false);
  }, [block.language, code, onRun]);

  const handleReset = () => {
    setCode(block.starterCode);
    setResult(null);
  };

  return (
    <div className="space-y-2">
      {/* Language badge */}
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
            className="btn-primary text-xs py-1.5 px-4"
          >
            <Play size={12} />
            {running ? 'Running…' : 'Run'}
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
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            autocompletion: true,
          }}
        />
      </div>

      {/* Output */}
      {result && (
        <div
          className={`rounded-xl p-4 font-mono text-sm whitespace-pre-wrap ${
            result.error
              ? 'bg-blush-50 text-red-700 border border-blush-200'
              : 'bg-gray-900 text-gray-100'
          }`}
        >
          {result.error ? `Error: ${result.error}` : result.stdout || '(no output)'}
        </div>
      )}
    </div>
  );
}
