import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { sql } from '@codemirror/lang-sql';
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
  availableLanguages?: Language[];
}

const LANG_EXTENSIONS = {
  python: [python()],
  javascript: [javascript({ jsx: false })],
  sql: [sql()],
};

const LANG_LABELS: Record<Language, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  sql: 'SQL',
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
  availableLanguages = ['python', 'javascript', 'sql'],
}: EditorPanelProps) {
  return (
    <div className="flex flex-col h-full bg-gray-950 rounded-none overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-800 flex-shrink-0">
        {/* Language switcher */}
        <div className="flex rounded-lg overflow-hidden border border-gray-800 bg-gray-950 p-0.5">
          {availableLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                language === lang
                  ? 'bg-amber-600 text-white shadow-sm'
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
            className="p-1.5 text-gray-400 hover:text-amber-300 hover:bg-gray-800 transition-colors rounded-lg"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={onRun}
            disabled={running}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 text-amber-200 hover:bg-gray-700 border border-gray-700 disabled:opacity-50 transition-all shadow-sm"
          >
            <Play size={13} className="text-amber-400 fill-amber-400/20" />
            Run Code
          </button>
          <button
            onClick={onSubmit}
            disabled={running}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-500 disabled:opacity-50 transition-all shadow-sm"
          >
            <Send size={13} />
            Submit Solution
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
