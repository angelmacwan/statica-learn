import React from 'react';
import { Link } from 'react-router-dom';

const ComingSoon = ({ moduleName }) => {
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <div className="coming-soon-icon">🚀</div>
        <h1>{moduleName} Module</h1>
        <p>We're currently building this module. Check back soon for interactive challenges!</p>
        <Link to="/" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
