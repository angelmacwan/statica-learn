import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import challenges from '../data/challenges.json';
import pythonChallenges from '../data/python-challenges.json';

const Home = () => {
  const navigate = useNavigate();
  
  // Get first 5 challenges for preview
  const previewChallenges = challenges.slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 22
      }
    }
  };

  return (
    <div className="home-container">
      <motion.div 
        className="home-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="home-title"
          variants={cardVariants}
        >
          Select a Module
        </motion.h1>
        <motion.p 
          className="home-subtitle"
          variants={cardVariants}
        >
          Choose your learning path and start practicing.
        </motion.p>
        
        <div className="module-grid">
          <motion.div 
            className="module-card" 
            variants={cardVariants}
            onClick={() => navigate('/sql')}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              borderColor: 'var(--color-blue)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
            whileTap={{ scale: 0.95 }}
          >
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
          </motion.div>
          
          <motion.div 
            className="module-card" 
            variants={cardVariants}
            onClick={() => navigate('/python')}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              borderColor: 'var(--color-teal)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="module-icon python-icon">Py</div>
            <h2 className="module-name">Python</h2>
            <p className="module-desc">Learn programming fundamentals and data analysis with Python.</p>
            
            <div className="module-content-preview">
              <span className="preview-title">Included Challenges</span>
              <ul className="preview-list">
                {pythonChallenges.slice(0, 5).map(ch => (
                  <li key={ch.id} className="preview-item">
                    <div className="preview-dot"></div>
                    {ch.title}
                  </li>
                ))}
              </ul>
            </div>

            <button className="btn btn-primary module-btn" style={{ marginTop: '2rem', width: '100%' }}>
              Start Practicing
            </button>
          </motion.div>
        </div>
      </motion.div>
      <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '12px', color: 'var(--text-placeholder)', paddingBottom: '1rem' }}>
        This is a product of <a href="https://staticalabs.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>StaticaLabs</a> (staticalabs.com)
      </footer>
    </div>
  );
};

export default Home;
