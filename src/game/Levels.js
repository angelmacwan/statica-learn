// Level definitions for Robot Gardener
// Cell types: 'empty', 'soil', 'water_source', 'seed', 'plant', 'mature', 'wall', 'goal'

export const LEVELS = [
  // ─── TIER 1: SEQUENCING ─────────────────────────────────────
  {
    id: 'L1_1',
    tier: 1,
    tierLevel: 1,
    title: 'Move Forward',
    objective: 'Move the robot 3 spaces forward and stop.',
    hint: 'Call move_forward() three times, one on each line.',
    gridSize: 8,
    robotStart: { x: 3, y: 6, dir: 0 }, // dir: 0=N,1=E,2=S,3=W
    initialCells: [],
    successCondition: { type: 'robot_at', x: 3, y: 3 },
    starterCode: `# Move the robot forward 3 times
move_forward()
move_forward()
move_forward()`,
    allowedCommands: ['move_forward', 'turn_left', 'turn_right', 'print'],
    newConcept: 'Function calls & sequencing',
  },
  {
    id: 'L1_2',
    tier: 1,
    tierLevel: 2,
    title: 'Plant a Seed',
    objective: 'Move to the soil plot and plant a seed there.',
    hint: 'Use move_right() then move_forward() to reach the soil, then plant().',
    gridSize: 8,
    robotStart: { x: 2, y: 5, dir: 0 },
    initialCells: [{ x: 3, y: 4, type: 'soil' }],
    successCondition: { type: 'seed_at', x: 3, y: 4 },
    starterCode: `# Navigate to the soil and plant a seed
move_right()
move_forward()
plant()`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'plant', 'print'],
    newConcept: 'Output actions (plant)',
  },
  {
    id: 'L1_3',
    tier: 1,
    tierLevel: 3,
    title: 'Row of Seeds',
    objective: 'Plant 3 seeds in a horizontal line (at columns 2, 3, 4 on row 5).',
    hint: 'Plant, then move right, plant again — repeat for each cell.',
    gridSize: 8,
    robotStart: { x: 2, y: 5, dir: 0 },
    initialCells: [
      { x: 2, y: 5, type: 'soil' },
      { x: 3, y: 5, type: 'soil' },
      { x: 4, y: 5, type: 'soil' },
    ],
    successCondition: { type: 'seeds_at', positions: [{ x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }] },
    starterCode: `# Plant 3 seeds in a row — no loops needed yet!
plant()
move_right()
plant()
move_right()
plant()`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'plant', 'print'],
    newConcept: 'Repetition via manual sequence',
  },
  {
    id: 'L1_4',
    tier: 1,
    tierLevel: 4,
    title: 'Simple Maze',
    objective: 'Navigate around the walls to reach the goal tile at (5, 2).',
    hint: 'Use turn_right() / turn_left() to change direction, then move_forward().',
    gridSize: 8,
    robotStart: { x: 1, y: 6, dir: 0 },
    initialCells: [
      { x: 1, y: 4, type: 'wall' },
      { x: 2, y: 4, type: 'wall' },
      { x: 3, y: 4, type: 'wall' },
      { x: 3, y: 3, type: 'wall' },
      { x: 3, y: 2, type: 'wall' },
      { x: 5, y: 2, type: 'goal' },
    ],
    successCondition: { type: 'robot_at', x: 5, y: 2 },
    starterCode: `# Navigate around the walls to reach the goal
# Tip: turn_right() / turn_left() + move_forward()
move_forward()
move_forward()
turn_right()
move_forward()
move_forward()
move_forward()
move_forward()
turn_left()
move_forward()
move_forward()`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'print'],
    newConcept: 'Direction changes',
  },
  {
    id: 'L1_5',
    tier: 1,
    tierLevel: 5,
    title: 'Gather Water',
    objective: 'Move to the water source, collect water, then return to start (3, 6).',
    hint: 'Use check_cell() to confirm you are at the water source before collecting.',
    gridSize: 8,
    robotStart: { x: 3, y: 6, dir: 0 },
    initialCells: [{ x: 3, y: 2, type: 'water_source' }],
    successCondition: { type: 'robot_at_with_item', x: 3, y: 6, item: 'water' },
    starterCode: `# Go to the water source, collect water, come back
move_forward()
move_forward()
move_forward()
move_forward()
water()          # collect from water source
move_forward()   # oops — actually turn around first!
# Hint: you need to turn around to go back
turn_right()
turn_right()
move_forward()
move_forward()
move_forward()
move_forward()`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'water', 'check_cell', 'get_inventory', 'print'],
    newConcept: 'check_cell() · inventory',
  },

  // ─── TIER 2: CONTROL FLOW ────────────────────────────────────
  {
    id: 'L2_1',
    tier: 2,
    tierLevel: 1,
    title: 'Loop & Plant',
    objective: 'Plant 5 seeds in a vertical line using a for loop.',
    hint: 'Use for i in range(5): then indent plant() and move_forward().',
    gridSize: 8,
    robotStart: { x: 3, y: 6, dir: 0 },
    initialCells: [
      { x: 3, y: 6, type: 'soil' },
      { x: 3, y: 5, type: 'soil' },
      { x: 3, y: 4, type: 'soil' },
      { x: 3, y: 3, type: 'soil' },
      { x: 3, y: 2, type: 'soil' },
    ],
    successCondition: { type: 'seeds_count', count: 5 },
    starterCode: `# Plant 5 seeds using a loop
for i in range(5):
    plant()
    move_forward()`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'plant', 'print'],
    newConcept: 'for loops · range()',
  },
  {
    id: 'L2_2',
    tier: 2,
    tierLevel: 2,
    title: 'Water If Dry',
    objective: 'Walk across the row and water only cells that have seeds (not already watered).',
    hint: 'Use check_cell() to see if the cell is "seed", then water() it.',
    gridSize: 8,
    robotStart: { x: 1, y: 4, dir: 1 }, // facing East
    initialCells: [
      { x: 1, y: 4, type: 'seed' },
      { x: 2, y: 4, type: 'empty' },
      { x: 3, y: 4, type: 'seed' },
      { x: 4, y: 4, type: 'empty' },
      { x: 5, y: 4, type: 'seed' },
    ],
    successCondition: { type: 'watered_count', count: 3 },
    starterCode: `# Walk across and water only seed cells
for i in range(5):
    if check_cell() == "seed":
        water()
    move_forward()`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'water', 'check_cell', 'print'],
    newConcept: 'if statements · conditionals',
  },
  {
    id: 'L2_3',
    tier: 2,
    tierLevel: 3,
    title: 'Four Corners',
    objective: 'Plant a seed at each of the 4 corners of the inner 6x6 area.',
    hint: 'Move to corner, plant, turn right, repeat 4 times.',
    gridSize: 8,
    robotStart: { x: 1, y: 6, dir: 0 },
    initialCells: [
      { x: 1, y: 1, type: 'soil' },
      { x: 6, y: 1, type: 'soil' },
      { x: 6, y: 6, type: 'soil' },
      { x: 1, y: 6, type: 'soil' },
    ],
    successCondition: { type: 'seeds_at', positions: [{ x: 1, y: 1 }, { x: 6, y: 1 }, { x: 6, y: 6 }, { x: 1, y: 6 }] },
    starterCode: `# Plant at all 4 corners
# Corner 1: top-left (1,1)
move_forward()
move_forward()
move_forward()
move_forward()
move_forward()
plant()
turn_right()
# Fill in the rest!`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'plant', 'print'],
    newConcept: 'Loops + direction changes',
  },
  {
    id: 'L2_4',
    tier: 2,
    tierLevel: 4,
    title: 'Plant Until Empty',
    objective: 'Plant seeds until your inventory runs out. You start with 4 seeds.',
    hint: 'Use while len(get_inventory()) > 0 to loop while you have seeds.',
    gridSize: 8,
    robotStart: { x: 1, y: 4, dir: 1 },
    initialCells: [
      { x: 1, y: 4, type: 'soil' },
      { x: 2, y: 4, type: 'soil' },
      { x: 3, y: 4, type: 'soil' },
      { x: 4, y: 4, type: 'soil' },
    ],
    startInventory: ['seed', 'seed', 'seed', 'seed'],
    successCondition: { type: 'inventory_empty_and_seeds', count: 4 },
    starterCode: `# Plant while inventory has seeds
while len(get_inventory()) > 0:
    plant()
    move_forward()`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'plant', 'get_inventory', 'print'],
    newConcept: 'while loops · inventory',
  },
  {
    id: 'L2_5',
    tier: 2,
    tierLevel: 5,
    title: 'Grow & Harvest',
    objective: 'Water 3 seeds twice each to make them mature, then harvest all 3.',
    hint: 'Loop twice to water each seed, then loop again to harvest mature plants.',
    gridSize: 8,
    robotStart: { x: 1, y: 4, dir: 1 },
    initialCells: [
      { x: 1, y: 4, type: 'seed' },
      { x: 3, y: 4, type: 'seed' },
      { x: 5, y: 4, type: 'seed' },
    ],
    successCondition: { type: 'harvested_count', count: 3 },
    starterCode: `# Water each seed twice, then harvest
positions = [1, 3, 5]
for i in range(2):
    for pos in positions:
        # navigate to pos and water
        pass

# Now harvest each
for pos in positions:
    # navigate to pos and harvest
    pass`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'water', 'harvest', 'check_cell', 'get_inventory', 'print'],
    newConcept: 'Multi-step state · nested ideas',
  },

  // ─── TIER 3: ADVANCED ────────────────────────────────────────
  {
    id: 'L3_1',
    tier: 3,
    tierLevel: 1,
    title: 'Custom Function',
    objective: 'Define a function plant_and_move() and call it 4 times to plant a line of seeds.',
    hint: 'def my_function(): ... then call it with my_function().',
    gridSize: 8,
    robotStart: { x: 2, y: 6, dir: 0 },
    initialCells: [
      { x: 2, y: 6, type: 'soil' },
      { x: 2, y: 5, type: 'soil' },
      { x: 2, y: 4, type: 'soil' },
      { x: 2, y: 3, type: 'soil' },
    ],
    successCondition: { type: 'seeds_count', count: 4 },
    starterCode: `# Define a reusable function
def plant_and_move():
    plant()
    move_forward()

# Call it 4 times
for i in range(4):
    plant_and_move()`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'plant', 'water', 'harvest', 'check_cell', 'get_inventory', 'print'],
    newConcept: 'Function definitions',
  },
  {
    id: 'L3_2',
    tier: 3,
    tierLevel: 2,
    title: 'Grid Pattern',
    objective: 'Plant seeds in a 3×3 pattern starting at (1,1).',
    hint: 'Use nested for loops: outer for rows, inner for columns.',
    gridSize: 8,
    robotStart: { x: 1, y: 1, dir: 1 }, // facing East
    initialCells: [
      ...[1, 2, 3].flatMap(y => [1, 2, 3].map(x => ({ x, y, type: 'soil' }))),
    ],
    successCondition: { type: 'seeds_count', count: 9 },
    starterCode: `# Plant a 3x3 grid of seeds using nested loops
def plant_row(length):
    for i in range(length):
        plant()
        if i < length - 1:
            move_forward()

for row in range(3):
    plant_row(3)
    # move to next row start
    if row < 2:
        turn_right()
        move_forward()
        turn_right()`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'plant', 'print'],
    newConcept: 'Nested loops',
  },
  {
    id: 'L3_3',
    tier: 3,
    tierLevel: 3,
    title: 'Inventory Tracker',
    objective: 'Harvest 3 plants and track counts with a dictionary.',
    hint: 'Create counts = {} then counts["plant"] = counts.get("plant", 0) + 1.',
    gridSize: 8,
    robotStart: { x: 1, y: 4, dir: 1 },
    initialCells: [
      { x: 1, y: 4, type: 'mature' },
      { x: 3, y: 4, type: 'mature' },
      { x: 5, y: 4, type: 'mature' },
    ],
    successCondition: { type: 'harvested_count', count: 3 },
    starterCode: `# Harvest plants and track with a dictionary
counts = {}

for step in range(5):
    cell = check_cell()
    if cell == "mature":
        harvest()
        counts["plant"] = counts.get("plant", 0) + 1
        print("Harvested! Total:", counts["plant"])
    move_forward()`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'harvest', 'check_cell', 'get_inventory', 'print'],
    newConcept: 'Dictionaries · .get()',
  },
  {
    id: 'L3_4',
    tier: 3,
    tierLevel: 4,
    title: 'Optimal Path',
    objective: 'Reach the goal at (6, 1) in 10 moves or fewer.',
    hint: 'Plan an efficient diagonal-like path — minimize backtracking.',
    gridSize: 8,
    robotStart: { x: 1, y: 6, dir: 0 },
    initialCells: [
      { x: 6, y: 1, type: 'goal' },
      { x: 3, y: 4, type: 'wall' },
      { x: 3, y: 3, type: 'wall' },
      { x: 4, y: 4, type: 'wall' },
    ],
    successCondition: { type: 'robot_at_within_moves', x: 6, y: 1, maxMoves: 10 },
    starterCode: `# Reach goal in 10 moves or fewer!
# Think before you code — plan your route.
move_forward()
move_forward()
turn_right()
move_forward()
move_forward()
turn_left()
move_forward()
move_forward()
move_forward()
turn_right()
move_forward()`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'print'],
    newConcept: 'Algorithmic thinking',
  },
  {
    id: 'L3_5',
    tier: 3,
    tierLevel: 5,
    title: 'Full Crop Cycle',
    objective: 'Complete a full crop cycle: plant → water (×2) → harvest for all 3 soil plots.',
    hint: 'Use a helper function to handle each plot. Watering twice makes plants mature.',
    gridSize: 8,
    robotStart: { x: 1, y: 4, dir: 1 },
    initialCells: [
      { x: 1, y: 4, type: 'soil' },
      { x: 3, y: 4, type: 'soil' },
      { x: 5, y: 4, type: 'soil' },
    ],
    successCondition: { type: 'harvested_count', count: 3 },
    starterCode: `# Full crop cycle: plant, water ×2, harvest
def full_cycle():
    plant()
    water()
    water()
    harvest()

full_cycle()
move_forward()
move_forward()
full_cycle()
move_forward()
move_forward()
full_cycle()`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'plant', 'water', 'harvest', 'check_cell', 'get_inventory', 'print'],
    newConcept: 'State machines · composability',
  },
];

export const TIER_INFO = {
  1: { name: 'Sequencing', color: '#4589ff', icon: '▶' },
  2: { name: 'Control Flow', color: '#08bdba', icon: '↺' },
  3: { name: 'Advanced', color: '#be95ff', icon: '⬡' },
};
