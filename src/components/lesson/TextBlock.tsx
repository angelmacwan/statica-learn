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
                 prose-a:text-mint-400 prose-a:no-underline hover:prose-a:underline"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const rawContent = String(children);
            const isMultiline = rawContent.includes('\n');
            const isInline = inline || (!match && !isMultiline);

            if (isInline) {
              return (
                <code
                  className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 border border-gray-200/80 font-medium"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const lang = match ? match[1] : '';

            return (
              <div className="my-5 rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 shadow-card">
                {lang && lang !== 'mermaid' && (
                  <div className="bg-gray-800/90 px-4 py-1.5 text-[11px] font-mono font-bold text-mint-300 border-b border-gray-700/60 flex items-center justify-between uppercase tracking-wider">
                    <span>{lang}</span>
                  </div>
                )}
                <pre className="p-4 font-mono text-xs sm:text-sm text-gray-100 overflow-x-auto leading-relaxed whitespace-pre m-0 bg-transparent">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
        }}
      >
        {block.content}
      </ReactMarkdown>
    </div>
  );
}
