import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { loadPath, loadLessonsForPath } from '@/lib/contentLoader';
import { getAllProgress } from '@/lib/firestore';
import { useAuth } from '@/features/auth/AuthProvider';
import { Clock, CheckCircle2, Circle, Lock, ArrowLeft } from 'lucide-react';
import { ModuleBackgroundGraphic } from '@/components/ui/ModuleBackgroundGraphic';
import { getModulePastelStyle } from '@/lib/modulePastels';
import type { Path, Lesson } from '@/types';

export default function PathPage() {
  const { pathSlug } = useParams<{ pathSlug: string }>();
  const { user, contentWidthClass } = useAuth();
  const [path, setPath] = useState<Path | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pathSlug) return;
    Promise.all([loadPath(pathSlug), loadLessonsForPath(pathSlug)]).then(([p, ls]) => {
      setPath(p);
      setLessons(ls);
      setLoading(false);
    });
  }, [pathSlug]);

  useEffect(() => {
    if (!user) return;
    getAllProgress(user.uid).then((p) => {
      const map: Record<string, string> = {};
      Object.entries(p).forEach(([id, prog]) => {
        map[id] = prog.status;
      });
      setProgress(map);
    });
  }, [user]);

  if (loading) return <div className="p-12 text-gray-400">Loading…</div>;
  if (!path) return <div className="p-12 text-gray-400">Path not found.</div>;

  const completedCount = lessons.filter((l) => progress[l.id] === 'completed').length;
  const pct = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const pastelStyle = getModulePastelStyle(path.slug);

  return (
    <div className={`relative ${contentWidthClass} mx-auto px-4 sm:px-6 py-10 space-y-8 transition-all duration-300`}>
      <ModuleBackgroundGraphic pathSlug={pathSlug} />
      {/* Header */}
      <div className={`space-y-4 rounded-2xl p-6 border shadow-soft ${pastelStyle.cardClass}`}>
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white/80 border border-gray-200 rounded-xl px-3.5 py-2 hover:bg-white transition-all shadow-sm mb-2"
        >
          <ArrowLeft size={14} /> Back to Explore
        </Link>
        <div className="flex items-center gap-2">
          <span className="pill pill-mint">{path.difficulty}</span>
          <span className="pill pill-lavender capitalize">{path.category.replace('-', ' ')}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{path.title}</h1>
        <p className="text-gray-600 text-sm leading-relaxed">{path.description}</p>

        {user && lessons.length > 0 && (
          <div className="space-y-1 max-w-xs pt-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{completedCount} / {lessons.length} lessons</span>
              <span className="font-semibold">{pct}%</span>
            </div>
            <div className="h-2 bg-white/80 border border-gray-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-mint-400 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lesson list */}
      <div className="space-y-2">
        {lessons.map((lesson, idx) => {
          const status = progress[lesson.id] ?? 'not_started';
          const isFirst = idx === 0;
          const prevCompleted = idx === 0 || progress[lessons[idx - 1].id] === 'completed';
          const accessible = isFirst || prevCompleted || status !== 'not_started';

          return (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              pathSlug={path.slug}
              status={status}
              accessible={accessible}
              index={idx + 1}
            />
          );
        })}
      </div>
    </div>
  );
}

function LessonRow({
  lesson,
  pathSlug,
  status,
  accessible,
  index,
}: {
  lesson: Lesson;
  pathSlug: string;
  status: string;
  accessible: boolean;
  index: number;
}) {
  const icon =
    status === 'completed' ? (
      <CheckCircle2 size={18} className="text-mint-400 shrink-0" />
    ) : !accessible ? (
      <Lock size={16} className="text-gray-300 shrink-0" />
    ) : (
      <Circle size={18} className="text-gray-300 shrink-0" />
    );

  const inner = (
    <>
      <span className="text-xs text-gray-300 font-mono w-5 text-right shrink-0">{index}</span>
      {icon}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-gray-900 truncate">{lesson.title}</h3>
        <p className="text-xs text-gray-400 truncate">{lesson.description}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
        <Clock size={12} />
        {lesson.estimatedMinutes}m
      </div>
    </>
  );

  const baseClassName = `card p-4 flex items-center gap-4 transition-all block w-full ${
    accessible ? 'hover:shadow-card cursor-pointer' : 'opacity-60 cursor-not-allowed'
  }`;

  if (!accessible) {
    return <div className={baseClassName}>{inner}</div>;
  }

  return (
    <Link to={`/learn/${pathSlug}/${lesson.slug}`} className={baseClassName}>
      {inner}
    </Link>
  );
}
