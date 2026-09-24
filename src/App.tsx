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
import PracticePage from '@/pages/PracticePage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';

// CodeArena
import { ArenaLobbyPage } from '@/features/codearena/components/ArenaLobbyPage';
import { ArenaQuestionPage } from '@/features/codearena/components/ArenaQuestionPage';

/** Redirects unauthenticated users to /home */
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
        {/* Public routes */}
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes - requires login */}
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/paths/:pathSlug" element={<PathPage />} />
            <Route path="/learn/:pathSlug/:lessonSlug" element={<LessonPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* CodeArena - lobby inside layout, question page full-screen outside layout */}
            <Route path="/arena" element={<ArenaLobbyPage />} />
          </Route>
          {/* Arena question - full screen, no sidebar */}
          <Route path="/arena/:slug" element={<ArenaQuestionPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AuthProvider>
  );
}
