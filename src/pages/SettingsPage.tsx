import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/AuthProvider';
import { getUserProfile, upsertUserProfile } from '@/lib/firestore';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const EMOJI_OPTIONS = [
  '🧑‍💻', '👨‍💻', '👩‍💻', '🐱', '🦊', '🐼', '🐸', '🦄',
  '🤖', '👾', '🧙', '🦸', '🧑‍🚀', '🐙', '🦋', '🌟',
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getUserProfile(user.uid).then((profile) => {
      setSelectedEmoji(profile?.avatarEmoji || '');
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    await upsertUserProfile(user.uid, { avatarEmoji: selectedEmoji });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user)
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-gray-500">Sign in to access settings.</p>
        <Link to="/login" className="btn-primary inline-flex">Sign in</Link>
      </div>
    );

  if (loading) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      {/* Avatar emoji picker */}
      <div className="card p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Avatar Emoji</h2>
          <p className="text-sm text-gray-400 mt-0.5">Pick an emoji to represent you across the app.</p>
        </div>

        {/* Current preview */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-3xl leading-none">
            {selectedEmoji || '🧑‍💻'}
          </div>
          <span className="text-sm text-gray-500">Your avatar</span>
        </div>

        {/* Picker grid */}
        <div className="grid grid-cols-8 gap-2">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelectedEmoji(emoji)}
              className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                selectedEmoji === emoji
                  ? 'bg-gray-900 ring-2 ring-gray-900 ring-offset-1'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="btn-primary flex items-center gap-2"
        >
          {saved ? <><Check size={14} /> Saved</> : 'Save'}
        </button>
      </div>
    </div>
  );
}
