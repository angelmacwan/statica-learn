# Statica Learn — Technical Implementation Spec

This document defines the technical architecture, stack, data model, and build
phases for the Statica Learn rebuild. It is scoped to backend/architecture
concerns only. UI/UX/design is covered in a separate document.

Repo: `angelmacwan/statica-learn`
Current live site: https://learning.staticalabs.com/
Target: rebuild in place, same repo, same hosting model (static).

---

## 1. Stack

- **Frontend**: React + TypeScript + Vite
- **Routing**: React Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend-as-a-service**: Supabase (Auth + Postgres + Storage)
- **Hosting**: Cloudflare Pages (static build, no server)
- **Code editor**: CodeMirror 6 (lighter than Monaco; switch to Monaco only
  if a specific feature requires it)
- **JS execution**: Web Worker (isolated from main thread)
- **Python execution**: Pyodide (WebAssembly Python) inside a Web Worker
- **Content storage**: Git (JSON/YAML files in-repo), not the database
- **Analytics**: lightweight event table in Supabase, or PostHog if preferred

No custom backend server for v1. Everything server-side is handled by
Supabase. A sandboxed execution service (for projects requiring real
backends) is explicitly out of scope until Phase 6+.

---

## 2. High-Level Architecture

```
Cloudflare Pages (static)
        |
   React + Vite app
        |
   ------------------
   |                |
Static content   Supabase
(Git, bundled)      |
              --------------------
              |        |         |
             Auth      DB     Storage
```

- The app is a static SPA. All lesson/path content ships as part of the
  build (JSON/YAML → bundled or fetched as static assets).
- Supabase is the only backend dependency: auth, user data, progress,
  activity events.
- No server-rendered pages, no API routes, no SSR.

---

## 3. Content Model (Git-based CMS)

Content lives in the repo under `content/`, authored as JSON or Markdown
with frontmatter. Content is NOT stored in Postgres. Postgres stores only
user-generated data (progress, attempts, activity).

```
content/
├── paths/
│   ├── python.json
│   ├── javascript.json
│   └── critical-thinking.json
├── lessons/
│   ├── python/
│   │   ├── 01-variables.json
│   │   ├── 02-conditions.json
│   │   └── ...
│   └── critical-thinking/
│       └── ...
└── projects/
    └── ...
```

### Path definition

```ts
interface Path {
	id: string;
	slug: string;
	title: string;
	description: string;
	category:
		| 'programming'
		| 'data'
		| 'ai'
		| 'software-engineering'
		| 'thinking';
	difficulty: 'intro' | 'easy' | 'medium' | 'hard';
	moduleIds: string[]; // ordered
	published: boolean;
}
```

### Lesson definition

```ts
interface Lesson {
	id: string;
	slug: string;
	title: string;
	description: string;
	pathId: string;
	moduleId: string;
	difficulty: 'intro' | 'easy' | 'medium' | 'hard';
	estimatedMinutes: number;
	concepts: string[]; // concept ids, for future skill tracking
	blocks: LessonBlock[];
}
```

### Lesson block types (v1 scope)

Implement only these four block types for v1. Do not build the full set
listed in the original brainstorm (matching, ordering, fill-blank,
visualization, reflection) until Phase 6.

```ts
type LessonBlock = TextBlock | MultipleChoiceBlock | CodeBlock | ChallengeBlock;

interface TextBlock {
	type: 'text';
	content: string; // markdown
}

interface MultipleChoiceBlock {
	type: 'multipleChoice';
	question: string;
	options: string[];
	correctIndex: number;
	explanation?: string;
}

interface CodeBlock {
	type: 'code';
	language: 'python' | 'javascript';
	starterCode: string;
	solutionCode?: string;
}

interface ChallengeBlock {
	type: 'challenge';
	language: 'python' | 'javascript';
	prompt: string;
	starterCode: string;
	tests: CodeTest[];
}

interface CodeTest {
	input: unknown;
	expectedOutput: unknown;
	description?: string;
}
```

A lesson loader validates each content file against these types at build
time (e.g. with Zod) and fails the build on schema mismatch.

---

## 4. Database Schema (Supabase / Postgres)

v1 scope — four tables only. Do not implement `concepts`, `user_concepts`,
`achievements`, or `user_achievements` until Phase 6, when there is real
usage data to justify them.

```sql
-- users: managed by Supabase Auth (auth.users). Add a profile table for
-- app-specific fields.
create table profiles (
  id uuid primary key references auth.users(id),
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table user_progress (
  user_id uuid references profiles(id),
  lesson_id text not null,       -- matches Lesson.id from content files
  path_id text not null,
  status text check (status in ('not_started','started','completed')) default 'not_started',
  score numeric,
  attempts int default 0,
  started_at timestamptz,
  completed_at timestamptz,
  last_accessed_at timestamptz default now(),
  primary key (user_id, lesson_id)
);

create table activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  type text not null,   -- e.g. lesson_started, lesson_completed, question_answered, code_run
  metadata jsonb,
  created_at timestamptz default now()
);
```

Row-level security: enable RLS on `profiles`, `user_progress`, and
`activities`. Users may only read/write their own rows.

### Deferred schema (Phase 6+)

```sql
concepts (id, slug, name, description)
lesson_concepts (lesson_id, concept_id)
user_concepts (user_id, concept_id, mastery)
achievements (id, name, description, icon)
user_achievements (user_id, achievement_id, earned_at)
```

---

## 5. Authentication

- Supabase Auth.
- v1 providers: Email/password + Google.
- Support anonymous/guest usage: a user can go through lessons without an
  account. Progress is held in local component state / localStorage until
  they choose to sign up, at which point it's written to `user_progress`.
- No custom auth server, no JWT handling outside what Supabase provides.

---

## 6. Code Execution

### JavaScript

- Runs in a Web Worker, not the main thread.
- Worker receives code + test cases, returns `{ output, passed, error }`.
- No `eval` on the main thread under any circumstances.

### Python

- Pyodide loaded inside a Web Worker.
- Lazy-load Pyodide only when a Python code block is first rendered (it's
  several MB — do not include it in the main bundle).
- Same worker message contract as JS: `{ output, passed, error }`.

### Execution contract (shared)

```ts
interface ExecutionRequest {
	language: 'python' | 'javascript';
	code: string;
	tests?: CodeTest[];
}

interface ExecutionResult {
	stdout: string;
	error: string | null;
	testResults?: { passed: boolean; description?: string }[];
}
```

Both runners should implement this same interface so the UI layer doesn't
need to know which language is running.

Sandboxed/cloud execution (for full projects, not lesson exercises) is
explicitly deferred to Phase 6+.

---

## 7. Progress Tracking

- Every meaningful action fires an `activities` insert: `lesson_started`,
  `lesson_completed`, `question_answered`, `code_run`, `path_started`.
- `user_progress` is updated on lesson start/completion — this is the
  table the UI reads for "% complete" displays.
- No skill/mastery calculation in v1. That requires the `concepts` tables
  (Phase 6).

---

## 8. Routing

```
/                        home
/explore                 category browse
/paths/:pathSlug         path overview
/learn/:pathSlug/:lessonSlug   lesson runner
/practice                 standalone exercises
/projects                 project list
/projects/:slug           project detail
/profile
/settings
/login
/signup
```

Handled by React Router. No server-side routing needed since this is a
static SPA (configure Cloudflare Pages SPA fallback to `index.html`).

---

## 9. Repository Structure

```
src/
├── app/
│   ├── router.tsx
│   ├── providers.tsx
│   └── config.ts
├── components/
│   ├── ui/
│   ├── lesson/
│   ├── progress/
│   └── code/
├── features/
│   ├── auth/
│   ├── lessons/
│   ├── paths/
│   └── progress/
├── pages/
├── lib/
│   ├── supabase.ts
│   ├── analytics.ts
│   ├── contentLoader.ts
│   └── execution/
│       ├── jsRunner.worker.ts
│       └── pyRunner.worker.ts
├── content/
│   ├── paths/
│   ├── lessons/
│   └── projects/
└── types/
```

---

## 10. Build/Deploy Pipeline

```
git push
   ↓
GitHub Actions
   ↓
- validate content files against schema (fail build on invalid content)
- vite build
   ↓
Cloudflare Pages deploy
```

Content validation should run as a CI step, not just at runtime, so a bad
lesson JSON file fails the build rather than breaking the live site.

---

## 11. Build Phases (implementation order)

**Phase 1 — Foundation**
React + TS + Vite scaffold, Supabase project, auth (email + Google),
routing skeleton, `profiles` table, RLS policies.

**Phase 2 — Learning engine**
Content loader + schema validation for Path/Lesson, lesson block renderer
for the 4 v1 block types, `user_progress` read/write.

**Phase 3 — Content**
Author lessons for one path only (Python) end-to-end: ~15-20 lessons.

**Phase 4 — Browser code execution**
JS Web Worker runner, Pyodide Python worker runner, CodeMirror integration,
challenge/test evaluation UI.

**Phase 5 — Projects**
Project content type (instructions + starter code + hints), project pages,
no automated grading yet.

**Phase 6 — Expansion (post-validation only)**
Concept/skill tracking tables, achievements, search, additional paths,
AI tutor integration, sandboxed execution for real projects.

Do not start Phase 6 work until Phase 1-5 are shipped and at least one
path has real user completion data.

---

## 12. Explicit Non-Goals for v1

- No custom backend server
- No SSR/Next.js
- No skill/mastery graph
- No achievements system
- No search
- No AI tutor
- No sandboxed cloud code execution
- No admin CMS UI (content authored directly as files in Git)
