import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import sqlChallenges from '../data/sql-challenges.json';
import pythonChallenges from '../data/python-challenges.json';
import { LEVELS } from '../game/Levels.js';

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8" cy="8" r="3" />
    <line x1="8" y1="1" x2="8" y2="3" />
    <line x1="8" y1="13" x2="8" y2="15" />
    <line x1="1" y1="8" x2="3" y2="8" />
    <line x1="13" y1="8" x2="15" y2="8" />
    <line x1="3.05" y1="3.05" x2="4.46" y2="4.46" />
    <line x1="11.54" y1="11.54" x2="12.95" y2="12.95" />
    <line x1="3.05" y1="12.95" x2="4.46" y2="11.54" />
    <line x1="11.54" y1="4.46" x2="12.95" y2="3.05" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 10.5a5.5 5.5 0 1 1-5-5 5.5 5.5 0 0 0 5 5z" />
  </svg>
);

// =========================================================================
// IBM Carbon Design System Icon Components
// =========================================================================

// Database Cylinder for SQL
const SqlIcon = () => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 32 32" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    aria-hidden="true"
  >
    <ellipse cx="16" cy="7" rx="11" ry="4" />
    <path d="M5 7v9c0 2.2 4.9 4 11 4s11-1.8 11-4V7" />
    <path d="M5 16v9c0 2.2 4.9 4 11 4s11-1.8 11-4v-9" />
  </svg>
);

// Code Brackets for Python
const PythonIcon = () => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 32 32" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    aria-hidden="true"
  >
    <path d="M10 9L3 16L10 23" />
    <path d="M22 9L29 16L22 23" />
    <path d="M18 5L14 27" />
  </svg>
);

// Robot Grid Navigation for Robot Gardener
const RobotIcon = () => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 32 32" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    aria-hidden="true"
  >
    <rect x="6" y="10" width="20" height="16" rx="1" />
    <circle cx="11" cy="17" r="2" fill="currentColor" />
    <circle cx="21" cy="17" r="2" fill="currentColor" />
    <path d="M16 10V5" />
    <circle cx="16" cy="4" r="1" fill="currentColor" />
    <path d="M9 26v2M23 26v2" />
    <path d="M12 22h8" />
  </svg>
);

// Trailing Arrow for Buttons
const ArrowRightIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    aria-hidden="true"
  >
    <line x1="3" y1="8" x2="13" y2="8" />
    <polyline points="9 4 13 8 9 12" />
  </svg>
);

// =========================================================================
// MODULE DATA ARRAY (SCALABILITY)
// To add new modules in the future (e.g., 5+ modules), simply append new
// objects to this array. The grid will automatically scale and reflow.
// =========================================================================
const MODULES = [
  {
    id: 'sql',
    title: 'SQL Module',
    category: 'Query Practice',
    tag: 'Database',
    desc: 'Practice writing SQL against small, realistic datasets. Start with selects and filters, then build up to joins, grouping, and reporting queries.',
    path: '/sql',
    accentColor: '#4589ff', // Carbon Blue 50
    progressKey: 'statica-learn-progress',
    totalChallenges: sqlChallenges.length,
    progressType: 'challengeData',
    Icon: SqlIcon,
  },
  {
    id: 'python',
    title: 'Python Module',
    category: 'Code Practice',
    tag: 'Programming',
    desc: 'Work through Python fundamentals with tiny problems that run in the browser. Each exercise is meant to make one idea click.',
    path: '/python',
    accentColor: '#08bdba', // Carbon Teal 50
    progressKey: 'statica-learn-python-progress',
    totalChallenges: pythonChallenges.length,
    progressType: 'challengeData',
    Icon: PythonIcon,
  },
  {
    id: 'robot-gardener',
    title: 'Robot Gardener',
    category: 'Python Game',
    tag: 'Simulation',
    desc: 'Use code to guide a robot around a garden grid. It turns movement, loops, and planning into something you can see immediately.',
    path: '/robot-gardener',
    accentColor: '#42be65', // Carbon Green 50
    progressKey: 'statica-robot-gardener-progress',
    totalChallenges: LEVELS.length,
    progressType: 'robotLevels',
    Icon: RobotIcon,
  }
];

function loadModuleProgress(module) {
  try {
    const raw = localStorage.getItem(module.progressKey);
    if (!raw) return { solved: 0, total: module.totalChallenges, percent: 0 };

    const parsed = JSON.parse(raw);
    const solved = module.progressType === 'robotLevels'
      ? Object.values(parsed || {}).filter(item => item?.solved).length
      : Object.values(parsed?.challengeData || {}).filter(item => item?.status === 'solved').length;
    const percent = module.totalChallenges > 0
      ? Math.round((solved / module.totalChallenges) * 100)
      : 0;

    return { solved, total: module.totalChallenges, percent };
  } catch {
    return { solved: 0, total: module.totalChallenges, percent: 0 };
  }
}

function getModuleProgress() {
  return MODULES.reduce((acc, module) => {
    acc[module.id] = loadModuleProgress(module);
    return acc;
  }, {});
}

const Home = () => {
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();
  const [moduleProgress] = useState(getModuleProgress);

  return (
    <div className="carbon-layout">
      {/* IBM Carbon Header (UI Shell) */}
      <header className="carbon-header" role="banner">
        <Link 
          className="app-logo" 
          to="/"
          style={{ textDecoration: 'none', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <div className="app-logo-icon" style={{ background: 'none', borderRadius: 0, width: 'auto', height: 'auto', padding: 0, display: 'flex', alignItems: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Database cylinder body */}
              <ellipse cx="16" cy="8" rx="10" ry="4" fill="#4589ff" />
              <rect x="6" y="8" width="20" height="14" fill="#4589ff" />
              <ellipse cx="16" cy="22" rx="10" ry="4" fill="#0353e9" />
              {/* Shine lines */}
              <ellipse cx="16" cy="8" rx="10" ry="4" fill="none" stroke="#74aaff" strokeWidth="1" />
              <line x1="6" y1="14" x2="26" y2="14" stroke="#0353e9" strokeWidth="1" />
              <line x1="6" y1="19" x2="26" y2="19" stroke="#0353e9" strokeWidth="1" />
              {/* Highlight */}
              <ellipse cx="13" cy="7.5" rx="3" ry="1.2" fill="white" opacity="0.25" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span className="app-logo-name" style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>StaticaLearn</span>
            <span style={{ fontSize: '11px', color: 'var(--text-placeholder)', fontWeight: 400, letterSpacing: '0.02em' }}>by StaticaLabs</span>
          </div>
        </Link>
        <nav className="carbon-header-nav" role="navigation" aria-label="Global navigation" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem 0.5rem', width: '28px', height: '28px', background: 'transparent', border: '1px solid var(--border-subtle)' }}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a 
            href="https://staticalabs.com" 
            className="carbon-nav-link" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Visit StaticaLabs website (opens in a new tab)"
          >
            StaticaLabs
          </a>
        </nav>
      </header>

      {/* Main Corporate Content Grid */}
      <main className="carbon-main">
        <div className="carbon-container">
          
          {/* Hero Section */}
          <section className="carbon-hero">
            <h1 className="carbon-hero-title">
              StaticaLearn
            </h1>
            <p className="carbon-hero-subtitle">
              A personal practice space for learning SQL, Python, and problem solving through small interactive challenges.
            </p>
          </section>

          {/* Module Cards Grid */}
          <section 
            className="carbon-grid" 
            role="region" 
            aria-label="Available training modules"
          >
            {MODULES.map((module) => {
              const { id, title, category, tag, desc, path, accentColor, Icon } = module;
              const progress = moduleProgress[id];
              return (
                <article 
                  key={id}
                  className="carbon-card"
                  onClick={() => navigate(path)}
                  style={{ '--hover-accent-color': accentColor }}
                  tabIndex="0"
                  role="button"
                  aria-pressed="false"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(path);
                    }
                  }}
                >
                  <div className="carbon-card-header">
                    <div className="carbon-card-meta">
                      <span className="carbon-card-tag">{tag}</span>
                      <span className="carbon-card-icon-wrapper">
                        <Icon />
                      </span>
                    </div>
                    
                    <div className="carbon-card-title-group">
                      <h2 className="carbon-card-title">{title}</h2>
                      <span className="carbon-card-category">{category}</span>
                    </div>
                    
                    <p className="carbon-card-desc">{desc}</p>
                  </div>

                  <div className="carbon-card-footer">
                    <div className="carbon-card-progress" aria-label={`${title} progress: ${progress.solved} of ${progress.total} complete`}>
                      <div className="carbon-card-progress-meta">
                        <span>Progress</span>
                        <span>{progress.solved}/{progress.total}</span>
                      </div>
                      <div className="carbon-card-progress-track">
                        <span
                          className="carbon-card-progress-fill"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    </div>
                    <button 
                      className="carbon-btn-primary" 
                      onClick={(e) => {
                        e.stopPropagation(); // prevent double navigation
                        navigate(path);
                      }}
                      tabIndex="-1" // card itself is focusable
                    >
                      Start Module
                      <span className="carbon-btn-icon">
                        <ArrowRightIcon />
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

        </div>
      </main>
    </div>
  );
};

export default Home;
