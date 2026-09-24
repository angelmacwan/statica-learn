import { Link } from 'react-router-dom';
import {
  ListOrdered,
  BookOpen,
  Code2,
  HelpCircle,
  Trophy,
  Terminal as TerminalIcon,
  CheckCircle2,
  Circle,
  Layers,
  ChevronRight,
  Clock,
} from 'lucide-react';
import type { Lesson, LessonBlock } from '@/types';

interface Props {
  lesson: Lesson;
  allLessons: Lesson[];
  pathSlug: string;
  completedBlocks: Set<number>;
  activeBlockIdx: number;
  onSelectBlock: (idx: number) => void;
}

function getBlockTitle(block: LessonBlock): string {
  switch (block.type) {
    case 'text': {
      const match = block.content.match(/^(?:#+\s+)(.+)$/m);
      if (match && match[1]) {
        return match[1].replace(/[*_`]/g, '').trim();
      }
      const firstLine = block.content.split('\n')[0].replace(/[*_#`]/g, '').trim();
      return firstLine.length > 32 ? firstLine.substring(0, 32) + '…' : firstLine || 'Concept Overview';
    }
    case 'multipleChoice': {
      const q = block.question.replace(/[`*_]/g, '').trim();
      return q.length > 32 ? q.substring(0, 32) + '…' : q || 'Knowledge Check';
    }
    case 'code':
      return `${block.language ? block.language.charAt(0).toUpperCase() + block.language.slice(1) : 'Code'} Practice`;
    case 'challenge': {
      const p = block.prompt.replace(/[`*_]/g, '').trim();
      return p.length > 32 ? p.substring(0, 32) + '…' : p || 'Challenge Task';
    }
    case 'terminal':
      return 'Terminal Command';
    default:
      return 'Lesson Step';
  }
}

function getBlockIcon(type: LessonBlock['type']) {
  switch (type) {
    case 'text':
      return BookOpen;
    case 'code':
      return Code2;
    case 'multipleChoice':
      return HelpCircle;
    case 'challenge':
      return Trophy;
    case 'terminal':
      return TerminalIcon;
    default:
      return BookOpen;
  }
}

export function FloatingLessonPlan({
  lesson,
  allLessons,
  pathSlug,
  completedBlocks,
  activeBlockIdx,
  onSelectBlock,
}: Props) {
  const totalBlocks = lesson.blocks.length;
  const completedCount = completedBlocks.size;
  const progressPct = totalBlocks > 0 ? Math.round((completedCount / totalBlocks) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Floating Card 1: Lesson Plan Steps */}
      <div className="card p-4 space-y-4 shadow-soft bg-white/95 backdrop-blur border border-gray-100/90 rounded-2xl">
        {/* Card Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-mint-100 text-mint-400">
                <ListOrdered size={16} />
              </div>
              <h2 className="text-sm font-bold text-gray-900 tracking-tight">Lesson Plan</h2>
            </div>
            <span className="text-[11px] font-semibold text-mint-400 bg-mint-50 px-2 py-0.5 rounded-full border border-mint-100">
              {completedCount}/{totalBlocks} Steps
            </span>
          </div>

          {/* Mini progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-mint-300 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Step-by-Step Floating Cards */}
        <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
          {lesson.blocks.map((block, idx) => {
            const Icon = getBlockIcon(block.type);
            const isCompleted = completedBlocks.has(idx);
            const isActive = activeBlockIdx === idx;
            const title = getBlockTitle(block);

            return (
              <button
                key={idx}
                onClick={() => onSelectBlock(idx)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 border ${
                  isActive
                    ? 'border-mint-300 bg-mint-50/80 text-gray-900 font-semibold shadow-xs ring-1 ring-mint-300/40'
                    : isCompleted
                    ? 'border-gray-100 bg-gray-50/60 text-gray-700 hover:bg-gray-100/80'
                    : 'border-transparent hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-[10px] text-gray-400 shrink-0 w-3 text-right">
                    {idx + 1}
                  </span>
                  <Icon
                    size={14}
                    className={`shrink-0 ${
                      isActive ? 'text-mint-400' : isCompleted ? 'text-mint-300' : 'text-gray-400'
                    }`}
                  />
                  <span className="truncate">{title}</span>
                </div>

                {isCompleted ? (
                  <CheckCircle2 size={14} className="text-mint-400 shrink-0" />
                ) : isActive ? (
                  <div className="w-2 h-2 rounded-full bg-mint-400 animate-pulse shrink-0" />
                ) : (
                  <Circle size={12} className="text-gray-300 shrink-0 opacity-40" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Card 2: Path Curriculum Outline */}
      {allLessons.length > 0 && (
        <div className="card p-4 space-y-3 bg-white/90 backdrop-blur border border-gray-100 rounded-2xl hidden md:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={15} className="text-gray-500" />
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Path Outline</h3>
            </div>
            <Link
              to={`/paths/${pathSlug}`}
              className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-0.5"
            >
              All <ChevronRight size={12} />
            </Link>
          </div>

          <div className="space-y-1">
            {allLessons.slice(0, 6).map((l, i) => {
              const isCurrent = l.slug === lesson.slug;
              return (
                <Link
                  key={l.id}
                  to={`/learn/${pathSlug}/${l.slug}`}
                  className={`flex items-center justify-between gap-2 p-2 rounded-xl text-xs transition-all ${
                    isCurrent
                      ? 'bg-gray-900 text-white font-medium shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="truncate flex-1">
                    {i + 1}. {l.title}
                  </span>
                  {isCurrent ? (
                    <span className="text-[10px] bg-mint-400 text-gray-900 px-1.5 py-0.5 rounded font-bold shrink-0">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5 shrink-0">
                      <Clock size={10} /> {l.estimatedMinutes}m
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
