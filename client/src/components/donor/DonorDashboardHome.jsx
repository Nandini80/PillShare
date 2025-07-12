import { useState, useEffect } from "react"
import { Heart, Package, Pill, AlertTriangle, Bell, X } from "lucide-react"

const DonorDashboardHome = ({
  profile,
  donatedMedicines,
  isProfileComplete,
  setActiveTab,
  handleDeleteExpired,
  allRequests,
}) => {
  const [showRequestAlert, setShowRequestAlert] = useState(false)
  const [pendingRequests, setPendingRequests] = useState([])

  useEffect(() => {
    const pending = allRequests.filter((request) => request.status === "pending")
    setPendingRequests(pending)
    if (pending.length > 0) {
      setShowRequestAlert(true)
    }
  }, [allRequests])

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date()
  }

  const expiredMedicines = donatedMedicines.filter((medicine) => isExpired(medicine.expiryDate))

  return (
    <div className="space-y-6">
      {/* New Request Alert */}
      {showRequestAlert && pendingRequests.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <p className="text-blue-800 font-medium">
                  New Request{pendingRequests.length > 1 ? "s" : ""} Received!
                </p>
                <p className="text-blue-700 text-sm">
                  You have {pendingRequests.length} pending request{pendingRequests.length > 1 ? "s" : ""} waiting for
                  your response.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab("requests")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                View Requests
              </button>
              <button onClick={() => setShowRequestAlert(false)} className="text-blue-500 hover:text-blue-700">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Completion Alert */}
      {!isProfileComplete() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            <div className="flex-1">
              <p className="text-yellow-800 font-medium">Complete Your Profile</p>
              <p className="text-yellow-700 text-sm">
                Please complete your profile to start donating medicines and receive requests.
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
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, {profile.name}!</h2>
            <p className="text-gray-600 mt-1">Thank you for making a difference in people's lives</p>
          </div>
          <div className="hidden md:block">
            <Heart className="w-16 h-16 text-red-400" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-blue-600">{donatedMedicines.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Medicines</p>
              <p className="text-2xl font-bold text-green-600">
                {donatedMedicines.filter((m) => !isExpired(m.expiryDate)).length}
              </p>
            </div>
            <Pill className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-orange-600">{pendingRequests.length}</p>
            </div>
            <Bell className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Expired Medicine Alert */}
      {expiredMedicines.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-800">
                You have {expiredMedicines.length} expired medicine(s) that should be removed
              </p>
            </div>
            <button
              onClick={handleDeleteExpired}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Remove All Expired
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {donatedMedicines.slice(0, 3).map((medicine) => (
            <div key={medicine._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Pill className="w-4 h-4 text-blue-500 mr-3" />
                <div>
                  <p className="font-medium">{medicine.name}</p>
                  <p className="text-sm text-gray-600">Added on {new Date(medicine.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  isExpired(medicine.expiryDate) ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}
              >
                {isExpired(medicine.expiryDate) ? "Expired" : "Available"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DonorDashboardHome
