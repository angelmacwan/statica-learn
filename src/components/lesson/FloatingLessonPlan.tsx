import { Link } from 'react-router-dom';
import { Layers, ChevronRight, Clock, Lock, CheckCircle2 } from 'lucide-react';
import type { Lesson } from '@/types';

interface Props {
  lesson: Lesson;
  allLessons: Lesson[];
  pathSlug: string;
  lessonProgressMap?: Record<string, string>;
}

export function FloatingLessonPlan({
  lesson,
  allLessons,
  pathSlug,
  lessonProgressMap = {},
}: Props) {
  const currentIdx = allLessons.findIndex((l) => l.slug === lesson.slug);

  const isAccessible = (idx: number): boolean => {
    if (idx === 0) return true;
    if (idx <= currentIdx) return true;
    const prev = allLessons[idx - 1];
    const prevStatus = lessonProgressMap[prev.id];
    const selfStatus = lessonProgressMap[allLessons[idx].id];
    return prevStatus === 'completed' || (selfStatus !== undefined && selfStatus !== 'not_started');
  };

  const completedCount = allLessons.filter(
    (l) => lessonProgressMap[l.id] === 'completed'
  ).length;

  return (
    <div className="card p-5 space-y-4 bg-white/95 backdrop-blur border border-gray-100 shadow-soft rounded-2xl">
      {/* Path Outline Header */}
      <div className="space-y-2 border-b border-gray-100 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-mint-100 text-mint-400">
              <Layers size={16} />
            </div>
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">Path Outline</h2>
          </div>
          <Link
            to={`/paths/${pathSlug}`}
            className="text-[11px] font-semibold text-gray-400 hover:text-gray-800 transition-colors flex items-center gap-0.5"
          >
            Overview <ChevronRight size={12} />
          </Link>
        </div>

        {/* Progress summary */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
          <span>{allLessons.length} Lessons</span>
          <span className="font-semibold text-mint-400">{completedCount} Completed</span>
        </div>
      </div>

      {/* Curriculum Lesson List */}
      <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
        {allLessons.map((l, i) => {
          const isCurrent = l.slug === lesson.slug;
          const accessible = isAccessible(i);
          const isCompleted = lessonProgressMap[l.id] === 'completed';

          const inner = (
            <>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="font-mono text-[11px] text-gray-400 shrink-0 w-4 text-right">
                  {i + 1}.
                </span>
                <span className="truncate">{l.title}</span>
              </div>

              {isCurrent ? (
                <span className="text-[10px] bg-mint-400 text-gray-900 px-2 py-0.5 rounded-full font-bold shrink-0 shadow-xs">
                  Active
                </span>
              ) : isCompleted ? (
                <CheckCircle2 size={14} className="text-mint-400 shrink-0" />
              ) : accessible ? (
                <span className="text-[10px] text-gray-400 flex items-center gap-0.5 shrink-0">
                  <Clock size={10} /> {l.estimatedMinutes}m
                </span>
              ) : (
                <span className="text-[10px] text-gray-400 flex items-center gap-1 shrink-0">
                  <Lock size={12} className="text-gray-400" />
                </span>
              )}
            </>
          );

          if (!accessible) {
            return (
              <div
                key={l.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl text-xs text-gray-400 bg-gray-50/50 border border-transparent opacity-60 cursor-not-allowed select-none"
                title="Complete previous lesson to unlock"
              >
                {inner}
              </div>
            );
          }

          return (
            <Link
              key={l.id}
              to={`/learn/${pathSlug}/${l.slug}`}
              className={`flex items-center justify-between gap-2 p-2.5 rounded-xl text-xs transition-all ${
                isCurrent
                  ? 'bg-gray-900 text-white font-semibold shadow-xs ring-1 ring-gray-900'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
