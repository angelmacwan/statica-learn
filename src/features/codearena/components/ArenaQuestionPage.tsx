import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, PanelLeft, Search, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthProvider';
import { ARENA_QUESTIONS, DIFFICULTY_META, CATEGORIES } from '../questions';
import { runArenaCode } from '../arenaRunner';
import { getArenaProgress, getAllArenaProgress, saveArenaCode, recordArenaSubmission } from '../arenaFirestore';
import { ProblemPanel } from './ProblemPanel';
import { EditorPanel } from './EditorPanel';
import { SuccessBurst } from './SuccessBurst';
import type { Language, SubmissionResult, ArenaProgress } from '../types';

const AUTOSAVE_DELAY = 5000;
const RATE_LIMIT_MS = 3000;

export function ArenaQuestionPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const question = ARENA_QUESTIONS.find((q) => q.slug === slug);

  // Available languages for this question
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
  const [allProgress, setAllProgress] = useState<Record<string, ArenaProgress>>({});
  const [showBurst, setShowBurst] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Rate limiting & Auto-save state/refs
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [rateLimitNotice, setRateLimitNotice] = useState<string | null>(null);

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSubmitTime = useRef<number>(0);

  // Refs for tracking saved state and avoiding initial load overwrites
  const isLoadedRef = useRef<boolean>(false);
  const lastSavedCodeRef = useRef<string>('');
  const codeRef = useRef<string>(code);
  const languageRef = useRef<Language>(language);
  const questionIdRef = useRef<string | undefined>(question?.id);

  // Keep refs synchronized
  useEffect(() => {
    codeRef.current = code;
    languageRef.current = language;
    questionIdRef.current = question?.id;
  }, [code, language, question?.id]);

  // Flush auto-save function: ONLY saves if isLoadedRef is true AND code has changed from lastSavedCodeRef
  const flushAutoSave = useCallback(() => {
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
      autosaveTimer.current = null;
    }
    if (
      isLoadedRef.current &&
      user &&
      questionIdRef.current &&
      codeRef.current !== undefined &&
      codeRef.current !== lastSavedCodeRef.current
    ) {
      const qId = questionIdRef.current;
      const lang = languageRef.current;
      const c = codeRef.current;
      lastSavedCodeRef.current = c;
      saveArenaCode(user.uid, qId, lang, c);
    }
  }, [user]);

  // Flush on unmount
  useEffect(() => {
    return () => {
      flushAutoSave();
    };
  }, [flushAutoSave]);

  // Cooldown countdown timer interval
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRateLimitNotice(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  // Rate limit check function
  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const timeSinceLast = now - lastSubmitTime.current;
    if (timeSinceLast < RATE_LIMIT_MS) {
      const remainingSec = Math.ceil((RATE_LIMIT_MS - timeSinceLast) / 1000);
      setRateLimitNotice(`Please wait ${remainingSec}s`);
      setCooldownSeconds(remainingSec);
      return false;
    }
    lastSubmitTime.current = now;
    setRateLimitNotice(null);
    return true;
  }, []);

  // Load overall user progress for problem navigator sidebar
  useEffect(() => {
    if (!user) return;
    getAllArenaProgress(user.uid).then(setAllProgress);
  }, [user?.uid]);

  // Set default language when question changes
  useEffect(() => {
    if (!question) return;
    const initialLang: Language = question.starterCode?.sql ? 'sql' : 'python';
    setLanguage(initialLang);
  }, [question?.id]);

  // Load progress and restore saved code safely without triggering false auto-saves
  useEffect(() => {
    if (!question) return;
    isLoadedRef.current = false;
    setResult(null);

    const starter = question.starterCode[language] || '';

    if (!user) {
      setCode(starter);
      codeRef.current = starter;
      lastSavedCodeRef.current = starter;
      isLoadedRef.current = true;
      return;
    }

    getArenaProgress(user.uid, question.id).then((p) => {
      setProgress(p);
      const restoredCode =
        p?.savedCode?.[language] !== undefined && p.savedCode[language] !== ''
          ? p.savedCode[language]!
          : starter;

      setCode(restoredCode);
      codeRef.current = restoredCode;
      lastSavedCodeRef.current = restoredCode;
      isLoadedRef.current = true;
    });
  }, [question?.id, user?.uid, language]);

  const handleLanguageChange = useCallback(
    (newLang: Language) => {
      if (newLang === language) return;
      flushAutoSave();
      setLanguage(newLang);
    },
    [language, flushAutoSave]
  );

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      codeRef.current = newCode;
      if (!user || !question || !isLoadedRef.current) return;

      // Do nothing if code hasn't changed from what is already saved
      if (newCode === lastSavedCodeRef.current) return;

      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);

      const targetQId = question.id;
      const targetLang = language;

      // Save every 5 seconds only if code was updated
      autosaveTimer.current = setTimeout(() => {
        if (codeRef.current === newCode && newCode !== lastSavedCodeRef.current) {
          lastSavedCodeRef.current = newCode;
          saveArenaCode(user.uid, targetQId, targetLang, newCode);
        }
        autosaveTimer.current = null;
      }, AUTOSAVE_DELAY);
    },
    [user, question, language]
  );

  const handleRun = useCallback(async () => {
    if (!question) return;
    if (!checkRateLimit()) return;

    flushAutoSave();
    setRunning(true);
    setResult(null);
    try {
      const res = await runArenaCode(question, code, language);
      setResult(res);
    } finally {
      setRunning(false);
    }
  }, [question, code, language, checkRateLimit, flushAutoSave]);

  const handleSubmit = useCallback(async () => {
    if (!question || !user) return;
    if (!checkRateLimit()) return;

    flushAutoSave();
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

      const isPass = res.passed;
      const updatedProgress: ArenaProgress = {
        questionId: question.id,
        bestStatus: isPass || progress?.bestStatus === 'pass' ? 'pass' : 'fail',
        totalAttempts: (progress?.totalAttempts ?? 0) + 1,
        firstSolvedAt: isPass ? (progress?.firstSolvedAt ?? new Date()) : (progress?.firstSolvedAt ?? null),
        lastAttemptAt: new Date(),
        savedCode: { ...(progress?.savedCode ?? {}), [language]: code },
        passingSubmissions: isPass
          ? {
              ...(progress?.passingSubmissions ?? {}),
              [language]: {
                questionId: question.id,
                language,
                submittedCode: code,
                status: 'pass',
                passedAt: new Date(),
                testResults: res.testResults,
                stdout: res.stdout,
              },
            }
          : progress?.passingSubmissions,
      };

      setProgress(updatedProgress);
      setAllProgress((prev) => ({ ...prev, [question.id]: updatedProgress }));

      if (isPass) {
        setShowBurst(true);
      }
    } finally {
      setRunning(false);
    }
  }, [question, user, code, language, progress, checkRateLimit, flushAutoSave]);

  const handleReset = useCallback(() => {
    if (!question) return;
    const starter = question.starterCode[language] || '';
    setCode(starter);
    codeRef.current = starter;
    setResult(null);
    if (user) {
      saveArenaCode(user.uid, question.id, language, starter);
    }
  }, [question, language, user]);

  if (!question) {
    return (
      <div className="flex items-center justify-center h-screen bg-cream-50 text-gray-600 font-medium">
        Question not found.{' '}
        <Link to="/arena" className="ml-2 text-amber-700 underline font-semibold">
          Back to Arena
        </Link>
      </div>
    );
  }

  const solved = progress?.bestStatus === 'pass';

  const filteredQuestions = ARENA_QUESTIONS.filter((q) =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSolved = Object.values(allProgress).filter((p) => p.bestStatus === 'pass').length;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-cream-50 text-gray-900">
      {showBurst && <SuccessBurst onDone={() => setShowBurst(false)} />}

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/90 backdrop-blur-md border-b border-cream-200 flex-shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsSidebarOpen((v) => !v)}
            title={isSidebarOpen ? 'Hide problem list' : 'Show problem list'}
            className="p-1.5 rounded-lg text-gray-600 hover:text-amber-800 hover:bg-cream-100 transition-colors flex-shrink-0"
          >
            <PanelLeft size={18} />
          </button>
          <div className="h-4 w-px bg-cream-300 flex-shrink-0" />
          <Link
            to="/arena"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-amber-800 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={14} />
            CodeArena
          </Link>
          <span className="text-gray-300 flex-shrink-0">/</span>
          <span className="text-sm font-bold text-gray-900 truncate">{question.title}</span>
        </div>

        {solved && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100/80 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-bold">
            <Trophy size={13} className="text-emerald-700" />
            Solved
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Problem Navigator */}
        {isSidebarOpen && (
          <div className="w-72 flex-shrink-0 border-r border-cream-200 bg-white/80 backdrop-blur-sm flex flex-col overflow-hidden transition-all">
            {/* Sidebar Header */}
            <div className="p-3.5 border-b border-cream-200 bg-cream-50/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Problems</span>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded-full">
                  {totalSolved} / {ARENA_QUESTIONS.length} Solved
                </span>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problem..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-cream-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Scrollable Problem Items */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredQuestions.map((q) => {
                const isActive = q.slug === slug;
                const prog = allProgress[q.id];
                const isSolved = prog?.bestStatus === 'pass';
                const isAttempted = prog && prog.bestStatus !== 'unsolved' && !isSolved;
                const diffMeta = DIFFICULTY_META[q.difficulty];
                const catMeta = CATEGORIES[q.category];

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      flushAutoSave();
                      navigate(`/arena/${q.slug}`);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 group ${
                      isActive
                        ? 'bg-amber-100/70 border-amber-300 shadow-sm text-amber-950 font-semibold'
                        : 'border-transparent hover:bg-cream-100/70 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {/* Status Icon */}
                    <div className="mt-0.5 flex-shrink-0">
                      {isSolved ? (
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      ) : isAttempted ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-500 bg-amber-100" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>

                    {/* Problem Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs truncate font-medium">{q.title}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border flex-shrink-0 ${diffMeta.color}`}>
                          {diffMeta.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500">
                        <span>{catMeta?.emoji}</span>
                        <span className="truncate">{catMeta?.label}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
              {filteredQuestions.length === 0 && (
                <div className="p-4 text-center text-xs text-gray-400">
                  No problems match "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* Center: Problem Statement & Output */}
        <div className="w-[42%] min-w-[320px] border-r border-cream-200 bg-white overflow-hidden flex flex-col">
          <ProblemPanel
            question={question}
            result={result}
            running={running}
            solved={solved}
          />
        </div>

        {/* Right: Code Editor Panel */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <EditorPanel
            language={language}
            code={code}
            running={running}
            onLanguageChange={handleLanguageChange}
            onCodeChange={handleCodeChange}
            onRun={handleRun}
            onSubmit={handleSubmit}
            onReset={handleReset}
            availableLanguages={availableLanguages}
            cooldownSeconds={cooldownSeconds}
            rateLimitNotice={rateLimitNotice}
          />
        </div>
      </div>
    </div>
  );
}
