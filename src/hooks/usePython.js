import { useState, useEffect, useCallback } from 'react';

let pyodideInstance = null;
let isLoading = false;

export async function loadPython() {
  if (pyodideInstance) return pyodideInstance;
  if (isLoading) {
    // Wait until it's loaded if another call started it
    while (isLoading) {
      await new Promise(r => setTimeout(r, 100));
    }
    return pyodideInstance;
  }
  
  isLoading = true;
  try {
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    
    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
    });
    
    isLoading = false;
    return pyodideInstance;
  } catch (err) {
    isLoading = false;
    console.error('Failed to load Pyodide', err);
    throw err;
  }
}

export function usePython(challenge) {
  const [pyReady, setPyReady] = useState(false);
  const [pyError, setPyError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function init() {
      try {
        setPyReady(false);
        setPyError(null);
        await loadPython();
        if (!cancelled) {
          setPyReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          setPyError(err.message);
        }
      }
    }
    init();
    
    return () => { cancelled = true; };
  }, [challenge?.id]);
  
  const executePython = useCallback(async (code) => {
    if (!pyReady || !pyodideInstance) return { error: 'Python not ready' };
    
    // We want to capture stdout
    let stdout = '';
    pyodideInstance.setStdout({ batched: (msg) => { stdout += msg + '\\n'; } });
    
    try {
      // Clear globals to avoid state leakage between runs
      const globals = pyodideInstance.toPy({});
      
      // Run the user code first
      await pyodideInstance.runPythonAsync(code, { globals });
      
      let allPassed = true;
      let testOutput = '';

      if (challenge?.test_cases && challenge.test_cases.length > 0) {
        testOutput += '---\nTest Results:\n';
        for (let i = 0; i < challenge.test_cases.length; i++) {
          const tc = challenge.test_cases[i];
          try {
            const isPass = await pyodideInstance.runPythonAsync(`${tc.input} == ${tc.expected}`, { globals });
            if (isPass) {
              testOutput += `✓ Test ${i + 1} passed\n`;
            } else {
              const actual = await pyodideInstance.runPythonAsync(`repr(${tc.input})`, { globals });
              testOutput += `✗ Test ${i + 1} failed\n  Input: ${tc.input}\n  Expected: ${tc.expected}\n  Got: ${actual}\n`;
              allPassed = false;
            }
          } catch (err) {
            const errMsg = err.message.trim().split('\n').pop();
            testOutput += `✗ Test ${i + 1} error\n  Input: ${tc.input}\n  Error: ${errMsg}\n`;
            allPassed = false;
          }
        }
      }

      const finalOutput = stdout.trim() + (stdout.trim() && testOutput ? '\n\n' : '') + testOutput.trim();

      return { success: allPassed, output: finalOutput };
    } catch (err) {
      // Syntax error or error in user code itself
      return { success: false, error: err.message, output: stdout.trim() };
    }
  }, [pyReady, challenge]);

  return { pyReady, pyError, executePython };
}
