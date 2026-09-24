import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthProvider';
import {
  Home,
  Compass,
  LogIn,
  Lock,
  Swords,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/arena', label: 'CodeArena', icon: Swords },
];

const DEFAULT_EMOJI = '🧑‍💻';

export function Layout() {
  const { user, avatarEmoji } = useAuth();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  const displayEmoji = avatarEmoji || DEFAULT_EMOJI;

  return (
    <div className="flex min-h-screen bg-cream-50">
      {/* Left nav rail */}
      <nav
        className={`hidden md:flex flex-col bg-white border-r border-gray-100 p-3 fixed top-0 left-0 h-full z-40 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Header: Logo + Toggle button */}
        <div
          className={`mb-4 px-1 py-1 ${
            collapsed ? 'flex flex-col items-center gap-2' : 'flex items-center justify-between'
          }`}
        >
          {collapsed ? (
            <>
              <button
                onClick={toggleCollapsed}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                title="Expand sidebar"
              >
                <ChevronRight size={16} />
              </button>
              <Link
                to="/home"
                className="flex items-center justify-center py-1"
                title="Statica Learn"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/home"
                className="flex items-center gap-2.5 overflow-hidden py-1"
                title="Statica Learn by StaticaLabs"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                    Statica Learn
                  </span>
                  <span className="text-[10px] font-normal text-gray-500 whitespace-nowrap">
                    by StaticaLabs
                  </span>
                </div>
              </Link>

              <button
                onClick={toggleCollapsed}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                title="Collapse sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            </>
          )}
        </div>

        {/* Nav links */}
        <div className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active =
              to === '/home' ? location.pathname === '/home' : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Login nudge for guests */}
        {!user && (
          <div
            className={`mt-4 rounded-xl bg-amber-50 border border-amber-200 transition-all ${
              collapsed ? 'p-2.5 flex items-center justify-center' : 'p-3 space-y-1.5'
            }`}
          >
            {collapsed ? (
              <Link to="/login" title="Sign in to unlock all features" className="text-amber-700">
                <Lock size={16} />
              </Link>
            ) : (
              <>
                <div className="flex items-center gap-2 text-amber-700">
                  <Lock size={13} className="shrink-0" />
                  <span className="text-xs font-semibold">Sign in to unlock</span>
                </div>
                <p className="text-xs text-amber-600 leading-snug">
                  All modules, paths, and progress tracking require an account.
                </p>
                <Link
                  to="/login"
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900"
                >
                  <LogIn size={12} /> Sign in free
                </Link>
              </>
            )}
          </div>
        )}

        {/* Bottom: auth */}
        <div className="mt-auto pt-3 border-t border-gray-100 space-y-1">
          {user ? (
            <Link
              to="/profile"
              title={collapsed ? user.displayName ?? 'Profile' : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all ${
                collapsed ? 'justify-center px-0' : ''
              }`}
            >
              <span className="text-lg leading-none shrink-0">{displayEmoji}</span>
              {!collapsed && <span className="truncate">{user.displayName ?? 'Profile'}</span>}
            </Link>
          ) : (
            <Link
              to="/login"
              title={collapsed ? 'Sign in' : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all ${
                collapsed ? 'justify-center px-0' : ''
              }`}
            >
              <LogIn size={18} className="shrink-0" />
              {!collapsed && <span>Sign in</span>}
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4">
        <Link to="/home" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-gray-900 text-sm">Statica Learn</span>
            <span className="text-[10px] font-normal text-gray-500">by StaticaLabs</span>
          </div>
        </Link>
        {user ? (
          <Link to="/profile" className="text-xl leading-none">
            {displayEmoji}
          </Link>
        ) : (
          <Link to="/login" className="flex items-center gap-1 text-sm font-medium text-amber-600">
            <Lock size={13} />
            Sign in
          </Link>
        )}
      </header>

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? 'md:ml-16' : 'md:ml-60'
        }`}
      >
        <div className="md:hidden h-14" /> {/* spacer for mobile header */}
        <Outlet />
      </main>
    </div>
  );
}
