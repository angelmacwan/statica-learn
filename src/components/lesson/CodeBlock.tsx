import { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { Play, RotateCcw } from 'lucide-react';
import { runCode } from '@/lib/execution/runner';
import { ResultTable } from '@/components/sql/ResultTable';
import { SchemaViewer } from '@/components/sql/SchemaViewer';
import type { CodeBlock as CodeBlockType, ExecutionResult } from '@/types';

interface Props {
	block: CodeBlockType;
	onRun?: () => void;
}

const langExtension = {
	python: [python()],
	javascript: [javascript({ jsx: false })],
	sql: [sql()],
};

export function CodeBlock({ block, onRun }: Props) {
	const [code, setCode] = useState(block.starterCode);
	const [result, setResult] = useState<ExecutionResult | null>(null);
	const [running, setRunning] = useState(false);

	const handleRun = useCallback(async () => {
		setRunning(true);
		setResult(null);
		onRun?.();
		const res = await runCode({
			language: block.language,
			code,
			schema_sql: block.schema_sql,
			seed_sql: block.seed_sql,
		});
		setResult(res);
		setRunning(false);
	}, [block.language, block.schema_sql, block.seed_sql, code, onRun]);

	const handleReset = () => {
		setCode(block.starterCode);
		setResult(null);
	};

	return (
		<div className="space-y-3 bg-gray-800 p-4 rounded-xl">
			{/* Schema viewer if available */}
			{block.language === 'sql' && block.schema_sql && (
				<SchemaViewer
					schemaSql={block.schema_sql}
					seedSql={block.seed_sql}
				/>
			)}

			{/* Language badge */}
			<div className="flex items-center justify-between">
				<span className="pill pill-mint capitalize">
					{block.language}
				</span>
				{block.readOnly ? (
					<span className="text-xs text-gray-300">Example only</span>
				) : (
					<div className="flex items-center gap-2">
						<button
							onClick={handleReset}
							className="btn-ghost text-xs py-1.5 px-3"
						>
							<RotateCcw size={12} />
							Reset
						</button>
						<button
							onClick={handleRun}
							disabled={running}
							className="btn-primary text-xs py-1.5 px-4"
						>
							<Play size={12} />
							{running ? 'Running…' : 'Run'}
						</button>
					</div>
				)}
			</div>

			{/* Editor */}
			<div className="rounded-xl overflow-hidden">
				<CodeMirror
					value={code}
					onChange={setCode}
					extensions={langExtension[block.language]}
					theme={oneDark}
					className="text-sm"
					editable={!block.readOnly}
					basicSetup={{
						lineNumbers: true,
						foldGutter: false,
						autocompletion: true,
					}}
				/>
			</div>
			{block.readOnly && block.readOnlyNote && (
				<p className="text-xs text-gray-300">{block.readOnlyNote}</p>
			)}

			{/* Output */}
			{result && (
				<div className="space-y-2">
					{result.error ? (
						<div className="rounded-xl p-4 font-mono text-sm whitespace-pre-wrap bg-blush-50 text-red-700 border border-blush-200">
							Error: {result.error}
						</div>
					) : result.sqlResult ? (
						<ResultTable
							result={result.sqlResult}
							title="Query Results"
						/>
					) : (
						<div className="rounded-xl p-4 font-mono text-sm whitespace-pre-wrap bg-gray-900 text-gray-100">
							{result.stdout || '(no output)'}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
