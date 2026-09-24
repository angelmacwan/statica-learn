import { useAuth } from '@/features/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { getAllProgress, upsertUserProfile } from '@/lib/firestore';
import { Link } from 'react-router-dom';
import { LogOut, Sliders, User, Check, Maximize2, CheckCircle2, Flame } from 'lucide-react';
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
      <div className="p-12 text-center space-y-4 relative z-10">
        <p className="text-gray-500">Sign in to view your profile and settings.</p>
        <Link to="/login" className="btn-primary inline-flex">
          Sign in
        </Link>
      </div>
    );

  return (
    <div className={`relative z-10 ${contentWidthClass} mx-auto px-4 sm:px-6 py-10 space-y-8 transition-all duration-300`}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile & Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account, display avatar, and content layout preferences.</p>
      </div>

      {/* User Card with Integrated Compact Stats */}
      <div className="card p-6 flex flex-wrap items-center justify-between gap-6 bg-white border border-cream-200 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-4xl leading-none shadow-sm shrink-0">
            {displayEmoji}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.displayName ?? 'Learner'}</h2>
            <p className="text-xs text-gray-400 font-medium">{user.email}</p>

            {/* Compact Badges for Completed & In Progress */}
            <div className="flex flex-wrap items-center gap-2.5 mt-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-200/80">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>{stats.completed} Completed</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-800 border border-amber-200/80">
                <Flame size={14} className="text-amber-600" />
                <span>{stats.started} In Progress</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold text-xs transition-all shadow-sm"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>

      {/* Settings Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-lg border-b border-cream-200 pb-3">
          <Sliders size={20} className="text-amber-600" />
          <span>App Settings & Layout</span>
        </div>

        {/* Content Section Width Setting (Button-Only Selector) */}
        <div className="card p-6 space-y-5 bg-white border border-cream-200 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Maximize2 size={16} className="text-amber-700" />
                <h3 className="text-base font-bold text-gray-900">Content Section Width</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select your preferred width for learning modules. <strong>XL</strong> expands the content section and reduces surrounding padding.
              </p>
            </div>
            <span className="pill pill-mint font-semibold uppercase text-[11px] shrink-0">
              {currentWidthMeta.label} ({currentWidthMeta.px})
            </span>
          </div>

          {/* Width Selection Buttons Only */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {WIDTH_POSITIONS.map((w) => {
              const isActive = contentWidth === w.key;
              return (
                <button
                  key={w.key}
                  onClick={() => setContentWidth(w.key)}
                  className={`py-3 px-4 rounded-xl text-xs transition-all flex flex-col items-center justify-center gap-1 border ${
                    isActive
                      ? 'bg-amber-700 text-white font-bold border-amber-700 shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-cream-100 hover:text-gray-900 font-semibold border-cream-200'
                  }`}
                >
                  <span>{w.label}</span>
                  <span className={`text-[10px] ${isActive ? 'text-amber-100' : 'text-gray-400'}`}>
                    {w.px}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Width Description & Visual Preview */}
          <div className="bg-cream-50 border border-cream-200 rounded-xl p-4 space-y-3">
            <p className="text-xs text-gray-700">
              <span className="font-bold text-gray-900">{currentWidthMeta.label} Layout: </span>
              {currentWidthMeta.desc}
            </p>

            {/* Mini Screen Preview Graphic */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                <span>Padding</span>
                <span>Content Section ({currentWidthMeta.previewPct}%)</span>
                <span>Padding</span>
              </div>
              <div className="h-7 bg-cream-200/60 rounded-lg p-1 flex items-center justify-center relative overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded text-[10px] font-bold text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                  style={{ width: `${currentWidthMeta.previewPct}%` }}
                >
                  Content Section ({currentWidthMeta.label})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Emoji Picker */}
        <div className="card p-6 space-y-4 bg-white border border-cream-200 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={16} className="text-amber-700" />
              <h3 className="text-base font-bold text-gray-900">Avatar Emoji</h3>
            </div>
            {avatarSaved && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <Check size={14} /> Saved
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500">Pick an emoji avatar to represent you across Statica Learn.</p>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleSaveAvatar(emoji)}
                className={`w-11 h-11 rounded-xl text-2xl flex items-center justify-center transition-all ${
                  selectedEmoji === emoji
                    ? 'bg-amber-700 text-white ring-2 ring-amber-700 ring-offset-2 shadow-sm'
                    : 'bg-cream-50 hover:bg-cream-100 border border-cream-200'
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
