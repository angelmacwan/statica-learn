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

/**
 * Pre-parse imported modules in Python code and load them into Pyodide.
 */
async function ensurePackages(code: string, tests?: CodeTest[]) {
  if (!pyodide) return;

  let combinedCode = code;
  if (tests && tests.length > 0) {
    for (const test of tests) {
      if (typeof test.input === 'string') {
        combinedCode += '\n' + test.input;
      }
    }
  }

  try {
    if (typeof pyodide.loadPackagesFromImports === 'function') {
      await pyodide.loadPackagesFromImports(combinedCode);
    }
  } catch (err) {
    console.warn('Failed to load packages from imports:', err);
  }
}

/**
 * Extract missing module name from Pyodide ModuleNotFoundError message
 */
function extractMissingModuleName(errMessage: string): string | null {
  const match = errMessage.match(/No module named\s*['"]([^'"]+)['"]/i);
  if (match && match[1]) {
    // Get top-level module name (e.g. 'pandas.core.frame' -> 'pandas')
    return match[1].split('.')[0];
  }
  return null;
}

/**
 * Attempt to load a missing module using loadPackagesFromImports, loadPackage, or micropip
 */
async function loadSingleModule(modName: string): Promise<boolean> {
  if (!pyodide || !modName) return false;

  try {
    if (typeof pyodide.loadPackagesFromImports === 'function') {
      await pyodide.loadPackagesFromImports(`import ${modName}`);
      return true;
    }
  } catch {
    // ignore and proceed to loadPackage
  }

  try {
    await pyodide.loadPackage(modName);
    return true;
  } catch {
    // fallback to micropip
    try {
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      await micropip.install(modName);
      return true;
    } catch {
      return false;
    }
  }
}

self.onmessage = async (e: MessageEvent<ExecutionRequest>) => {
  const { code, tests } = e.data;
  const result = await runPython(code, tests);
  self.postMessage(result);
};

async function runPython(
  code: string,
  tests?: CodeTest[],
  isRetry = false
): Promise<ExecutionResult> {
  try {
    await loadPyodideIfNeeded();
    await ensurePackages(code, tests);
  } catch (err) {
    return {
      stdout: '',
      error: `Failed to load Python runtime or packages: ${err instanceof Error ? err.message : String(err)}`,
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
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (!isRetry) {
          const missingMod = extractMissingModuleName(errorMsg);
          if (missingMod) {
            const loaded = await loadSingleModule(missingMod);
            if (loaded) {
              return runPython(code, tests, true);
            }
          }
        }
        testResults.push({
          passed: false,
          description: test.description,
          actual: errorMsg,
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
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (!isRetry) {
      const missingMod = extractMissingModuleName(errorMsg);
      if (missingMod) {
        const loaded = await loadSingleModule(missingMod);
        if (loaded) {
          return runPython(code, tests, true);
        }
      }
    }
    return {
      stdout,
      error: errorMsg,
    };
  }
}

export {}; // Required for TS module worker
