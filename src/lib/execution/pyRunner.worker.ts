import type { ExecutionRequest, ExecutionResult, CodeTest } from '@/types';

/**
 * Python Web Worker using Pyodide (WebAssembly Python).
 * Pyodide is lazy-loaded via ESM dynamic import - compatible with Vite's
 * ES module worker format (importScripts is NOT available in module workers).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodide: any = null;

async function loadPyodideIfNeeded() {
  if (pyodide) return;
  // Dynamic import of Pyodide's ESM build - works in module workers
  const { loadPyodide } = await import(
    /* @vite-ignore */
    // @ts-expect-error dynamic CDN import in worker
    'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.mjs'
  );
  pyodide = await loadPyodide();
}

self.onmessage = async (e: MessageEvent<ExecutionRequest>) => {
  const { code, tests } = e.data;
  const result = await runPython(code, tests);
  self.postMessage(result);
};

async function runPython(code: string, tests?: CodeTest[]): Promise<ExecutionResult> {
  try {
    await loadPyodideIfNeeded();
  } catch (err) {
    return {
      stdout: '',
      error: `Failed to load Python runtime: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  try {
    // Redirect stdout to capture print() output
    pyodide.runPython(`
import sys, io
_stdout_capture = io.StringIO()
sys.stdout = _stdout_capture
`);

    if (!tests || tests.length === 0) {
      const pyRet = pyodide.runPython(code);
      const stdout = (pyodide.runPython('_stdout_capture.getvalue()') as string).trim();
      let returnValue: unknown = undefined;
      if (pyRet !== undefined && pyRet !== null) {
        try {
          returnValue = typeof pyRet.toJs === 'function' ? pyRet.toJs() : pyRet;
        } catch {
          returnValue = String(pyRet);
        }
      }
      return { stdout, error: null, returnValue };
    }

    // Run user code to define functions
    pyodide.runPython(code);

    const testResults = [];
    for (const test of tests) {
      try {
        const inputs = Array.isArray(test.input) ? test.input : [test.input];
        const inputJson = JSON.stringify(inputs).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const expectedJson = JSON.stringify(test.expectedOutput)
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'");

        const evalRes = pyodide.runPython(`
import json as _json, types as _types
_inputs = _json.loads('${inputJson}')
_expected = _json.loads('${expectedJson}')
_fn = next(
  (v for k, v in list(globals().items())
   if isinstance(v, _types.FunctionType) and not k.startswith('_')),
  None
)
if _fn is None:
    raise Exception("No function found. Define a function in your code.")
_actual = _fn(*_inputs)
try:
    if isinstance(_actual, (int, float, str, bool, type(None), list, dict)):
        _actual_ser = _actual
    else:
        _actual_ser = str(_actual)
except Exception:
    _actual_ser = str(_actual)

_passed = _json.dumps(_actual) == _json.dumps(_expected)
_json.dumps({"passed": _passed, "actual": _actual_ser})
`);
        const parsed = JSON.parse(evalRes as string);
        testResults.push({
          passed: Boolean(parsed.passed),
          description: test.description,
          actual: parsed.actual,
        });
      } catch (err) {
        testResults.push({
          passed: false,
          description: test.description,
          actual: err instanceof Error ? err.message : String(err),
        });
      }
    }

    const stdout = (pyodide.runPython('_stdout_capture.getvalue()') as string).trim();
    return { stdout, error: null, testResults };
  } catch (err) {
    let stdout = '';
    try {
      stdout = (pyodide.runPython('_stdout_capture.getvalue()') as string).trim();
    } catch {
      // ignore
    }
    return {
      stdout,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export {}; // Required for TS module worker
