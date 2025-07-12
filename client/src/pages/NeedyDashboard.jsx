"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { Search, User, Settings, Bell, LogOut, Heart, ChevronDown, AlertCircle } from "lucide-react"
import {
  getProfile,
  updateProfile,
  searchDonors,
  changePassword,
  getRecentSearches,
  getAvailableCities,
  getAvailableMedicines,
  createDonationRequest,
  getMyRequests,
  rateDonor,
} from "../services/needyService"
import axios from "axios"
import Footer from "../components/Footer"
import NeedyFindMedicine from "../components/needy/NeedyFindMedicine"
import NeedyRequests from "../components/needy/NeedyRequests"

const NeedyDashboard = () => {
  const [activeTab, setActiveTab] = useState("find")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
  })

  const [searchResults, setSearchResults] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [prescriptionFile, setPrescriptionFile] = useState(null)

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [loadingCities, setLoadingCities] = useState(false)
  const [availableCities, setAvailableCities] = useState([])
  const [availableMedicines, setAvailableMedicines] = useState([])

  const [myRequests, setMyRequests] = useState([])

  const { auth, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.token) {
      fetchProfile()
      fetchRecentSearches()
      fetchStates()
      fetchAvailableCities()
      fetchAvailableMedicines()
      fetchMyRequests()
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

  // Profile completeness check function
  const isProfileComplete = () => {
    return (
      profileData.name && profileData.email && profileData.phone && profileData.address && selectedState && selectedCity
    )
  }

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const result = await getProfile(auth.token)
      if (result.success) {
        setProfileData(result.data)
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

  const fetchRecentSearches = async () => {
  try {
    const result = await getRecentSearches(auth.token)
    if (result.success) {
      const limitedSearches = result.data.slice(0,3)
      setRecentSearches(limitedSearches)
    }
  } catch (error) {
    console.error("Failed to fetch recent searches")
  }
}

  const fetchAvailableCities = async () => {
    try {
      const result = await getAvailableCities(auth.token)
      if (result.success) {
        setAvailableCities(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch available cities")
    }
  }

  const fetchAvailableMedicines = async () => {
    try {
      const result = await getAvailableMedicines(auth.token)
      if (result.success) {
        setAvailableMedicines(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch available medicines")
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB")
        return
      }
      // Check file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
      if (!allowedTypes.includes(file.type)) {
        setError("Only images (JPEG, PNG) and PDF files are allowed")
        return
      }
      setPrescriptionFile(file)
      setError("")
    }
  }

  const removePrescriptionFile = () => {
    setPrescriptionFile(null)
  }

  const handleSearch = async () => {
    if (!searchQuery || !selectedRegion) {
      setError("Please enter medicine name and select region")
      return
    }

    setLoading(true)
    setError("")

    try {
      const result = await searchDonors(searchQuery, selectedRegion, prescriptionFile, auth.token)
      if (result.success) {
        setSearchResults(result.data)
        fetchRecentSearches()
        setSuccess(`Found ${result.data.length} donors`)
      } else {
        setError(result.message)
        setSearchResults([])
      }
    } catch (error) {
      setError("Failed to search donors")
      setSearchResults([])
    }
    setLoading(false)
  }

  const handleProfileUpdate = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const updatedProfile = {
        ...profileData,
        state: selectedState,
        city: selectedCity,
      }

      const result = await updateProfile(updatedProfile, auth.token)
      if (result.success) {
        setSuccess("Profile updated successfully")
        setProfileData(result.data)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("Failed to update profile")
    }
    setLoading(false)
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const result = await changePassword(
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        auth.token,
      )

      if (result.success) {
        setSuccess("Password updated successfully")
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("Failed to change password")
    }
    setLoading(false)
  }

  const fetchMyRequests = async () => {
    try {
      const result = await getMyRequests(auth.token)
      if (result.success) {
        setMyRequests(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch requests")
    }
  }

  const handleCreateRequest = async (donorId, medicineId) => {
    setLoading(true)
    setError("")

    try {
      const result = await createDonationRequest(donorId, medicineId, "", auth.token)
      if (result.success) {
        setSuccess("Request sent successfully!")
        fetchMyRequests()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("Failed to send request")
    }
    setLoading(false)
  }

  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>

      {/* Profile Completion Status */}
      <div
        className={`rounded-xl p-4 border mb-6 ${isProfileComplete() ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}
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
                <p className="text-green-700 text-sm">You can now search for medicines and make requests.</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-yellow-800 font-medium">Profile Incomplete</p>
                <p className="text-yellow-700 text-sm">
                  Please fill all required fields to start requesting medicines.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profileData.name || ""}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            value={profileData.email || ""}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={profileData.phone || ""}
            placeholder="e.g., +91 1234567890"
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              required
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
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
            rows={3}
            value={profileData.address || ""}
            placeholder="Enter your complete address"
            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={handleProfileUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
      <form onSubmit={handlePasswordChange}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  )

  const menuItems = [
    { id: "find", label: "Find Medicine", icon: Search },
    { id: "requests", label: "My Requests", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  if (loading && !profileData.name) {
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
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-red-500 mr-2" />
                <span className="text-xl font-bold text-gray-900">PillShare</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{profileData.name}</span>
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
                      activeTab === item.id ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
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
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                {success}
              </div>
            )}

            {activeTab === "find" && (
              <NeedyFindMedicine
                isProfileComplete={isProfileComplete}
                setActiveTab={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                prescriptionFile={prescriptionFile}
                setPrescriptionFile={setPrescriptionFile}
                availableMedicines={availableMedicines}
                availableCities={availableCities}
                searchResults={searchResults}
                recentSearches={recentSearches}
                loading={loading}
                error={error}
                success={success}
                handleSearch={handleSearch}
                handleCreateRequest={handleCreateRequest}
                handleFileUpload={handleFileUpload}
                removePrescriptionFile={removePrescriptionFile}
              />
            )}
            {activeTab === "requests" && (
              <NeedyRequests
                myRequests={myRequests}
                loading={loading}
                error={error}
                success={success}
                rateDonor={rateDonor}
              />
            )}
            {activeTab === "profile" && renderProfile()}
            {activeTab === "settings" && renderSettings()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default NeedyDashboard
