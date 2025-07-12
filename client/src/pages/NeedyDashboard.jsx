"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import {
  Search,
  MapPin,
  User,
  Settings,
  Bell,
  LogOut,
  Heart,
  Pill,
  Clock,
  Phone,
  Mail,
  FileText,
  Filter,
  ChevronRight,
  Star,
  ChevronDown,
  Upload,
  X,
} from "lucide-react"
import {
  getProfile,
  updateProfile,
  searchDonors,
  changePassword,
  getRecentSearches,
  getAvailableCities,
  getAvailableMedicines,
} from "../services/needyService"
import axios from "axios"

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

  const { auth, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.token) {
      fetchProfile()
      fetchRecentSearches()
      fetchStates()
      fetchAvailableCities()
      fetchAvailableMedicines()
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
        setRecentSearches(result.data)
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
        fetchRecentSearches() // Refresh recent searches
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">PillShare</span>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{profileData.name}</span>
                <LogOut onClick={handleLogout} className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border">
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab("find")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "find" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Search className="h-5 w-5 mr-3" />
                  Find Medicine
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "profile" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "settings" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
            )}
            {success && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {activeTab === "find" && (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">Find Medicine Near You</h1>
                      <p className="text-blue-100">Connect with generous donors in your area</p>
                    </div>
                    <Heart className="h-16 w-16 text-white opacity-20" />
                  </div>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Search for Medicine</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
                      <select
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Medicine</option>
                        {availableMedicines.map((medicine, index) => (
                          <option key={index} value={medicine.name}>
                            {medicine.name} ({medicine.availableCount} available)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                      <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Region</option>
                        {availableCities.map((city, index) => (
                          <option key={index} value={city.name}>
                            {city.name} ({city.medicineCount} medicines available)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Prescription</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {prescriptionFile ? (
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-8 w-8 text-blue-500 mr-3" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-900">{prescriptionFile.name}</p>
                              <p className="text-xs text-gray-500">
                                {(prescriptionFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={removePrescriptionFile}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 mb-2">Click to upload prescription</p>
                          <p className="text-xs text-gray-400">Supports: JPEG, PNG, PDF (Max 5MB)</p>
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    {loading ? "Searching..." : "Search Donors"}
                  </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Search Results ({searchResults.length})</h2>
                      <button className="flex items-center text-blue-600 hover:text-blue-700">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </button>
                    </div>
                    <div className="space-y-4">
                      {searchResults.map((donor) => (
                        <div key={donor._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h3 className="font-semibold text-gray-900 mr-2">{donor.donorName}</h3>
                                {donor.verified && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                <Pill className="h-4 w-4 inline mr-1" />
                                {donor.medicine} - {donor.quantity} units
                              </p>
                              <p className="text-sm text-gray-600 mb-1">
                                <MapPin className="h-4 w-4 inline mr-1" />
                                {donor.address} • {donor.distance}
                              </p>
                              <p className="text-sm text-gray-600 mb-2">
                                <Clock className="h-4 w-4 inline mr-1" />
                                Expires: {donor.expiry}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                  {donor.rating}
                                </div>
                                <span>{donor.donations} donations</span>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm">
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </button>
                              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm">
                                <Mail className="h-4 w-4 mr-1" />
                                Message
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h2>
                  <div className="space-y-3">
                    {recentSearches.length > 0 ? (
                      recentSearches.map((search, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{search.medicine}</p>
                            <p className="text-sm text-gray-600">
                              {search.region} • {new Date(search.date).toLocaleDateString()}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No recent searches</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name || ""}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email || ""}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone || ""}
                      placeholder="e.g., +91 1234567890"
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <div className="relative">
                      <select
                        value={selectedState}
                        onChange={(e) => {
                          setSelectedState(e.target.value)
                          setSelectedCity("")
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                        style={{ maxHeight: "120px", overflowY: "auto" }}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <div className="relative">
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        disabled={!selectedState || loadingCities}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        style={{ maxHeight: "120px", overflowY: "auto" }}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      rows={3}
                      value={profileData.address || ""}
                      placeholder="e.g., 123 Main St, Sector 15, Faridabad"
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Change Password</h3>
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
                  <div className="border-t pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Notification Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span className="text-sm text-gray-700">Email notifications for new donations</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span className="text-sm text-gray-700">SMS notifications for urgent requests</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span className="text-sm text-gray-700">Weekly summary reports</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-xl font-bold">PillShare</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Connecting medicine donors with those in need. Making healthcare accessible for everyone, one donation
                at a time.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <span className="text-white font-semibold">f</span>
                </div>
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
                  <span className="text-white font-semibold">t</span>
                </div>
                <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors">
                  <span className="text-white font-semibold">in</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Safety Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 PillShare. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">+91 1234567890</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">support@pillshare.com</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default NeedyDashboard
