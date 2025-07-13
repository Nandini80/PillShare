import { useState } from "react"
import { Bell, Pill, User, MapPin, Calendar, Star, X, Eye, FileText } from "lucide-react"

const DonorRequests = ({
  allRequests,
  loading,
  error,
  success,
  handleApproveRequest,
  handleRejectRequest,
  handleCompleteRequest,
}) => {
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [requestMessage, setRequestMessage] = useState("")
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState(null)

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} className={`h-4 w-4 ${i <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />,
      )
    }
    return <div className="flex">{stars}</div>
  }

  const handleApprove = async (requestId) => {
    await handleApproveRequest(requestId, requestMessage)
    setShowRequestModal(false)
    setRequestMessage("")
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Requests</h3>
        <div className="flex space-x-2">
          <span className="text-sm text-gray-600">Total: {allRequests.length}</span>
        </div>
      </div>

      <div className="space-y-4">
        {allRequests.length > 0 ? (
          allRequests.map((request) => (
            <div key={request._id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-semibold text-gray-800 mr-2">{request.needyName}</h4>
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
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Pill className="w-4 h-4 mr-2" />
                      Medicine: {request.medicineName} - {request.quantity} units
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      Contact: {request.needyEmail} | {request.needyPhone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      Address: {request.needyAddress}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Requested: {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {request.message && (
                    <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded">Message: {request.message}</p>
                  )}

                  {request.rating && (
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-gray-600">Rating:</span>
                      {renderStars(request.rating)}
                      {request.ratingComment && (
                        <span className="text-sm text-gray-600">- {request.ratingComment}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {/* View Prescription Button */}
                  {request.prescriptionUrl && (
                    <button
                      onClick={() => {
                        setSelectedPrescription(request.prescriptionUrl)
                        setShowPrescriptionModal(true)
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Prescription
                    </button>
                  )}

                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowRequestModal(true)
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {request.status === "approved" && (
                    <button
                      onClick={() => handleCompleteRequest(request._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No requests found</p>
          </div>
        )}
      </div>

      {/* Request Action Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Approve Request</h3>
              <button
                onClick={() => {
                  setShowRequestModal(false)
                  setRequestMessage("")
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Approve request from {selectedRequest?.needyName} for {selectedRequest?.medicineName}?
              </p>
              <p className="text-xs text-gray-500 mb-4">Your contact information will be shared with the requester.</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Add a message for the requester..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRequestModal(false)
                  setRequestMessage("")
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(selectedRequest._id)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Prescription</h3>
              <button
                onClick={() => {
                  setShowPrescriptionModal(false)
                  setSelectedPrescription(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center">
              {selectedPrescription ? (
                selectedPrescription.toLowerCase().includes(".pdf") ? (
                  <div className="space-y-4">
                    <FileText className="w-16 h-16 text-blue-500 mx-auto" />
                    <p className="text-gray-600">PDF Prescription</p>
                    <a
                      href={`http://localhost:5000/${selectedPrescription}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                    >
                      Open PDF
                    </a>
                  </div>
                ) : (
                  <img
                    src={`http://localhost:5000/${selectedPrescription}`}
                    alt="Prescription"
                    className="max-w-full h-auto rounded-lg"
                  />
                )
              ) : (
                <p className="text-gray-500">No prescription available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DonorRequests
