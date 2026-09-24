import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadAllPaths } from '@/lib/contentLoader';
import { Search } from 'lucide-react';
import type { Path } from '@/types';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'programming', label: 'Programming' },
  { id: 'data', label: 'Data' },
  { id: 'ai', label: 'AI' },
  { id: 'software-engineering', label: 'Engineering' },
  { id: 'thinking', label: 'Thinking' },
] as const;

import { useAuth } from '@/features/auth/AuthProvider';

export default function ExplorePage() {
  const { contentWidthClass } = useAuth();
  const [paths, setPaths] = useState<Path[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadAllPaths().then(setPaths);
  }, []);

  const filtered = paths.filter((p) => {
    const matchCat = category === 'all' || p.category === category;
    const matchQuery =
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className={`${contentWidthClass} mx-auto px-4 sm:px-6 py-10 space-y-8 transition-all duration-300`}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Explore Paths</h1>
        <p className="text-gray-500">Browse all available learning paths.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search paths…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-mint-200"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`pill transition-all ${
              category === cat.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Path grid */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-sm py-12 text-center">No paths found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((path) => (
            <Link
              key={path.id}
              to={`/paths/${path.slug}`}
              className="card p-5 hover:shadow-card transition-all flex flex-col gap-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-gray-700">
                  {path.title}
                </h3>
                <span className="pill pill-mint shrink-0">{path.difficulty}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                {path.description}
              </p>
              <span className="pill pill-lavender self-start capitalize">{path.category.replace('-', ' ')}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
