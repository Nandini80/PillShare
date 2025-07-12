"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth } = useContext(AuthContext)

  // If no token, redirect to landing page
  if (!auth.token) {
    return <Navigate to="/" replace />
  }

  // If role doesn't match, redirect to appropriate dashboard or landing page
  if (requiredRole && auth.role !== requiredRole) {
    if (auth.role === "donor") {
      return <Navigate to="/donor-dashboard" replace />
    } else if (auth.role === "needy") {
      return <Navigate to="/needy-dashboard" replace />
    } else {
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default ProtectedRoute
