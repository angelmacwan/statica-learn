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

  // Find declared functions in user code to auto-export if user didn't write exports.fn = ...
  const fnNames: string[] = [];
  const fnRegex = /(?:function\s+([a-zA-Z0-9_$]+)|const\s+([a-zA-Z0-9_$]+)\s*=\s*(?:function|\([^)]*\)\s*=>))/g;
  let m;
  while ((m = fnRegex.exec(code)) !== null) {
    const name = m[1] || m[2];
    if (name && !['console', 'exports'].includes(name)) {
      fnNames.push(name);
    }
  }

  let capturedReturnValue: unknown = undefined;

  try {
    const autoExports = fnNames.map((f) => `if (typeof ${f} !== 'undefined') exports['${f}'] = ${f};`).join('\n');
    const wrappedCode = `${code}\n${autoExports}\nreturn exports;`;
    // eslint-disable-next-line no-new-func
    const runner = new Function('console', 'exports', wrappedCode);
    const res = runner(mockConsole, exports);
    if (res && typeof res === 'object') {
      exports = res;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  const stdout = logs.join('\n');

  if (!tests || tests.length === 0) {
    return { stdout, error, returnValue: capturedReturnValue };
  }

  // Run tests against exported or captured functions
  const testResults = tests.map((test) => {
    try {
      const inputs = Array.isArray(test.input) ? test.input : [test.input];
      // Find the first exported or captured function
      const fn = Object.values(exports).find((v) => typeof v === 'function') as (
        ...args: unknown[]
      ) => unknown;
      if (!fn) throw new Error('No function found. Define a function in your code.');
      const actual = fn(...inputs);
      const passed = JSON.stringify(actual) === JSON.stringify(test.expectedOutput);
      return { passed, description: test.description, actual };
    } catch (err) {
      return {
        passed: false,
        description: test.description,
        actual: err instanceof Error ? err.message : String(err),
      };
    }
  });

  return { stdout, error, testResults };
}

export {}; // Make this a module
