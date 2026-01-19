import {BrowserRouter,Routes,Route} from "react-router-dom"
import Dashboard from './pages/Dashboard'
import Profile from './pages/ProfilePage'
import Worker from './pages/WorkerDashboard'
import './App.css'
import Home from "./pages/Home"
import NearbyHospitals from './pages/NearbyHospitals'
import NearbyTraffic from './pages/NearbyTraffic'
import NearbySchools from './pages/NearbySchools'

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
        <Route path='/nearby-schools' element={<NearbySchools />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
