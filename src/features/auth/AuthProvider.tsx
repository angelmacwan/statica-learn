import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { upsertUserProfile, getUserProfile } from '@/lib/firestore';
import { CONTENT_WIDTH_CLASSES, type ContentWidthSetting } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  avatarEmoji: string;
  contentWidth: ContentWidthSetting;
  contentWidthClass: string;
  setContentWidth: (width: ContentWidthSetting) => Promise<void>;
  refreshAvatar: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarEmoji, setAvatarEmoji] = useState('');
  const [contentWidth, setContentWidthState] = useState<ContentWidthSetting>(() => {
    const saved = localStorage.getItem('content_width_setting');
    if (saved && ['small', 'normal', 'large', 'xl'].includes(saved)) {
      return saved as ContentWidthSetting;
    }
    return 'normal';
  });

  const loadUserProfile = async (uid: string) => {
    const profile = await getUserProfile(uid);
    setAvatarEmoji(profile?.avatarEmoji || '');
    if (profile?.contentWidth && ['small', 'normal', 'large', 'xl'].includes(profile.contentWidth)) {
      setContentWidthState(profile.contentWidth);
      localStorage.setItem('content_width_setting', profile.contentWidth);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser && !firebaseUser.isAnonymous) {
        await upsertUserProfile(firebaseUser.uid, {
          displayName: firebaseUser.displayName ?? 'Learner',
          avatarUrl: firebaseUser.photoURL ?? '',
        });
        await loadUserProfile(firebaseUser.uid);
      } else {
        setAvatarEmoji('');
      }
    });
    return unsubscribe;
  }, []);

  const refreshAvatar = async () => {
    if (user) await loadUserProfile(user.uid);
  };

  const setContentWidth = async (width: ContentWidthSetting) => {
    setContentWidthState(width);
    localStorage.setItem('content_width_setting', width);
    if (user && !user.isAnonymous) {
      await upsertUserProfile(user.uid, { contentWidth: width });
    }
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setAvatarEmoji('');
  };

  const contentWidthClass = CONTENT_WIDTH_CLASSES[contentWidth] || 'max-w-3xl';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        avatarEmoji,
        contentWidth,
        contentWidthClass,
        setContentWidth,
        refreshAvatar,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
