import React from 'react';
import { useNavigate } from 'react-router-dom';
import challenges from '../data/challenges.json';

const Home = () => {
  const navigate = useNavigate();
  
  // Get first 5 challenges for preview
  const previewChallenges = challenges.slice(0, 5);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Select a Module</h1>
        <p className="home-subtitle">Choose your learning path and start practicing.</p>
        
        <div className="module-grid">
          <div className="module-card" onClick={() => navigate('/sql')}>
            <div className="module-icon sql-icon">SQL</div>
            <h2 className="module-name">SQL</h2>
            <p className="module-desc">Master data querying and manipulation with interactive SQL challenges.</p>
            
            <div className="module-content-preview">
              <span className="preview-title">Included Challenges</span>
              <ul className="preview-list">
                {previewChallenges.map(ch => (
                  <li key={ch.id} className="preview-item">
                    <div className="preview-dot"></div>
                    {ch.title}
                  </li>
                ))}
                <li className="preview-item" style={{ opacity: 0.6, fontSize: '11px', fontStyle: 'italic', marginTop: '4px' }}>
                  + {challenges.length - previewChallenges.length} more challenges...
                </li>
              </ul>
            </div>
            
            <button className="btn btn-primary module-btn" style={{ marginTop: '2rem', width: '100%' }}>
              Start Practicing
            </button>
          </div>
          
          <div className="module-card" onClick={() => navigate('/python')}>
            <div className="module-icon python-icon">Py</div>
            <h2 className="module-name">Python</h2>
            <p className="module-desc">Learn programming fundamentals and data analysis with Python.</p>
            
            <div className="module-content-preview">
              <span className="preview-title">Curriculum Sneak Peek</span>
              <div className="skeleton-list">
                <div className="skeleton-item" style={{ width: '85%' }}></div>
                <div className="skeleton-item" style={{ width: '70%' }}></div>
                <div className="skeleton-item" style={{ width: '90%' }}></div>
                <div className="skeleton-item" style={{ width: '65%' }}></div>
                <div className="skeleton-item" style={{ width: '40%', opacity: 0.5 }}></div>
              </div>
            </div>

            <div className="coming-soon-badge">Coming Soon</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
