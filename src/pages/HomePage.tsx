import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthProvider';
import { loadAllPaths } from '@/lib/contentLoader';
import { getAllProgress } from '@/lib/firestore';
import { ArrowRight, BookOpen, Zap } from 'lucide-react';
import type { Path } from '@/types';

export default function HomePage() {
  const { user } = useAuth();
  const [paths, setPaths] = useState<Path[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    loadAllPaths().then(setPaths);
  }, []);

  useEffect(() => {
    if (!user) return;
    getAllProgress(user.uid).then((p) => {
      // Build per-path completion percentage
      const counts: Record<string, { total: number; done: number }> = {};
      Object.values(p).forEach((prog) => {
        if (!counts[prog.pathId]) counts[prog.pathId] = { total: 0, done: 0 };
        counts[prog.pathId].total++;
        if (prog.status === 'completed') counts[prog.pathId].done++;
      });
      const pct: Record<string, number> = {};
      Object.entries(counts).forEach(([id, { total, done }]) => {
        pct[id] = Math.round((done / total) * 100);
      });
      setProgressMap(pct);
    });
  }, [user]);

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
              <PathCard key={path.id} path={path} progress={progressMap[path.id]} />
            ))}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-2 gap-4">
        <Link
          to="/practice"
          className="card p-5 hover:shadow-card transition-all group flex flex-col gap-2"
        >
          <Zap size={20} className="text-mint-400" />
          <h3 className="font-semibold text-gray-900 text-sm">Practice</h3>
          <p className="text-xs text-gray-500">Standalone exercises to sharpen specific skills.</p>
        </Link>
        <Link
          to="/projects"
          className="card p-5 hover:shadow-card transition-all group flex flex-col gap-2"
        >
          <BookOpen size={20} className="text-coral-300" />
          <h3 className="font-semibold text-gray-900 text-sm">Projects</h3>
          <p className="text-xs text-gray-500">Apply what you've learned to real projects.</p>
        </Link>
      </section>
    </div>
  );
}

function PathCard({ path, progress }: { path: Path; progress?: number }) {
  const difficultyColor: Record<string, string> = {
    intro: 'pill-mint',
    easy: 'pill-mint',
    medium: 'pill-coral',
    hard: 'pill-blush',
  };

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

      {typeof progress === 'number' && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-mint-300 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-1 text-xs text-gray-400 mt-auto">
        <span>{path.moduleIds.length} modules</span>
      </div>
    </Link>
  );
}
