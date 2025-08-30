import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App.jsx'
import Dashboard from '../components/Dashboard/Dashboard.jsx'
import DemoPage from '../components/DemoPage.jsx'
import MidjourneyShowcase from '../components/MidjourneyShowcase.jsx'
import AuthContainer from '../components/Auth/AuthContainer.jsx'

// Protected Route Component
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Public Route Component (redirects if already logged in)
const PublicRoute = ({ children, user }) => {
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute user={null}>
        <AuthContainer />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute user={null}>
        <AuthContainer />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute user={null}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/demo',
    element: <DemoPage />,
  },
  {
    path: '/midjourney',
    element: <MidjourneyShowcase />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
