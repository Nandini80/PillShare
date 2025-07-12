import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import LandingPage from "./pages/LandingPage"
import DonorDashboard from "./pages/DonorDashboard"
import NeedyDashboard from "./pages/NeedyDashboard"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/donor-dashboard"
            element={
              <ProtectedRoute requiredRole="donor">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/needy-dashboard"
            element={
              <ProtectedRoute requiredRole="needy">
                <NeedyDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
