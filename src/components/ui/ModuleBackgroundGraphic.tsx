interface Props {
  pathSlug?: string;
  className?: string;
}

export function ModuleBackgroundGraphic({ pathSlug, className }: Props) {
  if (!pathSlug) return null;

  const slug = pathSlug.toLowerCase();

  const baseClasses =
    className ??
    'fixed bottom-4 right-4 md:bottom-8 md:right-8 w-64 h-64 md:w-96 md:h-96 pointer-events-none select-none z-0 transition-opacity duration-500';

  if (slug.includes('git')) {
    return (
      <div className={`${baseClasses} text-orange-500/10`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          {/* Git Branch & Commit tree */}
          <line x1="6" y1="3" x2="6" y2="21" />
          <circle cx="6" cy="6" r="3" fill="currentColor" />
          <circle cx="6" cy="18" r="3" fill="currentColor" />
          <path d="M6 9a9 9 0 0 1 9 9" />
          <circle cx="15" cy="18" r="3" fill="currentColor" />
          <path d="M15 9a6 6 0 0 0-6-6" strokeDasharray="2 2" />
        </svg>
      </div>
    );
  }

  if (slug.includes('python')) {
    return (
      <div className={`${baseClasses} text-emerald-500/10`}>
        <svg
          viewBox="0 0 128 128"
          fill="currentColor"
          className="w-full h-full"
        >
          {/* Python emblem */}
          <path d="M63.5 1.5c-30.8 0-29 13.4-29 13.4l.1 13.9h29.5v4.2H22.7C7.3 33 6.9 55.4 6.9 55.4s-1.5 17.6 15.8 17.6h9.4v-13.6c0-15.6 13.6-15.1 13.6-15.1h29.1s13.5.2 13.5-13.1V15c0-13.5-14.8-13.5-14.8-13.5h-10.5zm-14 9.1a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4z" />
          <path d="M64.4 126.5c30.8 0 29-13.4 29-13.4l-.1-13.9H63.8v-4.2h41.4c15.4 0 15.8-22.4 15.8-22.4s1.5-17.6-15.8-17.6h-9.4v13.6c0 15.6-13.6 15.1-13.6 15.1H53.1s-13.5-.2-13.5 13.1v16.4c0 13.5 14.8 13.5 14.8 13.5h10zm14-9.1a4.2 4.2 0 1 1 0-8.4 4.2 4.2 0 0 1 0 8.4z" />
        </svg>
      </div>
    );
  }

  if (slug.includes('sql')) {
    return (
      <div className={`${baseClasses} text-indigo-500/10`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          {/* RDBMS Database Stack & Schema */}
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <line x1="12" y1="8" x2="12" y2="21" strokeDasharray="1 2" />
        </svg>
      </div>
    );
  }

  // Default fallback code graphic
  return (
    <div className={`${baseClasses} text-gray-500/10`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    </div>
  );
}
