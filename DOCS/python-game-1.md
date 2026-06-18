# Robot Gardener: Game Design Document & Implementation Plan

**Project**: Browser-based educational game teaching Python and programming concepts  
**Platform**: Web app (Vite + React + JavaScript)  
**Target Audience**: Beginners learning Python fundamentals (ages 14+, self-learners)  
**Scope**: MVP with 3 progression tiers, extensible to full game

---

## 1. Game Overview

### 1.1 High Concept

Players program a robot gardener to navigate grids, plant seeds, and grow crops by writing Python code. The robot interprets code commands and executes them visually. As puzzles increase in complexity, players learn programming fundamentals: variables, control flow, functions, and data structures.

### 1.2 Core Loop

1. Player reads puzzle objective (e.g., "Plant 3 seeds in a line")
2. Player writes Python code in editor
3. Player hits "Run" button
4. Robot executes code on the grid, showing real-time animation
5. If code succeeds: puzzle solved, unlock next level
6. If code fails: error message appears, player debugs and retries

### 1.3 Learning Objectives

- **Tier 1**: Variables, function calls, sequencing
- **Tier 2**: Loops, conditionals, basic data types
- **Tier 3**: Lists, dictionaries, custom functions, state management

---

## 2. Game Design

### 2.1 Core Mechanics

#### Robot Commands

The robot understands these Python-like functions:

```python
# Movement
move_forward()          # Move 1 cell in facing direction
move_right()           # Turn right, move 1 cell
move_left()            # Turn left, move 1 cell
turn_right()           # Rotate 90 degrees clockwise
turn_left()            # Rotate 90 degrees counter-clockwise

# Gardening
plant()                # Plant seed at current position
water()                # Water plant at current position
harvest()              # Pick crop at current position
check_cell()           # Return contents of current cell (water, seed, plant, empty)

# Inventory
add_inventory(item)    # Add item to inventory
remove_inventory(item) # Remove item from inventory
get_inventory()        # Return list of inventory items

# Utility
wait(seconds)          # Pause execution
print(message)         # Output to debug console
```

#### Grid System

- 8x8 grid (scales to 12x12 for advanced levels)
- Cell types: empty, water, seed, growing plant, mature plant
- Robot has position (x, y) and facing direction (North, East, South, West)
- Obstacles (walls) block movement, cause error if robot tries to move into them

#### Execution Model

- Player writes code in CodeMirror editor
- Click "Run" validates syntax and executes
- Robot animates at 1 cell per 500ms (configurable)
- Errors halt execution, display error message and line number
- Successful completion shows "Level Complete" modal

---

### 2.2 Progression System

#### Tier 1: Sequencing (Levels 1-5)

**Learning Focus**: Function calls, imperative thinking, understanding sequences

| Level | Objective                   | Constraints                    | New Concept                         |
| ----- | --------------------------- | ------------------------------ | ----------------------------------- |
| 1.1   | Move robot forward 3 spaces | No loops, no conditionals      | Function calls, sequencing          |
| 1.2   | Plant seed at position      | Hardcoded position             | Output actions (plant)              |
| 1.3   | Create line of 3 seeds      | Hardcoded moves/plants         | Repetition (manual sequence)        |
| 1.4   | Navigate simple maze        | 2x2 turning required           | Direction changes                   |
| 1.5   | Gather water from well      | Move to well, interact, return | Conditional logic (check cell type) |

**Starter Code Template**:

```python
# Level 1.1
move_forward()
move_forward()
move_forward()
```

---

#### Tier 2: Control Flow (Levels 6-15)

**Learning Focus**: Loops, conditionals, variables, optimization

| Level | Objective                          | Constraints                  | New Concept               |
| ----- | ---------------------------------- | ---------------------------- | ------------------------- |
| 2.1   | Plant 5 seeds in a line            | Must use `for` loop          | Loops, iteration          |
| 2.2   | Water plants only if dry           | Conditional watering         | `if` statements           |
| 2.3   | Navigate grid and plant at corners | 4 corners of grid            | Combining loops + turns   |
| 2.4   | Plant until inventory empty        | Variable-length inventory    | Loop with break condition |
| 2.5   | Grow and harvest crops             | Sequential watering, waiting | Time-based operations     |

**Starter Code Template**:

```python
# Level 2.1
for i in range(5):
    plant()
    move_forward()
```

---

#### Tier 3: Advanced (Levels 16-25)

**Learning Focus**: Functions, lists, dictionaries, composability, optimization

| Level | Objective                         | Constraints                | New Concept          |
| ----- | --------------------------------- | -------------------------- | -------------------- |
| 3.1   | Create reusable movement function | Must define own function   | Function definitions |
| 3.2   | Plant crops in grid pattern       | Use nested loops           | Nested loops         |
| 3.3   | Track inventory with dict         | Count each item type       | Dictionary basics    |
| 3.4   | Optimize movement path            | Must reach goal in N moves | Algorithmic thinking |
| 3.5   | Multi-step crop cycle             | Plant, water (x3), harvest | State machines       |

**Starter Code Template**:

```python
# Level 3.1
def move_and_plant():
    move_forward()
    plant()

for i in range(3):
    move_and_plant()
```

---

### 2.3 Visual Design

#### Aesthetic

- Isometric or top-down 2D grid
- Simple pixel/blocky art style
- Color palette: greens (grass), browns (soil), blues (water), yellows (crops)
- Robot: cute box character with directional indicator (arrow on top)

#### Animations

- **Movement**: Robot glides 500ms per cell
- **Planting**: Seed sprite appears, plant grows over 1 second
- **Watering**: Water droplet animation, plant color brightens
- **Harvesting**: Plant shrinks, disappears into inventory
- **Errors**: Robot shakes, red highlight on problematic line in editor

#### UI Layout

```
┌─────────────────────────────────────────┐
│ ROBOT GARDENER | Level 1.1: Move Forward │
├────────────────┬────────────────────────┤
│                │                        │
│   8x8 Grid     │   Code Editor          │
│   w/ Robot     │   (CodeMirror 6)       │
│                │                        │
│                ├────────────────────────┤
│                │ Run | Reset | Solution │
├────────────────┼────────────────────────┤
│ Objective: Move robot forward 3 spaces  │
│ Output Console / Errors                 │
└────────────────┴────────────────────────┘
```

---

## 3. Technical Architecture

### 3.1 Tech Stack

- **Frontend Framework**: React 18 with Vite
- **Code Editor**: CodeMirror 6
- **Python Execution**: Skulpt.js (lightweight Python interpreter)
- **Graphics**: Canvas API (vanilla or Pixi.js for performance)
- **State Management**: React Context + useState
- **Storage**: localStorage for progress/saves
- **Styling**: Tailwind CSS or vanilla CSS modules

### 3.2 Project Structure

```
robot-gardener/
├── src/
│   ├── components/
│   │   ├── GameCanvas.jsx        # Grid rendering + robot animation
│   │   ├── CodeEditor.jsx        # CodeMirror wrapper
│   │   ├── Console.jsx           # Output/error display
│   │   ├── LevelUI.jsx           # Objective, controls, UI chrome
│   │   └── Modal.jsx             # Level complete, solutions
│   ├── game/
│   │   ├── Robot.js              # Robot state + movement logic
│   │   ├── Grid.js               # Grid state + cell management
│   │   ├── Executor.js           # Code execution engine (Skulpt wrapper)
│   │   ├── Levels.js             # Level definitions + objectives
│   │   └── GameState.js          # Global game state + progress
│   ├── hooks/
│   │   ├── useGameEngine.js      # Main game loop + orchestration
│   │   ├── useCodeExecution.js   # Code running + error handling
│   │   └── useAnimation.js       # Animation frame scheduling
│   ├── styles/
│   │   └── globals.css           # Color vars, grid styles
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── levels.json               # Level data (alternative to hardcoding)
├── package.json
└── vite.config.js
```

### 3.3 Core Classes & Interfaces

#### Robot.js

```javascript
class Robot {
	constructor(x, y, gridWidth, gridHeight) {
		this.x = x;
		this.y = y;
		this.direction = 0; // 0=N, 1=E, 2=S, 3=W
		this.inventory = [];
		this.gridWidth = gridWidth;
		this.gridHeight = gridHeight;
	}

	moveForward() {
		/* update x,y based on direction */
	}
	turnLeft() {
		/* direction = (direction - 1) % 4 */
	}
	turnRight() {
		/* direction = (direction + 1) % 4 */
	}
	plant(gridCell) {
		/* add seed to grid, return success */
	}
	water(gridCell) {
		/* hydrate plant in grid */
	}
	harvest(gridCell) {
		/* remove plant, add to inventory */
	}
	getInventory() {
		return [...this.inventory];
	}
}
```

#### Grid.js

```javascript
class Grid {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.cells = Array(height)
			.fill(null)
			.map(() => Array(width).fill('empty'));
	}

	getCell(x, y) {
		/* return cell state */
	}
	setCell(x, y, type) {
		/* update cell */
	}
	isWalkable(x, y) {
		/* check if robot can move there */
	}
	reset() {
		/* clear grid to initial state */
	}
}
```

#### Executor.js

```javascript
class Executor {
	constructor(robot, grid) {
		this.robot = robot;
		this.grid = grid;
		this.executionLog = [];
		this.errors = [];
	}

	execute(code) {
		// 1. Parse code with Skulpt
		// 2. Inject robot/grid as global scope
		// 3. Run with timeout (max 10 seconds)
		// 4. Capture output, errors, final state
		// 5. Return { success, log, errors, finalState }
	}

	captureOutput(message) {
		this.executionLog.push(message);
	}
	haltWithError(error) {
		this.errors.push(error);
		throw error;
	}
}
```

---

## 4. Implementation Plan

### Phase 1: MVP Core (Week 1-2)

**Goal**: Playable single level with movement, planting, and basic loops

#### Deliverables

- [ ] Vite + React project scaffold
- [ ] Grid + Robot classes
- [ ] Basic GameCanvas (simple rectangles for grid/robot)
- [ ] CodeEditor wrapper around CodeMirror 6
- [ ] Skulpt integration for code execution
- [ ] Level 1.1 (move forward 3 spaces) fully playable
- [ ] Console output (print statements, errors)
- [ ] localStorage for progress save

#### Tasks

1. Setup Vite project, install deps (react, codemirror, skulpt, tailwind)
2. Implement Robot + Grid classes with unit tests
3. Build Canvas component (8x8 grid, robot sprite, animation loop)
4. Integrate Skulpt, map robot commands to Python functions
5. Build CodeEditor component with syntax highlighting
6. Create GameCanvas animation loop (requestAnimationFrame)
7. Implement Executor to run code safely with timeout
8. Add Console component for output/errors
9. Level complete detection + UI modal
10. Save/load progress to localStorage

#### Success Criteria

- Level 1.1 completable by writing 3x move_forward()
- Robot animates smoothly at 500ms per cell
- Errors display with line number
- Can move between levels, progress persists

---

### Phase 2: Tier 1 Levels (Week 2-3)

**Goal**: Levels 1.1 through 1.5 fully implemented with planting, watering, interaction

#### Deliverables

- [ ] Plant + Water mechanics
- [ ] Cell type system (empty, seed, plant, water, obstacle)
- [ ] Levels 1.2-1.5 with objectives + starter code
- [ ] Improved grid visuals (grass, soil, sprites)
- [ ] Tutorial overlay for first 2 levels

#### Tasks

1. Add plant/water/harvest/check_cell functions
2. Expand Grid to support multiple cell types
3. Implement cell state transitions (seed -> growing -> mature)
4. Create level definitions (objectives, initial grid state, constraints)
5. Build LevelUI component (objective display, controls)
6. Add animation for planting (seed sprite pops in, grows)
7. Add animation for watering (droplet effect)
8. Implement level validation (detect success condition)
9. Create tutorial text/hints for early levels

#### Success Criteria

- 5 levels playable start to finish
- Planting/watering animations smooth and clear
- Objectives are clear and testable
- Progress saves and resumes correctly

---

### Phase 3: Tier 2 Loops & Conditionals (Week 3-4)

**Goal**: For loops, if statements, variables introduced through levels 2.1-2.5

#### Deliverables

- [ ] Levels 2.1-2.5 fully implemented
- [ ] For loop support in Skulpt execution
- [ ] If/else conditional support
- [ ] Variable support in player code
- [ ] Improved error messages (syntax vs logic)

#### Tasks

1. Test Skulpt for loop support (may require wrapper or workaround)
2. Create level 2.1 (plant 5 seeds with loop)
3. Implement conditional check_cell() return values
4. Create level 2.2 (water only if dry)
5. Add visual indicator for cell state (color or icon)
6. Create levels 2.3-2.5
7. Implement failure detection (e.g., watered already-watered plant)
8. Add hint system ("You can use a loop for this")
9. Create "Solution" button to show reference answer

#### Success Criteria

- For loops work and optimize code
- If statements properly detect grid state
- Hints don't spoil, encourage exploration
- No syntax errors from Skulpt limitations

---

### Phase 4: Tier 3 Functions & Data Structures (Week 4-5)

**Goal**: Function definitions, lists, dictionaries in levels 3.1-3.5

#### Deliverables

- [ ] Levels 3.1-3.5 fully implemented
- [ ] Function definition support
- [ ] List/array support
- [ ] Dictionary support
- [ ] Multi-step level objectives

#### Tasks

1. Test Skulpt for function definitions
2. Create level 3.1 (define custom function)
3. Implement nested loop support for patterns
4. Create levels 3.2-3.3 (grid patterns, dict tracking)
5. Add visual feedback for inventory (list of items shown in UI)
6. Implement performance constraints (move limit, time limit)
7. Create optimization challenges (fewest moves, fewest lines)
8. Add leaderboard/progress tracking

#### Success Criteria

- Function definitions work and reduce boilerplate
- Lists/dicts functional without edge case bugs
- Move/time limits enforced visually
- All 25 levels completable in sequence

---

### Phase 5: Polish & Release (Week 5)

**Goal**: Visual refinement, accessibility, performance

#### Deliverables

- [ ] Pixel art or polished vector graphics for grid/robot
- [ ] Sound effects (optional: plant, harvest, level complete)
- [ ] Mobile-responsive UI
- [ ] Keyboard shortcuts (Ctrl+Enter to run)
- [ ] Dark mode support
- [ ] Documentation + README

#### Tasks

1. Commission/create sprite assets for robot, seeds, plants, water
2. Refine color palette, add lighting/shadows
3. Optimize Canvas rendering (use dirty rectangles or Pixi.js)
4. Test on mobile (touch-friendly controls)
5. Add keyboard shortcuts
6. Implement dark mode toggle
7. Write README with level guide
8. Create GitHub repo, deploy to Vercel/Netlify

#### Success Criteria

- No jank, 60fps on modern browsers
- Mobile playable (though not optimized UI)
- Visually cohesive and pleasant
- Documentation clear for self-learners

---

## 5. Development Priorities & Milestones

### Minimum Viable Product (MVP)

**Scope**: Levels 1.1-2.5, core mechanics, playable end-to-end  
**Effort**: 4-5 weeks full-time solo dev  
**Checkpoint**: By end of Phase 3

### Version 1.0 Full Release

**Scope**: All 25 levels, polish, accessibility  
**Effort**: 5 weeks + Phase 5 polish  
**Checkpoint**: By end of Phase 5

### Post-Launch Extensions (Optional)

- Level editor for custom puzzles
- Multiplayer (race levels, cooperative challenges)
- Integration with classroom platforms (progress tracking per student)
- Additional teaching tracks (data structures deep dive, algorithms)
- AI mentor (Claude API integration for hints)

---

## 6. Code Execution & Safety

### Skulpt Integration

Skulpt is a lightweight Python-to-JavaScript transpiler. Key setup:

```javascript
// Load Skulpt
<script src="https://www.skulpt.org/js/skulpt.min.js"></script>
<script src="https://www.skulpt.org/js/skulpt-stdlib.js"></script>

// In executor
async executeCode(code, robot, grid) {
  const builtins = {
    'move_forward': () => robot.moveForward(),
    'plant': () => robot.plant(grid.getCell(robot.x, robot.y)),
    'print': (msg) => this.captureOutput(msg),
    // ... etc
  };

  try {
    const result = await Sk.misceval.asyncToPromise(() =>
      Sk.importMainWithBody('<stdin>', false, code, true)
    );
  } catch (e) {
    this.haltWithError(e);
  }
}
```

### Safety Constraints

1. **Timeout**: 10-second execution limit per level
2. **Memory**: No file I/O, network access, or eval
3. **Scope**: Only robot/grid functions available globally
4. **Validation**: Pre-flight syntax check before execution

---

## 7. Testing Strategy

### Unit Tests

- Robot movement + directional logic
- Grid cell state transitions
- Executor error handling
- Level completion detection

### Integration Tests

- Full level playthrough (UI -> code -> execution -> completion)
- Cross-level progress saving
- Edge cases (moving out of bounds, harvesting empty cell)

### Manual QA

- All 25 levels completable with reference solution
- Mobile responsiveness
- Error messages helpful and non-cryptic

---

## 8. Success Metrics

### Learning Outcomes

- Player completes at least 10 levels in first session
- Can write loops independently by level 2.3
- Can define custom functions by level 3.1

### Engagement

- Avg. session >15 minutes
- > 50% of players reach level 3.1
- Net promoter score >7/10 from playtesters

### Technical

- Page load <2 seconds
- Zero Skulpt crashes
- 99% code execution success rate (no hanging)

---

## 9. Known Challenges & Mitigations

| Challenge                                  | Mitigation                                                          |
| ------------------------------------------ | ------------------------------------------------------------------- |
| Skulpt may not support all Python 3 syntax | Test early, provide clear error messages, constrain language subset |
| Animation performance on low-end devices   | Use requestAnimationFrame efficiently, provide quality toggle       |
| Debugging player code is hard              | Show execution step-by-step, highlight executed lines in editor     |
| Python has multiple ways to solve problems | Encourage multiple solutions, don't enforce specific patterns       |
| Beginners get frustrated with syntax       | Lint before running, provide autoformat, generous error messages    |

---

## 10. Future Directions

### Content Expansion

- Create "Chef" variant (inventory management, recipes, data structure focus)
- Create "Factory" variant (functional programming, pipelines)
- Create "Maze" variant (pathfinding, algorithms)

### Platform Integration

- Export progress as JSON for classroom tracking
- Embed in LMS (Canvas, Blackboard)
- Create Discord bot for homework submission

### Advanced Features

- Record/replay executions for debugging
- Diff against reference solution
- AI-powered hint system (Claude API)
- Procedural level generation

---

## Appendix A: Level Specifications (Tier 1)

### Level 1.1: Move Forward

**Objective**: Move the robot 3 spaces forward and stop.  
**Grid**: 8x8, robot at (0, 0) facing North, no obstacles  
**Success Condition**: Robot at (0, 3)  
**Starter Code**:

```python
# Move forward 3 times
move_forward()
move_forward()
move_forward()
```

### Level 1.2: Plant Seed

**Objective**: Move to position (1, 1) and plant a seed.  
**Grid**: 8x8, robot at (0, 0), no obstacles  
**Success Condition**: Seed at (1, 1)  
**Starter Code**:

```python
move_right()
move_forward()
plant()
```

### Level 1.3: Line of Seeds

**Objective**: Plant 3 seeds in a horizontal line.  
**Grid**: 8x8, robot at (0, 0)  
**Success Condition**: Seeds at (0, 0), (1, 0), (2, 0)  
**Hint**: You can repeat actions without a loop.

### Level 1.4: Simple Maze

**Objective**: Navigate a 2x2 maze and reach the goal at (3, 3).  
**Grid**: 8x8 with walls at (1, 1), (2, 2)  
**Success Condition**: Robot at (3, 3)  
**Constraints**: No loops allowed

### Level 1.5: Gather Water

**Objective**: Move to well at (4, 4), interact with it, return to start.  
**Grid**: 8x8 with water cell at (4, 4)  
**Success Condition**: Robot at (0, 0) with water in inventory  
**New Function**: `check_cell()` returns cell type

---
