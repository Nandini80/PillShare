import { createContext, useState, useEffect } from "react"
export const AuthContext = createContext()
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    user: null,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    const user = localStorage.getItem("user")

    if (token && role) {
      setAuth({
        token,
        role,
        user: user ? JSON.parse(user) : null,
      })
    }
    setLoading(false)
  }, [])

  const login = (token, role, user) => {
    localStorage.setItem("token", token)
    localStorage.setItem("role", role)
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    }
    setAuth({ token, role, user })
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("user")
    setAuth({
      token: null,
      role: null,
      user: null,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ auth, setAuth, login, logout }}>{children}</AuthContext.Provider>
}
