import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import GetToKnow from './pages/onBoarding/GetToKnow'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { getUser } from '@/lib/api/user'
import Dashboard from './pages/dashboard/Dashboard'
import DashboardHome from './pages/dashboard/DashboardHome'
import WorkoutPlan from './pages/dashboard/WorkoutPlan'
import Progress from './pages/dashboard/Progress'
import Profile from './pages/dashboard/Profile'
import Clients from './pages/dashboard/Clients'
import Schedule from './pages/dashboard/Schedule'
import Analytics from './pages/dashboard/Analytics'

const App = () => {
  const { setUser, setUserData, setLoading, loading } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user)
      if (user) {
        // Fetch user data from Firestore when auth state changes
        const userDoc = await getUser(user.uid)
        setUserData(userDoc)
      } else {
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [setUser, setUserData, setLoading])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<GetToKnow />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="workout-plan" element={<WorkoutPlan />} />
          <Route path="progress" element={<Progress />} />
          <Route path="profile" element={<Profile />} />
          <Route path="clients" element={<Clients />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
