# ready to work

[x] need an indicator that the user needs to login to access all modules and paths, and data is saved only for logged in users - Added amber lock banner in sidebar for guests (desktop + mobile) - Shows "Sign in to unlock" with explanation and sign-in link

[x] need a landing page at URL/home - Added `/home` route aliasing `HomePage` in App.tsx

[x] Dont show the users google avatar, instead add a emoji there, should be customizable - Replaced all photo usage with emoji in Layout, ProfilePage - Default: 🧑‍💻; customizable via Settings > Avatar Emoji picker (16 options) - Stored in Firestore `users/{uid}.avatarEmoji`

[x] Clone the main branch of this repo and bring over python and sql questions - Brought over all 42 Python questions and 30 SQL questions from main branch into CodeArena & Practice Hub - Implemented SQLite WebAssembly SQL code runner (sqlRunner.ts), ResultTable, and SchemaViewer components - Integrated SQL execution, schema inspection, and test verification in CodeArena & Lessons

[x] Add a SQL module, just like we have a python one - Added complete SQL learning path (`/paths/sql`) and 16 comprehensive SQL lessons (`/content/lessons/sql/`) ranging from intro & RDBMS fundamentals to queries, filtering, sorting, logical operators, pattern matching, aggregate functions, GROUP BY, HAVING, CASE expressions, INNER/LEFT joins, table creation, DML (INSERT/UPDATE/DELETE), PK/FK constraints, and ALTER/DROP schema modifications.
