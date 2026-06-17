import React, { useState, useMemo } from 'react'

export default function ChallengesList({ challenges, currentIndex, challengeData, onSelect }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'easy' | 'medium' | 'hard'

  // Group challenges by dataset
  const grouped = useMemo(() => {
    const q = search.toLowerCase().trim()
    const filtered = challenges.filter((ch, i) => {
      const matchSearch = !q || ch.title.toLowerCase().includes(q) || ch.dataset.toLowerCase().includes(q)
      const matchDiff = filter === 'all' || ch.difficulty === filter
      return matchSearch && matchDiff
    })

    const groups = {}
    filtered.forEach((ch, _) => {
      const key = ch.dataset
      if (!groups[key]) groups[key] = []
      groups[key].push(ch)
    })
    return groups
  }, [challenges, search, filter])

  const solvedCount = Object.values(challengeData || {}).filter(d => d.status === 'solved').length

  return (
    <div className="challenges-list">
      {/* List header */}
      <div className="cl-header">
        <div className="cl-title-row">
          <span className="cl-title">Challenges</span>
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
          {['all', 'easy', 'medium', 'hard'].map(d => (
            <button
              key={d}
              className={`cl-filter-btn ${filter === d ? 'active' : ''} ${d !== 'all' ? d : ''}`}
              onClick={() => setFilter(d)}
            >
              {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
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
                const status = challengeData[ch.id]?.status || 'none'
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
                    <span className={`cl-item-badge ${ch.difficulty}`}>
                      {ch.difficulty[0].toUpperCase()}
                    </span>
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
