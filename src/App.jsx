import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Dashboard from './pages/Dashboard'
import Profile from './pages/ProfilePage'
import Worker from './pages/WorkerDashboard'
import './App.css'
import Home from "./pages/Home"
import NearbyHospitals from './pages/NearbyHospitals'
import NearbyTraffic from './pages/NearbyTraffic'

function App() {
  return(
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/worker/dashboard' element={<Worker />} />
        <Route path='/nearby-hospitals' element={<NearbyHospitals />} />
        <Route path='/nearby-traffic' element={<NearbyTraffic />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
