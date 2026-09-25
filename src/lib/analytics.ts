import { logActivity } from '@/lib/firestore';

export async function trackEvent(
  userId: string | null,
  event: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  if (!userId) return;
  // Only track path_started and lesson_completed
  const activityTypes = [
    'path_started',
    'lesson_completed',
  ] as const;
  type ValidType = (typeof activityTypes)[number];
  if (activityTypes.includes(event as ValidType)) {
    await logActivity(userId, event as ValidType, metadata);
  }
}
