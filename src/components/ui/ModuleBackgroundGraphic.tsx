interface Props {
  pathSlug?: string;
  className?: string;
}

export function ModuleBackgroundGraphic({ pathSlug, className }: Props) {
  if (!pathSlug) return null;

  const slug = pathSlug.toLowerCase();

  let imgSrc: string | null = null;
  if (slug.includes('git')) {
    imgSrc = '/images/git.png';
  } else if (slug.includes('python')) {
    imgSrc = '/images/python.png';
  } else if (slug.includes('sql') || slug.includes('database')) {
    imgSrc = '/images/database.png';
  } else if (slug.includes('ml') || slug.includes('machine-learning')) {
    imgSrc = '/images/ml.png';
  }

  if (!imgSrc) return null;

  const baseClasses =
    className ??
    'fixed bottom-4 right-4 md:bottom-8 md:right-8 w-64 h-64 md:w-96 md:h-96 pointer-events-none select-none z-0 animate-watermark-pop';

  return (
    <div className={baseClasses}>
      <img
        src={imgSrc}
        alt=""
        className="w-full h-full object-contain pointer-events-none select-none"
      />
    </div>
  );
}
