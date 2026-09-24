import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthProvider';
import { ARENA_QUESTIONS } from '../questions';
import { runArenaCode } from '../arenaRunner';
import { getArenaProgress, saveArenaCode, recordArenaSubmission } from '../arenaFirestore';
import { ProblemPanel } from './ProblemPanel';
import { EditorPanel } from './EditorPanel';
import { SuccessBurst } from './SuccessBurst';
import type { Language, SubmissionResult, ArenaProgress } from '../types';

const AUTOSAVE_DELAY = 1500;

export function ArenaQuestionPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const question = ARENA_QUESTIONS.find((q) => q.slug === slug);

  // Determine available languages for this question
  const availableLanguages = (['sql', 'python', 'javascript'] as Language[]).filter(
    (lang) => question?.starterCode?.[lang] !== undefined
  );
  if (availableLanguages.length === 0) {
    availableLanguages.push('python', 'javascript');
  }

  const defaultLang: Language = question?.starterCode?.sql ? 'sql' : 'python';
  const [language, setLanguage] = useState<Language>(defaultLang);
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [progress, setProgress] = useState<ArenaProgress | null>(null);
  const [showBurst, setShowBurst] = useState(false);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Set default language when question changes
  useEffect(() => {
    if (!question) return;
    const initialLang: Language = question.starterCode?.sql ? 'sql' : 'python';
    setLanguage(initialLang);
  }, [question?.id]);

  // Load progress and restore saved code
  useEffect(() => {
    if (!question) return;
    setResult(null);
    const starter = question.starterCode[language] || '';
    setCode(starter);

    if (!user) return;
    getArenaProgress(user.uid, question.id).then((p) => {
      setProgress(p);
      if (p?.savedCode?.[language]) {
        setCode(p.savedCode[language]!);
      }
    });
  }, [question?.id, user?.uid, language]);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      if (!user || !question) return;
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => {
        saveArenaCode(user.uid, question.id, language, newCode);
      }, AUTOSAVE_DELAY);
    },
    [user, question, language]
  );

  const handleRun = useCallback(async () => {
    if (!question) return;
    setRunning(true);
    setResult(null);
    try {
      const res = await runArenaCode(question, code, language);
      setResult(res);
    } finally {
      setRunning(false);
    }
  }, [question, code, language]);

  const handleSubmit = useCallback(async () => {
    if (!question || !user) return;
    setRunning(true);
    setResult(null);
    try {
      const res = await runArenaCode(question, code, language);
      setResult(res);

      await recordArenaSubmission({
        userId: user.uid,
        questionId: question.id,
        language,
        submittedCode: code,
        status: res.error ? 'error' : res.passed ? 'pass' : 'fail',
        testResults: res.testResults,
        stdout: res.stdout,
        error: res.error,
      });

      if (res.passed) {
        setProgress((prev) => ({
          questionId: question.id,
          bestStatus: 'pass',
          totalAttempts: (prev?.totalAttempts ?? 0) + 1,
          firstSolvedAt: prev?.firstSolvedAt ?? new Date(),
          lastAttemptAt: new Date(),
          savedCode: { ...(prev?.savedCode ?? { python: '', javascript: '' }), [language]: code },
        }));
        setShowBurst(true);
      }
    } finally {
      setRunning(false);
    }
  }, [question, user, code, language]);

  const handleReset = useCallback(() => {
    if (!question) return;
    setCode(question.starterCode[language] || '');
    setResult(null);
  }, [question, language]);

  if (!question) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Question not found.{' '}
        <Link to="/arena" className="ml-2 text-indigo-600 underline">
          Back to Arena
        </Link>
      </div>
    );
  }

  const solved = progress?.bestStatus === 'pass';

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {showBurst && <SuccessBurst onDone={() => setShowBurst(false)} />}

      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-200 flex-shrink-0 z-10">
        <Link
          to="/arena"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={15} />
          CodeArena
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-900 truncate">{question.title}</span>
        {solved && (
          <span className="ml-auto flex items-center gap-1 text-xs font-medium text-amber-600">
            <Trophy size={13} />
            Solved
          </span>
        )}
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Problem + Results */}
        <div className="w-[42%] min-w-[320px] border-r border-gray-200 bg-white overflow-hidden flex flex-col">
          <ProblemPanel
            question={question}
            result={result}
            running={running}
            solved={solved}
          />
        </div>

        {/* Right: Editor */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <EditorPanel
            language={language}
            code={code}
            running={running}
            onLanguageChange={setLanguage}
            onCodeChange={handleCodeChange}
            onRun={handleRun}
            onSubmit={handleSubmit}
            onReset={handleReset}
            availableLanguages={availableLanguages}
          />
        </div>
      </div>
    </div>
  );
}
