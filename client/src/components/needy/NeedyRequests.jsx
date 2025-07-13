"use client"

import { useState } from "react"
import { Bell, Pill, MapPin, Calendar, Star, Phone, Mail, MessageCircle, X } from "lucide-react"

const NeedyRequests = ({ myRequests, loading, error, success, rateDonor }) => {
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submittingRating, setSubmittingRating] = useState(false)

  const findDonorDetails = (currentRequest) => {
    if (currentRequest.donorDetails) {
      return currentRequest.donorDetails
    }

    if (currentRequest.donorContact) {
      return currentRequest.donorContact
    }

    if (currentRequest.donor) {
      return currentRequest.donor
    }

    const matchingRequest = myRequests.find(
      (request) =>
        request.donorName === currentRequest.donorName &&
        request._id !== currentRequest._id &&
        (request.donorDetails || request.donorContact || request.donor),
    )

    if (matchingRequest) {
      return matchingRequest.donorDetails || matchingRequest.donorContact || matchingRequest.donor
    }
    return null
  }

  const renderStars = (currentRating, interactive = false, onStarClick = null) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${
            i <= currentRating ? "text-yellow-400 fill-current" : "text-gray-300"
          } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
          onClick={interactive && onStarClick ? () => onStarClick(i) : undefined}
        />,
      )
    }
    return <div className="flex">{stars}</div>
  }

  const handleRateClick = (request) => {
    setSelectedRequest(request)
    setRating(0)
    setComment("")
    setShowRatingModal(true)
  }

  const handleSubmitRating = async () => {
    if (rating === 0) {
      alert("Please select a rating")
      return
    }

    setSubmittingRating(true)
    try {
      const result = await rateDonor(selectedRequest._id, rating, comment, localStorage.getItem("token"))
      if (result.success) {
        setShowRatingModal(false)
        setSelectedRequest(null)
        setRating(0)
        setComment("")
        // Refresh the page or update the requests list
        window.location.reload()
      } else {
        alert(result.message || "Failed to submit rating")
      }
    } catch (error) {
      alert("Failed to submit rating")
    }
    setSubmittingRating(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">My Requests</h3>
        <div className="flex space-x-2">
          <span className="text-sm text-gray-600">Total: {myRequests.length}</span>
        </div>
      </div>

      <div className="space-y-4">
        {myRequests.length > 0 ? (
          myRequests.map((request) => {
            // Find donor details for this request
            const donorDetails = findDonorDetails(request)

            return (
              <div key={request._id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold text-gray-800 mr-2">{request.donorName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Pill className="w-4 h-4 mr-2" />
                        Medicine: {request.medicineName} - {request.quantity} units
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Requested: {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        Location: {donorDetails?.address || "Address not available"}
                      </div>
                    </div>

                    {/* Show contact details only for approved requests */}
                    {request.status === "approved" && donorDetails && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-green-800 mb-2">Donor Contact Details</h5>
                        <div className="space-y-2">
                          {donorDetails.address && (
                            <div className="flex items-center text-sm text-green-700">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{donorDetails.address}</span>
                            </div>
                          )}
                          {donorDetails.phone && (
                            <div className="flex items-center text-sm text-green-700">
                              <Phone className="w-4 h-4 mr-2" />
                              <a href={`tel:${donorDetails.phone}`} className="hover:underline">
                                {donorDetails.phone}
                              </a>
                            </div>
                          )}
                          {donorDetails.email && (
                            <div className="flex items-center text-sm text-green-700">
                              <Mail className="w-4 h-4 mr-2" />
                              <a href={`mailto:${donorDetails.email}`} className="hover:underline">
                                {donorDetails.email}
                              </a>
                            </div>
                          )}
                          {!donorDetails.phone && !donorDetails.email && !donorDetails.address && (
                            <p className="text-sm text-green-700">Contact information will be shared by the donor.</p>
                          )}
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                          Please contact the donor to arrange medicine pickup.
                        </p>
                      </div>
                    )}

                    {/* Show message if approved but no contact details available */}
                    {request.status === "approved" && !donorDetails && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-yellow-700">
                          Contact details are being processed. The donor will share their contact information soon.
                        </p>
                      </div>
                    )}

                    {/* Show donor message if available */}
                    {request.message && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-start">
                          <MessageCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">Message from donor:</p>
                            <p className="text-sm text-blue-700">{request.message}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Show existing rating if available */}
                    {request.rating && (
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm text-gray-600">Your rating:</span>
                        {renderStars(request.rating)}
                        {request.ratingComment && (
                          <span className="text-sm text-gray-600">- {request.ratingComment}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {/* Show rate button only for completed requests that haven't been rated */}
                    {request.status === "completed" && !request.rating && (
                      <button
                        onClick={() => handleRateClick(request)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm flex items-center"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Rate Donor
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No requests found</p>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Rate Donor</h3>
              <button
                onClick={() => {
                  setShowRatingModal(false)
                  setSelectedRequest(null)
                  setRating(0)
                  setComment("")
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Rate your experience with {selectedRequest?.donorName}</p>
              <p className="text-xs text-gray-500 mb-4">Medicine: {selectedRequest?.medicineName}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex items-center space-x-1">
                {renderStars(rating, true, setRating)}
                <span className="ml-2 text-sm text-gray-600">
                  {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "Select rating"}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Share your experience..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRatingModal(false)
                  setSelectedRequest(null)
                  setRating(0)
                  setComment("")
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={submittingRating || rating === 0}
                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingRating ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NeedyRequests
