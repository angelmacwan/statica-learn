import { logActivity } from '@/lib/firestore';

export async function trackEvent(
  userId: string | null,
  event: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  if (!userId) return;
  // Only track known activity types to keep Firestore clean
  const activityTypes = [
    'lesson_started',
    'lesson_completed',
    'question_answered',
    'code_run',
    'path_started',
  ] as const;
  type ValidType = (typeof activityTypes)[number];
  if (activityTypes.includes(event as ValidType)) {
    await logActivity(userId, event as ValidType, metadata);
  }
}
