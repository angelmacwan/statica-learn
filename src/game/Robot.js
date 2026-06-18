// Robot state and movement logic
export const DIRECTIONS = ['N', 'E', 'S', 'W'];
export const DIR_DELTAS = {
  N: { dx: 0, dy: -1 },
  E: { dx: 1,  dy: 0 },
  S: { dx: 0, dy:  1 },
  W: { dx: -1, dy: 0 },
};

export class Robot {
  constructor(x, y, dir = 0, gridSize = 8, inventory = []) {
    this.x = x;
    this.y = y;
    this.dir = dir; // 0=N,1=E,2=S,3=W
    this.gridSize = gridSize;
    this.inventory = [...inventory];
    this.moves = 0;
  }

  get dirName() { return DIRECTIONS[this.dir]; }

  clone() {
    const r = new Robot(this.x, this.y, this.dir, this.gridSize, this.inventory);
    r.moves = this.moves;
    return r;
  }

  moveForward(grid) {
    const { dx, dy } = DIR_DELTAS[this.dirName];
    const nx = this.x + dx;
    const ny = this.y + dy;
    if (nx < 0 || ny < 0 || nx >= this.gridSize || ny >= this.gridSize) {
      throw new Error(`Cannot move: out of bounds (${nx}, ${ny})`);
    }
    if (grid.getCell(nx, ny) === 'wall') {
      throw new Error(`Cannot move: wall at (${nx}, ${ny})`);
    }
    this.x = nx;
    this.y = ny;
    this.moves++;
    return { x: this.x, y: this.y };
  }

  turnLeft() { this.dir = (this.dir + 3) % 4; }
  turnRight() { this.dir = (this.dir + 1) % 4; }

  moveRight(grid) { this.turnRight(); this.moveForward(grid); }
  moveLeft(grid) { this.turnLeft(); this.moveForward(grid); }

  plant(grid) {
    const cell = grid.getCell(this.x, this.y);
    if (cell !== 'empty' && cell !== 'soil') {
      throw new Error(`Cannot plant: cell is "${cell}", not empty soil`);
    }
    grid.setCell(this.x, this.y, 'seed');
    return true;
  }

  water(grid) {
    const cell = grid.getCell(this.x, this.y);
    if (cell === 'water_source') {
      // Collect water from source
      this.inventory.push('water');
      return 'collected';
    }
    if (cell === 'seed') {
      grid.setCell(this.x, this.y, 'plant');
      grid.incrementWater(this.x, this.y);
      return 'watered_seed';
    }
    if (cell === 'plant') {
      const wc = grid.incrementWater(this.x, this.y);
      if (wc >= 2) {
        grid.setCell(this.x, this.y, 'mature');
      }
      return 'watered_plant';
    }
    throw new Error(`Cannot water: nothing to water at (${this.x}, ${this.y})`);
  }

  harvest(grid) {
    const cell = grid.getCell(this.x, this.y);
    if (cell !== 'mature' && cell !== 'plant') {
      throw new Error(`Cannot harvest: cell is "${cell}", plant not ready`);
    }
    grid.setCell(this.x, this.y, 'soil');
    this.inventory.push('crop');
    return 'harvested';
  }

  checkCell(grid) {
    return grid.getCell(this.x, this.y);
  }

  getInventory() { return [...this.inventory]; }

  addInventory(item) { this.inventory.push(item); }

  removeInventory(item) {
    const idx = this.inventory.indexOf(item);
    if (idx === -1) throw new Error(`Item "${item}" not in inventory`);
    this.inventory.splice(idx, 1);
  }
}
