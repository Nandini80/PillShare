"use client"

import { useState } from "react"
import { Star, X } from "lucide-react"

const NeedyRequests = ({ myRequests, loading, error, success, handleRateSubmit, rateDonor }) => {
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [ratingData, setRatingData] = useState({ rating: 0, comment: "" })

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
          } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
          onClick={interactive ? () => onStarClick(i) : undefined}
        />,
      )
    }
    return <div className="flex">{stars}</div>
  }

  const handleRateClick = (request) => {
    setSelectedRequest(request)
    setShowRatingModal(true)
  }

  const submitRating = async () => {
    if (ratingData.rating === 0) {
      alert("Please select a rating")
      return
    }

    try {
      await rateDonor(selectedRequest._id, ratingData.rating, ratingData.comment)
      setShowRatingModal(false)
      setRatingData({ rating: 0, comment: "" })
    } catch (error) {
      console.error("Failed to submit rating")
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Requests</h2>
        <div className="space-y-4">
          {myRequests.length > 0 ? (
            myRequests.map((request) => (
              <div key={request._id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{request.donorName}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Medicine: {request.medicineName} - {request.quantity} units
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Status:{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : request.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </p>
                    {request.donorContact && request.status === "approved" && (
                      <div className="text-sm text-gray-600 mb-2">
                        <p>Phone: {request.donorContact.phone}</p>
                        <p>Address: {request.donorContact.address}</p>
                      </div>
                    )}
                    {request.status === "pending" && (
                      <div className="text-sm text-gray-500 italic mb-2">
                        Contact information will be visible after request approval
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Requested: {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4">
                    {request.status === "completed" && !request.rating && (
                      <button
                        onClick={() => handleRateClick(request)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                      >
                        Rate Donor
                      </button>
                    )}
                    {request.rating && (
                      <div className="text-sm">
                        <p className="text-gray-600">Your Rating:</p>
                        {renderStars(request.rating)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No requests found</p>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Rate Donor</h3>
              <button
                onClick={() => {
                  setShowRatingModal(false)
                  setRatingData({ rating: 0, comment: "" })
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Rate your experience with {selectedRequest?.donorName}</p>
              <div className="flex justify-center mb-4">
                {renderStars(ratingData.rating, true, (rating) => setRatingData({ ...ratingData, rating }))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment (Optional)</label>
              <textarea
                value={ratingData.comment}
                onChange={(e) => setRatingData({ ...ratingData, comment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Share your experience..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRatingModal(false)
                  setRatingData({ rating: 0, comment: "" })
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={loading || ratingData.rating === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NeedyRequests
