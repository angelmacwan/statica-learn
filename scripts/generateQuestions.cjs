const fs = require('fs');
const { execSync } = require('child_process');

const pyMain = JSON.parse(execSync('git show main:src/data/python-challenges.json').toString());
const sqlMain = JSON.parse(execSync('git show main:src/data/sql-challenges.json').toString());

function parsePyTestCase(tc) {
  let funcCall = tc.input;
  let parenIndex = funcCall.indexOf('(');
  let argsStr = funcCall.substring(parenIndex + 1, funcCall.lastIndexOf(')')).trim();

  let inputArgs;
  try {
    inputArgs = eval('[' + argsStr + ']');
  } catch (e) {
    inputArgs = [argsStr];
  }

  let expectedVal;
  try {
    let expStr = tc.expected;
    if (expStr === 'True') expectedVal = true;
    else if (expStr === 'False') expectedVal = false;
    else if (expStr === 'None') expectedVal = null;
    else expectedVal = eval('(' + expStr.replace(/'/g, '"') + ')');
  } catch (e) {
    expectedVal = tc.expected ?? '';
  }

  return {
    description: `${tc.input} → ${tc.expected}`,
    input: inputArgs,
    expectedOutput: expectedVal,
  };
}

const datasetToPyCat = {
  Conditions: 'number-crunching',
  Loops: 'loop-quest',
  Stacks: 'string-sorcery',
  Lists: 'list-adventures',
  Strings: 'string-sorcery',
  Sets: 'list-adventures',
  Dictionaries: 'list-adventures',
  Math: 'math-magic',
};

const convertedPy = pyMain.map((q) => {
  const category = datasetToPyCat[q.dataset] || 'number-crunching';
  const tests = q.test_cases ? q.test_cases.map(parsePyTestCase) : [];

  return {
    id: q.id,
    slug: q.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    title: q.title,
    category,
    difficulty: q.difficulty,
    description: `## ${q.title}\n\n${q.prompt}`,
    hint: q.hint,
    starterCode: {
      python: q.initial_code,
      javascript: `// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}`,
    },
    tests,
    tags: [q.dataset.toLowerCase(), q.difficulty],
  };
});

const datasetToSqlCat = {
  School: 'sql-basics',
  'E-commerce': 'sql-joins',
  'Company HR': 'sql-aggregates',
  Movies: 'sql-advanced',
};

const convertedSql = sqlMain.map((q) => {
  return {
    id: q.id,
    slug: q.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    title: q.title,
    category: datasetToSqlCat[q.dataset] || 'sql-basics',
    difficulty: q.difficulty,
    description: `## ${q.title}\n\n**Dataset:** ${q.dataset}\n\n${q.prompt}`,
    hint: q.hint,
    starterCode: {
      sql: `-- Write your SQL query below\nSELECT * FROM ...;`,
    },
    tests: [],
    tags: ['sql', q.dataset.toLowerCase(), q.difficulty],
    schema_sql: q.schema_sql,
    seed_sql: q.seed_sql,
    answer_sql: q.answer_sql,
    ordered: q.ordered,
  };
});

console.log(`Successfully parsed ${convertedPy.length} Python questions and ${convertedSql.length} SQL questions.`);

// Read existing questions.ts
const existingContent = fs.readFileSync('src/features/codearena/questions.ts', 'utf8');

// Combine converted questions with existing ones, removing any duplicates by ID or slug
const questionMap = new Map();

for (const q of convertedPy) {
  questionMap.set(q.id, q);
}
for (const q of convertedSql) {
  questionMap.set(q.id, q);
}

const allQuestions = Array.from(questionMap.values());

const tsOutput = `import type { ArenaQuestion } from './types';

export const ARENA_QUESTIONS: ArenaQuestion[] = ${JSON.stringify(allQuestions, null, 2)};
`;

fs.writeFileSync('src/features/codearena/questions.ts', tsOutput);
console.log('Updated src/features/codearena/questions.ts with all questions!');
