import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './components/Home.jsx'
import ComingSoon from './components/ComingSoon.jsx'
import SqlModule from './modules/SqlModule.jsx'

export default function App() {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/sql" element={<SqlModule />} />
      <Route path="/python" element={<ComingSoon moduleName="Python" />} />
    </Routes>
  )
}
