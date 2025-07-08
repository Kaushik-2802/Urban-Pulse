import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Dashboard from './pages/Dashboard'
import ProfileSetup from './pages/ProfileSetup'
import './App.css'
import Home from "./pages/Home"

function App() {
  const profileCompleted = localStorage.getItem('profileCompleted');
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        if(profileCompleted==='true'){
        <Route path="/dashboard" element={<Dashboard />} />
        }else{
        <Route path="/profile-setup" element={<ProfileSetup />} />
        }
      </Routes>
    </BrowserRouter>
  )
}

export default App
