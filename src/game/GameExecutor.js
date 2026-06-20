/* eslint-disable no-undef */
export class GameExecutor {
  constructor() {
    this.log = [];
    this.outputLines = [];
  }

  reset() {
    this.log = [];
    this.outputLines = [];
  }

  async execute(code, robot, grid) {
    this.reset();
    const log = this.log;
    const outputLines = this.outputLines;

    return new Promise((resolve) => {
      if (typeof Sk === 'undefined') {
        resolve({ success: false, error: 'Skulpt not loaded.' });
        return;
      }

      const snapRobot = () => ({ x: robot.x, y: robot.y, dir: robot.dir, money: robot.money });
      
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

      const makeSkulptFn = (jsFn) => {
        return new Sk.builtin.func(function (...skArgs) {
          const jsArgs = skArgs.map(a => {
            if (a instanceof Sk.builtin.str) return a.v;
            if (a instanceof Sk.builtin.int_) return a.v;
            if (a instanceof Sk.builtin.float_) return a.v;
            if (a instanceof Sk.builtin.bool) return a.v;
            return a;
          });
          try {
            const result = jsFn(...jsArgs);
            if (result === undefined || result === null) return Sk.builtin.none.none$;
            if (typeof result === 'string') return new Sk.builtin.str(result);
            if (typeof result === 'number') return new Sk.builtin.int_(result);
            if (typeof result === 'boolean') return new Sk.builtin.bool(result);
            if (Array.isArray(result)) {
              return new Sk.builtin.tuple(result.map(item =>
                typeof item === 'string' ? new Sk.builtin.str(item) : new Sk.builtin.int_(item)
              ));
            }
            return Sk.builtin.none.none$;
          } catch (err) {
            throw new Sk.builtin.RuntimeError(err.message);
          }
        });
      };

      const commands = {
        move_forward: () => {
          robot.moveForward(grid);
          log.push({ type: 'move', robot: snapRobot() });
        },
        turn_right: () => {
          robot.turnRight();
          log.push({ type: 'turn', robot: snapRobot() });
        },
        turn_left: () => {
          robot.turnLeft();
          log.push({ type: 'turn', robot: snapRobot() });
        },
        plant: (type) => {
          const res = robot.plant(grid, type || 'wheat');
          log.push({ type: 'plant', cellKey: res.key, cellData: res.cell, robot: snapRobot() });
        },
        water: () => {
          const res = robot.water(grid);
          log.push({ type: 'water', cellKey: res.key, cellData: res.cell, robot: snapRobot() });
        },
        harvest: () => {
          const res = robot.harvest(grid);
          log.push({ type: 'harvest', cellKey: res.key, cellData: res.cell, robot: snapRobot() });
        },
        use_pickaxe: () => {
          const res = robot.clear(grid, 'STONE');
          log.push({ type: 'clear', cellKey: res.key, cellData: res.cell, robot: snapRobot() });
        },
        use_axe: () => {
          const res = robot.clear(grid, 'BRANCH');
          log.push({ type: 'clear', cellKey: res.key, cellData: res.cell, robot: snapRobot() });
        },
        check_block: () => {
          return robot.checkBlock(grid);
        },
        get_money: () => {
          return robot.money;
        },
        get_farm_size: () => {
          return robot.getFarmSize();
        },
        get_position: () => {
          return [robot.x, robot.y];
        },
        print: (msg) => {
          outputLines.push(String(msg));
        }
      };

      for (const [name, fn] of Object.entries(commands)) {
        Sk.builtins[name] = makeSkulptFn(fn);
      }

      Sk.misceval.asyncToPromise(() =>
        Sk.importMainWithBody('<stdin>', false, code, true)
      ).then(() => {
        resolve({
          success: true,
          log,
          output: outputLines.join('')
        });
      }).catch((err) => {
        let errorMsg = String(err);
        if (err.tp$str) errorMsg = err.tp$str().v;
        resolve({
          success: false,
          error: errorMsg,
          log,
          output: outputLines.join('')
        });
      });
    });
  }
}
