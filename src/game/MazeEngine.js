/**
 * MazeEngine.js
 * Maze generation (recursive backtracking) + Robot state + Fog of war
 */

// Directions: 0=NORTH, 1=EAST, 2=SOUTH, 3=WEST
export const DIR = { NORTH: 0, EAST: 1, SOUTH: 2, WEST: 3 };
export const DIR_NAMES = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
const DIR_DELTAS = [
  { dx: 0, dy: -1 }, // NORTH
  { dx: 1, dy: 0 },  // EAST
  { dx: 0, dy: 1 },  // SOUTH
  { dx: -1, dy: 0 }, // WEST
];

// CellState enum values (as numbers matching spec)
export const CellState = { UNKNOWN: 0, DISCOVERED: 1, VISITED: 2 };

// Wall bitmask per cell: bit 0=N, 1=E, 2=S, 3=W
// walls[y][x] is a bitmask; bit set = wall present
function buildFullWallGrid(cols, rows) {
  // Start with all walls present
  const walls = Array.from({ length: rows }, () =>
    new Uint8Array(cols).fill(0b1111)
  );
  return walls;
}

/**
 * Generate maze using recursive backtracking (DFS).
 * Returns walls[rows][cols] bitmask array.
 */
export function generateMaze(cols, rows, seed = null) {
  const walls = buildFullWallGrid(cols, rows);
  const visited = Array.from({ length: rows }, () => new Uint8Array(cols));

  // Simple seeded LCG random for deterministic generation
  let _seed = seed !== null ? seed : Math.floor(Math.random() * 2 ** 31);
  const rand = () => {
    _seed = (_seed * 1664525 + 1013904223) & 0xffffffff;
    return (_seed >>> 0) / 0xffffffff;
  };

  const inBounds = (x, y) => x >= 0 && x < cols && y >= 0 && y < rows;

  // Remove wall between (x,y) and neighbor in direction d
  const removeWall = (x, y, d) => {
    walls[y][x] &= ~(1 << d);
    const nx = x + DIR_DELTAS[d].dx;
    const ny = y + DIR_DELTAS[d].dy;
    const opposite = (d + 2) % 4;
    walls[ny][nx] &= ~(1 << opposite);
  };

  // Iterative DFS backtracking
  const stack = [{ x: 0, y: 0 }];
  visited[0][0] = 1;
  let visitedCount = 1;
  const total = cols * rows;

  while (visitedCount < total) {
    const top = stack[stack.length - 1];
    // Gather unvisited neighbors
    const neighbors = [];
    for (let d = 0; d < 4; d++) {
      const nx = top.x + DIR_DELTAS[d].dx;
      const ny = top.y + DIR_DELTAS[d].dy;
      if (inBounds(nx, ny) && !visited[ny][nx]) {
        neighbors.push({ x: nx, y: ny, d });
      }
    }
    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const chosen = neighbors[Math.floor(rand() * neighbors.length)];
      removeWall(top.x, top.y, chosen.d);
      visited[chosen.y][chosen.x] = 1;
      visitedCount++;
      stack.push({ x: chosen.x, y: chosen.y });
    }
  }

  return walls;
}

/**
 * VirtualMaze — the "simulation" state that Skulpt runs against.
 * Tracks robot position/direction, fog of war, and all API calls.
 */
export class VirtualMaze {
  constructor({ cols, rows, walls, goalX, goalY, fogOfWar = true, animSpeed = 150 }) {
    this.cols = cols;
    this.rows = rows;
    this.walls = walls;
    this.goalX = goalX;
    this.goalY = goalY;
    this.fogOfWar = fogOfWar;
    this.animSpeed = animSpeed;

    // Robot state
    this.x = 0;
    this.y = 0;
    this.dir = DIR.EAST; // Start facing East

    // Fog of war: 2D array of CellState
    this.fog = Array.from({ length: rows }, () =>
      new Uint8Array(cols).fill(CellState.UNKNOWN)
    );
    // Mark starting position as visited and update sensor discoveries
    this._markVisited(0, 0);

    // Score tracking
    this.moves = 0;
    this.turns = 0;
    this.solved = false;
  }

  _markVisited(x, y) {
    this.fog[y][x] = CellState.VISITED;
    this._discoverNeighbors(x, y);
  }

  _discoverNeighbors(x, y) {
    for (let d = 0; d < 4; d++) {
      const nx = x + DIR_DELTAS[d].dx;
      const ny = y + DIR_DELTAS[d].dy;
      if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
        if (this.fog[ny][nx] === CellState.UNKNOWN) {
          this.fog[ny][nx] = CellState.DISCOVERED;
        }
      }
    }
  }

  // ─── Wall helpers ────────────────────────────────────────────────────────
  _hasWall(x, y, dir) {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return true;
    return !!(this.walls[y][x] & (1 << dir));
  }

  // Returns whether there's a wall in the robot's absolute direction `dir`
  _wallInDir(dir) {
    return this._hasWall(this.x, this.y, dir);
  }

  // Translate relative direction (0=front,1=right,3=left) to absolute
  _relToAbs(rel) {
    return (this.dir + rel) % 4;
  }

  // ─── Robot API ───────────────────────────────────────────────────────────
  moveForward() {
    const frontDir = this.dir;
    if (this._wallInDir(frontDir)) {
      throw new Error('Cannot move forward: wall ahead!');
    }
    this.x += DIR_DELTAS[frontDir].dx;
    this.y += DIR_DELTAS[frontDir].dy;
    this.moves++;
    this._markVisited(this.x, this.y);
    if (this.x === this.goalX && this.y === this.goalY) {
      this.solved = true;
    }
  }

  turnLeft() {
    this.dir = (this.dir + 3) % 4;
    this.turns++;
  }

  turnRight() {
    this.dir = (this.dir + 1) % 4;
    this.turns++;
  }

  wallFront() {
    return this._wallInDir(this.dir);
  }

  wallLeft() {
    return this._wallInDir(this._relToAbs(3));
  }

  wallRight() {
    return this._wallInDir(this._relToAbs(1));
  }

  position() {
    return [this.x, this.y];
  }

  direction() {
    return DIR_NAMES[this.dir];
  }

  atGoal() {
    return this.x === this.goalX && this.y === this.goalY;
  }

  getGoalPosition() {
    return [this.goalX, this.goalY];
  }

  getSize() {
    return [this.cols, this.rows];
  }

  // Score: moves + 0.25 per turn
  getScore() {
    return this.moves + this.turns * 0.25;
  }

  // Snapshot for action queue
  snap() {
    return {
      x: this.x,
      y: this.y,
      dir: this.dir,
      fog: this.fog.map(row => new Uint8Array(row)), // deep copy
      solved: this.solved,
    };
  }
}


