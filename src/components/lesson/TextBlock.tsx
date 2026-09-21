import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import type { TextBlock as TextBlockType } from '@/types';

interface Props {
  block: TextBlockType;
}

export function TextBlock({ block }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Render Mermaid diagrams after markdown is rendered
  useEffect(() => {
    const diagrams = ref.current?.querySelectorAll('code.language-mermaid');
    if (!diagrams?.length) return;

    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
      diagrams.forEach((el) => {
        const pre = el.parentElement;
        if (!pre) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'mermaid my-4 flex justify-center overflow-x-auto';
        wrapper.textContent = el.textContent ?? '';
        pre.replaceWith(wrapper);
        mermaid.run({ nodes: [wrapper] });
      });
    });
  }, [block.content]);

  return (
    <div
      ref={ref}
      className="prose prose-gray max-w-none prose-headings:font-semibold prose-code:font-mono
                 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl
                 prose-a:text-mint-400 prose-a:no-underline hover:prose-a:underline"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
    </div>
  );
}
