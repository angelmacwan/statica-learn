/* eslint-disable no-undef */
/**
 * MazeExecutor.js
 * Skulpt-based Python executor wired to the Maze Robot API.
 * Produces an action log for animated playback.
 */

export class MazeExecutor {
  constructor() {
    this.log = [];
    this.outputLines = [];
  }

  reset() {
    this.log = [];
    this.outputLines = [];
  }

  async execute(code, maze) {
    this.reset();
    const log = this.log;
    const outputLines = this.outputLines;

    return new Promise((resolve) => {
      if (typeof Sk === 'undefined') {
        resolve({ success: false, error: 'Skulpt not loaded.' });
        return;
      }

      // Take a snapshot of the robot + fog for the log
      const snapState = () => ({
        x: maze.x,
        y: maze.y,
        dir: maze.dir,
        fog: maze.fog.map((row) => Array.from(row)),
        solved: maze.solved,
      });

      Sk.configure({
        output: (text) => {
          outputLines.push(text);
          log.push({ type: 'print', text });
        },
        read: (x) => {
          if (Sk.builtinFiles !== undefined && Sk.builtinFiles.files[x] !== undefined) {
            return Sk.builtinFiles.files[x];
          }
          if (Sk.builtinFiles !== undefined) {
            const fallbacks = [
              'src/lib/' + x,
              'src/lib/' + x + '.js',
              'src/lib/' + x + '/__init__.js',
              'src/lib/' + x + '.py',
              'src/lib/' + x + '/__init__.py',
              'src/builtin/' + x + '.js',
              x + '.js',
              x + '.py',
            ];
            for (let f of fallbacks) {
              if (Sk.builtinFiles.files[f] !== undefined) {
                return Sk.builtinFiles.files[f];
              }
            }
          }
          // Fallback for core modules in Sk.sysmodules (like sys, math)
          const cleanName = x.replace(/^src\/lib\//, '').replace(/\.(js|py)$/, '').replace(/\/__init__$/, '');
          if (Sk.sysmodules && typeof Sk.sysmodules.mp$lookup === 'function') {
            try {
              const lookupName = new Sk.builtin.str(cleanName);
              if (Sk.sysmodules.mp$lookup(lookupName) !== undefined) {
                return `var $builtinmodule = function (name) { return Sk.sysmodules.mp$lookup(new Sk.builtin.str("${cleanName}")); };`;
              }
            } catch (e) {
              // Ignore and let standard error flow
            }
          }
          throw "File not found: '" + x + "'";
        },
        execLimit: 20000,
        yieldLimit: 100,
        __future__: Sk.python3,
      });

      let totalApiCalls = 0;
      const MAX_STEPS = 10000;
      const checkLimit = (isAction = false) => {
        totalApiCalls++;
        if (totalApiCalls > 50000) {
          throw new Error(
            `Execution limit exceeded. You may have an infinite loop (too many sensor checks or operations without moving)!`
          );
        }
        if (isAction) {
          const actionCount = log.filter((a) => a.type !== 'print').length;
          if (actionCount > MAX_STEPS) {
            throw new Error(
              `Maximum steps (${MAX_STEPS}) exceeded. You may have an infinite loop!`
            );
          }
        }
      };

      // Wrap a JS function into a Skulpt builtin
      const makeFn = (jsFn) => {
        return new Sk.builtin.func(function (...skArgs) {
          const jsArgs = skArgs.map((a) => {
            if (a instanceof Sk.builtin.str) return a.v;
            if (a instanceof Sk.builtin.int_) return a.v;
            if (a instanceof Sk.builtin.float_) return a.v;
            if (a instanceof Sk.builtin.bool) return a.v;
            return a;
          });

          const jsToSk = (val) => {
            if (val === undefined || val === null) return Sk.builtin.none.none$;
            if (typeof val === 'string') return new Sk.builtin.str(val);
            if (typeof val === 'number') {
              if (Number.isInteger(val)) return new Sk.builtin.int_(val);
              return new Sk.builtin.float_(val);
            }
            if (typeof val === 'boolean') return new Sk.builtin.bool(val);
            if (Array.isArray(val)) {
              return new Sk.builtin.tuple(val.map(jsToSk));
            }
            return Sk.builtin.none.none$;
          };

          try {
            const result = jsFn(...jsArgs);
            if (result === undefined || result === null)
              return Sk.builtin.none.none$;
            return jsToSk(result);
          } catch (err) {
            throw new Sk.builtin.RuntimeError(err.message);
          }
        });
      };

      // Build all Robot API commands
      const commands = {
        move_forward: () => {
          maze.moveForward();
          log.push({ type: 'move', state: snapState() });
          checkLimit(true);
        },
        turn_left: () => {
          maze.turnLeft();
          log.push({ type: 'turn', state: snapState() });
          checkLimit(true);
        },
        turn_right: () => {
          maze.turnRight();
          log.push({ type: 'turn', state: snapState() });
          checkLimit(true);
        },
        wall_front: () => {
          checkLimit(false);
          return maze.wallFront();
        },
        wall_left: () => {
          checkLimit(false);
          return maze.wallLeft();
        },
        wall_right: () => {
          checkLimit(false);
          return maze.wallRight();
        },
        position: () => {
          checkLimit(false);
          return maze.position();
        },
        direction: () => {
          checkLimit(false);
          return maze.direction();
        },
        at_goal: () => {
          checkLimit(false);
          return maze.atGoal();
        },
      };

      for (const [name, fn] of Object.entries(commands)) {
        Sk.builtins[name] = makeFn(fn);
      }

      Sk.misceval
        .asyncToPromise(() =>
          Sk.importMainWithBody('<stdin>', false, code, true)
        )
        .then(() => {
          resolve({
            success: true,
            log,
            output: outputLines.join(''),
            solved: maze.solved,
            score: maze.getScore(),
            moves: maze.moves,
            turns: maze.turns,
          });
        })
        .catch((err) => {
          let errorMsg = String(err);
          if (err.tp$str) errorMsg = err.tp$str().v;
          resolve({
            success: false,
            error: errorMsg,
            log,
            output: outputLines.join(''),
            solved: maze.solved,
            score: maze.getScore(),
            moves: maze.moves,
            turns: maze.turns,
          });
        });
    });
  }
}
