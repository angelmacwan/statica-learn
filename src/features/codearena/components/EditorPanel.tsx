import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Play, Send, RotateCcw } from 'lucide-react';
import type { Language } from '../types';

interface EditorPanelProps {
  language: Language;
  code: string;
  running: boolean;
  onLanguageChange: (lang: Language) => void;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
}

const LANG_EXTENSIONS = {
  python: [python()],
  javascript: [javascript({ jsx: false })],
};

const LANG_LABELS: Record<Language, string> = {
  python: 'Python',
  javascript: 'JavaScript',
};

export function EditorPanel({
  language,
  code,
  running,
  onLanguageChange,
  onCodeChange,
  onRun,
  onSubmit,
  onReset,
}: EditorPanelProps) {
  return (
    <div className="flex flex-col h-full bg-gray-950 rounded-none overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-800 flex-shrink-0">
        {/* Language switcher */}
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          {(['python', 'javascript'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                language === lang
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            title="Reset to starter code"
            className="p-1.5 text-gray-500 hover:text-gray-300 transition-colors rounded"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={onRun}
            disabled={running}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            <Play size={13} />
            Run
          </button>
          <button
            onClick={onSubmit}
            disabled={running}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            <Send size={13} />
            Submit
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={code}
          height="100%"
          theme={oneDark}
          extensions={LANG_EXTENSIONS[language]}
          onChange={onCodeChange}
          style={{ height: '100%', fontSize: '13px' }}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            tabSize: language === 'python' ? 4 : 2,
          }}
        />
      </div>
    </div>
  );
}
