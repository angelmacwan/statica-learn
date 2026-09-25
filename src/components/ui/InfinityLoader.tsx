interface InfinityLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function InfinityLoader({
  size = 'md',
  text,
  fullScreen = false,
  className = '',
}: InfinityLoaderProps) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className={`relative ${sizeMap[size]}`}>
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full text-amber-600"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background trace */}
          <path
            d="M12.7,12.1c-2.4-2.6-7.3-3.2-9.9-0.7s-2.5,6.7,0,9.2s7.4,1.9,9.9-0.7c2.1-2.2,4.5-5.6,6.5-7.8c2.4-2.6,7.4-3.2,9.9-0.7s2.5,6.7,0,9.2s-7.5,1.9-9.9-0.7C17.2,17.7,14.8,14.3,12.7,12.1z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-20"
          />
          {/* Animated line */}
          <path
            d="M12.7,12.1c-2.4-2.6-7.3-3.2-9.9-0.7s-2.5,6.7,0,9.2s7.4,1.9,9.9-0.7c2.1-2.2,4.5-5.6,6.5-7.8c2.4-2.6,7.4-3.2,9.9-0.7s2.5,6.7,0,9.2s-7.5,1.9-9.9-0.7C17.2,17.7,14.8,14.3,12.7,12.1z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="infinity-path-animated"
          />
        </svg>
      </div>
      {text && (
        <span className="text-xs font-semibold text-gray-500 animate-pulse tracking-wide">
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-50/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
