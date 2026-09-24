import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  Timestamp,
  increment,
} from 'firebase/firestore';
import type { ArenaAttempt, ArenaProgress, Language, TestResult } from '@/features/codearena/types';

// ─── Progress ─────────────────────────────────────────────────────────────────

export async function getArenaProgress(
  userId: string,
  questionId: string
): Promise<ArenaProgress | null> {
  const snap = await getDoc(doc(db, 'users', userId, 'arena_progress', questionId));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    questionId: d.questionId,
    bestStatus: d.bestStatus,
    totalAttempts: d.totalAttempts ?? 0,
    firstSolvedAt: d.firstSolvedAt ? (d.firstSolvedAt as Timestamp).toDate() : null,
    lastAttemptAt: (d.lastAttemptAt as Timestamp)?.toDate() ?? new Date(),
    savedCode: d.savedCode ?? { python: '', javascript: '' },
  };
}

export async function getAllArenaProgress(
  userId: string
): Promise<Record<string, ArenaProgress>> {
  const snap = await getDocs(collection(db, 'users', userId, 'arena_progress'));
  const result: Record<string, ArenaProgress> = {};
  snap.forEach((docSnap) => {
    const d = docSnap.data();
    result[docSnap.id] = {
      questionId: d.questionId,
      bestStatus: d.bestStatus,
      totalAttempts: d.totalAttempts ?? 0,
      firstSolvedAt: d.firstSolvedAt ? (d.firstSolvedAt as Timestamp).toDate() : null,
      lastAttemptAt: (d.lastAttemptAt as Timestamp)?.toDate() ?? new Date(),
      savedCode: d.savedCode ?? { python: '', javascript: '' },
    };
  });
  return result;
}

export async function saveArenaCode(
  userId: string,
  questionId: string,
  language: Language,
  code: string
): Promise<void> {
  const ref = doc(db, 'users', userId, 'arena_progress', questionId);
  const snap = await getDoc(ref);
  const field = `savedCode.${language}`;
  if (!snap.exists()) {
    await setDoc(ref, {
      questionId,
      bestStatus: 'unsolved',
      totalAttempts: 0,
      firstSolvedAt: null,
      lastAttemptAt: serverTimestamp(),
      savedCode: { python: '', javascript: '', [language]: code },
    });
  } else {
    await setDoc(ref, { [field]: code, lastAttemptAt: serverTimestamp() }, { merge: true });
  }
}

// ─── Submission ──────────────────────────────────────────────────────────────

export interface RecordSubmissionArgs {
  userId: string;
  questionId: string;
  language: Language;
  submittedCode: string;
  status: 'pass' | 'fail' | 'error';
  testResults: TestResult[];
  stdout: string;
  error: string | null;
}

export async function recordArenaSubmission(args: RecordSubmissionArgs): Promise<void> {
  const { userId, questionId, language, submittedCode, status, testResults, stdout, error } = args;

  const progressRef = doc(db, 'users', userId, 'arena_progress', questionId);
  const progressSnap = await getDoc(progressRef);
  const existing = progressSnap.data();
  const prevAttempts = existing?.totalAttempts ?? 0;
  const alreadySolved = existing?.bestStatus === 'pass';

  // Upsert progress
  const progressUpdate: Record<string, unknown> = {
    questionId,
    totalAttempts: increment(1),
    lastAttemptAt: serverTimestamp(),
    [`savedCode.${language}`]: submittedCode,
  };

  if (status === 'pass' && !alreadySolved) {
    progressUpdate.bestStatus = 'pass';
    progressUpdate.firstSolvedAt = serverTimestamp();
  } else if (!alreadySolved) {
    progressUpdate.bestStatus = status;
  }

  await setDoc(progressRef, progressUpdate, { merge: true });

  // Log attempt
  const attempt: Omit<ArenaAttempt, 'submittedAt'> & { submittedAt: ReturnType<typeof serverTimestamp> } = {
    questionId,
    language,
    status,
    submittedCode,
    testResults,
    stdout,
    error,
    attemptNumber: prevAttempts + 1,
    submittedAt: serverTimestamp(),
  };

  await addDoc(collection(db, 'users', userId, 'arena_attempts'), attempt);
}
