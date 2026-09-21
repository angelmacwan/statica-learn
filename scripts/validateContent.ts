/**
 * Content validation script - run with: npm run validate-content
 * Fails with non-zero exit code if any content file fails schema validation.
 */
import { readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { PathSchema, LessonSchema } from '../src/types/index.js';

const root = resolve(process.cwd(), 'src/content');
let errors = 0;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateDir(dir: string, schema: any) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      validateDir(fullPath, schema);
    } else if (entry.name.endsWith('.json')) {
      const raw = JSON.parse(readFileSync(fullPath, 'utf8'));
      const result = schema.safeParse(raw);
      if (!result.success) {
        console.error(`[FAIL] ${fullPath}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result.error.issues.forEach((issue: any) =>
          console.error(`   ${issue.path.join('.')}: ${issue.message}`)
        );
        errors++;
      } else {
        console.log(`[PASS] ${fullPath}`);
      }
    }
  }
}

validateDir(join(root, 'paths'), PathSchema);
validateDir(join(root, 'lessons'), LessonSchema);

if (errors > 0) {
  console.error(`\n${errors} validation error(s). Fix them before building.`);
  process.exit(1);
} else {
  console.log('\nAll content files valid.');
}
