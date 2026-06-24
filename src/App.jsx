import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './components/Home.jsx'
import SqlModule from './modules/SqlModule.jsx'
import PythonModule from './modules/PythonModule.jsx'
import RobotGardenerGameModule from './modules/RobotGardenerGameModule.jsx'
import MazeSolverModule from './modules/MazeSolverModule.jsx'

export default function App() {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/sql" element={<SqlModule />} />
      <Route path="/python" element={<PythonModule />} />
      <Route path="/robot-gardener-game" element={<RobotGardenerGameModule />} />
      <Route path="/maze-solver" element={<MazeSolverModule />} />
    </Routes>
  )
}
