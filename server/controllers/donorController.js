const User = require("../models/User")
const Medicine = require("../models/Medicine")
const PrescriptionSearch = require("../models/PrescriptionSearch")
const DonationRequest = require("../models/DonationRequest")
const bcrypt = require("bcryptjs")

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        city: user.city || "",
        state: user.state || "",
        address: user.address || "",
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, city, state, address } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    if (email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        })
      }
    }

    user.name = name || user.name
    user.email = email || user.email
    user.phone = phone || user.phone
    user.city = city || user.city
    user.state = state || user.state
    user.address = address || user.address

    await user.save()

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        state: user.state,
        address: user.address,
      },
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ donorId: req.user._id }).sort({ createdAt: -1 })

    res.json({
      success: true,
      data: medicines,
    })
  } catch (error) {
    console.error("Get medicines error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.addMedicine = async (req, res) => {
  try {
    const { name, quantity, expiryDate, category, description } = req.body
    const donor = await User.findById(req.user._id)

    const medicine = new Medicine({
      donorId: req.user._id,
      name,
      quantity: Number.parseInt(quantity),
      expiryDate: new Date(expiryDate),
      category,
      description,
      location: {
        city: donor.city,
        state: donor.state,
        address: donor.address,
      },
    })

    await medicine.save()

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: medicine,
    })
  } catch (error) {
    console.error("Add medicine error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params
    const { name, quantity, expiryDate, category, description } = req.body

    const medicine = await Medicine.findOne({ _id: id, donorId: req.user._id })
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      })
    }

    medicine.name = name || medicine.name
    medicine.quantity = quantity ? Number.parseInt(quantity) : medicine.quantity
    medicine.expiryDate = expiryDate ? new Date(expiryDate) : medicine.expiryDate
    medicine.category = category || medicine.category
    medicine.description = description || medicine.description
    medicine.updatedAt = Date.now()

    await medicine.save()

    res.json({
      success: true,
      message: "Medicine updated successfully",
      data: medicine,
    })
  } catch (error) {
    console.error("Update medicine error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params

    const medicine = await Medicine.findOneAndDelete({ _id: id, donorId: req.user._id })
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      })
    }

    res.json({
      success: true,
      message: "Medicine deleted successfully",
    })
  } catch (error) {
    console.error("Delete medicine error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.deleteExpiredMedicines = async (req, res) => {
  try {
    const result = await Medicine.deleteMany({
      donorId: req.user._id,
      expiryDate: { $lt: new Date() },
    })

    res.json({
      success: true,
      message: `${result.deletedCount} expired medicines deleted successfully`,
    })
  } catch (error) {
    console.error("Delete expired medicines error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.getNeedyRequests = async (req, res) => {
  try {
    const donor = await User.findById(req.user._id)
    const needyRequests = await PrescriptionSearch.find({
      $or: [{ region: { $regex: donor.city, $options: "i" } }, { region: { $regex: donor.state, $options: "i" } }],
    })
      .populate("needyId", "name email phone city state address")
      .sort({ createdAt: -1 })
      .limit(20)

    const donorMedicines = await Medicine.find({
      donorId: req.user._id,
      expiryDate: { $gte: new Date() },
      isAvailable: true,
    })

    const matchingRequests = needyRequests.filter((request) => {
      return donorMedicines.some(
        (medicine) =>
          medicine.name.toLowerCase().includes(request.medicine.toLowerCase()) ||
          request.medicine.toLowerCase().includes(medicine.name.toLowerCase()),
      )
    })

    const formattedRequests = matchingRequests.map((request) => ({
      _id: request._id,
      needyName: request.needyId.name,
      needyEmail: request.needyId.email,
      needyPhone: request.needyId.phone,
      needyAddress: `${request.needyId.city}, ${request.needyId.state}`,
      medicineName: request.medicine,
      region: request.region,
      prescriptionUrl: request.prescriptionUrl,
      requestDate: request.createdAt,
      status: "pending",
    }))

    res.json({
      success: true,
      data: formattedRequests,
    })
  } catch (error) {
    console.error("Get needy requests error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.approveDonationRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const { message } = req.body

    const request = await DonationRequest.findById(requestId).populate("donorId needyId")

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      })
    }

    if (request.donorId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to approve this request",
      })
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      })
    }

    // Get donor's contact information
    const donor = await User.findById(req.user._id)

    request.status = "approved"
    request.donorContact = {
      phone: donor.phone,
      address: `${donor.address}, ${donor.city}, ${donor.state}`,
    }
    request.message = message || ""
    request.updatedAt = Date.now()

    await request.save()

    res.json({
      success: true,
      message: "Request approved successfully",
      data: request,
    })
  } catch (error) {
    console.error("Approve donation request error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.rejectDonationRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const { message } = req.body

    const request = await DonationRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      })
    }

    if (request.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to reject this request",
      })
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      })
    }

    request.status = "rejected"
    request.message = message || ""
    request.updatedAt = Date.now()

    await request.save()

    res.json({
      success: true,
      message: "Request rejected successfully",
    })
  } catch (error) {
    console.error("Reject donation request error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.completeDonationRequest = async (req, res) => {
  try {
    const { requestId } = req.params

    const request = await DonationRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      })
    }

    if (request.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to complete this request",
      })
    }

    if (request.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Request must be approved before completion",
      })
    }

    request.status = "completed"
    request.updatedAt = Date.now()

    await request.save()

    res.json({
      success: true,
      message: "Request marked as completed",
    })
  } catch (error) {
    console.error("Complete donation request error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await DonationRequest.find({ donorId: req.user._id })
      .populate("needyId", "name email phone city state address")
      .populate("medicineId", "name category description quantity")
      .sort({ createdAt: -1 })

    const formattedRequests = requests.map((request) => ({
      _id: request._id,
      needyName: request.needyId.name,
      needyEmail: request.needyId.email,
      needyPhone: request.needyId.phone,
      needyAddress: `${request.needyId.city}, ${request.needyId.state}`,
      medicineName: request.medicineName,
      quantity: request.quantity,
      status: request.status,
      message: request.message,
      prescriptionUrl: request.prescriptionUrl,
      rating: request.rating,
      ratingComment: request.ratingComment,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    }))

    res.json({
      success: true,
      data: formattedRequests,
    })
  } catch (error) {
    console.error("Get all requests error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const isMatch = await user.matchPassword(oldPassword)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      })
    }

    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.getDashboardStats = async (req, res) => {
  try {
    const totalMedicines = await Medicine.countDocuments({ donorId: req.user._id })
    const availableMedicines = await Medicine.countDocuments({
      donorId: req.user._id,
      expiryDate: { $gte: new Date() },
    })
    const expiredMedicines = await Medicine.countDocuments({
      donorId: req.user._id,
      expiryDate: { $lt: new Date() },
    })

    res.json({
      success: true,
      data: {
        totalMedicines,
        availableMedicines,
        expiredMedicines,
      },
    })
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}
