import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEVELS, TIER_INFO } from '../game/Levels.js';
import { Robot } from '../game/Robot.js';
import { Grid } from '../game/Grid.js';
import { Executor } from '../game/Executor.js';
import { checkSuccess } from '../game/GameState.js';
import GameCanvas from '../components/GameCanvas.jsx';
import GameCodeEditor from '../components/GameCodeEditor.jsx';
import { useNavigate } from 'react-router-dom';

const SKULPT_CDN = 'https://skulpt.org/js/skulpt.min.js';
const SKULPT_STDLIB = 'https://skulpt.org/js/skulpt-stdlib.js';
const ANIM_SPEED = 500; // ms per step
const PROGRESS_KEY = 'statica-robot-gardener-progress';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); }
  catch { return {}; }
}

function saveProgress(data) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

export default function RobotGardenerModule() {
  const navigate = useNavigate();

  // ─── State ───────────────────────────────────────────────────
  const [skulptReady, setSkulptReady] = useState(false);
  const [skulptError, setSkulptError] = useState(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [editorCode, setEditorCode] = useState('');
  const [robotState, setRobotState] = useState(null);
  const [gridState, setGridState] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [consoleLines, setConsoleLines] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | running | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [errorLine, setErrorLine] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [progress, setProgress] = useState(loadProgress);

  const animTimerRef = useRef(null);
  const robotRef = useRef(null);
  const gridRef = useRef(null);
  const executorRef = useRef(new Executor());
  const progressRef = useRef(progress);

  // Keep progressRef in sync
  useEffect(() => { progressRef.current = progress; }, [progress]);

  const level = LEVELS[levelIndex];

  // ─── Load Skulpt ─────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        await loadScript(SKULPT_CDN);
        await loadScript(SKULPT_STDLIB);
        setSkulptReady(true);
      } catch (e) { // eslint-disable-line no-unused-vars
        setSkulptError('Failed to load Python runtime. Check your connection.');
      }
    })();
  }, []);

  // ─── Initialize level ────────────────────────────────────────
  const initLevel = useCallback((lvl) => {
    const robot = new Robot(
      lvl.robotStart.x, lvl.robotStart.y, lvl.robotStart.dir,
      lvl.gridSize, lvl.startInventory || []
    );
    const grid = new Grid(lvl.gridSize, lvl.initialCells || []);
    robotRef.current = robot;
    gridRef.current = grid;
    setRobotState({ x: robot.x, y: robot.y, dir: robot.dir, inventory: [...robot.inventory] });
    setGridState({ cells: grid.cells.map(r => [...r]) });
    setConsoleLines([]);
    setStatus('idle');
    setErrorMsg('');
    setErrorLine(null);
    setShowSuccess(false);
    setShowHint(false);
    setShowSolution(false);
    setAnimating(false);
  }, []);

  useEffect(() => {
    const saved = progressRef.current[level.id]?.code;
    setEditorCode(saved || level.starterCode);
    initLevel(level);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelIndex]);

  // ─── Finalize run (check success) ────────────────────────────
  const finalizeRun = useCallback((success, robot, grid, harvests, currentCode) => {
    if (success) {
      setStatus('success');
      setShowSuccess(true);
      setProgress(prev => {
        const newProgress = {
          ...prev,
          [level.id]: { solved: true, code: currentCode, solvedAt: Date.now() },
        };
        saveProgress(newProgress);
        return newProgress;
      });
    } else {
      setStatus('error');
      setErrorMsg('Objective not yet complete. Check the goal and try again!');
    }
    setRobotState({ x: robot.x, y: robot.y, dir: robot.dir, inventory: [...robot.inventory] });
    setGridState({ cells: grid.cells.map(r => [...r]) });
  }, [level.id]);

  // ─── Run code ────────────────────────────────────────────────
  const handleRun = useCallback(async () => {
    if (!skulptReady || animating) return;
    clearTimeout(animTimerRef.current);

    // Snapshot current editor code
    const currentEditorRef = editorCode;

    // Reset robot & grid
    const lvl = LEVELS[levelIndex];
    const robot = new Robot(
      lvl.robotStart.x, lvl.robotStart.y, lvl.robotStart.dir,
      lvl.gridSize, lvl.startInventory || []
    );
    const grid = new Grid(lvl.gridSize, lvl.initialCells || []);
    robotRef.current = robot;
    gridRef.current = grid;
    setRobotState({ x: robot.x, y: robot.y, dir: robot.dir, inventory: [...robot.inventory] });
    setGridState({ cells: grid.cells.map(r => [...r]) });

    setStatus('running');
    setConsoleLines([]);
    setErrorMsg('');
    setErrorLine(null);
    setAnimating(true);

    const result = await executorRef.current.execute(currentEditorRef, robot, grid);

    if (!result.success) {
      setStatus('error');
      setErrorMsg(result.error || 'Unknown error');
      setErrorLine(result.lineNo || null);
      setConsoleLines(result.output ? result.output.split('\n').filter(Boolean) : []);
      setAnimating(false);
      // Show current (partial) grid state
      setRobotState({ x: robot.x, y: robot.y, dir: robot.dir, inventory: [...robot.inventory] });
      setGridState({ cells: grid.cells.map(r => [...r]) });
      return;
    }

    // Count harvests in the log
    const harvests = (result.log || []).filter(a => a.type === 'harvest').length;
    const log = result.log || [];
    setConsoleLines(result.output ? result.output.split('\n').filter(Boolean) : []);

    if (log.length === 0) {
      setAnimating(false);
      finalizeRun(
        checkSuccess(lvl.successCondition, robot, grid, harvests),
        robot, grid, harvests, currentEditorRef
      );
      return;
    }

    // Animate step by step
    let step = 0;
    const tick = () => {
      if (step >= log.length) {
        setAnimating(false);
        finalizeRun(
          checkSuccess(lvl.successCondition, robot, grid, harvests),
          robot, grid, harvests, currentEditorRef
        );
        return;
      }
      const action = log[step];
      const rSnap = action.to || action.robot;
      const gSnap = action.gridSnap;
      if (rSnap) setRobotState(rSnap);
      if (gSnap) setGridState({ cells: gSnap.cells });
      step++;
      animTimerRef.current = setTimeout(tick, ANIM_SPEED);
    };
    animTimerRef.current = setTimeout(tick, 100);
  }, [skulptReady, animating, levelIndex, editorCode, finalizeRun]);

  const handleReset = useCallback(() => {
    clearTimeout(animTimerRef.current);
    setAnimating(false);
    const saved = progressRef.current[level.id]?.code;
    setEditorCode(saved || level.starterCode);
    initLevel(level);
  }, [level, initLevel]);

  const handleNext = useCallback(() => {
    if (levelIndex < LEVELS.length - 1) setLevelIndex(i => i + 1);
  }, [levelIndex]);

  const handleSelectLevel = (idx) => setLevelIndex(idx);

  // ─── Keyboard shortcut ───────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault(); handleRun();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRun]);

  // ─── Cleanup on unmount ──────────────────────────────────────
  useEffect(() => {
    return () => clearTimeout(animTimerRef.current);
  }, []);

  // ─── Tier grouping for sidebar ───────────────────────────────
  const tieredLevels = [1, 2, 3].map(tier => ({
    tier,
    levels: LEVELS.filter(l => l.tier === tier),
  }));

  const isSolved = (id) => !!progress[id]?.solved;
  const solvedCount = Object.values(progress).filter(p => p?.solved).length;

  return (
    <div className="rg-shell">
      {/* ── Header ── */}
      <header className="rg-header">
        <div className="rg-header-left">
          <button className="rg-back-btn" onClick={() => navigate('/')} title="Back to Home">
            ← Home
          </button>
          <div className="rg-logo">
            <span className="rg-logo-icon">🤖</span>
            <span className="rg-logo-name">Robot Gardener</span>
          </div>
        </div>
        <div className="rg-header-center">
          <span className="rg-level-badge" style={{ color: TIER_INFO[level.tier].color }}>
            {TIER_INFO[level.tier].icon} Tier {level.tier} · Level {level.tierLevel}
          </span>
          <span className="rg-level-title">{level.title}</span>
        </div>
        <div className="rg-header-right">
          <span className="rg-progress-text">
            {solvedCount}/{LEVELS.length} solved
          </span>
          <button
            className="rg-sidebar-btn"
            onClick={() => setSidebarOpen(v => !v)}
            title="Toggle sidebar"
          >
            ☰
          </button>
        </div>
      </header>

      <div className="rg-body">
        {/* ── Sidebar ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              className="rg-sidebar"
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            >
              <div className="rg-sidebar-header">Levels</div>
              <div className="rg-sidebar-body">
                {tieredLevels.map(({ tier, levels: tLevels }) => (
                  <div key={tier} className="rg-tier-group">
                    <div className="rg-tier-label" style={{ color: TIER_INFO[tier].color }}>
                      {TIER_INFO[tier].icon} Tier {tier}: {TIER_INFO[tier].name}
                    </div>
                    {tLevels.map((l) => {
                      const idx = LEVELS.findIndex(x => x.id === l.id);
                      const solved = isSolved(l.id);
                      const active = idx === levelIndex;
                      return (
                        <button
                          key={l.id}
                          className={`rg-level-item ${active ? 'active' : ''} ${solved ? 'solved' : ''}`}
                          onClick={() => handleSelectLevel(idx)}
                        >
                          <span className="rg-level-item-icon">
                            {solved ? '✅' : active ? '▶' : '○'}
                          </span>
                          <span className="rg-level-item-title">{l.title}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Main ── */}
        <div className="rg-main">
          {/* Left: Grid + Objective */}
          <div className="rg-left">
            <div className="rg-grid-wrap">
              {gridState && (
                <GameCanvas
                  gridSize={level.gridSize}
                  cells={gridState.cells}
                  robot={robotState}
                  animating={animating}
                />
              )}
              {animating && (
                <div className="rg-anim-badge">
                  <span className="rg-anim-dot" />
                  Executing…
                </div>
              )}
            </div>

            {/* Objective */}
            <div className="rg-objective">
              <div className="rg-objective-label">🎯 Objective</div>
              <p className="rg-objective-text">{level.objective}</p>
              {level.newConcept && (
                <div className="rg-concept-badge">
                  📚 {level.newConcept}
                </div>
              )}
              <div className="rg-objective-actions">
                <button className="rg-hint-btn" onClick={() => setShowHint(v => !v)}>
                  {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
                </button>
                <button
                  className="rg-hint-btn"
                  onClick={() => setShowSolution(v => !v)}
                  style={{ color: 'var(--color-yellow)' }}
                >
                  {showSolution ? '🙈 Hide Solution' : '🗝 Show Solution'}
                </button>
              </div>
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    className="rg-hint-box"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    💡 {level.hint}
                  </motion.div>
                )}
                {showSolution && (
                  <motion.div
                    className="rg-hint-box rg-solution-box"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                      {level.starterCode}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Inventory */}
            {robotState?.inventory?.length > 0 && (
              <div className="rg-inventory">
                <span className="rg-inventory-label">🎒 Inventory:</span>
                {robotState.inventory.map((item, i) => (
                  <span key={i} className="rg-inventory-item">{item}</span>
                ))}
              </div>
            )}
          </div>

          {/* Right: Editor + Console */}
          <div className="rg-right">
            {/* Editor toolbar */}
            <div className="rg-editor-toolbar">
              <span className="rg-editor-label">Python Editor</span>
              <span className="rg-editor-hint">
                {skulptReady
                  ? '✅ Ready · Ctrl+Enter to run'
                  : skulptError
                  ? '❌ ' + skulptError
                  : '⏳ Loading Python…'}
              </span>
            </div>

            {/* Editor */}
            <div className="rg-editor-wrap">
              <GameCodeEditor
                code={editorCode}
                onChange={setEditorCode}
                onRun={handleRun}
                disabled={animating || !skulptReady}
                errorLine={errorLine}
              />
            </div>

            {/* Action buttons */}
            <div className="rg-editor-actions">
              <button
                id="rg-run-btn"
                className="btn btn-primary"
                onClick={handleRun}
                disabled={animating || !skulptReady}
              >
                {animating ? '⏳ Running…' : '▶ Run'}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleReset}
                disabled={animating}
              >
                ↺ Reset
              </button>
              {status === 'success' && levelIndex < LEVELS.length - 1 && (
                <motion.button
                  className="btn btn-success"
                  onClick={handleNext}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  Next Level →
                </motion.button>
              )}
            </div>

            {/* Console */}
            <div className="rg-console">
              <div className="rg-console-header">
                <span>Console</span>
                <span className={`rg-console-status ${status}`}>
                  {status === 'idle' && '—'}
                  {status === 'running' && '⏳ Running'}
                  {status === 'success' && '✅ Success!'}
                  {status === 'error' && '❌ Error'}
                </span>
              </div>
              <div className="rg-console-body">
                {status === 'error' && (
                  <div className="rg-console-error">
                    {errorLine && <span className="rg-err-line">Line {errorLine}: </span>}
                    {errorMsg}
                  </div>
                )}
                {consoleLines.map((line, i) => (
                  <div key={i} className="rg-console-line">&gt; {line}</div>
                ))}
                {status === 'success' && (
                  <div className="rg-console-success">🎉 Level complete! Objective met.</div>
                )}
                {status === 'idle' && consoleLines.length === 0 && (
                  <div className="rg-console-placeholder">Output will appear here…</div>
                )}
              </div>
            </div>

            {/* Reference card */}
            <div className="rg-commands">
              <div className="rg-commands-header">Available Commands</div>
              <div className="rg-commands-body">
                {[
                  'move_forward()', 'move_right()', 'move_left()',
                  'turn_right()', 'turn_left()',
                  'plant()', 'water()', 'harvest()', 'check_cell()',
                  'get_inventory()', 'print(msg)',
                ].map(cmd => (
                  <span key={cmd} className="rg-cmd-pill">{cmd}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Success Modal ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="rg-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              className="rg-modal"
              initial={{ scale: 0.7, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="rg-modal-icon">🌟</div>
              <h2 className="rg-modal-title">Level Complete!</h2>
              <p className="rg-modal-sub">{level.title} — Tier {level.tier}·{level.tierLevel}</p>
              <p className="rg-modal-text">{level.objective}</p>
              <div className="rg-modal-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => setShowSuccess(false)}>
                  Keep Practicing
                </button>
                {levelIndex < LEVELS.length - 1 && (
                  <button
                    className="btn btn-primary"
                    onClick={() => { setShowSuccess(false); handleNext(); }}
                  >
                    Next Level →
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
