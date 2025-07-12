"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { loginUser, registerUser } from "../services/authService"
import { useNavigate } from "react-router-dom"
import { Heart, Users, MapPin, Shield, Clock, CheckCircle, Menu, X } from "lucide-react"
import Footer from "../components/Footer"
import AuthModal from "../components/AuthModal"

const PillShareLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState("login") // 'login' or 'register'
  const [userType, setUserType] = useState("donor") // 'donor' or 'needy'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { auth, login } = useContext(AuthContext)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  useEffect(() => {
    if (auth.token && auth.role) {
      navigate(auth.role === "donor" ? "/donor-dashboard" : "/needy-dashboard")
    }
  }, [auth, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("") // Clear error when user types
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (authMode === "register") {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords don't match")
          setLoading(false)
          return
        }

        const data = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: userType,
        })

        if (data.token) {
          // Use the context's login method instead of manual localStorage
          login(data.token, data.role, data.user)
          setShowAuthModal(false)
          // Reset form
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          })
          // Navigation will happen automatically due to useEffect
        } else {
          setError(data.message || "Registration failed")
        }
      } else {
        const data = await loginUser({
          email: formData.email,
          password: formData.password,
        })

        if (data.token) {
          // Use the context's login method
          login(data.token, data.role, data.user)
          setShowAuthModal(false)
          // Reset form
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          })
          // Navigation will happen automatically due to useEffect
        } else {
          setError(data.message || "Login failed")
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      console.error("Auth error:", error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Heart className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PillShare
                </span>
              </div>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#home" className="text-gray-700 hover:text-blue-600 px-3 py-2 transition-colors">
                  Home
                </a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 px-3 py-2 transition-colors">
                  About
                </a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 px-3 py-2 transition-colors">
                  How It Works
                </a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 transition-colors">
                  Contact
                </a>
              </div>
            </div>
            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => {
                  setAuthMode("login")
                  setShowAuthModal(true)
                }}
                className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuthMode("register")
                  setShowAuthModal(true)
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Register
              </button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Home
              </a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                About
              </a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                How It Works
              </a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Contact
              </a>
              <div className="flex flex-col space-y-2 px-3 py-2">
                <button
                  onClick={() => {
                    setAuthMode("login")
                    setShowAuthModal(true)
                    setIsMenuOpen(false)
                  }}
                  className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthMode("register")
                    setShowAuthModal(true)
                    setIsMenuOpen(false)
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Share Medicine,
              </span>
              <br />
              <span className="text-gray-800">Save Lives</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect medicine donors with those in need. A platform that brings communities together to ensure no one
              goes without essential medication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setAuthMode("register")
                  setUserType("donor")
                  setShowAuthModal(true)
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Donate Medicine
              </button>
              <button
                onClick={() => {
                  setAuthMode("register")
                  setUserType("needy")
                  setShowAuthModal(true)
                }}
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg"
              >
                Find Medicine
              </button>
            </div>
          </div>
        </div>
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About PillShare</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              PillShare is a revolutionary platform that bridges the gap between medicine surplus and shortage, creating
              a community-driven solution for healthcare accessibility.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To ensure that no one goes without essential medication by connecting generous donors with those in need
                within local communities.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300">
              <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community First</h3>
              <p className="text-gray-600">
                We believe in the power of community support. Every donation and request is handled with care, dignity,
                and respect.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300">
              <Shield className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                All transactions are verified and secure. We ensure prescription validation and proper medicine handling
                protocols.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How PillShare Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and effective. Connect with your community in just a few steps.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            {/* For Donors */}
            <div>
              <h3 className="text-2xl font-bold text-blue-600 mb-8 text-center">For Donors</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Register & Create Profile</h4>
                    <p className="text-gray-600">
                      Sign up as a donor and complete your profile with contact details and location.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">List Your Medicines</h4>
                    <p className="text-gray-600">
                      Add details about medicines you want to donate including expiry dates and quantities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Connect & Help</h4>
                    <p className="text-gray-600">
                      Get connected with people in need and arrange safe medicine transfers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* For Needy */}
            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-8 text-center">For Those in Need</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Register & Verify</h4>
                    <p className="text-gray-600">Create your account and provide necessary details for verification.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Search for Medicine</h4>
                    <p className="text-gray-600">
                      Enter your location and required medicine with doctor's prescription.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Get Connected</h4>
                    <p className="text-gray-600">
                      View nearby donors and connect with them to arrange medicine collection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose PillShare?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Location-Based</h3>
              <p className="text-gray-600">
                Find donors and recipients in your immediate area for quick and easy medicine transfers.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <Clock className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expiry Management</h3>
              <p className="text-gray-600">
                Automatic alerts for expiring medicines to ensure only safe medications are shared.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
              <CheckCircle className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Prescription Verified</h3>
              <p className="text-gray-600">
                All medicine requests are verified with proper medical prescriptions for safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who are already making healthcare more accessible in their communities.
          </p>
          <button
            onClick={() => {
              setAuthMode("register")
              setShowAuthModal(true)
            }}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Use shared Footer */}
      <Footer />

      {/* Auth Modal with blurred background */}
      {showAuthModal && (
        <AuthModal
          authMode={authMode}
          setAuthMode={setAuthMode}
          userType={userType}
          setUserType={setUserType}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setShowAuthModal={setShowAuthModal}
          loading={loading}
          error={error}
        />
      )}
    </div>
  )
}

export default PillShareLanding
