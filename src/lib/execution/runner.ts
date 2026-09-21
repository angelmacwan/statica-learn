import type { ExecutionRequest, ExecutionResult } from '@/types';

// Worker instances — reused across calls
let jsWorker: Worker | null = null;
let pyWorker: Worker | null = null;

function getJsWorker(): Worker {
  if (!jsWorker) {
    jsWorker = new Worker(new URL('./jsRunner.worker.ts', import.meta.url), { type: 'module' });
  }
  return jsWorker;
}

function getPyWorker(): Worker {
  if (!pyWorker) {
    pyWorker = new Worker(new URL('./pyRunner.worker.ts', import.meta.url), { type: 'module' });
  }
  return pyWorker;
}

export function runCode(request: ExecutionRequest, timeoutMs = 10000): Promise<ExecutionResult> {
  const worker = request.language === 'python' ? getPyWorker() : getJsWorker();

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ stdout: '', error: 'Execution timed out (10s limit).' });
    }, timeoutMs);

    const handler = (e: MessageEvent<ExecutionResult>) => {
      clearTimeout(timeout);
      worker.removeEventListener('message', handler);
      resolve(e.data);
    };

    worker.addEventListener('message', handler);
    worker.postMessage(request);
  });
}
