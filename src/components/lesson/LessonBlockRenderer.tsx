import { TextBlock } from './TextBlock';
import { MultipleChoiceBlock } from './MultipleChoiceBlock';
import { CodeBlock } from './CodeBlock';
import { ChallengeBlock } from './ChallengeBlock';
import type { LessonBlock } from '@/types';

interface Props {
  block: LessonBlock;
  onMultipleChoiceAnswer?: (correct: boolean) => void;
  onCodeRun?: () => void;
  onChallengeComplete?: (passed: boolean) => void;
}

export function LessonBlockRenderer({
  block,
  onMultipleChoiceAnswer,
  onCodeRun,
  onChallengeComplete,
}: Props) {
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} />;
    case 'multipleChoice':
      return <MultipleChoiceBlock block={block} onAnswer={onMultipleChoiceAnswer} />;
    case 'code':
      return <CodeBlock block={block} onRun={onCodeRun} />;
    case 'challenge':
      return <ChallengeBlock block={block} onComplete={onChallengeComplete} />;
    default:
      return null;
  }
}
