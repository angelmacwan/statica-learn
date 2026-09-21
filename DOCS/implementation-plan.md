# Statica Learn - Technical Implementation Spec

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
- **Backend-as-a-service**: Firebase (Auth + Firestore + Storage)
- **Hosting**: Cloudflare Pages (static build, no server) - Firebase
  Hosting is also a fine choice here; either works with a static Vite build
- **Code editor**: CodeMirror 6
- **JS execution**: Web Worker (isolated from main thread)
- **Python execution**: Pyodide (WebAssembly Python) inside a Web Worker
- **Content storage**: Git (JSON/YAML files in-repo), not the database
- **Analytics**: lightweight event table in firebase

No custom backend server for v1. Everything server-side is handled by
Firebase. A sandboxed execution service (for projects requiring real
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
Static content   Firebase
(Git, bundled)      |
              --------------------
              |        |         |
             Auth   Firestore  Storage
```

- The app is a static SPA. All lesson/path content ships as part of the
  build (JSON/YAML → bundled or fetched as static assets).
- Firebase is the only backend dependency: auth, user data, progress,
  activity events.
- No server-rendered pages, no API routes, no SSR.

---

## 3. Content Model (Git-based CMS)

Content lives in the repo under `content/`, authored as JSON or Markdown
with frontmatter. Content is NOT stored in Firestore. Firestore stores only
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

## 4. Database Schema (Firestore)

v1 scope - three top-level collections. Do not implement `concepts`,
`userConcepts`, `achievements`, or `userAchievements` until Phase 6, when
there is real usage data to justify them.

Firestore is document-based, not relational - model this as one profile
document per user, with progress as a subcollection under it (so security
rules can scope access with a single `request.auth.uid == userId` check
and you never need a cross-collection join).

```
users/{userId}
  displayName: string
  avatarUrl: string
  createdAt: timestamp

users/{userId}/progress/{lessonId}
  pathId: string
  status: "not_started" | "started" | "completed"
  score: number | null
  attempts: number
  startedAt: timestamp | null
  completedAt: timestamp | null
  lastAccessedAt: timestamp

users/{userId}/activities/{activityId}
  type: string    // lesson_started, lesson_completed, question_answered, code_run
  metadata: map
  createdAt: timestamp
```

### Security rules (v1)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /progress/{lessonId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /activities/{activityId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Indexes

Add a composite index on `progress` (`pathId` + `status`) once you need
"% complete per path" queries across many lessons - not required for v1
if you just read the whole subcollection client-side.

### Deferred schema (Phase 6+)

```
concepts/{conceptId}
  slug, name, description

users/{userId}/conceptMastery/{conceptId}
  mastery: number

achievements/{achievementId}
  name, description, icon

users/{userId}/achievements/{achievementId}
  earnedAt: timestamp
```

---

## 5. Authentication

- Firebase Auth.
- v1 providers: Email/password + Google.
- Support anonymous/guest usage: Firebase Auth's anonymous sign-in works
  well here - start the user as an anonymous auth user on first visit, so
  progress can be written to Firestore right away, then link the anonymous
  account to Google/email if they choose to sign up (`linkWithCredential`)
  rather than migrating data after the fact.
- No custom auth server, no JWT handling outside what Firebase provides.

---

## 6. Code Execution

### JavaScript

- Runs in a Web Worker, not the main thread.
- Worker receives code + test cases, returns `{ output, passed, error }`.
- No `eval` on the main thread under any circumstances.

### Python

- Pyodide loaded inside a Web Worker.
- Lazy-load Pyodide only when a Python code block is first rendered (it's
  several MB - do not include it in the main bundle).
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

- Every meaningful action writes a document to the `activities`
  subcollection: `lesson_started`, `lesson_completed`, `question_answered`,
  `code_run`, `path_started`.
- The `progress` subcollection is updated on lesson start/completion  - 
  this is what the UI reads for "% complete" displays.
- No skill/mastery calculation in v1. That requires the `conceptMastery`
  subcollection (Phase 6).

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
│   ├── firebase.ts
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

**Phase 1 - Foundation**
React + TS + Vite scaffold, Firebase project, auth (email + Google +
anonymous), routing skeleton, `users` collection, security rules.

**Phase 2 - Learning engine**
Content loader + schema validation for Path/Lesson, lesson block renderer
for the 4 v1 block types, `progress` subcollection read/write.

**Phase 3 - Content**
Author lessons for one path only (Python) end-to-end: ~15-20 lessons.

**Phase 4 - Browser code execution**
JS Web Worker runner, Pyodide Python worker runner, CodeMirror integration,
challenge/test evaluation UI.

**Phase 5 - Projects**
Project content type (instructions + starter code + hints), project pages,
no automated grading yet.

**Phase 6 - Expansion (post-validation only)**
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
