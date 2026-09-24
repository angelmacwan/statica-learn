import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Lock, Filter, Swords } from 'lucide-react';
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
    <div className="min-h-screen bg-cream-50 pb-16">
      {/* Hero */}
      <div className="bg-cream-100/60 border-b border-cream-200 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 mb-3">
                <Swords size={13} /> Practical Code Challenges
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Code<span className="text-amber-700">Arena</span>
              </h1>
              <p className="mt-2 text-gray-600 text-sm max-w-lg leading-relaxed">
                Practice real coding challenges. Pick a problem, write your solution, watch the tests
                pass. Interactive feedback with immediate execution.
              </p>
            </div>
            {user && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-100/80 border border-amber-200/90 rounded-2xl shadow-soft">
                <CheckCircle2 size={18} className="text-amber-700" />
                <span className="text-sm font-bold text-amber-900">
                  {totalSolved} / {ARENA_QUESTIONS.length} Solved
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Filter size={13} />
            Filter:
          </div>

          {/* Category */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter((f) => ({ ...f, category: 'all' }))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter.category === 'all'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-cream-50 border border-cream-200 text-gray-700 hover:bg-cream-100'
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
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    filter.category === cat
                      ? 'bg-amber-700 text-white shadow-sm'
                      : 'bg-cream-50 border border-cream-200 text-gray-700 hover:bg-cream-100'
                  }`}
                >
                  {meta.emoji} {meta.label}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-cream-300" />

          {/* Difficulty */}
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() =>
                setFilter((f) => ({ ...f, difficulty: f.difficulty === diff ? 'all' : diff }))
              }
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filter.difficulty === diff
                  ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
                  : `${DIFFICULTY_META[diff].color} hover:opacity-80`
              }`}
            >
              {DIFFICULTY_META[diff].label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs font-medium text-gray-500 mb-3 px-1">
          Showing {filtered.length} problem{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Question list */}
        <div className="space-y-2.5">
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
                className="flex items-center gap-4 bg-white border border-cream-200 rounded-2xl px-5 py-4 hover:border-amber-400 hover:shadow-md transition-all group"
              >
                {/* Status icon */}
                <div className="flex-shrink-0 w-6">
                  {solved ? (
                    <CheckCircle2 size={20} className="text-emerald-600 fill-emerald-100" />
                  ) : attempted ? (
                    <div className="w-4 h-4 rounded-full border-2 border-amber-500 bg-amber-100" />
                  ) : !user ? (
                    <Lock size={16} className="text-gray-300" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  )}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-bold text-gray-900 group-hover:text-amber-800 transition-colors">
                    {q.title}
                  </span>
                  {prog?.totalAttempts ? (
                    <span className="ml-2 text-xs text-gray-400 font-medium">
                      ({prog.totalAttempts} attempt{prog.totalAttempts !== 1 ? 's' : ''})
                    </span>
                  ) : null}
                </div>

                {/* Category */}
                <span
                  className={`hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${catMeta.color}`}
                >
                  {catMeta.emoji} {catMeta.label}
                </span>

                {/* Difficulty */}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${diffMeta.color}`}
                >
                  {diffMeta.label}
                </span>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white border border-cream-200 rounded-2xl text-gray-500 text-sm shadow-soft">
            No problems match those filters.
          </div>
        )}
      </div>
    </div>
  );
}
