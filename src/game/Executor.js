/* eslint-disable no-undef */
// Code execution engine using Skulpt
// Skulpt (Sk) is loaded via CDN at runtime — not an npm package
// Converts Python code → action log for animation replay

export class Executor {
  constructor() {
    this.log = [];
    this.errors = [];
    this.outputLines = [];
  }

  reset() {
    this.log = [];
    this.errors = [];
    this.outputLines = [];
  }

  async execute(code, robot, grid) {
    this.reset();
    const log = this.log;
    const outputLines = this.outputLines;

    return new Promise((resolve) => {
      if (typeof Sk === 'undefined') {
        resolve({
          success: false,
          error: 'Python runtime not loaded yet. Please wait a moment and try again.',
        });
        return;
      }

      // ── State snapshots ──────────────────────────────────────
      const snapRobot = () => ({
        x: robot.x, y: robot.y, dir: robot.dir,
        inventory: [...robot.inventory],
        moves: robot.moves,
      });
      const snapGrid = () => ({
        cells: grid.cells.map(r => [...r]),
        waterCount: grid.waterCount.map(r => [...r]),
      });

      // ── Configure Skulpt ──────────────────────────────────────
      Sk.configure({
        output: (text) => { outputLines.push(text); },
        read: (x) => {
          if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[x] === undefined) {
            throw new Error(`File not found: ${x}`);
          }
          return Sk.builtinFiles.files[x];
        },
        execLimit: 20000,
        __future__: Sk.python3,
      });

      // ── Inject robot commands as Skulpt builtins ───────────────
      // This is the most reliable approach: inject JS functions into
      // Skulpt's global namespace before execution.
      const makeSkulptFn = (jsFn) => {
        return new Sk.builtin.func(function (...skArgs) {
          // Convert Skulpt args → JS values
          const jsArgs = skArgs.map(a => {
            if (a instanceof Sk.builtin.str) return a.v;
            if (a instanceof Sk.builtin.int_) return a.v;
            if (a instanceof Sk.builtin.float_) return a.v;
            if (a instanceof Sk.builtin.bool) return a.v;
            return a;
          });
          try {
            const result = jsFn(...jsArgs);
            // Convert return values → Skulpt values
            if (result === undefined || result === null) return Sk.builtin.none.none$;
            if (typeof result === 'string') return new Sk.builtin.str(result);
            if (typeof result === 'number') return new Sk.builtin.int_(result);
            if (typeof result === 'boolean') return new Sk.builtin.bool(result);
            if (Array.isArray(result)) {
              return new Sk.builtin.list(result.map(item =>
                typeof item === 'string' ? new Sk.builtin.str(item) : new Sk.builtin.int_(item)
              ));
            }
            return Sk.builtin.none.none$;
          } catch (err) {
            throw new Sk.builtin.RuntimeError(err.message);
          }
        });
      };

      // Map command names → JS functions
      const commands = {
        move_forward: () => {
          robot.moveForward(grid);
          log.push({ type: 'move', to: snapRobot(), gridSnap: snapGrid() });
        },
        move_right: () => {
          robot.moveRight(grid);
          log.push({ type: 'move', to: snapRobot(), gridSnap: snapGrid() });
        },
        move_left: () => {
          robot.moveLeft(grid);
          log.push({ type: 'move', to: snapRobot(), gridSnap: snapGrid() });
        },
        turn_right: () => {
          robot.turnRight();
          log.push({ type: 'turn', to: snapRobot(), gridSnap: snapGrid() });
        },
        turn_left: () => {
          robot.turnLeft();
          log.push({ type: 'turn', to: snapRobot(), gridSnap: snapGrid() });
        },
        plant: () => {
          robot.plant(grid);
          log.push({ type: 'plant', robot: snapRobot(), gridSnap: snapGrid() });
        },
        water: () => {
          const result = robot.water(grid);
          log.push({ type: 'water', result, robot: snapRobot(), gridSnap: snapGrid() });
          return result;
        },
        harvest: () => {
          robot.harvest(grid);
          log.push({ type: 'harvest', robot: snapRobot(), gridSnap: snapGrid() });
        },
        check_cell: () => {
          return robot.checkCell(grid);
        },
        get_inventory: () => {
          return robot.getInventory();
        },
        add_inventory: (item) => {
          robot.addInventory(item);
          log.push({ type: 'inventory', robot: snapRobot(), gridSnap: snapGrid() });
        },
        remove_inventory: (item) => {
          robot.removeInventory(item);
          log.push({ type: 'inventory', robot: snapRobot(), gridSnap: snapGrid() });
        },
        wait: (seconds) => {
          log.push({ type: 'wait', seconds, robot: snapRobot(), gridSnap: snapGrid() });
        },
      };

      // Inject into Skulpt's builtins object
      for (const [name, fn] of Object.entries(commands)) {
        Sk.builtins[name] = makeSkulptFn(fn);
      }

      // ── Run the code ──────────────────────────────────────────
      Sk.misceval.asyncToPromise(() =>
        Sk.importMainWithBody('<stdin>', false, code, true)
      ).then(() => {
        resolve({
          success: true,
          log,
          output: outputLines.join(''),
          finalRobot: snapRobot(),
          finalGrid: snapGrid(),
        });
      }).catch((err) => {
        let errorMsg;
        if (err.tp$str) {
          errorMsg = err.tp$str().v;
        } else if (err.args && err.args.v && err.args.v[0]) {
          errorMsg = typeof err.args.v[0] === 'object' && err.args.v[0].v
            ? err.args.v[0].v
            : String(err.args.v[0]);
        } else {
          errorMsg = String(err);
        }

        // Extract line number if available
        let lineNo = null;
        if (err.traceback && err.traceback.length > 0) {
          lineNo = err.traceback[err.traceback.length - 1].lineno;
        }

        resolve({
          success: false,
          error: errorMsg,
          lineNo,
          log,
          output: outputLines.join(''),
        });
      });
    });
  }
}
