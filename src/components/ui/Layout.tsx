import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthProvider';
import {
  Home,
  Compass,
  Code2,
  Briefcase,
  User,
  LogIn,
  LogOut,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/practice', label: 'Practice', icon: Code2 },
  { to: '/projects', label: 'Projects', icon: Briefcase },
];

export function Layout() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-cream-50">
      {/* Left nav rail */}
      <nav className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 p-4 gap-1 fixed top-0 left-0 h-full z-40">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 px-3 py-3 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm">Statica Learn</span>
        </Link>

        {/* Nav links */}
        {navItems.map(({ to, label, icon: Icon }) => {
          const active =
            to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}

        {/* Bottom: auth */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User size={16} />
                )}
                <span className="truncate">{user.displayName ?? 'Profile'}</span>
              </Link>
              <button
                onClick={signOut}
                className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <LogIn size={16} />
              Sign in
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm">Statica Learn</span>
        </Link>
        {user ? (
          <Link to="/profile">
            {user.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <User size={20} className="text-gray-500" />
            )}
          </Link>
        ) : (
          <Link to="/login" className="text-sm font-medium text-gray-600">
            Sign in
          </Link>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 md:ml-60 pt-0 md:pt-0">
        <div className="md:hidden h-14" /> {/* spacer for mobile header */}
        <Outlet />
      </main>
    </div>
  );
}
