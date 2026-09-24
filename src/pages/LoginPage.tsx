import { useAuth } from '@/features/auth/AuthProvider';
import { Navigate, Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

// ─── Blob SVGs (reused from LandingPage aesthetic) ───────────────────────────

function BlobMint({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        fill="#7ccfb0"
        d="M44.8,-62.3C57.5,-53.2,66.7,-39.1,70.4,-23.9C74.1,-8.7,72.3,7.6,66.3,21.9C60.3,36.2,50.2,48.5,37.5,56.5C24.8,64.5,9.4,68.2,-5.8,67.5C-21,66.8,-36,61.7,-48.2,52.5C-60.4,43.3,-69.8,30,-72.4,15.2C-75,0.4,-70.8,-15.9,-62.6,-29.6C-54.4,-43.3,-42.2,-54.4,-28.6,-62.2C-15,-70,-0,-74.5,13.7,-72.3C27.4,-70.1,32.1,-71.4,44.8,-62.3Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

function BlobCoral({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        fill="#f7b9a8"
        d="M39.5,-55.4C50.9,-45.9,59.7,-33.1,63.8,-18.6C67.9,-4.1,67.3,12.1,61.5,26.1C55.7,40.1,44.7,51.9,31.5,58.8C18.3,65.7,2.9,67.7,-13.3,66.1C-29.5,64.5,-46.5,59.3,-57.6,48.1C-68.7,36.9,-73.9,19.7,-73.1,2.9C-72.3,-13.9,-65.5,-30.3,-55.1,-42C-44.7,-53.7,-30.7,-60.7,-16.2,-64.8C-1.7,-68.9,13.3,-70.1,27,-65.5C40.7,-60.9,28.1,-64.9,39.5,-55.4Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

function BlobBlush({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        fill="#f4adb9"
        d="M47.4,-62.1C60.5,-53.1,69.7,-38.2,72.8,-22.3C75.9,-6.4,72.9,10.5,66.2,25.4C59.5,40.3,49.1,53.2,36.1,60.5C23.1,67.8,7.5,69.5,-8.1,68.1C-23.7,66.7,-39.3,62.2,-50.9,53C-62.5,43.8,-70.1,29.9,-72,15C-73.9,0.1,-70.1,-15.8,-62.5,-29.5C-54.9,-43.2,-43.5,-54.7,-30.3,-63.5C-17.1,-72.3,-2,-78.4,12.1,-77.3C26.2,-76.2,34.3,-71.1,47.4,-62.1Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

// ─── Google Icon ──────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const perks = [
  'Track progress across all paths',
  'Save your code and quiz answers',
  'Resume exactly where you left off',
  'Free forever - no credit card needed',
];

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel (decorative, hidden on mobile) ── */}
      <div className="hidden lg:flex relative flex-1 bg-gray-900 flex-col justify-between overflow-hidden p-12">
        {/* Blobs */}
        <BlobMint className="absolute -top-20 -left-16 w-80 h-80 opacity-20 pointer-events-none" />
        <BlobCoral className="absolute top-1/3 -right-24 w-72 h-72 opacity-15 pointer-events-none" />
        <BlobBlush className="absolute -bottom-16 left-1/4 w-64 h-64 opacity-20 pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="text-white font-semibold">Statica Learn</span>
        </div>

        {/* Center content */}
        <div className="relative space-y-8">
          <div className="space-y-3">
            <span className="pill bg-mint-400/20 text-mint-300 text-xs">Free to start</span>
            <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Learn by doing.<br />
              <span className="text-mint-300">Actually finish.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Structured paths, real code in the browser, and progress that sticks.
            </p>
          </div>

          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2 size={15} className="text-mint-300 shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom attribution */}
        <p className="relative text-xs text-gray-600">
          No subscription. No ads. Just learning.
        </p>
      </div>

      {/* ── Right panel (sign-in form) ── */}
      <div className="flex flex-1 flex-col bg-cream-50">

        {/* Top nav */}
        <div className="flex items-center justify-between px-8 pt-8">
          <Link to="/home" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft size={13} />
            Back to home
          </Link>
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">Statica Learn</span>
          </div>
        </div>

        {/* Sign-in card */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm space-y-8">

            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
              <p className="text-sm text-gray-500">
                Sign in to save your progress and pick up where you left off.
              </p>
            </div>

            {/* Google button */}
            <div className="space-y-4">
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-soft hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all active:scale-[0.98]"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <p className="text-center text-xs text-gray-400 leading-relaxed">
                More sign-in options coming soon.
              </p>
            </div>

            {/* Mobile perks */}
            <ul className="lg:hidden space-y-2.5 pt-2 border-t border-gray-100">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2.5 text-xs text-gray-500">
                  <CheckCircle2 size={13} className="text-mint-400 shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>

            {/* Legal */}
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              By signing in you agree to our{' '}
              <span className="underline underline-offset-2 cursor-pointer hover:text-gray-600">Terms</span>
              {' '}and{' '}
              <span className="underline underline-offset-2 cursor-pointer hover:text-gray-600">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
