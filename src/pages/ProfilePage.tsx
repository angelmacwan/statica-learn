import { useAuth } from '@/features/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { getAllProgress, upsertUserProfile } from '@/lib/firestore';
import { Link } from 'react-router-dom';
import { LogOut, Sliders, User, Check, Maximize2 } from 'lucide-react';
import type { ContentWidthSetting } from '@/types';

const DEFAULT_EMOJI = '🧑‍💻';

const EMOJI_OPTIONS = [
  '🧑‍💻', '👨‍💻', '👩‍💻', '🐱', '🦊', '🐼', '🐸', '🦄',
  '🤖', '👾', '🧙', '🦸', '🧑‍🚀', '🐙', '🦋', '🌟',
];

const WIDTH_POSITIONS: { key: ContentWidthSetting; label: string; px: string; desc: string; previewPct: number }[] = [
  {
    key: 'small',
    label: 'Small',
    px: '576px',
    desc: 'Compact content view with generous surrounding space.',
    previewPct: 45,
  },
  {
    key: 'normal',
    label: 'Normal',
    px: '768px',
    desc: 'Default comfortable width for balanced reading and coding.',
    previewPct: 62,
  },
  {
    key: 'large',
    label: 'Large',
    px: '1024px',
    desc: 'Wider content area for larger code snippets and diagrams.',
    previewPct: 80,
  },
  {
    key: 'xl',
    label: 'XL',
    px: '1280px',
    desc: 'Maximum content section width with minimal surrounding padding.',
    previewPct: 96,
  },
];

export default function ProfilePage() {
  const { user, signOut, avatarEmoji, contentWidth, contentWidthClass, setContentWidth, refreshAvatar } = useAuth();
  const [stats, setStats] = useState({ completed: 0, started: 0 });
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [avatarSaved, setAvatarSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setSelectedEmoji(avatarEmoji || DEFAULT_EMOJI);
    getAllProgress(user.uid).then((p) => {
      const vals = Object.values(p);
      setStats({
        completed: vals.filter((v) => v.status === 'completed').length,
        started: vals.filter((v) => v.status === 'started').length,
      });
    });
  }, [user, avatarEmoji]);

  const handleSaveAvatar = async (emoji: string) => {
    setSelectedEmoji(emoji);
    if (user) {
      await upsertUserProfile(user.uid, { avatarEmoji: emoji });
      await refreshAvatar();
      setAvatarSaved(true);
      setTimeout(() => setAvatarSaved(false), 2000);
    }
  };

  const activeWidthIdx = WIDTH_POSITIONS.findIndex((w) => w.key === contentWidth);
  const currentWidthMeta = WIDTH_POSITIONS[activeWidthIdx >= 0 ? activeWidthIdx : 1];

  const displayEmoji = avatarEmoji || DEFAULT_EMOJI;

  if (!user)
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-gray-500">Sign in to view your profile and settings.</p>
        <Link to="/login" className="btn-primary inline-flex">
          Sign in
        </Link>
      </div>
    );

  return (
    <div className={`${contentWidthClass} mx-auto px-4 sm:px-6 py-10 space-y-8 transition-all duration-300`}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account stats, display avatar, and content layout preferences.</p>
      </div>

      {/* User Card */}
      <div className="card p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cream-100 border border-cream-200 flex items-center justify-center text-4xl leading-none shadow-sm">
            {displayEmoji}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.displayName ?? 'Learner'}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium text-xs transition-all"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-5 text-center space-y-1 border-l-4 border-l-mint-400">
          <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
          <p className="text-xs font-medium text-gray-500">Lessons Completed</p>
        </div>
        <div className="card p-5 text-center space-y-1 border-l-4 border-l-coral-300">
          <p className="text-3xl font-bold text-gray-900">{stats.started}</p>
          <p className="text-xs font-medium text-gray-500">In Progress</p>
        </div>
      </div>

      {/* Settings Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg border-b border-gray-200 pb-2">
          <Sliders size={20} className="text-mint-400" />
          <span>App Settings & Layout</span>
        </div>

        {/* Content Section Width Setting */}
        <div className="card p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Maximize2 size={16} className="text-gray-700" />
                <h3 className="text-base font-semibold text-gray-900">Content Section Width</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Drag the slider to adjust the width of learning modules. <strong>XL</strong> expands the content section and reduces surrounding padding.
              </p>
            </div>
            <span className="pill pill-mint font-semibold uppercase text-[11px] shrink-0">
              {currentWidthMeta.label} ({currentWidthMeta.px})
            </span>
          </div>

          {/* Slider Controls */}
          <div className="space-y-3 pt-2">
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              value={activeWidthIdx >= 0 ? activeWidthIdx : 1}
              onChange={(e) => {
                const idx = parseInt(e.target.value, 10);
                if (WIDTH_POSITIONS[idx]) {
                  setContentWidth(WIDTH_POSITIONS[idx].key);
                }
              }}
              className="w-full accent-gray-900 cursor-pointer h-2 bg-gray-200 rounded-lg"
            />

            {/* Position Labels */}
            <div className="grid grid-cols-4 gap-1 text-center">
              {WIDTH_POSITIONS.map((w) => {
                const isActive = contentWidth === w.key;
                return (
                  <button
                    key={w.key}
                    onClick={() => setContentWidth(w.key)}
                    className={`py-1.5 px-2 rounded-xl text-xs transition-all flex flex-col items-center justify-center ${
                      isActive
                        ? 'bg-gray-900 text-white font-semibold shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium'
                    }`}
                  >
                    <span>{w.label}</span>
                    <span className={`text-[10px] ${isActive ? 'text-mint-200' : 'text-gray-400'}`}>
                      {w.px}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Width Description & Visual Preview */}
          <div className="bg-cream-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <p className="text-xs text-gray-700">
              <span className="font-semibold text-gray-900">{currentWidthMeta.label} Layout: </span>
              {currentWidthMeta.desc}
            </p>

            {/* Mini Screen Preview Graphic */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                <span>Surrounding Padding</span>
                <span>Content Section ({currentWidthMeta.previewPct}%)</span>
                <span>Surrounding Padding</span>
              </div>
              <div className="h-7 bg-gray-200 rounded-lg p-1 flex items-center justify-center relative overflow-hidden">
                <div
                  className="h-full bg-mint-300 rounded border border-mint-400 text-[10px] font-bold text-gray-900 flex items-center justify-center transition-all duration-300 shadow-sm"
                  style={{ width: `${currentWidthMeta.previewPct}%` }}
                >
                  Content Section ({currentWidthMeta.label})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Emoji Picker */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-700" />
              <h3 className="text-base font-semibold text-gray-900">Avatar Emoji</h3>
            </div>
            {avatarSaved && (
              <span className="flex items-center gap-1 text-xs text-mint-400 font-medium">
                <Check size={13} /> Saved
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500">Pick an emoji avatar to represent you across Statica Learn.</p>

          <div className="grid grid-cols-8 gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleSaveAvatar(emoji)}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                  selectedEmoji === emoji
                    ? 'bg-gray-900 ring-2 ring-gray-900 ring-offset-1 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
