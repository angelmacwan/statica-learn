import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import type { UserProfile, LessonProgress, Activity, ActivityType, ProgressStatus } from '@/types';

// ─── User Profile ────────────────────────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    displayName: d.displayName ?? '',
    avatarUrl: d.avatarUrl ?? '',
    avatarEmoji: d.avatarEmoji ?? '',
    createdAt: (d.createdAt as Timestamp)?.toDate() ?? new Date(),
  };
}

export async function upsertUserProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<void> {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { ...data, createdAt: serverTimestamp() });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(ref, data as any);
  }
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export async function getLessonProgress(
  userId: string,
  lessonId: string
): Promise<LessonProgress | null> {
  const snap = await getDoc(doc(db, 'users', userId, 'progress', lessonId));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    pathId: d.pathId,
    status: d.status as ProgressStatus,
    score: d.score ?? null,
    attempts: d.attempts ?? 0,
    startedAt: (d.startedAt as Timestamp)?.toDate() ?? null,
    completedAt: (d.completedAt as Timestamp)?.toDate() ?? null,
    lastAccessedAt: (d.lastAccessedAt as Timestamp)?.toDate() ?? new Date(),
  };
}

export async function getAllProgress(
  userId: string
): Promise<Record<string, LessonProgress>> {
  const snap = await getDocs(collection(db, 'users', userId, 'progress'));
  const result: Record<string, LessonProgress> = {};
  snap.forEach((doc) => {
    const d = doc.data();
    result[doc.id] = {
      pathId: d.pathId,
      status: d.status as ProgressStatus,
      score: d.score ?? null,
      attempts: d.attempts ?? 0,
      startedAt: (d.startedAt as Timestamp)?.toDate() ?? null,
      completedAt: (d.completedAt as Timestamp)?.toDate() ?? null,
      lastAccessedAt: (d.lastAccessedAt as Timestamp)?.toDate() ?? new Date(),
    };
  });
  return result;
}

export async function startLesson(
  userId: string,
  lessonId: string,
  pathId: string
): Promise<void> {
  const ref = doc(db, 'users', userId, 'progress', lessonId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      pathId,
      status: 'started',
      score: null,
      attempts: 1,
      startedAt: serverTimestamp(),
      completedAt: null,
      lastAccessedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(ref, {
      status: 'started',
      attempts: (snap.data().attempts ?? 0) + 1,
      lastAccessedAt: serverTimestamp(),
    });
  }
  await logActivity(userId, 'lesson_started', { lessonId, pathId });
}

export async function completeLesson(
  userId: string,
  lessonId: string,
  pathId: string,
  score: number
): Promise<void> {
  const ref = doc(db, 'users', userId, 'progress', lessonId);
  await setDoc(
    ref,
    {
      pathId,
      status: 'completed',
      score,
      completedAt: serverTimestamp(),
      lastAccessedAt: serverTimestamp(),
    },
    { merge: true }
  );
  await logActivity(userId, 'lesson_completed', { lessonId, pathId, score });
}

// ─── Activity logging ────────────────────────────────────────────────────────

export async function logActivity(
  userId: string,
  type: ActivityType,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  await addDoc(collection(db, 'users', userId, 'activities'), {
    type,
    metadata,
    createdAt: serverTimestamp(),
  });
}

export async function getRecentActivities(userId: string): Promise<Activity[]> {
  const snap = await getDocs(collection(db, 'users', userId, 'activities'));
  return snap.docs
    .map((doc) => {
      const d = doc.data();
      return {
        type: d.type as ActivityType,
        metadata: d.metadata ?? {},
        createdAt: (d.createdAt as Timestamp)?.toDate() ?? new Date(),
      } as Activity;
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 20);
}
