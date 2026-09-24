import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Lock, Filter } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthProvider';
import { ARENA_QUESTIONS, CATEGORIES, DIFFICULTY_META } from '../questions';
import { getAllArenaProgress } from '../arenaFirestore';
import type { ArenaProgress, Category, Difficulty } from '../types';

type FilterState = {
  category: Category | 'all';
  difficulty: Difficulty | 'all';
};

export function ArenaLobbyPage() {
  const { user } = useAuth();
  const [allProgress, setAllProgress] = useState<Record<string, ArenaProgress>>({});
  const [filter, setFilter] = useState<FilterState>({ category: 'all', difficulty: 'all' });

  useEffect(() => {
    if (!user) return;
    getAllArenaProgress(user.uid).then(setAllProgress);
  }, [user?.uid]);

  const filtered = ARENA_QUESTIONS.filter((q) => {
    if (filter.category !== 'all' && q.category !== filter.category) return false;
    if (filter.difficulty !== 'all' && q.difficulty !== filter.difficulty) return false;
    return true;
  });

  const totalSolved = Object.values(allProgress).filter((p) => p.bestStatus === 'pass').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Code<span className="text-indigo-600">Arena</span>
              </h1>
              <p className="mt-2 text-gray-500 text-sm max-w-lg">
                Practice real coding challenges. Pick a problem, write your solution, watch the tests
                pass. No fluff, just code.
              </p>
            </div>
            {user && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 rounded-xl">
                <CheckCircle2 size={16} className="text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-700">
                  {totalSolved} / {ARENA_QUESTIONS.length} solved
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Filter size={13} />
            Filter:
          </div>

          {/* Category */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter((f) => ({ ...f, category: 'all' }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter.category === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              All Topics
            </button>
            {(Object.keys(CATEGORIES) as Category[]).map((cat) => {
              const meta = CATEGORIES[cat];
              return (
                <button
                  key={cat}
                  onClick={() =>
                    setFilter((f) => ({ ...f, category: f.category === cat ? 'all' : cat }))
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filter.category === cat
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {meta.emoji} {meta.label}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200" />

          {/* Difficulty */}
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() =>
                setFilter((f) => ({ ...f, difficulty: f.difficulty === diff ? 'all' : diff }))
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filter.difficulty === diff
                  ? 'bg-gray-900 text-white border-gray-900'
                  : `${DIFFICULTY_META[diff].color} hover:opacity-80`
              }`}
            >
              {DIFFICULTY_META[diff].label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-400 mb-4">
          {filtered.length} problem{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Question list */}
        <div className="space-y-2">
          {filtered.map((q) => {
            const prog = allProgress[q.id];
            const solved = prog?.bestStatus === 'pass';
            const attempted = prog && prog.bestStatus !== 'unsolved' && !solved;
            const catMeta = CATEGORIES[q.category];
            const diffMeta = DIFFICULTY_META[q.difficulty];

            return (
              <Link
                key={q.id}
                to={user ? `/arena/${q.slug}` : '/login'}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-indigo-300 hover:shadow-sm transition-all group"
              >
                {/* Status icon */}
                <div className="flex-shrink-0 w-6">
                  {solved ? (
                    <CheckCircle2 size={18} className="text-green-500" />
                  ) : attempted ? (
                    <div className="w-4 h-4 rounded-full border-2 border-yellow-400 bg-yellow-50" />
                  ) : !user ? (
                    <Lock size={15} className="text-gray-300" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
                  )}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                    {q.title}
                  </span>
                  {prog?.totalAttempts ? (
                    <span className="ml-2 text-xs text-gray-400">
                      {prog.totalAttempts} attempt{prog.totalAttempts !== 1 ? 's' : ''}
                    </span>
                  ) : null}
                </div>

                {/* Category */}
                <span
                  className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${catMeta.color}`}
                >
                  {catMeta.emoji} {catMeta.label}
                </span>

                {/* Difficulty */}
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${diffMeta.color}`}
                >
                  {diffMeta.label}
                </span>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            No problems match those filters.
          </div>
        )}
      </div>
    </div>
  );
}
