# Code Runner

## Game Design Document & Implementation Plan

Version: 1.0

---

# Vision

Code Runner is a browser-based educational puzzle game that teaches Python programming through gameplay.

Players do not directly control the character.

Instead, they write Python code that controls a character navigating levels, collecting coins, avoiding obstacles, and reaching the goal.

The game starts with simple sequential commands and gradually introduces real programming concepts such as:

- Functions
- Loops
- Conditionals
- Variables
- Lists
- Objects
- Algorithms

The goal is to make learning programming feel like solving puzzles rather than completing tutorials.

---

# Design Principles

## 1. Code Is The Game

The player never uses keyboard controls.

Everything happens through code.

Example:

```python
move_right()
move_right()
jump()
```

The character executes the script.

---

## 2. Immediate Feedback

Players should see the result of their code within seconds.

Write code → Press Run → Watch execution.

---

## 3. One New Concept Per World

Each world introduces exactly one new programming concept.

Avoid overwhelming players.

---

## 4. Puzzle First

This is not an RPG.

This is not a platformer.

This is a programming puzzle game.

---

# Core Gameplay Loop

1. Load level
2. Examine map
3. Write code
4. Press Run
5. Watch execution
6. Success or failure
7. Improve code
8. Complete level

---

# MVP Features

## Character

Simple square character.

No animations required.

---

## World

Tile-based grid.

Each tile can be:

- Empty
- Ground
- Coin
- Enemy
- Goal
- Wall

Example:

```
S . . C . G
```

S = Start
C = Coin
G = Goal

---

## Code Editor

Use Monaco Editor.

Features:

- Syntax highlighting
- Read-only starter code
- Run button
- Reset button

---

## Execution Engine

Player writes Python-like code.

Example:

```python
move_right()
move_right()
collect()
```

Execution engine translates commands into game actions.

---

# World Progression

---

## World 1: Movement

Concept:
Sequential execution

Commands:

```python
move_right()
move_left()
```

Goal:
Reach flag.

---

## World 2: Actions

Concept:
Functions with parameters

Commands:

```python
jump()
collect()
```

Goal:
Collect coins.

---

## World 3: Loops

Concept:
for loops

Example:

```python
for i in range(5):
    move_right()
```

Player learns repetition.

---

## World 4: Conditions

Concept:
if statements

New APIs:

```python
enemy_ahead()
coin_ahead()
```

Example:

```python
if enemy_ahead():
    jump()
```

---

## World 5: While Loops

Concept:
Unknown length tasks

API:

```python
at_goal()
```

Example:

```python
while not at_goal():
    move_right()
```

---

## World 6: Functions

Concept:
Reusable logic

Example:

```python
def hop():
    jump()
    move_right()

hop()
```

---

## World 7: Variables

Concept:
State management

Example:

```python
coins = 0
```

---

## World 8: Lists

Concept:
Collections

Example:

```python
for coin in visible_coins():
    collect(coin)
```

---

## World 9: Objects

Concept:
Object-oriented programming

Example:

```python
player.position
player.coins
```

---

# Initial Command Set

## Movement

```python
move_right()
move_left()
move_up()
move_down()
```

---

## Actions

```python
jump()
collect()
```

---

## Information

```python
enemy_ahead()
wall_ahead()
coin_ahead()
at_goal()
```

Returns:

```python
True
False
```

---

# Failure States

Player:

- Hits enemy
- Falls into pit
- Runs out of steps
- Infinite loop detected

Display clear error message.

Example:

```
Execution stopped.
Enemy collision at step 14.
```

---

# Technical Architecture

## Stack

Frontend:

- React
- Vite
- TypeScript

Game Rendering:

- Phaser.js

Editor:

- Monaco Editor

Storage:

- LocalStorage

Deployment:

- Cloudflare Pages

No backend required.

---

# Project Structure

```text
src/

components/
  CodeEditor.tsx
  GameCanvas.tsx
  Toolbar.tsx

game/
  engine/
  interpreter/
  levels/

levels/
  world1/
  world2/
  world3/

hooks/

utils/

App.tsx
```

---

# Execution Engine Design

The game should not execute arbitrary Python.

Instead:

1. Parse code
2. Validate syntax
3. Convert to action list
4. Execute actions

Example:

Input:

```python
for i in range(3):
    move_right()
```

Generated actions:

```json
["move_right", "move_right", "move_right"]
```

Game then animates actions.

---

# Recommended Approach

Use Skulpt.

Skulpt executes Python inside the browser.

Benefits:

- Real Python syntax
- No server
- No sandbox concerns
- Easy integration

Alternative:

- Pyodide

But Skulpt is lighter.

---

# Level Format

```json
{
	"id": 1,
	"width": 10,
	"height": 5,
	"start": [0, 0],
	"goal": [9, 0],
	"coins": [[3, 0]],
	"enemies": [[5, 0]]
}
```

---

# Save System

Store in LocalStorage:

```json
{
	"completedLevels": [1, 2, 3],
	"stars": {
		"1": 3,
		"2": 2
	}
}
```

---

# Stretch Goals

## Level Editor

Players create custom levels.

---

## Community Levels

Export/import JSON.

Still no backend required.

---

## Challenges

Complete level using:

- Maximum 5 lines
- Only 1 loop
- No functions

---

## Replay Sharing

Export code as text.

Friends can try solutions.

---

# Development Roadmap

## Phase 1

Goal: Playable MVP

- React app
- Phaser canvas
- Grid system
- Character movement
- Run button

Expected:
1 week

---

## Phase 2

Python execution

- Integrate Skulpt
- Map commands to actions
- Replay system

Expected:
1 week

---

## Phase 3

World 1 and World 2

- 20 levels
- Save system
- Progression

Expected:
1 week

---

## Phase 4

Loops and Conditions

- for loops
- if statements
- Sensors

Expected:
1 week

---

## Phase 5

Polish

- Better UI
- Animations
- Sound
- Mobile support

Expected:
1 week

---

# Success Criteria

A player with zero programming knowledge can:

1. Complete World 1
2. Understand sequential execution
3. Learn loops naturally
4. Learn conditionals naturally
5. Write simple Python without feeling like they are studying

The game should feel like solving puzzles, not taking a course.
