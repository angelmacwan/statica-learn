import { PathSchema, LessonSchema } from '@/types';
import type { Path, Lesson } from '@/types';

// ─── Lazy-loaded content modules ─────────────────────────────────────────────
// Vite's import.meta.glob loads files lazily as dynamic imports.

const pathModules = import.meta.glob('/src/content/paths/*.json') as Record<
  string,
  () => Promise<{ default: unknown }>
>;
const lessonModules = import.meta.glob('/src/content/lessons/**/*.json') as Record<
  string,
  () => Promise<{ default: unknown }>
>;

function slugFromPath(filePath: string): string {
  return filePath.split('/').pop()!.replace('.json', '').replace(/^\d+-/, '');
}

export async function loadAllPaths(): Promise<Path[]> {
  const paths: Path[] = [];
  for (const load of Object.values(pathModules)) {
    const mod = await load();
    const parsed = PathSchema.safeParse(mod.default);
    if (parsed.success && parsed.data.published) {
      paths.push(parsed.data);
    }
  }
  return paths;
}

export async function loadPath(slug: string): Promise<Path | null> {
  const key = Object.keys(pathModules).find((k) => k.includes(`/${slug}.json`));
  if (!key) return null;
  const mod = await pathModules[key]();
  const parsed = PathSchema.safeParse(mod.default);
  return parsed.success ? parsed.data : null;
}

export async function loadLesson(pathSlug: string, lessonSlug: string): Promise<Lesson | null> {
  const key = Object.keys(lessonModules).find((k) => {
    return k.includes(`/lessons/${pathSlug}/`) && slugFromPath(k) === lessonSlug;
  });
  if (!key) return null;
  const mod = await lessonModules[key]();
  const parsed = LessonSchema.safeParse(mod.default);
  return parsed.success ? parsed.data : null;
}

export async function loadLessonsForPath(pathSlug: string): Promise<Lesson[]> {
  const keys = Object.keys(lessonModules).filter((k) => k.includes(`/lessons/${pathSlug}/`));
  const lessons: Lesson[] = [];
  for (const key of keys.sort()) {
    const mod = await lessonModules[key]();
    const parsed = LessonSchema.safeParse(mod.default);
    if (parsed.success) lessons.push(parsed.data);
  }
  return lessons;
}
