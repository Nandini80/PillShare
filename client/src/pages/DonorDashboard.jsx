"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { Heart, User, Settings, Plus, Package, Bell, LogOut, Home, ChevronDown } from "lucide-react"
import {
  getProfile,
  updateProfile,
  addMedicine,
  getMedicines,
  deleteMedicine,
  deleteExpiredMedicines,
  changePassword,
  getAllRequests,
  approveDonationRequest,
  rejectDonationRequest,
  completeDonationRequest,
} from "../services/donorService"
import axios from "axios"
import DonorDashboardHome from "../components/donor/DonorDashboardHome"
import DonorRequests from "../components/donor/DonorRequests"

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [donatedMedicines, setDonatedMedicines] = useState([])
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
  })

  const [medicineForm, setMedicineForm] = useState({
    name: "",
    quantity: "",
    expiryDate: "",
    category: "",
    description: "",
  })

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Location states
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [loadingCities, setLoadingCities] = useState(false)

  // Request states
  const [allRequests, setAllRequests] = useState([])

  const { auth, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.token) {
      fetchProfile()
      fetchMedicines()
      fetchStates()
      fetchAllRequests()
    }
  }, [auth.token])

  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState)
    } else {
      setCities([])
      setSelectedCity("")
    }
  }, [selectedState])

  const isProfileComplete = () => {
    return profile.name && profile.email && profile.phone && profile.address && selectedState && selectedCity
  }

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const result = await getProfile(auth.token)
      if (result.success) {
        setProfile(result.data)
        setSelectedState(result.data.state || "")
        setSelectedCity(result.data.city || "")
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("Failed to fetch profile")
    }
    setLoading(false)
  }

  const fetchMedicines = async () => {
    try {
      const result = await getMedicines(auth.token)
      if (result.success) {
        setDonatedMedicines(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch medicines")
    }
  }

  const fetchAllRequests = async () => {
    try {
      const result = await getAllRequests(auth.token)
      if (result.success) {
        setAllRequests(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch requests")
    }
  }

  const fetchStates = async () => {
    try {
      const response = await axios.get("https://countriesnow.space/api/v0.1/countries/states")
      const indiaData = response.data.data.find((country) => country.name === "India")
      if (indiaData) {
        setStates(indiaData.states.map((state) => state.name).sort())
      }
    } catch (error) {
      console.error("Error fetching states:", error)
    }
  }

  const fetchCities = async (state) => {
    if (!state) return
    setLoadingCities(true)
    try {
      const response = await axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", {
        country: "India",
        state: state,
      })
      if (response.data.error === false) {
        setCities(response.data.data.sort())
      } else {
        setCities([])
      }
    } catch (error) {
      console.error("Error fetching cities:", error)
      setCities([])
    } finally {
      setLoadingCities(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleProfileUpdate = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const updatedProfile = {
        ...profile,
        state: selectedState,
        city: selectedCity,
      }

      const result = await updateProfile(updatedProfile, auth.token)
      if (result.success) {
        setSuccess("Profile updated successfully")
        setProfile(result.data)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("Failed to update profile")
    }
    setLoading(false)
  }

  const handleAddMedicine = async (e) => {
    e.preventDefault()

    if (!isProfileComplete()) {
      setError("Please complete your profile before donating medicine")
      setActiveTab("profile")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await addMedicine(medicineForm, auth.token)
      if (result.success) {
        setSuccess("Medicine added successfully")
        setMedicineForm({
          name: "",
          quantity: "",
          expiryDate: "",
          category: "",
          description: "",
        })
        fetchMedicines()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("Failed to add medicine")
    }
    setLoading(false)
  }

  const handleDeleteMedicine = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        const result = await deleteMedicine(id, auth.token)
        if (result.success) {
          setSuccess("Medicine deleted successfully")
          fetchMedicines()
        } else {
          setError(result.message)
        }
      } catch (error) {
        setError("Failed to delete medicine")
      }
    }
  }

  const handleDeleteExpired = async () => {
    if (window.confirm("Are you sure you want to delete all expired medicines?")) {
      try {
        const result = await deleteExpiredMedicines(auth.token)
        if (result.success) {
          setSuccess("Expired medicines deleted successfully")
          fetchMedicines()
        } else {
          setError(result.message)
        }
      } catch (error) {
        setError("Failed to delete expired medicines")
      }
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    try {
      const result = await changePassword(
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
        auth.token,
      )

      if (result.success) {
        setSuccess("Password updated successfully")
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("Failed to change password")
    }
    setLoading(false)
  }

  const handleApproveRequest = async (requestId, message) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await approveDonationRequest(requestId, message, auth.token)
      if (result.success) {
        setSuccess("Request approved successfully")
        fetchAllRequests()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("Failed to approve request")
    }
    setLoading(false)
  }

  const handleRejectRequest = async (requestId) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await rejectDonationRequest(requestId, "", auth.token)
      if (result.success) {
        setSuccess("Request rejected successfully")
        fetchAllRequests()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("Failed to reject request")
    }
    setLoading(false)
  }

  const handleCompleteRequest = async (requestId) => {
    if (window.confirm("Mark this request as completed?")) {
      setLoading(true)
      setError("")
      setSuccess("")

      try {
        const result = await completeDonationRequest(requestId, auth.token)
        if (result.success) {
          setSuccess("Request marked as completed")
          fetchAllRequests()
        } else {
          setError(result.message)
        }
      } catch (error) {
        setError("Failed to complete request")
      }
      setLoading(false)
    }
  }

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date()
  }

  const renderProfile = () => (
    <div className="space-y-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>
      )}

      {/* Profile Completion Status */}
      <div
        className={`rounded-xl p-4 border ${
          isProfileComplete() ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
        }`}
      >
        <div className="flex items-center">
          {isProfileComplete() ? (
            <>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-green-800 font-medium">Profile Complete</p>
                <p className="text-green-700 text-sm">You can now donate medicines and receive requests.</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">!</span>
              </div>
              <div>
                <p className="text-yellow-800 font-medium">Profile Incomplete</p>
                <p className="text-yellow-700 text-sm">Please fill all required fields to start donating.</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
              placeholder="Enter your email"
              required
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed after registration</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value)
                  setSelectedCity("")
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                required
                // size="4"
              >
                <option value="">Select State</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState || loadingCities}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                // size="4"
              >
                <option value="">
                  {loadingCities ? "Loading cities..." : selectedState ? "Select City" : "Select State First"}
                </option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your complete address"
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleProfileUpdate}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  )

  const renderDonate = () => (
    <div className="space-y-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>
      )}

      {/* Profile Completion Check */}
      {!isProfileComplete() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold">!</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Complete Your Profile First</h3>
              <p className="text-yellow-700 mb-4">
                Before you can donate medicines, please complete your profile with all required information including
                name, phone, address, and location.
              </p>
              <button
                onClick={() => setActiveTab("profile")}
                className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm ${!isProfileComplete() ? "opacity-50 pointer-events-none" : ""}`}
      >
        <h3 className="text-lg font-semibold mb-4">Donate Medicine</h3>
        <form onSubmit={handleAddMedicine}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
              <input
                type="text"
                value={medicineForm.name}
                onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
                placeholder="Enter medicine name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!isProfileComplete()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={medicineForm.quantity}
                onChange={(e) => setMedicineForm({ ...medicineForm, quantity: e.target.value })}
                placeholder="Enter quantity"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!isProfileComplete()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="date"
                value={medicineForm.expiryDate}
                onChange={(e) => setMedicineForm({ ...medicineForm, expiryDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!isProfileComplete()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={medicineForm.category}
                onChange={(e) => setMedicineForm({ ...medicineForm, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!isProfileComplete()}
              >
                <option value="">Select Category</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Vitamin">Vitamin</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={medicineForm.description}
                onChange={(e) => setMedicineForm({ ...medicineForm, description: e.target.value })}
                placeholder="Additional details about the medicine condition..."
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isProfileComplete()}
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading || !isProfileComplete()}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              {loading ? "Adding..." : "Add Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const renderMyDonations = () => (
    <div className="space-y-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">My Donations</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("donate")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Add New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donatedMedicines.map((medicine) => (
          <div key={medicine._id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-gray-800">{medicine.name}</h4>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  isExpired(medicine.expiryDate) ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}
              >
                {isExpired(medicine.expiryDate) ? "Expired" : "Available"}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Package className="w-4 h-4 mr-2" />
                Quantity: {medicine.quantity}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-4 h-4 mr-2">📅</span>
                Expires: {new Date(medicine.expiryDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-4 h-4 mr-2">💊</span>
                Category: {medicine.category}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{medicine.description}</p>
            <div className="flex justify-between items-center">
              <button className="text-blue-600 hover:text-blue-800 transition-colors">
                <span className="text-sm">Edit</span>
              </button>
              <button
                onClick={() => handleDeleteMedicine(medicine._id)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <span className="text-sm">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>
      )}

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  )

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "profile", label: "Profile", icon: User },
    { id: "donate", label: "Donate", icon: Plus },
    { id: "donations", label: "My Donations", icon: Package },
    { id: "requests", label: "All Requests", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  if (loading && !profile.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
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

            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{profile.name}</span>
              </div>
              <LogOut onClick={handleLogout} className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                      activeTab === item.id ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "dashboard" && (
              <DonorDashboardHome
                profile={profile}
                donatedMedicines={donatedMedicines}
                isProfileComplete={isProfileComplete}
                setActiveTab={setActiveTab}
                handleDeleteExpired={handleDeleteExpired}
                allRequests={allRequests}
                fetchAllRequests={fetchAllRequests}
              />
            )}
            {activeTab === "profile" && renderProfile()}
            {activeTab === "donate" && renderDonate()}
            {activeTab === "donations" && renderMyDonations()}
            {activeTab === "requests" && (
              <DonorRequests
                allRequests={allRequests}
                loading={loading}
                error={error}
                success={success}
                handleApproveRequest={handleApproveRequest}
                handleRejectRequest={handleRejectRequest}
                handleCompleteRequest={handleCompleteRequest}
              />
            )}
            {activeTab === "settings" && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonorDashboard
