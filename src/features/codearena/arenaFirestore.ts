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
import type { ArenaAttempt, ArenaProgress, Language, TestResult, PassingSubmission } from '@/features/codearena/types';

// ─── Progress ─────────────────────────────────────────────────────────────────

export async function getArenaProgress(
  userId: string,
  questionId: string
): Promise<ArenaProgress | null> {
  if (!userId) return null;
  const snap = await getDoc(doc(db, 'users', userId, 'arena_progress', questionId));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    questionId: d.questionId,
    bestStatus: d.bestStatus ?? 'unsolved',
    totalAttempts: d.totalAttempts ?? 0,
    firstSolvedAt: d.firstSolvedAt ? (d.firstSolvedAt as Timestamp).toDate() : null,
    lastAttemptAt: (d.lastAttemptAt as Timestamp)?.toDate() ?? new Date(),
    savedCode: d.savedCode ?? { python: '', javascript: '' },
    passingSubmissions: d.passingSubmissions ?? {},
  };
}

export async function getAllArenaProgress(
  userId: string
): Promise<Record<string, ArenaProgress>> {
  if (!userId) return {};
  const snap = await getDocs(collection(db, 'users', userId, 'arena_progress'));
  const result: Record<string, ArenaProgress> = {};
  snap.forEach((docSnap) => {
    const d = docSnap.data();
    result[docSnap.id] = {
      questionId: d.questionId,
      bestStatus: d.bestStatus ?? 'unsolved',
      totalAttempts: d.totalAttempts ?? 0,
      firstSolvedAt: d.firstSolvedAt ? (d.firstSolvedAt as Timestamp).toDate() : null,
      lastAttemptAt: (d.lastAttemptAt as Timestamp)?.toDate() ?? new Date(),
      savedCode: d.savedCode ?? { python: '', javascript: '' },
      passingSubmissions: d.passingSubmissions ?? {},
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
  if (!userId) return;
  const ref = doc(db, 'users', userId, 'arena_progress', questionId);
  await setDoc(
    ref,
    {
      questionId,
      lastAttemptAt: serverTimestamp(),
      savedCode: { [language]: code },
    },
    { merge: true }
  );
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
  if (!userId) return;

  const progressRef = doc(db, 'users', userId, 'arena_progress', questionId);
  const progressSnap = await getDoc(progressRef);
  const existing = progressSnap.data();
  const prevAttempts = existing?.totalAttempts ?? 0;
  const alreadySolved = existing?.bestStatus === 'pass';

  // Base progress update
  const progressUpdate: Record<string, unknown> = {
    questionId,
    totalAttempts: increment(1),
    lastAttemptAt: serverTimestamp(),
    [`savedCode.${language}`]: submittedCode,
  };

  if (status === 'pass') {
    progressUpdate.bestStatus = 'pass';
    if (!alreadySolved) {
      progressUpdate.firstSolvedAt = serverTimestamp();
    }
    // Update latest passing submission map in progress doc
    progressUpdate[`passingSubmissions.${language}`] = {
      questionId,
      language,
      submittedCode,
      passedAt: serverTimestamp(),
      testResults,
      stdout,
    };
  } else if (!alreadySolved) {
    progressUpdate.bestStatus = status;
  }

  await setDoc(progressRef, progressUpdate, { merge: true });

  // If passing, save/override the single passing submission per (questionId, language)
  if (status === 'pass') {
    const submissionRef = doc(db, 'users', userId, 'arena_submissions', `${questionId}_${language}`);
    await setDoc(submissionRef, {
      questionId,
      language,
      submittedCode,
      status: 'pass',
      passedAt: serverTimestamp(),
      testResults,
      stdout,
      error: null,
    });
  }

  // Log attempt history doc
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

export async function getPassingSubmission(
  userId: string,
  questionId: string,
  language: Language
): Promise<PassingSubmission | null> {
  if (!userId) return null;
  const subRef = doc(db, 'users', userId, 'arena_submissions', `${questionId}_${language}`);
  const snap = await getDoc(subRef);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    questionId: d.questionId,
    language: d.language,
    submittedCode: d.submittedCode,
    status: 'pass',
    passedAt: (d.passedAt as Timestamp)?.toDate() ?? new Date(),
    testResults: d.testResults ?? [],
    stdout: d.stdout ?? '',
    error: d.error ?? null,
  };
}
