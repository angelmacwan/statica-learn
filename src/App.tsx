import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { useAuth } from '@/features/auth/AuthProvider';
import { Layout } from '@/components/ui/Layout';

// Pages
import HomePage from '@/pages/HomePage';
import LandingPage from '@/pages/LandingPage';
import ExplorePage from '@/pages/ExplorePage';
import PathPage from '@/pages/PathPage';
import LessonPage from '@/pages/LessonPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';

// CodeArena
import { ArenaLobbyPage } from '@/features/codearena/components/ArenaLobbyPage';
import { ArenaQuestionPage } from '@/features/codearena/components/ArenaQuestionPage';

/** Redirects unauthenticated users to /login */
function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public route - Landing Page at "/" */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes - requires login */}
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/paths/:pathSlug" element={<PathPage />} />
            <Route path="/learn/:pathSlug/:lessonSlug" element={<LessonPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* CodeArena */}
            <Route path="/arena" element={<ArenaLobbyPage />} />
          </Route>
          {/* Arena question - full screen */}
          <Route path="/arena/:slug" element={<ArenaQuestionPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
