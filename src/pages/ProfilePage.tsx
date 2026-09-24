import { useAuth } from '@/features/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { getAllProgress } from '@/lib/firestore';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const DEFAULT_EMOJI = '🧑‍💻';

export default function ProfilePage() {
  const { user, signOut, avatarEmoji } = useAuth();
  const [stats, setStats] = useState({ completed: 0, started: 0 });

  useEffect(() => {
    if (!user) return;
    getAllProgress(user.uid).then((p) => {
      const vals = Object.values(p);
      setStats({
        completed: vals.filter((v) => v.status === 'completed').length,
        started: vals.filter((v) => v.status === 'started').length,
      });
    });
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

      {/* Sign out */}
      <button
        onClick={signOut}
        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium text-sm transition-all"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </div>
  );
}
