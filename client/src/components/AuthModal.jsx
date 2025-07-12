"use client"

import { X } from "lucide-react"

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
  <div className="fixed inset-0 bg-gradient-to-br from-blue-100 via-white to-purple-100 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
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

export default AuthModal
