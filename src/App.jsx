import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './components/Home.jsx'
import ComingSoon from './components/ComingSoon.jsx'
import SqlModule from './modules/SqlModule.jsx'

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 1.05, y: -20 }}
    transition={{ 
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 1.2
    }}
    style={{ height: '100%', width: '100%' }}
  >
    {children}
  </motion.div>
)

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          } 
        />
        <Route 
          path="/sql" 
          element={
            <PageWrapper>
              <SqlModule />
            </PageWrapper>
          } 
        />
        <Route 
          path="/python" 
          element={
            <PageWrapper>
              <ComingSoon moduleName="Python" />
            </PageWrapper>
          } 
        />
      </Routes>
    </AnimatePresence>
  )
}
