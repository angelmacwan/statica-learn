// Grid state and cell management
export class Grid {
  constructor(size, initialCells = []) {
    this.size = size;
    this.cells = Array(size).fill(null).map(() => Array(size).fill('empty'));
    this.waterCount = Array(size).fill(null).map(() => Array(size).fill(0));

    for (const cell of initialCells) {
      this.cells[cell.y][cell.x] = cell.type;
    }
  }

  getCell(x, y) {
    if (x < 0 || y < 0 || x >= this.size || y >= this.size) return 'wall';
    return this.cells[y][x];
  }

  setCell(x, y, type) {
    if (x < 0 || y < 0 || x >= this.size || y >= this.size) return;
    this.cells[y][x] = type;
    if (type === 'seed' || type === 'soil' || type === 'empty') {
      this.waterCount[y][x] = 0;
    }
  }

  incrementWater(x, y) {
    this.waterCount[y][x] = (this.waterCount[y][x] || 0) + 1;
    return this.waterCount[y][x];
  }

  getWaterCount(x, y) {
    return this.waterCount[y][x] || 0;
  }

  isWalkable(x, y) {
    return this.getCell(x, y) !== 'wall';
  }

  clone() {
    const g = new Grid(this.size);
    g.cells = this.cells.map(row => [...row]);
    g.waterCount = this.waterCount.map(row => [...row]);
    return g;
  }

  countType(type) {
    let count = 0;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.cells[y][x] === type) count++;
      }
    }
    return count;
  }

  getPositionsOfType(type) {
    const positions = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.cells[y][x] === type) positions.push({ x, y });
      }
    }
    return positions;
  }
}
