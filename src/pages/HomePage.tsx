import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthProvider';
import { loadAllPaths, loadLessonsForPath } from '@/lib/contentLoader';
import { getAllProgress } from '@/lib/firestore';
import { ArrowRight, BookOpen, Zap, Clock, SortAsc } from 'lucide-react';
import { getModulePastelStyle } from '@/lib/modulePastels';
import { InfinityLoader } from '@/components/ui/InfinityLoader';
import type { Path } from '@/types';

type SortOption = 'last_accessed' | 'name';

interface PathProgressInfo {
  completed: number;
  total: number;
  lastAccessed: Date;
  started: boolean;
}

export default function HomePage() {
  const { user, contentWidthClass } = useAuth();
  const [paths, setPaths] = useState<Path[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, PathProgressInfo>>({});
  const [lessonCountMap, setLessonCountMap] = useState<Record<string, number>>({});
  const [sortBy, setSortBy] = useState<SortOption>('last_accessed');
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    loadAllPaths().then((loaded) => {
      setPaths(loaded);
      Promise.all(
        loaded.map((p) => loadLessonsForPath(p.slug).then((ls) => ({ id: p.id, count: ls.length })))
      ).then((results) => {
        const map: Record<string, number> = {};
        results.forEach(({ id, count }) => {
          map[id] = count;
        });
        setLessonCountMap(map);
      });
    });
  }, []);

  useEffect(() => {
    if (!user || paths.length === 0) {
      setLoadingProgress(false);
      return;
    }

    (async () => {
      setLoadingProgress(true);
      const lessonCounts = await Promise.all(
        paths.map((p) => loadLessonsForPath(p.slug).then((ls) => ({ pathId: p.id, total: ls.length })))
      );
      const totalByPath: Record<string, number> = {};
      lessonCounts.forEach(({ pathId, total }) => {
        totalByPath[pathId] = total;
      });

      const firestoreProgress = await getAllProgress(user.uid);

      const completedByPath: Record<string, number> = {};
      const lastAccessedByPath: Record<string, Date> = {};
      const startedByPath: Record<string, boolean> = {};

      Object.values(firestoreProgress).forEach((prog) => {
        const pId = prog.pathId;
        startedByPath[pId] = true;
        if (prog.status === 'completed') {
          completedByPath[pId] = (completedByPath[pId] ?? 0) + 1;
        }
        if (prog.lastAccessedAt) {
          const t = new Date(prog.lastAccessedAt);
          if (!lastAccessedByPath[pId] || t > lastAccessedByPath[pId]) {
            lastAccessedByPath[pId] = t;
          }
        }
      });

      const result: Record<string, PathProgressInfo> = {};
      paths.forEach((p) => {
        const total = totalByPath[p.id] ?? 0;
        const completed = completedByPath[p.id] ?? 0;
        const started = startedByPath[p.id] ?? false;
        const lastAccessed = lastAccessedByPath[p.id] ?? new Date(0);

        if (started || completed > 0) {
          result[p.id] = { completed, total, lastAccessed, started };
        }
      });

      setProgressMap(result);
      setLoadingProgress(false);
    })();
  }, [user, paths]);

  // Filter paths to ONLY active in-progress modules (started but NOT 100% completed)
  const activePaths = paths.filter((p) => {
    const prog = progressMap[p.id];
    if (!prog) return false;
    // Active means user has started it, but not completed all lessons
    return prog.started && prog.completed < prog.total;
  });

  // Sort active paths by chosen criteria
  const sortedActivePaths = [...activePaths].sort((a, b) => {
    if (sortBy === 'name') {
      return a.title.localeCompare(b.title);
    }
    // Default: last_accessed (most recent first)
    const timeA = progressMap[a.id]?.lastAccessed?.getTime() ?? 0;
    const timeB = progressMap[b.id]?.lastAccessed?.getTime() ?? 0;
    return timeB - timeA;
  });

  return (
    <div className={`relative z-10 ${contentWidthClass} mx-auto px-4 sm:px-6 py-12 space-y-12 transition-all duration-300`}>
      {/* Hero */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          {user ? `Welcome back${user.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}` : 'Learn by doing.'}
        </h1>
        <p className="text-lg text-gray-500 max-w-xl">
          Hands-on coding paths and exercises. Built one lesson at a time.
        </p>
        {!user && (
          <div className="flex gap-3 pt-2">
            <Link to="/explore" className="btn-primary">
              Start learning <ArrowRight size={15} />
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign in
            </Link>
          </div>
        )}
      </section>

      {/* Active In-Progress Modules Section */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-900">In-Progress Modules</h2>

          <div className="flex items-center gap-3">
            {/* Sort Toggle Option */}
            {sortedActivePaths.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1 text-xs shadow-xs">
                <button
                  onClick={() => setSortBy('last_accessed')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    sortBy === 'last_accessed'
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Clock size={12} /> Recent
                </button>
                <button
                  onClick={() => setSortBy('name')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    sortBy === 'name'
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <SortAsc size={12} /> Name
                </button>
              </div>
            )}

            <Link to="/explore" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
              Explore all <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {loadingProgress ? (
          <div className="py-12 flex justify-center">
            <InfinityLoader size="md" text="Loading active modules..." />
          </div>
        ) : sortedActivePaths.length === 0 ? (
          /* Empty State when no active modules in progress */
          <div className="card p-8 sm:p-12 text-center space-y-4 bg-white/90 border border-gray-100 shadow-soft rounded-3xl">
            <div className="w-16 h-16 rounded-2xl bg-mint-50 border border-mint-100 flex items-center justify-center mx-auto text-mint-400">
              <BookOpen size={30} />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-gray-900">No Modules in Progress</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                You don't have any active modules right now. Explore our learning paths and pick a module to start building your skills!
              </p>
            </div>
            <div className="pt-2">
              <Link to="/explore" className="btn-primary inline-flex items-center gap-2">
                Explore All Paths <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        ) : (
          /* Grid of Active Modules */
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedActivePaths.map((path, idx) => (
              <PathCard
                key={path.id}
                path={path}
                index={idx}
                progress={progressMap[path.id]}
                lessonCount={lessonCountMap[path.id]}
              />
            ))}
          </div>
        )}
      </section>

      {/* CodeArena quick action */}
      <section>
        <Link
          to="/arena"
          className="card p-5 hover:shadow-card transition-all group flex items-center justify-between gap-4 bg-gradient-to-r from-gray-900 to-indigo-950 text-white"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              <Zap size={15} /> CodeArena
            </div>
            <h3 className="font-bold text-white text-base">Practice Interactive Coding Challenges</h3>
            <p className="text-xs text-gray-300">Solve Python and SQL coding challenges with instant tests and execution.</p>
          </div>
          <div className="btn-primary text-xs py-2 px-4 bg-indigo-600 hover:bg-indigo-500 shrink-0">
            Enter Arena
          </div>
        </Link>
      </section>
    </div>
  );
}

function PathCard({
  path,
  index = 0,
  progress,
  lessonCount,
}: {
  path: Path;
  index?: number;
  progress?: PathProgressInfo;
  lessonCount?: number;
}) {
  const difficultyColor: Record<string, string> = {
    intro: 'pill-mint',
    easy: 'pill-mint',
    medium: 'pill-coral',
    hard: 'pill-blush',
  };

  const pastelStyle = getModulePastelStyle(path.slug, index);

  const pct = progress && progress.total > 0
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  const totalLessons = lessonCount ?? progress?.total ?? 0;

  return (
    <Link
      to={`/paths/${path.slug}`}
      className={`rounded-2xl p-5 border shadow-soft transition-all flex flex-col gap-3 group ${pastelStyle.cardClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-gray-700 leading-snug">
          {path.title}
        </h3>
        <span className={`pill shrink-0 ${difficultyColor[path.difficulty] ?? 'pill-mint'}`}>
          {path.difficulty}
        </span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{path.description}</p>

      {progress && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>{progress.completed} / {progress.total} lessons completed</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 bg-white/80 border border-gray-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-mint-400 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {totalLessons > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-1">
          <span>{totalLessons} lessons</span>
          <span className="text-gray-700 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
            Continue <ArrowRight size={12} />
          </span>
        </div>
      )}
    </Link>
  );
}
