import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext.jsx';
import MazeCanvas from '../components/MazeCanvas.jsx';
import GameCodeEditor from '../components/GameCodeEditor.jsx';
import { generateMaze, VirtualMaze } from '../game/MazeEngine.js';
import { MazeExecutor } from '../game/MazeExecutor.js';

// ── Maze sizes ─────────────────────────────────────────────────────────────
const MAZE_SIZES = [
  { id: '3x3',   size: 3,  fogOfWar: false, label: '3 × 3',   tag: 'Visible' },
  { id: '5x5',   size: 5,  fogOfWar: false, label: '5 × 5',   tag: 'Visible' },
  { id: '8x8',   size: 8,  fogOfWar: true,  label: '8 × 8',   tag: 'Fog' },
  { id: '12x12', size: 12, fogOfWar: true,  label: '12 × 12', tag: 'Fog' },
  { id: '16x16', size: 16, fogOfWar: true,  label: '16 × 16', tag: 'Fog' },
  { id: '20x20', size: 20, fogOfWar: true,  label: '20 × 20', tag: 'Fog' },
  { id: '24x24', size: 24, fogOfWar: true,  label: '24 × 24', tag: 'Fog' },
  { id: '32x32', size: 32, fogOfWar: true,  label: '32 × 32', tag: 'Fog' },
];

const DEFAULT_CODE =
`# Robot API:
#   move_forward()   – move one step
#   turn_left()      – rotate counter-clockwise
#   turn_right()     – rotate clockwise
#   wall_front()     – True if wall ahead
#   wall_left()      – True if wall to the left
#   wall_right()     – True if wall to the right
#   position()       – returns (x, y)
#   direction()      – returns "NORTH" / "EAST" / "SOUTH" / "WEST"
#   at_goal()        – True when you've reached the 🏁
#
# Score = moves + turns × 0.25  (lower is better)

while not at_goal():
    if not wall_front():
        move_forward()
    else:
        turn_right()
`;

// ── Constants ──────────────────────────────────────────────────────────────
const SKULPT_CDN    = 'https://skulpt.org/js/skulpt.min.js';
const SKULPT_STDLIB = 'https://skulpt.org/js/skulpt-stdlib.js';
const STORAGE_KEY   = 'statica-maze-solver-v2';
const CODE_KEY      = STORAGE_KEY + '-code';
const SCORES_KEY    = STORAGE_KEY + '-scores';

const DIR_NAMES = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

// ── Skulpt loader ──────────────────────────────────────────────────────────
function loadScript(src, checkGlobal) {
  return new Promise((resolve, reject) => {
    if (checkGlobal && checkGlobal()) { resolve(); return; }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (!checkGlobal) { resolve(); return; }
      existing.addEventListener('load', resolve);
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ── Goal: always center ────────────────────────────────────────────────────
function getGoal(size) {
  return { gx: Math.floor(size / 2), gy: Math.floor(size / 2) };
}


function loadScores() {
  try { return JSON.parse(localStorage.getItem(SCORES_KEY) || '{}'); } catch { return {}; }
}
function saveScores(data) {
  try { localStorage.setItem(SCORES_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

// ── Icons ──────────────────────────────────────────────────────────────────
const PlayIcon    = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><polygon points="4,2 14,8 4,14"/></svg>;
const StopIcon    = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="3" width="10" height="10" rx="1"/></svg>;
const RefreshIcon = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8a5 5 0 1 0 1-3"/><polyline points="1,3 3,8 8,6"/></svg>;
const NewMazeIcon = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="12" height="12" rx="1"/><path d="M6 2v3M10 11v3M2 6h3M11 10h3M5 10h3M8 5v3"/></svg>;
const SunIcon     = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="3"/><line x1="8" y1="1" x2="8" y2="3"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="1" y1="8" x2="3" y2="8"/><line x1="13" y1="8" x2="15" y2="8"/><line x1="3.05" y1="3.05" x2="4.46" y2="4.46"/><line x1="11.54" y1="11.54" x2="12.95" y2="12.95"/><line x1="3.05" y1="12.95" x2="4.46" y2="11.54"/><line x1="11.54" y1="4.46" x2="12.95" y2="3.05"/></svg>;
const MoonIcon    = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 10.5a5.5 5.5 0 1 1-5-5 5.5 5.5 0 0 0 5 5z"/></svg>;
const EyeIcon     = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/></svg>;
const EyeOffIcon  = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M13 6.5C13 6.5 11 10 8 10s-5-3.5-5-3.5"/><line x1="3" y1="3" x2="13" y2="13"/></svg>;
const TrophyIcon  = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 1h6v5a3 3 0 0 1-6 0V1z"/><path d="M2 3h3M11 3h3M8 9v4M5 15h6"/></svg>;
const CheckIcon   = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,8 6,11 13,4"/></svg>;

// Animation speed scaler depending on maze size and context
const getAnimSpeed = (mazeSize, isSubmit) => {
  if (isSubmit) {
    if (mazeSize <= 5) return 80;
    if (mazeSize <= 8) return 40;
    if (mazeSize <= 16) return 20;
    return 10; // extremely fast for large mazes during submission
  } else {
    if (mazeSize <= 5) return 120;
    if (mazeSize <= 8) return 80;
    if (mazeSize <= 16) return 50;
    return 30;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
export default function MazeSolverModule() {
  const { isDark, toggleTheme } = useTheme();

  // ── Skulpt ─────────────────────────────────────────────────────────────────
  const [skulptReady, setSkulptReady] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        await loadScript(SKULPT_CDN, () => window.Sk);
        await loadScript(SKULPT_STDLIB, () => window.Sk && window.Sk.builtinFiles);
        setSkulptReady(true);
      } catch (e) { console.error('Skulpt load failed', e); }
    })();
  }, []);

  // ── Selected maze size ─────────────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState(MAZE_SIZES[0].id);
  const mazeConfig = MAZE_SIZES.find(m => m.id === selectedId) ?? MAZE_SIZES[0];
  const { size, fogOfWar } = mazeConfig;

  // ── Code ───────────────────────────────────────────────────────────────────
  const [editorCode, setEditorCodeState] = useState(() => {
    try {
      const raw = localStorage.getItem(CODE_KEY);
      if (!raw) return DEFAULT_CODE;
      if (raw.startsWith('{')) {
        const parsed = JSON.parse(raw);
        const keys = Object.keys(parsed);
        if (keys.length > 0) return parsed[keys[0]] || DEFAULT_CODE;
      }
      return raw;
    } catch {
      return DEFAULT_CODE;
    }
  });

  const setEditorCode = useCallback((code) => {
    setEditorCodeState(code);
    try {
      localStorage.setItem(CODE_KEY, code);
    } catch { /* ignore */ }
  }, []);

  // ── Best scores per size ───────────────────────────────────────────────────
  const [bestScores, setBestScores] = useState(loadScores);

  // ── Maze nonce — increment to regenerate ──────────────────────────────────
  const [mazeNonce, setMazeNonce] = useState(0);

  // ── Maze data — derived, no setState in effects ────────────────────────────
  const mazeData = useMemo(() => {
    const walls = generateMaze(size, size);
    const { gx, gy } = getGoal(size);
    const initMaze = new VirtualMaze({ cols: size, rows: size, walls, goalX: gx, goalY: gy, fogOfWar });
    return { walls, gx, gy, initFog: initMaze.fog.map(r => Array.from(r)), initDir: initMaze.dir };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, mazeNonce, size, fogOfWar]);

  const goalPos = useMemo(() => ({ gx: mazeData.gx, gy: mazeData.gy }), [mazeData.gx, mazeData.gy]);
  const [levelVisible, setLevelVisible] = useState(false);

  const [robotState, setRobotState] = useState(() => ({
    x: 0, y: 0, dir: mazeData.initDir, fog: mazeData.initFog, solved: false,
  }));

  // ── Submission State ───────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [submitTestIdx, setSubmitTestIdx] = useState(0);
  const [testWalls, setTestWalls] = useState(null);

  // Reset robot when maze changes
  useEffect(() => {
    const t = setTimeout(() => {
      setRobotState({ x: 0, y: 0, dir: mazeData.initDir, fog: mazeData.initFog, solved: false });
      setLevelVisible(false);
    }, 0);
    return () => clearTimeout(t);
  }, [mazeData]);



  // ── Execution state ────────────────────────────────────────────────────────
  const [animating, setAnimating]     = useState(false);
  const [consoleLines, setConsoleLines] = useState([]);
  const [runResult, setRunResult]     = useState(null);
  const animTimerRef  = useRef(null);
  const executorRef   = useRef(new MazeExecutor());
  const consoleEndRef = useRef(null);
  const submitResultsRef = useRef([]);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLines]);

  const addLog = useCallback((text, type = 'info') => {
    setConsoleLines(prev => [...prev, { text, type, id: Date.now() + Math.random() }]);
  }, []);

  // Normal Run: Runs ONLY on the current maze the user is seeing.
  const handleRun = useCallback(async () => {
    if (!skulptReady || animating || !mazeData.walls) return;
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    setAnimating(true);
    setConsoleLines([]);
    setRunResult(null);

    addLog('[SYSTEM] Running code on current maze...', 'system');

    const displayMaze = new VirtualMaze({
      cols: size, rows: size,
      walls: mazeData.walls,
      goalX: goalPos.gx, goalY: goalPos.gy,
      fogOfWar,
    });

    setRobotState({ x: 0, y: 0, dir: 1, fog: displayMaze.fog.map(r => Array.from(r)), solved: false });

    const result = await executorRef.current.execute(editorCode, displayMaze);

    const fullLog = result.log || [];
    const animSpeed = getAnimSpeed(size, false);
    let step = 0;

    const tick = () => {
      // Drain prints immediately
      while (step < fullLog.length && fullLog[step].type === 'print') {
        const text = fullLog[step].text.replace(/\n$/, '');
        if (text !== '') addLog(text, 'output');
        step++;
      }

      if (step >= fullLog.length) {
        setAnimating(false);
        if (!result.success) {
          addLog(`❌ Error: ${result.error}`, 'error');
        } else if (result.solved) {
          addLog(`✅ Solved! Score: ${result.score.toFixed(2)} (${result.moves} moves, ${result.turns} turns)`, 'success');
          setRunResult({ solved: true, score: result.score, moves: result.moves, turns: result.turns });
        } else {
          addLog(`⚠️ Finished — goal not reached. (${result.moves} moves, ${result.turns} turns)`, 'warn');
          setRunResult({ solved: false, score: result.score, moves: result.moves, turns: result.turns });
        }
        return;
      }

      const action = fullLog[step];
      if (action.state) {
        setRobotState({ x: action.state.x, y: action.state.y, dir: action.state.dir, fog: action.state.fog, solved: action.state.solved });
      }
      step++;
      animTimerRef.current = setTimeout(tick, animSpeed);
    };
    tick();
  }, [skulptReady, animating, mazeData, editorCode, size, goalPos, fogOfWar, addLog]);

  // Submit test executor (recursive helper)
  async function startTest(index, code) {
    if (index === 0) {
      submitResultsRef.current = [];
    }

    setSubmitTestIdx(index);
    addLog(`[SYSTEM] Starting Test ${index + 1}/5...`, 'system');

    // Generate a random seed/maze for this test run
    const seed = Math.floor(Math.random() * 2147483647);
    const randomWalls = generateMaze(size, size, seed);
    setTestWalls(randomWalls);

    const testMaze = new VirtualMaze({
      cols: size, rows: size,
      walls: randomWalls,
      goalX: goalPos.gx, goalY: goalPos.gy,
      fogOfWar,
    });

    setRobotState({ x: 0, y: 0, dir: 1, fog: testMaze.fog.map(r => Array.from(r)), solved: false });

    const res = await executorRef.current.execute(code, testMaze);

    const fullLog = res.log || [];
    const animSpeed = getAnimSpeed(size, true);
    let step = 0;

    const tick = () => {
      // Drain print statements
      while (step < fullLog.length && fullLog[step].type === 'print') {
        const text = fullLog[step].text.replace(/\n$/, '');
        if (text !== '') addLog(`[Test ${index + 1}] ${text}`, 'output');
        step++;
      }

      if (step >= fullLog.length) {
        if (!res.success) {
          setSubmitting(false);
          setAnimating(false);
          addLog(`❌ Error on Test ${index + 1}/5: ${res.error}`, 'error');
          return;
        }
        if (res.solved) {
          addLog(`✅ Test ${index + 1}/5 Passed! Score: ${res.score.toFixed(2)} (${res.moves} moves, ${res.turns} turns)`, 'success');

          const nextResults = [...submitResultsRef.current, res];
          submitResultsRef.current = nextResults;

          if (index < 4) {
            animTimerRef.current = setTimeout(() => {
              startTest(index + 1, code);
            }, 600); // Brief pause before starting next run so user sees success state
          } else {
            // All tests succeeded!
            setSubmitting(false);
            setAnimating(false);

            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#22c55e', '#3b82f6', '#f59e0b'] });

            const avgScore = nextResults.reduce((sum, r) => sum + r.score, 0) / 5;
            addLog(`🎉 SUCCESS! All 5 test runs passed!`, 'success');
            addLog(`📊 Scores: ${nextResults.map((r, idx) => `Run ${idx + 1}: ${r.score.toFixed(2)}`).join(' | ')}`, 'info');
            addLog(`⭐ Average Score: ${avgScore.toFixed(2)}`, 'success');

            setBestScores(prev => {
              const current = prev[selectedId];
              if (current === undefined || avgScore < current) {
                const next = { ...prev, [selectedId]: avgScore };
                saveScores(next);
                return next;
              }
              return prev;
            });
            setRunResult({ solved: true, score: avgScore, moves: res.moves, turns: res.turns });
          }
        } else {
          setSubmitting(false);
          setAnimating(false);
          addLog(`❌ Test ${index + 1}/5 Failed: Goal not reached.`, 'error');
          setRunResult({ solved: false, score: null, moves: res.moves, turns: res.turns });
        }
        return;
      }

      const action = fullLog[step];
      if (action.state) {
        setRobotState({ x: action.state.x, y: action.state.y, dir: action.state.dir, fog: action.state.fog, solved: action.state.solved });
      }
      step++;
      animTimerRef.current = setTimeout(tick, animSpeed);
    };

    // Briefly pause to let the user see the new maze before running the robot
    animTimerRef.current = setTimeout(tick, 300);
  }

  // Submit flow
  const handleSubmit = () => {
    if (!skulptReady || animating) return;
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    setAnimating(true);
    setSubmitting(true);
    setConsoleLines([]);
    setRunResult(null);

    addLog('[SYSTEM] Initiating submission evaluation (5 randomized test runs)...', 'system');
    startTest(0, editorCode);
  };

  const handleStop = useCallback(() => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    setAnimating(false);
    setSubmitting(false);
    addLog('[SYSTEM] Execution stopped.', 'system');
  }, [addLog]);

  const handleNewMaze = useCallback(() => {
    if (animating) handleStop();
    setMazeNonce(n => n + 1);
    setConsoleLines([]);
    setRunResult(null);
  }, [animating, handleStop]);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ─── Render ──────────────────────────────────────────────────────────────
  const bestScore = bestScores[selectedId];
  const displayWalls = (submitting && testWalls) ? testWalls : mazeData.walls;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', height: '48px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-base)', flexShrink: 0, gap: '1rem', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => setSidebarOpen(v => !v)} className="btn btn-ghost btn-sm" title={sidebarOpen ? 'Hide sizes' : 'Show sizes'} style={{ fontSize: '14px', padding: '0.2rem 0.4rem' }}>☰</button>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="8" rx="10" ry="4" fill="#4589ff"/><rect x="6" y="8" width="20" height="14" fill="#4589ff"/><ellipse cx="16" cy="22" rx="10" ry="4" fill="#0353e9"/><ellipse cx="16" cy="8" rx="10" ry="4" fill="none" stroke="#74aaff" strokeWidth="1"/></svg>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>Maze Solver</span>
          </Link>
        </div>

        {/* Center info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, justifyContent: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{mazeConfig.label}</span>
          <span style={{ padding: '2px 8px', borderRadius: '99px', background: fogOfWar ? '#312e8155' : '#14532d55', color: fogOfWar ? '#a5b4fc' : '#4ade80', border: `1px solid ${fogOfWar ? '#4f46e566' : '#16a34a66'}`, fontSize: '11px', fontWeight: 600 }}>
            {fogOfWar ? '🌫 Fog of War' : '👁 Visible'}
          </span>
          {bestScore !== undefined && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>
              <TrophyIcon /> Best: {bestScore.toFixed(2)}
            </span>
          )}
          {runResult && (
            <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '99px', background: runResult.solved ? '#16a34a22' : '#92400e22', border: `1px solid ${runResult.solved ? '#22c55e55' : '#f59e0b55'}`, color: runResult.solved ? '#22c55e' : '#f59e0b', fontWeight: 600 }}>
              {runResult.solved ? `✅ ${runResult.score.toFixed(2)} pts` : `⚠️ ${runResult.moves}m ${runResult.turns}t`}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {fogOfWar && (
            <button onClick={() => setLevelVisible(v => !v)} className="btn btn-ghost btn-sm" title={levelVisible ? 'Hide full maze' : 'Reveal full maze'} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', opacity: levelVisible ? 1 : 0.65 }}>
              {levelVisible ? <EyeOffIcon /> : <EyeIcon />} {levelVisible ? 'Hide' : 'Peek'}
            </button>
          )}
          <button onClick={toggleTheme} className="btn btn-ghost btn-sm" title={isDark ? 'Light mode' : 'Dark mode'} style={{ display: 'flex', alignItems: 'center', padding: '0.25rem 0.4rem' }}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Sidebar: maze size picker ──────────────────────────────────────── */}
        {sidebarOpen && (
          <aside style={{ width: '200px', flexShrink: 0, borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-overlay)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0.6rem 0.75rem 0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Maze Size</span>
            </div>

            <div style={{ flex: 1, padding: '0.4rem' }}>
              {MAZE_SIZES.map(m => {
                const isCurrent = m.id === selectedId;
                const best = bestScores[m.id];
                const isFog = m.fogOfWar;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      if (animTimerRef.current) clearTimeout(animTimerRef.current);
                      setAnimating(false);
                      setSubmitting(false);
                      setSelectedId(m.id);
                      setRunResult(null);
                      setConsoleLines([]);
                    }}
                    style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.6rem', marginBottom: '2px', borderRadius: '6px', border: isCurrent ? '1px solid #22d3ee55' : '1px solid transparent', background: isCurrent ? '#22d3ee11' : 'transparent', color: isCurrent ? '#22d3ee' : 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.12s', display: 'flex', flexDirection: 'column', gap: '3px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{m.label}</span>
                      <span style={{ fontSize: '10px', padding: '1px 5px', borderRadius: '99px', background: isFog ? '#312e8133' : '#14532d33', color: isFog ? '#a5b4fc' : '#4ade80', fontWeight: 600 }}>{m.tag}</span>
                    </div>
                    {best !== undefined && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#f59e0b' }}>
                        <TrophyIcon /> {best.toFixed(2)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* API quick-ref */}
            <div style={{ padding: '0.6rem 0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.35rem', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Robot API</div>
              {[['move_forward()','move 1 tile'],['turn_left()','rotate CCW'],['turn_right()','rotate CW'],['wall_front()','→ bool'],['wall_left()','→ bool'],['wall_right()','→ bool'],['position()','→ (x,y)'],['direction()','→ str'],['at_goal()','→ bool']].map(([fn, desc]) => (
                <div key={fn} style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', marginBottom: '1px' }}>
                  <code style={{ fontSize: '10px', color: '#60a5fa' }}>{fn}</code>
                  <span style={{ fontSize: '10px', color: 'var(--text-placeholder)' }}>{desc}</span>
                </div>
              ))}
              <div style={{ marginTop: '0.4rem', fontSize: '10px', color: 'var(--text-placeholder)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
                Score = moves + turns × 0.25
              </div>
            </div>
          </aside>
        )}

        {/* ── Center: Maze canvas + console ─────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: '0 0 auto', width: sidebarOpen ? 'calc(50% - 100px)' : '50%', borderRight: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          {/* Canvas area */}
          <div style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflow: 'hidden', minHeight: 0 }}>
            {/* Stat bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
              {submitting ? (
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  🧪 Testing: Run {submitTestIdx + 1}/5
                </span>
              ) : (
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{mazeConfig.label} Maze</span>
              )}
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Goal: center ({goalPos.gx},{goalPos.gy})</span>
              {robotState && (
                <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: '99px', background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                  ({robotState.x},{robotState.y}) {DIR_NAMES[robotState.dir]}
                </span>
              )}
            </div>

            {/* Canvas */}
            <div style={{ flex: 1, minHeight: 0, borderRadius: '10px', overflow: 'hidden', background: '#07090f', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
              {displayWalls && (
                <MazeCanvas
                  cols={size} rows={size}
                  walls={displayWalls}
                  robotState={robotState}
                  goalX={goalPos.gx} goalY={goalPos.gy}
                  fogOfWar={fogOfWar}
                  levelVisible={levelVisible}
                />
              )}
            </div>
          </div>

          {/* Console */}
          <div style={{ flexShrink: 0, height: '150px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-overlay)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '4px 12px', borderBottom: '1px solid var(--border-subtle)', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              Console
              {animating && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'mazePulse 1s infinite' }} />}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.7 }}>
              {consoleLines.length === 0 && (
                <span style={{ color: 'var(--text-placeholder)' }}>
                  Press ▶ Run to test on the current maze, or click green Submit to evaluate on 5 random mazes…
                </span>
              )}
              {consoleLines.map(l => (
                <div key={l.id} style={{ color: l.type === 'error' ? '#f87171' : l.type === 'success' ? '#4ade80' : l.type === 'warn' ? '#fbbf24' : l.type === 'system' ? '#94a3b8' : 'var(--text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {l.text}
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>
          </div>
        </div>

        {/* ── Right: Code editor ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-overlay)', flexShrink: 0 }}>
            <button id="maze-run-btn" onClick={handleRun} disabled={!skulptReady || animating} className="btn btn-primary btn-sm" title="Run (Ctrl+Enter)" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600 }}>
              <PlayIcon /> Run
            </button>
            <button id="maze-submit-btn" onClick={handleSubmit} disabled={!skulptReady || animating} className="btn btn-success btn-sm" title="Submit solution" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600 }}>
              <CheckIcon /> Submit
            </button>
            <button id="maze-stop-btn" onClick={handleStop} disabled={!animating} className="btn btn-ghost btn-sm" title="Stop" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
              <StopIcon /> Stop
            </button>
            <button id="maze-new-btn" onClick={handleNewMaze} disabled={animating} className="btn btn-ghost btn-sm" title="Generate new maze" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
              <NewMazeIcon /> New Maze
            </button>
            <button id="maze-reset-code-btn" onClick={() => setEditorCode(DEFAULT_CODE)} disabled={animating} className="btn btn-ghost btn-sm" title="Reset code to default" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
              <RefreshIcon /> Reset Code
            </button>

            <div style={{ flex: 1 }} />
            {!skulptReady  && <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Loading Python…</span>}
            {skulptReady && !animating && <span style={{ fontSize: '11px', color: '#22c55e' }}>● Ready</span>}
            {animating    && <span style={{ fontSize: '11px', color: '#f59e0b' }}>● Running…</span>}
          </div>

          {/* Editor */}
          <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
            <GameCodeEditor
              code={editorCode}
              onChange={setEditorCode}
              onRun={handleRun}
              disabled={animating}
            />
          </div>
        </div>
      </div>

      <style>{`@keyframes mazePulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}
