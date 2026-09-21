import type { ExecutionRequest, ExecutionResult, CodeTest } from '@/types';

/**
 * JavaScript Web Worker runner.
 * Receives ExecutionRequest, returns ExecutionResult.
 * Runs code in a sandboxed Function scope - no eval on main thread.
 */

self.onmessage = async (e: MessageEvent<ExecutionRequest>) => {
  const { code, tests } = e.data;
  const result = await runJs(code, tests);
  self.postMessage(result);
};

async function runJs(code: string, tests?: CodeTest[]): Promise<ExecutionResult> {
  const logs: string[] = [];

  // Capture console.log output
  const mockConsole = {
    log: (...args: unknown[]) => logs.push(args.map(String).join(' ')),
    error: (...args: unknown[]) => logs.push('[error] ' + args.map(String).join(' ')),
    warn: (...args: unknown[]) => logs.push('[warn] ' + args.map(String).join(' ')),
  };

  let error: string | null = null;
  let exports: Record<string, unknown> = {};

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('console', 'exports', code);
    fn(mockConsole, exports);
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  const stdout = logs.join('\n');

  if (!tests || tests.length === 0) {
    return { stdout, error };
  }

  // Run tests against exported functions
  const testResults = tests.map((test) => {
    try {
      const inputs = Array.isArray(test.input) ? test.input : [test.input];
      // Find the first exported function
      const fn = Object.values(exports).find((v) => typeof v === 'function') as (
        ...args: unknown[]
      ) => unknown;
      if (!fn) throw new Error('No function exported. Use: exports.yourFunction = ...');
      const actual = fn(...inputs);
      const passed = JSON.stringify(actual) === JSON.stringify(test.expectedOutput);
      return { passed, description: test.description };
    } catch (err) {
      return { passed: false, description: test.description };
    }
  });

  return { stdout, error, testResults };
}

export {}; // Make this a module
