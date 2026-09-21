import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { MultipleChoiceBlock as MultipleChoiceBlockType } from '@/types';

interface Props {
  block: MultipleChoiceBlockType;
  onAnswer?: (correct: boolean) => void;
}

export function MultipleChoiceBlock({ block, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    onAnswer?.(idx === block.correctIndex);
  };

  return (
    <div className="card p-6 space-y-4">
      {/* Question — may contain code snippet */}
      <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed text-gray-800">
        {block.question}
      </pre>

      {/* Options */}
      <div className="space-y-2">
        {block.options.map((option, idx) => {
          const isCorrect = idx === block.correctIndex;
          const isSelected = selected === idx;
          let style =
            'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50';
          if (answered && isSelected && isCorrect)
            style = 'border-2 border-mint-300 bg-mint-50 text-gray-900';
          else if (answered && isSelected && !isCorrect)
            style = 'border-2 border-blush-300 bg-blush-50 text-gray-900';
          else if (answered && isCorrect)
            style = 'border border-mint-200 bg-mint-50 text-gray-700';

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between gap-3 ${style}`}
            >
              <span className="flex-1">{option}</span>
              {answered && isSelected && isCorrect && (
                <CheckCircle2 size={18} className="text-mint-400 shrink-0" />
              )}
              {answered && isSelected && !isCorrect && (
                <XCircle size={18} className="text-blush-300 shrink-0" />
              )}
              {answered && !isSelected && isCorrect && (
                <CheckCircle2 size={18} className="text-mint-300 shrink-0 opacity-50" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && block.explanation && (
        <div className="bg-lavender-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
          <span className="font-medium">Why: </span>
          {block.explanation}
        </div>
      )}
    </div>
  );
}
