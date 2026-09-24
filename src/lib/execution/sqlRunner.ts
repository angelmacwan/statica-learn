import initSqlJs, { SqlJsStatic } from 'sql.js';
import type { ExecutionRequest, ExecutionResult, SqlQueryResult } from '@/types';

let sqlPromise: Promise<SqlJsStatic> | null = null;

export async function getSqlJs(): Promise<SqlJsStatic> {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({
      locateFile: (file) => `/${file}`,
    });
  }
  return sqlPromise;
}

export function normalizeSqlRows(columns: string[], rows: unknown[][]) {
  return rows
    .map((row) =>
      Object.fromEntries(
        columns.map((col, i) => [
          col.toLowerCase(),
          row[i] === null || row[i] === undefined ? 'null' : String(row[i]).trim(),
        ])
      )
    )
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

export function checkSqlAnswer(
  userResult: { columns: string[]; rows: unknown[][] },
  expectedResult: { columns: string[]; rows: unknown[][] },
  ordered = false
): boolean {
  if (!userResult || !userResult.rows || !expectedResult || !expectedResult.rows) return false;

  const normalizeVal = (v: unknown) => (v === null || v === undefined ? 'null' : String(v).trim());

  if (ordered) {
    const userStr = JSON.stringify(userResult.rows.map((r) => r.map(normalizeVal)));
    const expStr = JSON.stringify(expectedResult.rows.map((r) => r.map(normalizeVal)));
    return userStr === expStr;
  }

  const userNorm = JSON.stringify(normalizeSqlRows(userResult.columns, userResult.rows));
  const expNorm = JSON.stringify(normalizeSqlRows(expectedResult.columns, expectedResult.rows));
  return userNorm === expNorm;
}

export async function runSql(request: ExecutionRequest): Promise<ExecutionResult> {
  try {
    const SQL = await getSqlJs();
    const db = new SQL.Database();

    if (request.schema_sql) {
      db.run(request.schema_sql);
    }
    if (request.seed_sql) {
      db.run(request.seed_sql);
    }

    let expectedResult: { columns: string[]; rows: unknown[][] } | null = null;
    if (request.answer_sql) {
      try {
        const expRes = db.exec(request.answer_sql.trim());
        if (expRes && expRes.length > 0) {
          expectedResult = { columns: expRes[0].columns, rows: expRes[0].values };
        } else {
          expectedResult = { columns: [], rows: [] };
        }
      } catch (err) {
        return {
          stdout: '',
          error: `Failed to execute reference solution: ${err instanceof Error ? err.message : String(err)}`,
        };
      }
    }

    let userResult: SqlQueryResult | null = null;
    let error: string | null = null;

    if (request.code && request.code.trim()) {
      try {
        const res = db.exec(request.code.trim());
        if (res && res.length > 0) {
          const { columns, values } = res[0];
          userResult = {
            columns,
            rows: values.slice(0, 500),
            totalRows: values.length,
            truncated: values.length > 500,
          };
        } else {
          userResult = { columns: [], rows: [], totalRows: 0, truncated: false };
        }
      } catch (err) {
        error = err instanceof Error ? err.message : String(err);
      }
    } else {
      error = 'Please enter a SQL query.';
    }

    db.close();

    let testResults: { passed: boolean; description?: string }[] | undefined = undefined;
    if (expectedResult && userResult && !error) {
      const passed = checkSqlAnswer(userResult, expectedResult, request.ordered);
      testResults = [
        {
          passed,
          description: request.ordered
            ? 'Result matching expected output (ordered)'
            : 'Result matching expected output',
        },
      ];
    }

    let stdout = '';
    if (userResult && userResult.rows.length > 0) {
      const colHeaders = userResult.columns.join(' | ');
      const separator = '-'.repeat(Math.max(40, colHeaders.length));
      const rowStrings = userResult.rows.slice(0, 10).map((r) => r.map((cell) => cell === null ? 'NULL' : String(cell)).join(' | '));
      stdout = `${colHeaders}\n${separator}\n${rowStrings.join('\n')}${
        userResult.rows.length > 10 ? `\n... (${userResult.rows.length} total rows)` : ''
      }`;
    } else if (userResult && !error) {
      stdout = 'Query executed successfully. (0 rows returned)';
    }

    return {
      stdout,
      error,
      testResults,
      sqlResult: userResult || undefined,
      expectedSqlResult: expectedResult || undefined,
    };
  } catch (err) {
    return {
      stdout: '',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
