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
  {
    id: 'L1_6',
    tier: 1,
    tierLevel: 6,
    title: 'Watering Run',
    objective: 'Gather water from the water source at (3, 2), then move to (3, 5) and water the dry seed.',
    hint: 'Move forward twice to the water source, collect water by calling water(), turn around, move to (3, 5), and call water() again.',
    gridSize: 8,
    robotStart: { x: 3, y: 4, dir: 0 },
    initialCells: [
      { x: 3, y: 2, type: 'water_source' },
      { x: 3, y: 5, type: 'seed' }
    ],
    successCondition: { type: 'watered_count', count: 1 },
    starterCode: `# Fetch water from (3,2), then water the seed at (3,5)
move_forward()
move_forward()
water()
turn_right()
turn_right()
move_forward()
move_forward()
move_forward()
water()`,
    allowedCommands: ['move_forward', 'turn_left', 'turn_right', 'water', 'print'],
    newConcept: 'Sequence integration',
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
  {
    id: 'L2_6',
    tier: 2,
    tierLevel: 6,
    title: 'Smart Planting',
    objective: 'Walk across the row from columns 1 to 5. Check each cell using check_cell(), and if it is "soil", plant a seed.',
    hint: 'Use a for loop and check_cell() to check if it is "soil", then plant().',
    gridSize: 8,
    robotStart: { x: 1, y: 4, dir: 1 },
    initialCells: [
      { x: 1, y: 4, type: 'soil' },
      { x: 2, y: 4, type: 'empty' },
      { x: 3, y: 4, type: 'soil' },
      { x: 4, y: 4, type: 'empty' },
      { x: 5, y: 4, type: 'soil' }
    ],
    successCondition: { type: 'seeds_count', count: 3 },
    starterCode: `# Check each cell and plant if it is soil
for i in range(5):
    if check_cell() == "soil":
        plant()
    move_forward()`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'plant', 'check_cell', 'print'],
    newConcept: 'Checking soil before planting',
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
  {
    id: 'L3_6',
    tier: 3,
    tierLevel: 6,
    title: 'Diagonal Irrigation',
    objective: 'Plant and water twice to make a diagonal line of 4 seeds mature at (1,1), (2,2), (3,3), and (4,4).',
    hint: 'Use a loop and relative moves. For each diagonal step, plant a seed, water it twice, then move diagonally to the next plot.',
    gridSize: 8,
    robotStart: { x: 1, y: 1, dir: 1 },
    initialCells: [
      { x: 1, y: 1, type: 'soil' },
      { x: 2, y: 2, type: 'soil' },
      { x: 3, y: 3, type: 'soil' },
      { x: 4, y: 4, type: 'soil' }
    ],
    successCondition: { type: 'watered_count', count: 4 },
    starterCode: `# Plant and water a diagonal line of 4 plots
for i in range(4):
    plant()
    water()
    water()
    if i < 3:
        turn_right()
        move_forward()
        turn_left()
        move_forward()`,
    allowedCommands: ['move_forward', 'move_right', 'move_left', 'turn_left', 'turn_right', 'plant', 'water', 'print'],
    newConcept: 'Diagonal pathing',
  },

  // ─── TIER 4: CHALLENGE GARDENS ──────────────────────────────
  {
    id: 'L4_1',
    tier: 4,
    tierLevel: 1,
    title: 'Serpentine Orchard',
    objective: 'Plant every soil tile in the 4x3 orchard using a back-and-forth route. Finish with exactly 12 seeds planted.',
    hint: 'Plant one row, move down, reverse direction, and repeat. row % 2 helps choose the turn direction.',
    gridSize: 8,
    robotStart: { x: 1, y: 1, dir: 1 },
    initialCells: [
      ...[1, 2, 3].flatMap(y => [1, 2, 3, 4].map(x => ({ x, y, type: 'soil' }))),
    ],
    successCondition: {
      type: 'all_of',
      conditions: [
        { type: 'seeds_at', positions: [1, 2, 3].flatMap(y => [1, 2, 3, 4].map(x => ({ x, y }))) },
        { type: 'type_count', cellType: 'seed', count: 12 },
      ],
    },
    starterCode: `# Plant the orchard in a serpentine pattern
for row in range(3):
    for col in range(4):
        plant()
        if col < 3:
            move_forward()

    if row < 2:
        if row % 2 == 0:
            turn_right()
            move_forward()
            turn_right()
        else:
            turn_left()
            move_forward()
            turn_left()`,
    allowedCommands: ['move_forward', 'turn_left', 'turn_right', 'plant', 'print'],
    newConcept: 'Nested loops · parity',
  },
  {
    id: 'L4_2',
    tier: 4,
    tierLevel: 2,
    title: 'Patch Triage',
    objective: 'Walk across the row and make the right decision for each plot: water seeds, plant soil, harvest mature crops, and leave everything else alone.',
    hint: 'Store check_cell() in a variable, then use if / elif branches for "seed", "soil", and "mature".',
    gridSize: 8,
    robotStart: { x: 1, y: 4, dir: 1 },
    initialCells: [
      { x: 1, y: 4, type: 'seed' },
      { x: 2, y: 4, type: 'mature' },
      { x: 3, y: 4, type: 'soil' },
      { x: 4, y: 4, type: 'plant' },
      { x: 5, y: 4, type: 'empty' },
      { x: 6, y: 4, type: 'seed' },
    ],
    successCondition: {
      type: 'all_of',
      conditions: [
        { type: 'harvested_count', count: 1 },
        {
          type: 'cells_at',
          positions: [
            { x: 1, y: 4, type: 'plant' },
            { x: 2, y: 4, type: 'soil' },
            { x: 3, y: 4, type: 'seed' },
            { x: 4, y: 4, type: 'plant' },
            { x: 5, y: 4, type: 'empty' },
            { x: 6, y: 4, type: 'plant' },
          ],
        },
      ],
    },
    starterCode: `# Triage each plot based on its current state
for step in range(6):
    cell = check_cell()
    if cell == "seed":
        water()
    elif cell == "soil":
        plant()
    elif cell == "mature":
        harvest()

    if step < 5:
        move_forward()`,
    allowedCommands: ['move_forward', 'plant', 'water', 'harvest', 'check_cell', 'print'],
    newConcept: 'Branching with elif',
  },
  {
    id: 'L4_3',
    tier: 4,
    tierLevel: 3,
    title: 'Reservoir Route',
    objective: 'Collect water, water the three corner seeds, then reach the goal at (3, 3) in 18 moves or fewer.',
    hint: 'Trace the outside path first: reservoir, top-right seed, bottom-right seed, bottom-left seed, then cut back to the goal.',
    gridSize: 8,
    robotStart: { x: 1, y: 3, dir: 0 },
    initialCells: [
      { x: 1, y: 1, type: 'water_source' },
      { x: 5, y: 1, type: 'seed' },
      { x: 5, y: 5, type: 'seed' },
      { x: 1, y: 5, type: 'seed' },
      { x: 3, y: 3, type: 'goal' },
      { x: 2, y: 2, type: 'wall' },
      { x: 3, y: 2, type: 'wall' },
      { x: 4, y: 2, type: 'wall' },
      { x: 2, y: 4, type: 'wall' },
      { x: 4, y: 4, type: 'wall' },
    ],
    successCondition: {
      type: 'all_of',
      conditions: [
        { type: 'robot_at_within_moves', x: 3, y: 3, maxMoves: 18 },
        {
          type: 'cells_at',
          positions: [
            { x: 5, y: 1, type: 'plant' },
            { x: 5, y: 5, type: 'plant' },
            { x: 1, y: 5, type: 'plant' },
          ],
        },
      ],
    },
    starterCode: `# Water all three seeds and finish at the goal
move_forward()
move_forward()
water()

turn_right()
for i in range(4):
    move_forward()
water()

turn_right()
for i in range(4):
    move_forward()
water()

turn_right()
for i in range(4):
    move_forward()
water()

turn_right()
turn_right()
move_forward()
move_forward()
turn_left()
move_forward()
move_forward()`,
    allowedCommands: ['move_forward', 'turn_left', 'turn_right', 'water', 'print'],
    newConcept: 'Route planning · move budget',
  },
  {
    id: 'L4_4',
    tier: 4,
    tierLevel: 4,
    title: 'Perimeter Harvest',
    objective: 'Harvest the four mature crops on the perimeter loop, then return to the starting tile.',
    hint: 'Each side is the same pattern: harvest, move 5 times, turn right.',
    gridSize: 8,
    robotStart: { x: 1, y: 6, dir: 0 },
    initialCells: [
      { x: 1, y: 6, type: 'mature' },
      { x: 1, y: 1, type: 'mature' },
      { x: 6, y: 1, type: 'mature' },
      { x: 6, y: 6, type: 'mature' },
    ],
    successCondition: {
      type: 'all_of',
      conditions: [
        { type: 'harvested_count', count: 4 },
        { type: 'robot_at', x: 1, y: 6 },
      ],
    },
    starterCode: `# Use the repeated perimeter pattern
for side in range(4):
    harvest()
    for step in range(5):
        move_forward()
    turn_right()`,
    allowedCommands: ['move_forward', 'turn_right', 'harvest', 'print'],
    newConcept: 'Loop decomposition',
  },
  {
    id: 'L4_5',
    tier: 4,
    tierLevel: 5,
    title: 'Checkerboard Survey',
    objective: 'Scan the 4x4 patch in a serpentine path and plant only the soil tiles. Finish with exactly 8 seeds.',
    hint: 'Combine the serpentine route with check_cell() so empty cells are skipped.',
    gridSize: 8,
    robotStart: { x: 1, y: 1, dir: 1 },
    initialCells: [
      ...[1, 2, 3, 4].flatMap(y =>
        [1, 2, 3, 4]
          .filter(x => (x + y) % 2 === 0)
          .map(x => ({ x, y, type: 'soil' }))
      ),
    ],
    successCondition: {
      type: 'all_of',
      conditions: [
        {
          type: 'seeds_at',
          positions: [1, 2, 3, 4].flatMap(y =>
            [1, 2, 3, 4]
              .filter(x => (x + y) % 2 === 0)
              .map(x => ({ x, y }))
          ),
        },
        { type: 'type_count', cellType: 'seed', count: 8 },
      ],
    },
    starterCode: `# Plant only soil cells while scanning the patch
for row in range(4):
    for col in range(4):
        if check_cell() == "soil":
            plant()
        if col < 3:
            move_forward()

    if row < 3:
        if row % 2 == 0:
            turn_right()
            move_forward()
            turn_right()
        else:
            turn_left()
            move_forward()
            turn_left()`,
    allowedCommands: ['move_forward', 'turn_left', 'turn_right', 'plant', 'check_cell', 'print'],
    newConcept: 'Pattern scanning · filtering',
  },
  {
    id: 'L4_6',
    tier: 4,
    tierLevel: 6,
    title: 'Crop Pipeline',
    objective: 'Use your 5 seeds to complete plant-water-water-harvest on every marked plot, then park on the goal at (5, 3).',
    hint: 'Write one helper for the full crop cycle, reuse it on the row, then turn north for the last two plots.',
    gridSize: 8,
    robotStart: { x: 1, y: 5, dir: 1 },
    initialCells: [
      { x: 1, y: 5, type: 'soil' },
      { x: 2, y: 5, type: 'soil' },
      { x: 3, y: 5, type: 'soil' },
      { x: 3, y: 4, type: 'soil' },
      { x: 3, y: 3, type: 'soil' },
      { x: 5, y: 3, type: 'goal' },
    ],
    startInventory: ['seed', 'seed', 'seed', 'seed', 'seed'],
    successCondition: {
      type: 'all_of',
      conditions: [
        { type: 'harvested_count', count: 5 },
        { type: 'inventory_count', item: 'seed', count: 0 },
        { type: 'robot_at', x: 5, y: 3 },
      ],
    },
    starterCode: `# Complete a full crop pipeline on all 5 plots
def full_cycle():
    plant()
    water()
    water()
    harvest()

for i in range(3):
    full_cycle()
    if i < 2:
        move_forward()

turn_left()
for i in range(2):
    move_forward()
    full_cycle()

turn_right()
move_forward()
move_forward()`,
    allowedCommands: ['move_forward', 'turn_left', 'turn_right', 'plant', 'water', 'harvest', 'get_inventory', 'print'],
    newConcept: 'Inventory · reusable workflows',
  },
];

export const TIER_INFO = {
  1: { name: 'Sequencing', color: '#4589ff', icon: '▶' },
  2: { name: 'Control Flow', color: '#08bdba', icon: '↺' },
  3: { name: 'Advanced', color: '#be95ff', icon: '⬡' },
  4: { name: 'Challenge Gardens', color: '#ff7eb6', icon: '◆' },
};
