import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useEffect, useState } from 'react';
import type { TextBlock as TextBlockType } from '@/types';

interface Props {
	block: TextBlockType;
}

function MermaidDiagram({ chart }: { chart: string }) {
	const [svg, setSvg] = useState<string>('');
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;
		const cleanChart = chart.trim();
		import('mermaid').then(({ default: mermaid }) => {
			mermaid.initialize({
				startOnLoad: false,
				theme: 'neutral',
				securityLevel: 'loose',
			});
			const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
			mermaid
				.render(uniqueId, cleanChart)
				.then(({ svg }) => {
					if (isMounted) {
						setSvg(svg);
						setError(null);
					}
				})
				.catch((err) => {
					if (isMounted) {
						console.error('Mermaid rendering error:', err);
						setError(
							err instanceof Error ? err.message : String(err),
						);
					}
				});
		});
		return () => {
			isMounted = false;
		};
	}, [chart]);

	if (error) {
		return (
			<div className="my-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono">
				<p className="font-bold mb-1">Mermaid Render Error</p>
				<pre className="whitespace-pre-wrap">{chart}</pre>
			</div>
		);
	}

	if (!svg) {
		return (
			<div className="my-5 p-6 text-center text-xs font-semibold text-amber-700 bg-amber-50/60 rounded-2xl border border-amber-200 animate-pulse">
				Rendering diagram...
			</div>
		);
	}

	return (
		<div
			className="my-6 p-4 bg-white border border-cream-200 rounded-2xl shadow-soft flex justify-center overflow-x-auto"
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
}

export function TextBlock({ block }: Props) {
	return (
		<div
			className="prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-code:font-mono
                 prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline leading-relaxed
                 prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0"
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm, remarkMath]}
				rehypePlugins={[rehypeKatex]}
				components={{
					pre({ children }) {
						return <>{children}</>;
					},
					code({ node, inline, className, children, ...props }: any) {
						const match = /language-(\w+)/.exec(className || '');
						const rawContent = String(children);
						const lang = match ? match[1] : '';

						if (
							lang === 'mermaid' ||
							rawContent.trim().startsWith('graph ') ||
							rawContent.trim().startsWith('sequenceDiagram') ||
							rawContent.trim().startsWith('flowchart ')
						) {
							return <MermaidDiagram chart={rawContent} />;
						}

						const isMultiline = rawContent.includes('\n');
						const isInline = inline || (!match && !isMultiline);

						if (isInline) {
							return (
								<code
									className="font-mono text-xs bg-cream-100 px-1.5 py-0.5 rounded text-amber-900 border border-cream-200/80 font-semibold"
									{...props}
								>
									{children}
								</code>
							);
						}

						// Read-only markdown content code blocks render with light cohesive container
						return (
							<div className="my-5 rounded-2xl overflow-hidden border border-cream-200/90 bg-cream-100/50 shadow-soft">
								{lang && (
									<div className="bg-cream-200/60 px-4 py-1.5 text-[11px] font-mono font-bold text-amber-900 border-b border-cream-200 flex items-center justify-between uppercase tracking-wider">
										<span>{lang}</span>
									</div>
								)}
								<pre className="font-mono text-xs sm:text-sm text-gray-900 overflow-x-auto leading-relaxed whitespace-pre m-0 !bg-transparent">
									<code
										className={`block p-4 ${className || ''}`.trim()}
										{...props}
									>
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
