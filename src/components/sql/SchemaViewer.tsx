import { useMemo, useState } from 'react';
import { Database, Table, ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  schemaSql?: string;
  seedSql?: string;
}

interface ParsedTable {
  name: string;
  columns: { name: string; type: string; isPk?: boolean; isFk?: boolean }[];
}

export function parseSchema(schemaSql?: string): ParsedTable[] {
  if (!schemaSql) return [];
  const tables: ParsedTable[] = [];

  // Match CREATE TABLE statements
  const tableMatches = schemaSql.matchAll(/CREATE\ TABLE\ (\w+)\s*\(([^;]+)\);?/gi);

  for (const match of tableMatches) {
    const tableName = match[1];
    const columnsBody = match[2];

    const columns: { name: string; type: string; isPk?: boolean; isFk?: boolean }[] = [];

    // Split column definitions
    const defs = columnsBody.split(',').map((d) => d.trim());
    for (const def of defs) {
      if (def.toUpperCase().startsWith('FOREIGN KEY') || def.toUpperCase().startsWith('PRIMARY KEY (')) {
        continue;
      }
      const parts = def.split(/\s+/);
      if (parts.length >= 2) {
        const colName = parts[0].replace(/[`"']/g, '');
        const colType = parts[1].toUpperCase();
        const isPk = def.toUpperCase().includes('PRIMARY KEY');
        const isFk = def.toUpperCase().includes('REFERENCES');
        columns.push({ name: colName, type: colType, isPk, isFk });
      }
    }

    tables.push({ name: tableName, columns });
  }

  return tables;
}

export function SchemaViewer({ schemaSql }: Props) {
  const tables = useMemo(() => parseSchema(schemaSql), [schemaSql]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleTable = (tableName: string) => {
    setCollapsed((prev) => ({ ...prev, [tableName]: !prev[tableName] }));
  };

  if (!tables || tables.length === 0) {
    return (
      <div className="p-4 text-xs text-gray-400 bg-gray-900 rounded-xl font-mono">
        No schema metadata available.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 space-y-3 font-mono text-xs">
      <div className="flex items-center gap-2 text-mint-300 font-semibold text-xs tracking-wide uppercase border-b border-gray-800 pb-2">
        <Database size={14} />
        <span>Database Schema ({tables.length} {tables.length === 1 ? 'table' : 'tables'})</span>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {tables.map((tbl) => {
          const isHidden = collapsed[tbl.name];
          return (
            <div key={tbl.name} className="border border-gray-800 rounded-lg overflow-hidden bg-gray-950/60">
              <button
                onClick={() => toggleTable(tbl.name)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-800/60 hover:bg-gray-800 text-gray-200 transition-colors font-medium text-left"
              >
                <div className="flex items-center gap-2">
                  <Table size={13} className="text-lavender-300" />
                  <span className="text-gray-100">{tbl.name}</span>
                </div>
                {isHidden ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
              </button>

              {!isHidden && (
                <div className="p-2 divide-y divide-gray-900 text-gray-300">
                  {tbl.columns.map((col) => (
                    <div key={col.name} className="flex items-center justify-between py-1 px-2 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-200">{col.name}</span>
                        {col.isPk && (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] px-1 py-0.5 rounded uppercase font-bold">
                            PK
                          </span>
                        )}
                        {col.isFk && (
                          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[9px] px-1 py-0.5 rounded uppercase font-bold">
                            FK
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 font-mono text-[10px]">{col.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
