import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Dashboard from './pages/Dashboard'
import ProfileSetup from './pages/ProfileSetup'
import Profile from './pages/ProfilePage'
import Worker from './pages/WorkerDashboard'
import './App.css'
import Home from "./pages/Home"

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/worker/dashboard' element={<Worker />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
