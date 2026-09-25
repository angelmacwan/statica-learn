import { Link } from 'react-router-dom';
import { ArrowRight, Code2, BookOpen, CheckCircle2, Zap, Lock } from 'lucide-react';

// ─── Blob SVGs ───────────────────────────────────────────────────────────────

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

// ─── Feature cards ───────────────────────────────────────────────────────────

const features = [
  {
    pill: 'pill-mint',
    icon: BookOpen,
    title: 'Structured Paths',
    desc: 'Curated learning journeys that build on each other. No random tutorials - every lesson has a reason.',
  },
  {
    pill: 'pill-coral',
    icon: Code2,
    title: 'Code in the Browser',
    desc: 'Write and run real Python and JavaScript right here. No installs, no setup, just code.',
  },
  {
    pill: 'pill-blush',
    icon: CheckCircle2,
    title: 'Progress Tracking',
    desc: 'Your completions, streaks, and scores are saved. Sign in once and pick up exactly where you left off.',
  },
  {
    pill: 'pill-mint',
    icon: Zap,
    title: 'Focused Exercises',
    desc: 'Practice modules drill specific skills with instant feedback. Sharpen what matters.',
  },
];

// ─── Paths preview ───────────────────────────────────────────────────────────

const paths = [
  {
    title: 'Python: From First Program to Practical Projects',
    difficulty: 'intro',
    pill: 'pill-mint',
    lessons: 14,
    desc: 'Variables, data, decisions, functions, files - all through useful programs you actually keep.',
  },
  {
    title: 'JavaScript Fundamentals',
    difficulty: 'easy',
    pill: 'pill-mint',
    lessons: 10,
    desc: 'The language of the web. DOM, events, async - the real stuff, not toy examples.',
    soon: true,
  },
  {
    title: 'Data Structures',
    difficulty: 'medium',
    pill: 'pill-coral',
    lessons: 12,
    desc: 'Arrays, trees, graphs, and hash maps - understand them at the code level.',
    soon: true,
  },
  {
    title: 'Algorithms',
    difficulty: 'medium',
    pill: 'pill-coral',
    lessons: 10,
    desc: 'Sorting, searching, recursion, dynamic programming. Built to stick.',
    soon: true,
  },
];


// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50 overflow-x-hidden">

      {/* ── Minimal top nav ── */}
      <header className="sticky top-0 z-50 bg-cream-50/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-gray-900 text-sm">Statica Learn</span>
              <span className="text-[10px] font-normal text-gray-500">by StaticaLabs</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost text-xs">Sign in</Link>
            <Link to="/home" className="btn-primary text-xs py-2 px-4">
              Start free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-28 flex flex-col items-center text-center">
        {/* Organic background blobs */}
        <BlobMint className="absolute top-0 right-0 w-96 h-96 opacity-20 pointer-events-none" />
        <BlobCoral className="absolute top-12 left-0 w-80 h-80 opacity-15 pointer-events-none" />
        <BlobBlush className="absolute bottom-0 right-16 w-64 h-64 opacity-10 pointer-events-none" />

        {/* Eyebrow pill */}
        <span className="pill pill-mint mb-6 text-xs tracking-wide uppercase font-semibold">
          Hands-on coding education
        </span>

        <h1 className="relative text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 tracking-tight leading-none max-w-3xl">
          Learn by doing.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-xl leading-relaxed">
          Structured paths. Real code you run in the browser. Progress that sticks.
          No fluff - just concrete skills built one lesson at a time.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <Link to="/home" className="btn-primary text-sm gap-2 py-3 px-6">
            Explore paths <ArrowRight size={15} />
          </Link>
          <Link to="/login" className="btn-secondary text-sm py-3 px-6">
            Sign in free
          </Link>
        </div>

        {/* Save notice */}
        <p className="mt-5 flex items-center gap-1.5 text-xs text-gray-400">
          <Lock size={11} />
          Sign in to save your progress. Browse freely without an account.
        </p>

        {/* Hero floating card */}
        <div className="relative mt-16 w-full max-w-lg">
          <div className="card p-5 shadow-float text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Python: First Steps</span>
              <span className="pill pill-mint">intro</span>
            </div>
            <p className="text-xs text-gray-500">Module 1 of 6 - Starting Out</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Progress</span><span>3 / 4 lessons</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-mint-300 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <div className="pt-1 grid grid-cols-3 gap-2 text-xs text-gray-500">
              {['Variables', 'Data Types', 'Conditions'].map((c) => (
                <div key={c} className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-mint-400 shrink-0" />{c}
                </div>
              ))}
            </div>
          </div>
          {/* Small decorative card behind */}
          <div className="absolute -bottom-3 -right-4 card p-3 shadow-soft text-xs text-gray-500 space-y-1 w-40 rotate-2 opacity-60">
            <div className="flex items-center gap-1 text-mint-400 font-semibold">
              <Zap size={10} /> Practice mode
            </div>
            <p className="text-gray-400">5 exercises ready</p>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative bg-white py-20 border-t border-gray-100">
        <BlobMint className="absolute -bottom-20 -left-20 w-72 h-72 opacity-10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
            <p className="mt-2 text-gray-500 text-sm max-w-md mx-auto">
              Everything you need to actually learn to code. Nothing you don't.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ pill, icon: Icon, title, desc }) => (
              <div key={title} className="card p-5 space-y-3 hover:shadow-card transition-all">
                <span className={`pill ${pill} text-xs`}>
                  <Icon size={11} className="mr-1" />{title.split(' ')[0]}
                </span>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Paths preview ── */}
      <section className="relative py-20 max-w-6xl mx-auto px-6">
        <BlobCoral className="absolute top-8 -right-24 w-72 h-72 opacity-10 pointer-events-none" />
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Pick a path</h2>
            <p className="mt-2 text-gray-500 text-sm">Start with what you need. More paths on the way.</p>
          </div>
          <Link
            to="/home"
            className="hidden sm:flex items-center gap-1 text-sm text-gray-400 hover:text-gray-800 transition-colors"
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {paths.map((path) => (
            <div key={path.title} className="card p-5 space-y-3 hover:shadow-card transition-all group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`pill ${path.pill} text-xs`}>{path.difficulty}</span>
                  {path.soon && (
                    <span className="pill bg-gray-100 text-gray-400 text-xs">coming soon</span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{path.lessons} lessons</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-gray-700">
                {path.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{path.desc}</p>
              {!path.soon && (
                <Link
                  to="/paths/python"
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900 underline underline-offset-2"
                >
                  Start path <ArrowRight size={11} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>


      {/* ── Final CTA ── */}
      <section className="relative py-28 overflow-hidden">
        <BlobMint className="absolute -top-10 -left-20 w-96 h-96 opacity-15 pointer-events-none" />
        <BlobCoral className="absolute -bottom-10 -right-20 w-96 h-96 opacity-10 pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Ready to build real skills?
          </h2>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            Free to browse. Sign in to save progress and unlock all paths.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/home" className="btn-primary text-sm py-3 px-8 gap-2">
              Start learning <ArrowRight size={15} />
            </Link>
            <Link to="/login" className="btn-secondary text-sm py-3 px-6">
              Sign in free
            </Link>
          </div>
          <p className="text-xs text-gray-400">No credit card. No subscription. Just learn.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gray-900 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold" style={{ fontSize: 9 }}>S</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="font-semibold text-gray-900">Statica Learn</span>
              <span className="font-normal text-gray-400">by StaticaLabs</span>
            </div>
          </div>
          <div className="flex gap-6">
            <Link to="/home" className="hover:text-gray-700 transition-colors">Explore</Link>
            <Link to="/login" className="hover:text-gray-700 transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
