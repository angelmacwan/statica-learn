import { useState, useMemo } from 'react'

const DEFAULT_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'easy', label: 'Easy', className: 'easy' },
  { value: 'medium', label: 'Medium', className: 'medium' },
  { value: 'hard', label: 'Hard', className: 'hard' },
]

export default function ChallengesList({
  challenges,
  currentIndex,
  challengeData,
  onSelect,
  title = 'Challenges',
  filterOptions = DEFAULT_FILTERS,
  getFilterValue = ch => ch.difficulty,
  getGroupKey = ch => ch.dataset,
  getSearchText = ch => `${ch.title} ${ch.dataset}`,
  getStatus = (ch, data) => data[ch.id]?.status || 'none',
  renderBadge,
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  // Group challenges by dataset
  const grouped = useMemo(() => {
    const q = search.toLowerCase().trim()
    const filtered = challenges.filter((ch) => {
      const matchSearch = !q || getSearchText(ch).toLowerCase().includes(q)
      const matchDiff = filter === 'all' || getFilterValue(ch) === filter
      return matchSearch && matchDiff
    })

    const groups = {}
    filtered.forEach((ch) => {
      const key = getGroupKey(ch)
      if (!groups[key]) groups[key] = []
      groups[key].push(ch)
    })
    return groups
  }, [challenges, search, filter, getFilterValue, getGroupKey, getSearchText])

  const solvedCount = challenges.filter(ch => getStatus(ch, challengeData || {}) === 'solved').length

  return (
    <div className="challenges-list">
      {/* List header */}
      <div className="cl-header">
        <div className="cl-title-row">
          <span className="cl-title">{title}</span>
          <span className="cl-count">{solvedCount}/{challenges.length}</span>
        </div>

        {/* Search */}
        <div className="cl-search-wrap">
          <span className="cl-search-icon">⌕</span>
          <input
            className="cl-search"
            type="text"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="challenges-search"
          />
          {search && (
            <button className="cl-search-clear" onClick={() => setSearch('')} title="Clear">×</button>
          )}
        </div>

        {/* Difficulty filter pills */}
        <div className="cl-filters">
          {filterOptions.map(({ value, label, className = '' }) => (
            <button
              key={value}
              className={`cl-filter-btn ${filter === value ? 'active' : ''} ${className}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable list */}
      <div className="cl-body">
        {Object.keys(grouped).length === 0 ? (
          <div className="cl-empty">No challenges match your filters.</div>
        ) : (
          Object.entries(grouped).map(([dataset, chs]) => (
            <div key={dataset} className="cl-group">
              <div className="cl-group-header">{dataset}</div>
              {chs.map(ch => {
                const idx = challenges.findIndex(c => c.id === ch.id)
                const isCurrent = idx === currentIndex
                const status = getStatus(ch, challengeData || {})
                const isDone = status === 'solved'
                const isAttempted = status === 'attempted'
                
                return (
                  <button
                    key={ch.id}
                    className={`cl-item ${isCurrent ? 'active' : ''} ${isDone ? 'done' : ''} ${isAttempted ? 'attempted' : ''}`}
                    onClick={() => onSelect(idx)}
                    id={`challenge-item-${ch.id}`}
                    title={ch.title}
                  >
                    <span className="cl-item-status">
                      {isDone ? '✓' : isAttempted ? '○' : isCurrent ? '▶' : '·'}
                    </span>
                    <span className="cl-item-title">{ch.title}</span>
                    {renderBadge ? renderBadge(ch) : (
                      <span className={`cl-item-badge ${ch.difficulty}`}>
                        {ch.difficulty[0].toUpperCase()}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
