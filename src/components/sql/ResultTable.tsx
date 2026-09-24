import type { SqlQueryResult } from '@/types';

interface Props {
  result: SqlQueryResult;
  title?: string;
}

export function ResultTable({ result, title }: Props) {
  if (!result || !result.columns || result.columns.length === 0) {
    return (
      <div className="bg-gray-900 text-gray-400 p-4 rounded-xl text-xs font-mono">
        Query returned no columns or rows.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {title && (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title} ({result.totalRows} {result.totalRows === 1 ? 'row' : 'rows'})
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-900 max-h-64 shadow-inner">
        <table className="w-full text-left font-mono text-xs text-gray-200 divide-y divide-gray-800">
          <thead className="bg-gray-800 text-gray-300 sticky top-0">
            <tr>
              {result.columns.map((col, idx) => (
                <th key={idx} className="px-3 py-2 font-medium tracking-wide border-r border-gray-700 last:border-r-0">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {result.rows.length === 0 ? (
              <tr>
                <td colSpan={result.columns.length} className="px-3 py-3 text-center text-gray-500 italic">
                  0 rows matching query
                </td>
              </tr>
            ) : (
              result.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-gray-800/40 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-1.5 whitespace-nowrap border-r border-gray-800 last:border-r-0">
                      {cell === null ? (
                        <span className="text-gray-500 italic">NULL</span>
                      ) : (
                        String(cell)
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {result.truncated && (
        <p className="text-[11px] text-gray-500 italic">
          * Showing first 500 rows out of {result.totalRows}.
        </p>
      )}
    </div>
  );
}
