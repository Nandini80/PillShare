"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { loginUser, registerUser } from "../services/authService"
import { useNavigate } from "react-router-dom"
import { Heart, Users, MapPin, Shield, Clock, CheckCircle, Menu, X, Phone, Mail } from "lucide-react"

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
  const { auth, login } = useContext(AuthContext) // Use the context properly

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Check if user is already authenticated and redirect
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

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-2xl font-bold">PillShare</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Connecting communities through medicine sharing. Making healthcare accessible to everyone, one donation
                at a time.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-gray-400">support@pillshare.com</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-gray-400">123 Health Street, Medical City</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 PillShare. All rights reserved. Made with ❤️ for a healthier community.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
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

const AuthModal = ({
  authMode,
  setAuthMode,
  userType,
  setUserType,
  formData,
  handleChange,
  handleSubmit,
  setShowAuthModal,
  loading,
  error,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{authMode === "login" ? "Login" : "Register"}</h2>
        <button
          onClick={() => {
            setShowAuthModal(false)
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {authMode === "register" && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Register as:</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setUserType("donor")}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                userType === "donor"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              Donor
            </button>
            <button
              onClick={() => setUserType("needy")}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                userType === "needy"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              Needy
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {authMode === "register" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {authMode === "register" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : authMode === "login" ? "Login" : "Register"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-600">
          {authMode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
            className="text-blue-600 hover:text-blue-800 font-semibold ml-1"
          >
            {authMode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  </div>
)