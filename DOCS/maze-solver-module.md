# Maze Solver

## Technical Design Document & Implementation Plan

Version: 1.0

---

# 1. Project Overview

Maze Solver is a browser-based programming game where users write Python code to control a robot navigating randomly generated mazes.

The player does not directly control the robot. Instead, they write Python algorithms that interact with a limited API exposed by the game engine.

The game progressively teaches:

- Variables
- Loops
- Conditions
- Functions
- Lists
- Dictionaries
- Sets
- Graph traversal
- DFS
- BFS
- Pathfinding
- State management

The project is entirely client-side and runs inside the browser.

---

# 2. Technology Stack

## Frontend

- React 19
- Vite
- TypeScript

## UI Framework

IBM Carbon Design System

Packages:

```bash
npm install @carbon/react
npm install @carbon/icons-react
npm install @carbon/styles
```

References:

- Grid System
- Theme Support
- Responsive Layouts
- Data Tables
- Side Panels
- Modals
- Tabs
- Notifications

---

## Python Execution

Pyodide

```bash
npm install pyodide
```

Purpose:

- Execute user Python code safely
- No backend required
- Sandboxed execution

---

## State Management

Recommended:

- Zustand

```bash
npm install zustand
```

Stores:

- Current level
- User code
- Best scores
- Game settings
- Execution state

---

## Persistence

Browser only

Primary:

```text
IndexedDB
```

Secondary:

```text
localStorage
```

Store:

- User code
- Completed levels
- Best scores
- Settings

---

# 3. Carbon Design System Layout

---

## Main Layout

```text
+--------------------------------------------------+
| Header                                           |
+--------------------------------------------------+
| Sidebar      | Maze View        | Code Editor    |
|              |                  |                |
| Levels       |                  |                |
| Progress     |                  |                |
| Statistics   |                  |                |
+--------------------------------------------------+
| Console / Logs                                  |
+--------------------------------------------------+
```

---

## Carbon Components

### Header

Use:

- Header
- HeaderName
- HeaderNavigation

Contains:

- Logo
- Current Level
- Theme Toggle

---

### Sidebar

Use:

- SideNav
- Accordion
- ProgressIndicator

Contains:

- Levels
- Achievements
- Statistics

---

### Maze Area

Use:

- Tile
- Grid

Contains:

- Maze Renderer
- Fog of War Layer
- Robot Renderer

---

### Code Editor

Use:

- Monaco Editor

Wrapped inside:

- Carbon Content Container

Buttons:

- Run
- Stop
- Reset
- Save

---

### Console

Use:

- DataTable
- InlineNotification

Displays:

- Logs
- Errors
- Runtime Exceptions

---

# 4. Core Gameplay

---

## Goal

Navigate the robot to the goal cell.

---

## Start Position

```text
(0,0)
```

Top-left corner.

---

## Goal Position

Randomized.

Never revealed to the player.

Robot must discover it.

---

## Robot Orientation

Possible directions:

```text
North
East
South
West
```

---

# 5. Robot API

These are the only functions exposed to user Python code.

---

## Movement

```python
move_forward()
```

Moves one tile forward.

---

```python
turn_left()
```

Rotate counter-clockwise.

---

```python
turn_right()
```

Rotate clockwise.

---

## Sensors

```python
wall_front()
```

Returns:

```python
True | False
```

---

```python
wall_left()
```

Returns:

```python
True | False
```

---

```python
wall_right()
```

Returns:

```python
True | False
```

---

## Position

```python
position()
```

Returns:

```python
(x, y)
```

---

## Orientation

```python
direction()
```

Returns:

```python
"NORTH"
"EAST"
"SOUTH"
"WEST"
```

---

## Goal Detection

```python
at_goal()
```

Returns:

```python
True | False
```

---

# 6. Fog of War System

Player only sees:

- Current robot position
- Previously visited cells
- Sensor discoveries

Everything else remains hidden.

---

## Known Cell States

```typescript
enum CellState {
	UNKNOWN,
	DISCOVERED,
	VISITED,
}
```

---

# 7. Maze Generation

Algorithm:

Recursive Backtracking

Benefits:

- Fast
- Guaranteed solvable
- Easy implementation

---

## Sizes

### Beginner

```text
3x3
5x5
8x8
```

---

### Intermediate

```text
12x12
16x16
20x20
```

---

### Advanced

```text
24x24
32x32
48x48
```

---

# 8. Game Engine Architecture

```text
User Python
      ↓
Pyodide
      ↓
Sandbox API
      ↓
Command Queue
      ↓
Game Engine
      ↓
Maze State
      ↓
Renderer
```

---

# 9. Action Queue System

Python execution should not directly manipulate the UI.

Instead:

```python
move_forward()
```

Produces:

```typescript
[
	{
		type: 'MOVE_FORWARD',
	},
];
```

Queue executes at fixed intervals.

Example:

```typescript
100ms/action
```

Benefits:

- Smooth animations
- Replay support
- Deterministic behavior

---

# 10. Scoring System

Avoid wall-clock timing.

Use action cost.

---

## Costs

```text
Move = 1 point
Turn = 0.25 points
```

---

## Final Score

```text
Average of 5 randomized runs
```

Lower score wins.

---

## Example

```text
Run 1 = 123
Run 2 = 115
Run 3 = 131
Run 4 = 120
Run 5 = 117

Average = 121.2
```

---

# 11. Replay System

Every run records:

```typescript
Action[]
```

Example:

```typescript
[MOVE_FORWARD, MOVE_FORWARD, TURN_RIGHT, MOVE_FORWARD];
```

Player can:

- Replay
- Pause
- Fast Forward

---

# 12. Progression System

---

## Level 1

Visible Maze

Teach:

```python
move_forward()
turn_left()
turn_right()
```

---

## Level 2

Conditions

Teach:

```python
if
```

---

## Level 3

Loops

Teach:

```python
while
for
```

---

## Level 4

Fog of War

Teach:

```python
memory
variables
```

---

## Level 5

Functions

Teach:

```python
def
```

---

## Level 6

Data Structures

Teach:

```python
set
dict
list
```

---

## Level 7

Graph Exploration

Teach:

```python
DFS
```

---

## Level 8

Optimal Paths

Teach:

```python
BFS
```

---

# 13. Storage Schema

```typescript
{
  currentLevel: number,

  codeByLevel: {
    [levelId]: string
  },

  bestScores: {
    [levelId]: number
  },

  completedLevels: string[]
}
```

Stored in:

```text
IndexedDB
```

---

# 14. Development Roadmap

## Phase 1

Core Engine

Deliverables:

- Maze generation
- Renderer
- Robot movement
- Fog of war

---

## Phase 2

Python Runtime

Deliverables:

- Pyodide integration
- Sandbox APIs
- Command queue

---

## Phase 3

Carbon UI

Deliverables:

- Layout
- Sidebar
- Progress tracking
- Settings

---

## Phase 4

Scoring

Deliverables:

- Multi-run evaluation
- Best score tracking
- Replay support

---

## Phase 5

Learning Platform

Deliverables:

- Tutorials
- Hints
- Achievements
- Challenges

---

# 15. Future Features

## Leaderboards

Cloudflare Workers + D1

Store:

- Username
- Level
- Score

---

## Daily Challenge

New maze seed every day.

---

## AI Analysis

Explain user algorithm.

Example:

```text
Your solution uses a wall-following strategy.

Complexity:
O(N)

Potential improvement:
Use BFS after mapping the maze.
```

---

## Competitive Mode

Users submit bots.

Bots compete on:

- Unknown mazes
- Random seeds
- Efficiency score

---

# Success Criteria

A beginner should be able to start with:

```python
move_forward()
```

and naturally progress toward:

```python
DFS
BFS
Graph Traversal
Path Optimization
State Management
```

without feeling like they are studying algorithms.
