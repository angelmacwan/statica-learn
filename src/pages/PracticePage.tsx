import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Database, Sparkles, ArrowRight } from 'lucide-react';
import { ARENA_QUESTIONS } from '@/features/codearena/questions';

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'python' | 'sql'>('all');

  const pythonQuestions = ARENA_QUESTIONS.filter((q) => !q.schema_sql);
  const sqlQuestions = ARENA_QUESTIONS.filter((q) => Boolean(q.schema_sql));

  const questionsToShow =
    activeTab === 'python'
      ? pythonQuestions
      : activeTab === 'sql'
      ? sqlQuestions
      : ARENA_QUESTIONS;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="pill pill-lavender">Practice Hub</span>
          <span className="pill pill-mint">{ARENA_QUESTIONS.length} Interactive Exercises</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Practice & Master Your Skills
        </h1>
        <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
          Solve hands-on Python and SQL coding challenges directly in your browser with instant testing and schema execution.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="card p-6 flex flex-col justify-between space-y-4 hover:shadow-card transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Code2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Python Practice</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Master control flow, functions, string manipulation, data structures, and algorithmic logic through {pythonQuestions.length} Python challenges.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('python')}
            className="btn-secondary self-start text-xs py-2 px-4 flex items-center gap-2"
          >
            <span>Filter Python ({pythonQuestions.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="card p-6 flex flex-col justify-between space-y-4 hover:shadow-card transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">SQL Practice</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Run real SQL queries against SQLite databases. Practice SELECT, WHERE, ORDER BY, GROUP BY, HAVING, JOINs, and database schema queries.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('sql')}
            className="btn-secondary self-start text-xs py-2 px-4 flex items-center gap-2"
          >
            <span>Filter SQL ({sqlQuestions.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* CodeArena Banner */}
      <div className="card p-6 bg-gradient-to-r from-gray-900 via-gray-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
            <Sparkles size={16} />
            Full Screen CodeArena
          </div>
          <h2 className="text-2xl font-bold text-white">Ready for a full IDE environment?</h2>
          <p className="text-gray-300 text-sm max-w-xl leading-relaxed">
            Jump into CodeArena for split-screen problem solving, instant test case execution, schema viewers, and automatic progress tracking.
          </p>
        </div>
        <Link to="/arena" className="btn-primary shrink-0 text-sm py-3 px-6 bg-indigo-600 hover:bg-indigo-500">
          Enter CodeArena
        </Link>
      </div>

      {/* Filter Tabs & Question List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-xl font-bold text-gray-900">All Exercises</h2>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {(['all', 'python', 'sql'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'all' ? `All (${ARENA_QUESTIONS.length})` : tab === 'python' ? `Python (${pythonQuestions.length})` : `SQL (${sqlQuestions.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {questionsToShow.map((q) => {
            const isSql = Boolean(q.schema_sql);
            return (
              <Link
                key={q.id}
                to={`/arena/${q.slug}`}
                className="card p-4 hover:border-indigo-300 hover:shadow-card transition-all flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`pill ${isSql ? 'pill-lavender' : 'pill-mint'} capitalize text-[10px]`}>
                      {isSql ? 'SQL' : 'Python'}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">{q.difficulty}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
                    {q.title}
                  </h3>
                </div>
                <div className="shrink-0 flex items-center text-gray-400 group-hover:text-indigo-600 transition-colors">
                  <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
