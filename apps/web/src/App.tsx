import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import GetToKnow from './pages/onboarding/GetToKnow'
import Dashboard from './pages/dashboard/Dashboard'
import DashboardHome from './pages/trainee/DashboardHome'
import WorkoutPlan from './pages/trainee/WorkoutPlan'
import Progress from './pages/trainee/Progress'
import Profile from './pages/trainee/Profile'
import Clients from './pages/trainer/Clients'
import Schedule from './pages/trainer/Schedule'
import Analytics from './pages/trainer/Analytics'
import TrainerDashboard from './pages/trainer/TrainerDashboard'
import TrainerProfile from './pages/trainer/TrainerProfile'

import { useAuthStore } from '@/lib/store/useAuthStore'
import { getFullUser } from '@/lib/api/user'

const App = () => {
  const { setUser, setUserData, setLoading, loading } = useAuthStore()

  // It watches for changes to the user's login status like when they sign in or sign out.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user)
      if (user) {
        // Fetch user data from Firestore when auth state changes
        const userDoc = await getFullUser(user.uid)
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
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/onboarding" element={<GetToKnow />} />

        <Route path="/dashboard/trainee" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="workout-plan" element={<WorkoutPlan />} />
          <Route path="progress" element={<Progress />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/dashboard/trainer" element={<Dashboard />}>
          <Route index element={<TrainerDashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<TrainerProfile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
