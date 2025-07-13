import { Search, MapPin, Heart, Pill, Clock, Star, Upload, X, FileText, AlertCircle, ChevronRight } from "lucide-react"

const NeedyFindMedicine = ({
  isProfileComplete,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedRegion,
  prescriptionFile,
  availableMedicines,
  availableCities,
  searchResults,
  recentSearches,
  loading,
  handleSearch,
  handleCreateRequest,
  handleFileUpload,
  removePrescriptionFile,
  myRequests = [],
}) => {
  const groupedMedicines = availableMedicines.reduce((acc, medicine) => {
    const normalizedName = medicine.name.toLowerCase().trim()
    if (acc[normalizedName]) {
      acc[normalizedName].donorCount += 1
    } else {
      acc[normalizedName] = {
        name: medicine.name,
        normalizedName,
        donorCount: 1,
      }
    }
    return acc
  }, {})

  const uniqueMedicines = Object.values(groupedMedicines)

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} className={`h-4 w-4 ${i <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />,
      )
    }
    return <div className="flex">{stars}</div>
  }

  const handleSearchClick = () => {
    if (!isProfileComplete()) {
      return
    }
    if (!prescriptionFile) {
      alert("Please upload a prescription before searching for medicines")
      return
    }
    handleSearch()
  }

  const handleRequestClick = (donorId, medicineId) => {
    if (!prescriptionFile) {
      alert("Please upload a prescription before making a request")
      return
    }
    handleCreateRequest(donorId, medicineId)
  }

  // Check if user has already requested this medicine from this donor
  const hasRequestedMedicine = (donorId, medicineId) => {
    return myRequests.some(
      (request) => request.donorId === donorId && request.medicineId === medicineId && request.status !== "rejected",
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Completion Alert */}
      {!isProfileComplete() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
            <div className="flex-1">
              <p className="text-yellow-800 font-medium">Complete Your Profile</p>
              <p className="text-yellow-700 text-sm">
                Please complete your profile to search for medicines and make requests.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("profile")}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
            >
              Complete Profile
            </button>
          </div>
        </div>
      )}

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
      <div
        className={`bg-white rounded-lg shadow-sm border p-6 ${!isProfileComplete() ? "opacity-50 pointer-events-none" : ""}`}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search for Medicine</h2>
        {!isProfileComplete() && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
              <p className="text-yellow-800 text-sm">
                Complete your profile first to search for medicines and make requests.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
            <select
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!isProfileComplete()}
            >
              <option value="">Select Medicine</option>
              {uniqueMedicines.slice(0, 10).map((medicine, index) => (
                <option key={index} value={medicine.name}>
                  {medicine.name} (from {medicine.donorCount} donor{medicine.donorCount > 1 ? "s" : ""})
                </option>
              ))}
            </select>
            {uniqueMedicines.length > 10 && (
              <p className="text-xs text-gray-500 mt-1">Showing top 10 medicines. Type to search for more.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!isProfileComplete()}
            >
              <option value="">Select Region</option>
              {availableCities.slice(0, 10).map((city, index) => (
                <option key={index} value={city.name}>
                  {city.name} ({city.medicineCount} medicines available)
                </option>
              ))}
            </select>
            {availableCities.length > 10 && (
              <p className="text-xs text-gray-500 mt-1">Showing top 10 cities. More available.</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Prescription <span className="text-red-500">*</span>
          </label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {prescriptionFile ? (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-500 mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{prescriptionFile.name}</p>
                    <p className="text-xs text-gray-500">{(prescriptionFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removePrescriptionFile}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  disabled={!isProfileComplete()}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <label className={`cursor-pointer block ${!isProfileComplete() ? "cursor-not-allowed" : ""}`}>
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Click to upload prescription</p>
                  <p className="text-xs text-gray-400">Supports: JPEG, PNG, PDF (Max 5MB)</p>
                  <p className="text-xs text-red-500 mt-1">Required for medicine requests</p>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={!isProfileComplete()}
                />
              </label>
            )}
          </div>
        </div>

        <button
          onClick={handleSearchClick}
          disabled={loading || !isProfileComplete() || !prescriptionFile}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
          <div className="space-y-4">
            {searchResults.map((donor) => {
              const hasRequested = hasRequestedMedicine(donor.donorId, donor._id)
              return (
                <div key={donor._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-gray-900 mr-2">{donor.donorName}</h3>
                        {donor.verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <Pill className="h-4 w-4 inline mr-1" />
                        {donor.medicine} - {donor.quantity} units available
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {donor.address}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Expires: {donor.expiry}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          {renderStars(Math.round(donor.rating))}
                          <span className="ml-1">
                            {donor.rating} ({donor.totalRatings} reviews)
                          </span>
                        </div>
                        <span>{donor.donations} donations</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      {hasRequested ? (
                        <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm">Request Sent</span>
                      ) : (
                        <button
                          onClick={() => handleRequestClick(donor.donorId, donor._id)}
                          disabled={loading || !prescriptionFile}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Medicine Statistics */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Medicines Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniqueMedicines.slice(0, 6).map((medicine, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{medicine.name}</h3>
                <Pill className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-xs text-gray-500">
                From {medicine.donorCount} donor{medicine.donorCount > 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
        {uniqueMedicines.length > 6 && (
          <p className="text-center text-sm text-gray-500 mt-4">
            And {uniqueMedicines.length - 6} more medicines available...
          </p>
        )}
      </div>

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
            <div className="text-gray-500 text-center py-4">No recent searches</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NeedyFindMedicine
