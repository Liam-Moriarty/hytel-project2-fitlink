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
import ProtectedRoute from './components/ProtectedRoute'

import { useAuthStore } from '@/lib/store/useAuthStore'
import { getFullUser, userKeys } from '@/lib/api/user'
import { queryClient } from '@/lib/queryClient'
import DietaryPlan from './pages/trainee/DietaryPlan'

// Redirects authenticated users away from auth pages to their dashboard
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, userData } = useAuthStore()

  if (isAuthenticated && userData?.role) {
    return <Navigate to={`/dashboard/${userData.role}`} replace />
  }

  return <>{children}</>
}

// Requires authentication but no specific role (for onboarding)
const AuthOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

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
        // Pre-populate TanStack Query cache so dashboard pages render instantly
        queryClient.setQueryData(userKeys.detail(user.uid), userDoc)
      } else {
        setUserData(null)
        // Clear user cache on logout
        queryClient.removeQueries({ queryKey: userKeys.all })
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
        {/* Public routes - redirect to dashboard if already logged in */}
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Onboarding - requires auth but no role yet */}
        <Route
          path="/onboarding"
          element={
            <AuthOnlyRoute>
              <GetToKnow />
            </AuthOnlyRoute>
          }
        />

        {/* Trainee routes - requires auth + trainee role */}
        <Route element={<ProtectedRoute allowedRole="trainee" />}>
          <Route path="/dashboard/trainee" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="workout-plan" element={<WorkoutPlan />} />
            <Route path="dietary-plan" element={<DietaryPlan />} />
            <Route path="progress" element={<Progress />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Trainer routes - requires auth + trainer role */}
        <Route element={<ProtectedRoute allowedRole="trainer" />}>
          <Route path="/dashboard/trainer" element={<Dashboard />}>
            <Route index element={<TrainerDashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<TrainerProfile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
