import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home.jsx'
import ComingSoon from './components/ComingSoon.jsx'
import SqlModule from './modules/SqlModule.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sql" element={<SqlModule />} />
      <Route path="/python" element={<ComingSoon moduleName="Python" />} />
    </Routes>
  )
}
