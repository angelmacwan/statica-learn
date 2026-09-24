import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthProvider';
import { loadAllPaths, loadLessonsForPath } from '@/lib/contentLoader';
import { getAllProgress } from '@/lib/firestore';
import { ArrowRight, BookOpen, Zap } from 'lucide-react';
import type { Path } from '@/types';

export default function HomePage() {
  const { user } = useAuth();
  const [paths, setPaths] = useState<Path[]>([]);
  // progressMap[pathId] = { completed, total }
  const [progressMap, setProgressMap] = useState<Record<string, { completed: number; total: number }>>({});
  // lessonCountMap[pathId] = total lesson count
  const [lessonCountMap, setLessonCountMap] = useState<Record<string, number>>({});

  useEffect(() => {
    loadAllPaths().then((loaded) => {
      setPaths(loaded);
      // Load lesson counts for all paths immediately (no auth needed)
      Promise.all(
        loaded.map((p) => loadLessonsForPath(p.slug).then((ls) => ({ id: p.id, count: ls.length })))
      ).then((results) => {
        const map: Record<string, number> = {};
        results.forEach(({ id, count }) => { map[id] = count; });
        setLessonCountMap(map);
      });
    });
  }, []);

  useEffect(() => {
    if (!user || paths.length === 0) return;

    (async () => {
      // Load actual lesson counts for all paths in parallel
      const lessonCounts = await Promise.all(
        paths.map((p) => loadLessonsForPath(p.slug).then((ls) => ({ pathId: p.id, total: ls.length })))
      );
      const totalByPath: Record<string, number> = {};
      lessonCounts.forEach(({ pathId, total }) => {
        totalByPath[pathId] = total;
      });

      // Load Firestore progress (only has records for touched lessons)
      const firestoreProgress = await getAllProgress(user.uid);

      // Count completed per path using pathId stored on each progress record
      const completedByPath: Record<string, number> = {};
      Object.values(firestoreProgress).forEach((prog) => {
        if (prog.status === 'completed') {
          completedByPath[prog.pathId] = (completedByPath[prog.pathId] ?? 0) + 1;
        }
      });

      const result: Record<string, { completed: number; total: number }> = {};
      paths.forEach((p) => {
        const total = totalByPath[p.id] ?? 0;
        const completed = completedByPath[p.id] ?? 0;
        // Only show progress bar if user has started this path
        if (completed > 0 || Object.values(firestoreProgress).some((pr) => pr.pathId === p.id)) {
          result[p.id] = { completed, total };
        }
      });
      setProgressMap(result);
    })();
  }, [user, paths]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      {/* Hero */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          {user ? `Welcome back${user.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}` : 'Learn by doing.'}
        </h1>
        <p className="text-lg text-gray-500 max-w-xl">
          Hands-on coding paths and exercises. No fluff - just concrete skills built one lesson at a time.
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

      {/* Paths */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Learning Paths</h2>
          <Link to="/explore" className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {paths.length === 0 ? (
          <div className="card p-8 text-center text-gray-400">
            <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
            <p>Paths coming soon.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {paths.slice(0, 4).map((path) => (
              <PathCard
                key={path.id}
                path={path}
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
  progress,
  lessonCount,
}: {
  path: Path;
  progress?: { completed: number; total: number };
  lessonCount?: number;
}) {
  const difficultyColor: Record<string, string> = {
    intro: 'pill-mint',
    easy: 'pill-mint',
    medium: 'pill-coral',
    hard: 'pill-blush',
  };

  const pct = progress && progress.total > 0
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  const totalLessons = lessonCount ?? progress?.total ?? 0;

  return (
    <Link
      to={`/paths/${path.slug}`}
      className="card p-5 hover:shadow-card transition-all flex flex-col gap-3 group"
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
          <div className="flex justify-between text-xs text-gray-400">
            <span>{progress.completed} / {progress.total} lessons</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-mint-300 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {totalLessons > 0 && (
        <div className="flex items-center gap-1 text-xs text-gray-400 mt-auto">
          <span>{totalLessons} lessons</span>
        </div>
      )}
    </Link>
  );
}
