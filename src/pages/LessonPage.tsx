import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { loadLesson, loadLessonsForPath } from '@/lib/contentLoader';
import { startLesson, completeLesson, getLessonProgress, logActivity } from '@/lib/firestore';
import { useAuth } from '@/features/auth/AuthProvider';
import { LessonBlockRenderer } from '@/components/lesson/LessonBlockRenderer';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { ModuleBackgroundGraphic } from '@/components/ui/ModuleBackgroundGraphic';
import type { Lesson } from '@/types';

export default function LessonPage() {
  const { pathSlug, lessonSlug } = useParams<{ pathSlug: string; lessonSlug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedBlocks, setCompletedBlocks] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!pathSlug || !lessonSlug) return;
    setLoading(true);
    setFinished(false);
    setCompletedBlocks(new Set());

    Promise.all([
      loadLesson(pathSlug, lessonSlug),
      loadLessonsForPath(pathSlug),
    ]).then(([ls, all]) => {
      setLesson(ls);
      setAllLessons(all);
      setLoading(false);
    });
  }, [pathSlug, lessonSlug]);

  // Mark lesson started on load & check existing progress in Firestore
  useEffect(() => {
    if (!user || !lesson) return;
    const userId = user.uid;
    const currLesson = lesson;
    let cancelled = false;

    async function syncProgress() {
      const existingProgress = await getLessonProgress(userId, currLesson.id);
      if (cancelled) return;

      if (existingProgress?.status === 'completed') {
        setFinished(true);
      } else {
        setFinished(false);
      }

      await startLesson(userId, currLesson.id, currLesson.pathId);
    }

    syncProgress();

    return () => {
      cancelled = true;
    };
  }, [user, lesson]);

  const currentIdx = allLessons.findIndex((l) => l.slug === lessonSlug);
  const nextLesson = allLessons[currentIdx + 1];
  const prevLesson = allLessons[currentIdx - 1];

  const handleMarkComplete = useCallback(async () => {
    if (!user || !lesson) return;
    const score = completedBlocks.size / Math.max(1, lesson.blocks.length);
    await completeLesson(user.uid, lesson.id, lesson.pathId, Math.round(score * 100));
    setFinished(true);
  }, [user, lesson, completedBlocks]);

  const handleCodeRun = useCallback(() => {
    if (!user || !lesson) return;
    logActivity(user.uid, 'code_run', { lessonId: lesson.id });
  }, [user, lesson]);

  if (loading) return <div className="p-12 text-gray-400">Loading lesson…</div>;
  if (!lesson) return <div className="p-12 text-gray-400">Lesson not found.</div>;

  return (
    <div className="relative max-w-2xl mx-auto px-6 py-10 space-y-8">
      <ModuleBackgroundGraphic pathSlug={pathSlug} />
      {/* Top navigation with Back button */}
      <nav className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white border border-gray-200 rounded-xl px-3.5 py-2 hover:bg-gray-50 transition-all shadow-sm"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <span className="text-gray-300">/</span>
        <Link to={`/paths/${pathSlug}`} className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
          Path Overview
        </Link>
      </nav>

      {/* Lesson header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="pill pill-mint">{lesson.difficulty}</span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} /> {lesson.estimatedMinutes}m
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
        <p className="text-gray-500 text-sm">{lesson.description}</p>
      </div>

      {/* Lesson blocks */}
      <div className="space-y-6">
        {lesson.blocks.map((block, idx) => (
          <div key={idx}>
            <LessonBlockRenderer
              block={block}
              onMultipleChoiceAnswer={(correct) => {
                logActivity(user?.uid ?? '', 'question_answered', {
                  lessonId: lesson.id,
                  blockIdx: idx,
                  correct,
                });
                if (correct) setCompletedBlocks((s) => new Set(s).add(idx));
              }}
              onCodeRun={handleCodeRun}
              onChallengeComplete={(passed) => {
                if (passed) setCompletedBlocks((s) => new Set(s).add(idx));
              }}
            />
          </div>
        ))}
      </div>

      {/* Complete / nav */}
      <div className="border-t border-gray-100 pt-6 flex items-center justify-between gap-4">
        {prevLesson ? (
          <Link
            to={`/learn/${pathSlug}/${prevLesson.slug}`}
            className="btn-secondary text-sm"
          >
            <ChevronLeft size={14} /> Previous
          </Link>
        ) : (
          <div />
        )}

        {finished ? (
          <div className="flex items-center gap-2 text-mint-400 font-medium text-sm">
            <CheckCircle2 size={18} /> Lesson complete!
          </div>
        ) : (
          <button onClick={handleMarkComplete} className="btn-primary text-sm">
            Mark complete <CheckCircle2 size={14} />
          </button>
        )}

        {nextLesson && finished ? (
          <Link
            to={`/learn/${pathSlug}/${nextLesson.slug}`}
            className="btn-primary text-sm"
          >
            Next <ChevronRight size={14} />
          </Link>
        ) : nextLesson ? (
          <button className="btn-secondary text-sm opacity-50" disabled>
            Next <ChevronRight size={14} />
          </button>
        ) : (
          <Link to={`/paths/${pathSlug}`} className="btn-secondary text-sm">
            Finish path
          </Link>
        )}
      </div>
    </div>
  );
}
