// Success condition checker
export function checkSuccess(condition, robot, grid, harvestedCount) {
  switch (condition.type) {
    case 'all_of':
      return condition.conditions.every(c =>
        checkSuccess(c, robot, grid, harvestedCount)
      );

    case 'robot_at':
      return robot.x === condition.x && robot.y === condition.y;

    case 'robot_at_with_item':
      return robot.x === condition.x &&
             robot.y === condition.y &&
             robot.inventory.includes(condition.item);

    case 'robot_at_within_moves':
      return robot.x === condition.x &&
             robot.y === condition.y &&
             robot.moves <= condition.maxMoves;

    case 'seed_at':
      return grid.getCell(condition.x, condition.y) === 'seed';

    case 'seeds_at': {
      return condition.positions.every(pos =>
        grid.getCell(pos.x, pos.y) === 'seed'
      );
    }

    case 'cells_at': {
      return condition.positions.every(pos =>
        grid.getCell(pos.x, pos.y) === pos.type
      );
    }

    case 'type_count':
      return grid.countType(condition.cellType) === condition.count;

    case 'seeds_count':
      return grid.countType('seed') >= condition.count;

    case 'watered_count':
      return grid.countType('plant') + grid.countType('mature') >= condition.count;

    case 'harvested_count':
      return harvestedCount >= condition.count;

    case 'inventory_count':
      return robot.inventory.filter(i => i === condition.item).length === condition.count;

    case 'inventory_empty_and_seeds':
      return robot.inventory.filter(i => i === 'seed').length === 0 &&
             grid.countType('seed') >= condition.count;

    default:
      return false;
  }
}
