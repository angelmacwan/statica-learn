# SQL Practice Platform -- Build Spec

Project Name: Statica Learn

UI: IBM carbon UI


https://github.com/carbon-design-system/carbon/tree/main/packages/react

npm install -S @carbon/react

## Overview

A fully client-side SQL practice app that runs in the browser. No server, no backend, no auth. Users solve SQL challenges by querying an in-browser SQLite database. Their query output is compared to a precomputed answer; if they match, they advance. Challenges are self-contained bundles: schema + seed data + question + expected answer.

---

## Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| SQL engine | `sql.js` (SQLite via WASM) | Runs fully in browser, no server needed |
| Framework | React (Vite) | Fast dev setup, component model fits the UI |
| State | `useState` / `useReducer` | Simple enough, no Redux needed |
| Code editor | `CodeMirror 6` | SQL syntax highlighting, lightweight |
| Styling | IBM Carbon UI | Your call; keep it minimal |
| Storage | `localStorage` | Persist progress across sessions |
| Challenge data | Static JSON file | Easy to add new challenges; no DB needed for metadata |

---

## Core Concept: The Challenge Bundle

Every challenge is a self-contained JS/JSON object:

```json
{
  "id": "orders-001",
  "title": "Top Spending Customers",
  "difficulty": "easy",
  "dataset": "ecommerce",
  "prompt": "Find the top 3 customers by total amount spent. Return customer_name and total_spent, ordered from highest to lowest.",
  "hint": "Use GROUP BY and ORDER BY together. SUM() will aggregate the amounts.",
  "schema_sql": "CREATE TABLE customers (...); CREATE TABLE orders (...);",
  "seed_sql": "INSERT INTO customers VALUES ...; INSERT INTO orders VALUES ...;",
  "answer_sql": "SELECT c.name AS customer_name, SUM(o.amount) AS total_spent FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.id ORDER BY total_spent DESC LIMIT 3;"
}
```

The app runs both `answer_sql` and the user's query against the same DB, then compares the result sets.

---

## Result Comparison Logic

Naive string comparison on SQL won't work. Compare the actual result tables:

1. Run `answer_sql` on load (store the expected rows + columns)
2. Run user's query on submit
3. Normalize both result sets:
   - Sort rows by all columns (to handle unordered results where order doesn't matter)
   - Trim whitespace from string values
   - Case-insensitive column name matching
4. Deep-equal comparison
5. If challenge requires specific ordering (e.g. "top 3 ordered by..."), set `ordered: true` in the challenge -- skip the sort step for that challenge

Edge cases to handle:
- User query throws a SQL error -- show the error message, don't crash
- Empty result set -- handle gracefully, show "your query returned 0 rows"
- Result set too large -- cap display at 500 rows

---

## UI Layout

```
+--------------------------------------------------+
|  [Logo / App Name]          [Challenge 3 of 12]  |
+--------------------------------------------------+
|  CHALLENGE PANEL            |  RESULTS PANEL      |
|                             |                     |
|  [Dataset: E-commerce]      |  Your Output:       |
|  [Difficulty: Medium]       |  +--+--------+--+  |
|                             |  |  |        |  |  |
|  Prompt text here...        |  +--+--------+--+  |
|                             |                     |
|  [Show Hint]                |  Expected Output:   |
|                             |  +--+--------+--+  |
|  SQL Editor:                |  |  |        |  |  |
|  +------------------------+ |  +--+--------+--+  |
|  |  SELECT ...            | |                     |
|  |                        | |  [✓ Match! / ✗ No] |
|  +------------------------+ |                     |
|  [Run]    [Reset]           |  [Next Challenge]   |
+-----------------------------+---------------------+
|  Schema Reference (collapsible)                   |
|  TABLE customers (id, name, email, city)          |
|  TABLE orders (id, customer_id, amount, date)     |
+--------------------------------------------------+
```

Key UX decisions:
- Schema reference always accessible (collapsed by default)
- Show both the user's output AND expected output side by side so users can see exactly where they went wrong
- "Next Challenge" button only appears on correct answer
- Hint is hidden by default, revealed on click (one click -- no confirmation)
- Progress bar or step indicator at the top

---

## App State Shape

```js
{
  challenges: [...],          // loaded from challenges.json
  currentIndex: 0,            // which challenge is active
  completed: [0, 2, 3],      // indices of solved challenges
  userQuery: "",              // current editor content
  queryResult: null,          // { columns, rows } or { error }
  expectedResult: null,       // { columns, rows }
  isCorrect: null,            // true | false | null (not yet run)
  hintVisible: false,
  schemaVisible: false,
}
```

Persist `completed` and `currentIndex` in `localStorage` so progress survives a page refresh.

---

## Challenge List

### Dataset 1: E-commerce

**Schema:**
```sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT,
  email TEXT,
  city TEXT,
  joined_date TEXT  -- ISO date string e.g. '2023-04-15'
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT,
  category TEXT,
  price REAL
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date TEXT,
  status TEXT  -- 'completed', 'pending', 'cancelled'
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  unit_price REAL
);
```

**Seed data ideas:** 15 customers across 5 cities, 20 products in 4 categories (Electronics, Clothing, Books, Home), 40 orders, 80 order items.

**Challenges:**

| ID | Title | Difficulty | Concept |
|---|---|---|---|
| ec-001 | List all customers from Mumbai | Easy | Basic SELECT + WHERE |
| ec-002 | Count orders per status | Easy | GROUP BY + COUNT |
| ec-003 | Top 3 customers by spend | Medium | JOIN + GROUP BY + ORDER BY + LIMIT |
| ec-004 | Most popular product category | Medium | JOIN + GROUP BY + SUM |
| ec-005 | Customers who never placed an order | Medium | LEFT JOIN + IS NULL |
| ec-006 | Average order value per city | Medium | Multi-join + GROUP BY |
| ec-007 | Month with highest revenue in 2023 | Hard | strftime + GROUP BY + ORDER BY |
| ec-008 | Products bought together most often | Hard | Self-join on order_items |

---

### Dataset 2: Company HR

**Schema:**
```sql
CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT,
  budget REAL
);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT,
  department_id INTEGER,
  manager_id INTEGER,  -- references employees.id (self-join)
  salary REAL,
  hire_date TEXT,
  level TEXT  -- 'junior', 'mid', 'senior', 'lead'
);
```

**Challenges:**

| ID | Title | Difficulty | Concept |
|---|---|---|---|
| hr-001 | List all senior employees | Easy | WHERE |
| hr-002 | Average salary per department | Easy | JOIN + GROUP BY + AVG |
| hr-003 | Employees earning above department average | Hard | Subquery or window function |
| hr-004 | Find each employee's manager name | Medium | Self-join |
| hr-005 | Departments over budget (salary sum vs budget) | Hard | GROUP BY + HAVING + JOIN |
| hr-006 | Longest-serving employee per department | Hard | Subquery + MIN(hire_date) |

---

### Dataset 3: Movies

**Schema:**
```sql
CREATE TABLE movies (
  id INTEGER PRIMARY KEY,
  title TEXT,
  release_year INTEGER,
  genre TEXT,
  rating REAL,   -- 1.0 to 10.0
  runtime_mins INTEGER
);

CREATE TABLE actors (
  id INTEGER PRIMARY KEY,
  name TEXT,
  birth_year INTEGER
);

CREATE TABLE cast_members (
  movie_id INTEGER,
  actor_id INTEGER,
  role TEXT
);

CREATE TABLE reviews (
  id INTEGER PRIMARY KEY,
  movie_id INTEGER,
  reviewer_name TEXT,
  score INTEGER,   -- 1 to 5
  review_date TEXT
);
```

**Challenges:**

| ID | Title | Difficulty | Concept |
|---|---|---|---|
| mv-001 | All movies released after 2010 with rating above 8 | Easy | WHERE + AND |
| mv-002 | Average rating per genre | Easy | GROUP BY + AVG |
| mv-003 | Top 5 highest-rated movies | Easy | ORDER BY + LIMIT |
| mv-004 | Actors who appeared in more than 3 movies | Medium | JOIN + GROUP BY + HAVING |
| mv-005 | Genre with most reviews | Medium | JOIN + GROUP BY + COUNT |
| mv-006 | Movies with no reviews | Medium | LEFT JOIN + IS NULL |
| mv-007 | Reviewer who gave the most 5-star reviews | Medium | WHERE + GROUP BY + COUNT |
| mv-008 | Average score by reviewer (only those with 5+ reviews) | Hard | GROUP BY + HAVING + AVG |

---

## Admin / Challenge Authoring

Since there's no backend, challenge authoring is done by editing `challenges.json` directly. Consider adding a simple "Dev Mode" toggle (e.g. `?dev=true` in the URL) that shows:

- The answer SQL for the current challenge
- A raw view of the expected result set
- A "Test all challenges" button that runs every answer SQL and confirms it executes without error

This makes it easy to verify new challenges before shipping.

---

## Implementation Build Order

1. **Bootstrap:** Vite + React project, install `sql.js`, configure WASM loading
2. **DB engine module:** `useDatabase` hook -- load sql.js, create in-memory DB, run schema + seed, expose `runQuery(sql)`
3. **Challenge loader:** Import `challenges.json`, initialize DB for current challenge on mount/challenge change
4. **Query runner:** Run user SQL, catch errors, display result table
5. **Answer checker:** Run answer SQL on load, store expected result, compare on user submit
6. **UI shell:** Two-panel layout, editor, result tables, prompt panel
7. **Progress system:** Track completed challenges in localStorage, show progress indicator
8. **Schema viewer:** Parse CREATE TABLE statements from the challenge, render a readable schema panel
9. **Polish:** Hints, error messages, keyboard shortcut to run (Ctrl+Enter), responsive layout
10. **Dev mode:** Hidden panel for challenge authoring and verification

---

## sql.js Setup Notes

sql.js requires its WASM binary to be served as a static asset. With Vite:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['sql.js']
  }
})
```

Copy `sql-wasm.wasm` to `/public/` and initialize like:

```js
import initSqlJs from 'sql.js'

const SQL = await initSqlJs({
  locateFile: file => `/${file}`
})

const db = new SQL.Database()
db.run(challenge.schema_sql)
db.run(challenge.seed_sql)
```

Each challenge gets a fresh `new SQL.Database()` so state never bleeds between challenges.

---

## Result Table Normalization (pseudocode)

```js
function normalize(result) {
  // result = { columns: [...], values: [[...], [...]] }
  return result.values
    .map(row =>
      Object.fromEntries(result.columns.map((col, i) => [col.toLowerCase(), String(row[i]).trim()]))
    )
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
}

function checkAnswer(userResult, expectedResult, ordered = false) {
  if (ordered) {
    return JSON.stringify(userResult.values) === JSON.stringify(expectedResult.values)
  }
  return JSON.stringify(normalize(userResult)) === JSON.stringify(normalize(expectedResult))
}
```

---

## Potential Extensions (post-MVP)

- **Challenge editor UI:** A form to write schema, seed, prompt, and answer SQL, with a preview and a "save to JSON" export button
- **Timed mode:** Optional countdown per challenge
- **Streak / scoring:** Points for solving without hints, bonus for first try
- **Multiple correct answers:** Some challenges accept any query that produces the correct result set -- this is already handled by result-set comparison rather than SQL string comparison
- **Difficulty filter:** Let users jump to Easy / Medium / Hard challenges
- **Dark mode**
- **Export progress:** Download a JSON of completed challenges + timestamps