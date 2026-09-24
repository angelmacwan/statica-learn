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

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  avatarEmoji: string;
  refreshAvatar: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarEmoji, setAvatarEmoji] = useState('');

  const loadAvatar = async (uid: string) => {
    const profile = await getUserProfile(uid);
    setAvatarEmoji(profile?.avatarEmoji || '');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser && !firebaseUser.isAnonymous) {
        // Only set displayName + avatarUrl — never touch avatarEmoji here,
        // so we don't overwrite the user's saved choice on every login.
        await upsertUserProfile(firebaseUser.uid, {
          displayName: firebaseUser.displayName ?? 'Learner',
          avatarUrl: firebaseUser.photoURL ?? '',
        });
        await loadAvatar(firebaseUser.uid);
      } else {
        setAvatarEmoji('');
      }
    });
    return unsubscribe;
  }, []);

  const refreshAvatar = async () => {
    if (user) await loadAvatar(user.uid);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setAvatarEmoji('');
  };

  return (
    <AuthContext.Provider value={{ user, loading, avatarEmoji, refreshAvatar, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
