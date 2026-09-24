import { useAuth } from '@/features/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { getAllProgress, getRecentActivities } from '@/lib/firestore';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock } from 'lucide-react';
import type { Activity } from '@/types';

const DEFAULT_EMOJI = '🧑‍💻';

export default function ProfilePage() {
  const { user, signOut, avatarEmoji } = useAuth();
  const [stats, setStats] = useState({ completed: 0, started: 0 });
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!user) return;
    getAllProgress(user.uid).then((p) => {
      const vals = Object.values(p);
      setStats({
        completed: vals.filter((v) => v.status === 'completed').length,
        started: vals.filter((v) => v.status === 'started').length,
      });
    });
    getRecentActivities(user.uid).then(setActivities);
  }, [user]);

  const displayEmoji = avatarEmoji || DEFAULT_EMOJI;

  if (!user)
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-gray-500">Sign in to see your profile.</p>
        <Link to="/login" className="btn-primary inline-flex">
          Sign in
        </Link>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      {/* User card */}
      <div className="card p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-4xl leading-none">
          {displayEmoji}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{user.displayName ?? 'Learner'}</h1>
          <p className="text-sm text-gray-400">{user.email}</p>
          <Link to="/settings" className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2 mt-0.5 inline-block">
            Change avatar
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-5 text-center space-y-1">
          <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
          <p className="text-sm text-gray-400">Lessons completed</p>
        </div>
        <div className="card p-5 text-center space-y-1">
          <p className="text-3xl font-bold text-gray-900">{stats.started}</p>
          <p className="text-sm text-gray-400">In progress</p>
        </div>
      </div>

      {/* Recent activity */}
      {activities.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
          <div className="space-y-2">
            {activities.slice(0, 8).map((act, i) => (
              <div key={i} className="card px-4 py-3 flex items-center gap-3 text-sm">
                {act.type === 'lesson_completed' ? (
                  <CheckCircle2 size={15} className="text-mint-400 shrink-0" />
                ) : (
                  <Clock size={15} className="text-gray-300 shrink-0" />
                )}
                <span className="text-gray-600 capitalize">{act.type.replace(/_/g, ' ')}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {act.createdAt.toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sign out */}
      <button onClick={signOut} className="btn-secondary w-full">
        Sign out
      </button>
    </div>
  );
}
