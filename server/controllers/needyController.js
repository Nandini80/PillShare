const User = require("../models/User")
const Medicine = require("../models/Medicine")
const PrescriptionSearch = require("../models/PrescriptionSearch")
const DonationRequest = require("../models/DonationRequest")
const bcrypt = require("bcryptjs")

// Get needy profile
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

// Update needy profile
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

    // Check if email is already taken by another user
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

// Get available cities where donors are present
exports.getAvailableCities = async (req, res) => {
  try {
    const cities = await Medicine.aggregate([
      {
        $match: {
          expiryDate: { $gte: new Date() },
          isAvailable: true,
        },
      },
      {
        $group: {
          _id: "$location.city",
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          _id: { $ne: null, $ne: "" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    const availableCities = cities.map((city) => ({
      name: city._id,
      medicineCount: city.count,
    }))

    res.json({
      success: true,
      data: availableCities,
    })
  } catch (error) {
    console.error("Get available cities error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get available medicines
exports.getAvailableMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.aggregate([
      {
        $match: {
          expiryDate: { $gte: new Date() },
          isAvailable: true,
        },
      },
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
          categories: { $addToSet: "$category" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    const availableMedicines = medicines.map((medicine) => ({
      name: medicine._id,
      availableCount: medicine.count,
      categories: medicine.categories,
    }))

    res.json({
      success: true,
      data: availableMedicines,
    })
  } catch (error) {
    console.error("Get available medicines error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Search for donors
exports.searchDonors = async (req, res) => {
  try {
    const { searchQuery, region } = req.body
    const prescriptionFile = req.file

    if (!searchQuery || !region) {
      return res.status(400).json({
        success: false,
        message: "Medicine name and region are required",
      })
    }

    // Search for medicines based on name and location
    const medicines = await Medicine.find({
      $and: [
        { name: { $regex: searchQuery, $options: "i" } },
        { "location.city": { $regex: region, $options: "i" } },
        { expiryDate: { $gte: new Date() } },
        { isAvailable: true },
      ],
    }).populate("donorId", "name email phone city state address")

    // Get donation counts and ratings for each donor
    const searchResults = await Promise.all(
      medicines.map(async (medicine) => {
        // Count total donations by this donor
        const donationCount = await DonationRequest.countDocuments({
          donorId: medicine.donorId._id,
          status: "completed",
        })

        // Calculate average rating
        const ratingStats = await DonationRequest.aggregate([
          {
            $match: {
              donorId: medicine.donorId._id,
              rating: { $exists: true },
            },
          },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
              totalRatings: { $sum: 1 },
            },
          },
        ])

        const averageRating = ratingStats.length > 0 ? ratingStats[0].averageRating : 0
        const totalRatings = ratingStats.length > 0 ? ratingStats[0].totalRatings : 0

        return {
          _id: medicine._id,
          donorId: medicine.donorId._id,
          donorName: medicine.donorId.name,
          donorEmail: medicine.donorId.email,
          medicine: medicine.name,
          quantity: medicine.quantity,
          category: medicine.category,
          description: medicine.description,
          expiry: medicine.expiryDate.toLocaleDateString(),
          address: `${medicine.location.city}, ${medicine.location.state}`,
          distance: "2.5 km", // This would be calculated based on actual coordinates
          verified: true, // This would be based on donor verification status
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          totalRatings: totalRatings,
          donations: donationCount,
        }
      }),
    )

    // Save the search to database with prescription
    const searchRecord = new PrescriptionSearch({
      needyId: req.user._id,
      medicine: searchQuery,
      region: region,
      prescriptionUrl: prescriptionFile ? prescriptionFile.path : null,
      searchResults: medicines.map((m) => ({
        donorId: m.donorId._id,
        medicineId: m._id,
      })),
    })

    await searchRecord.save()

    res.json({
      success: true,
      data: searchResults,
      message: `Found ${searchResults.length} donors`,
    })
  } catch (error) {
    console.error("Search donors error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Create donation request
exports.createDonationRequest = async (req, res) => {
  try {
    const { donorId, medicineId, message } = req.body

    // Check if medicine exists and is available
    const medicine = await Medicine.findById(medicineId).populate("donorId")
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      })
    }

    if (!medicine.isAvailable || medicine.expiryDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Medicine is no longer available",
      })
    }

    // Check if request already exists
    const existingRequest = await DonationRequest.findOne({
      needyId: req.user._id,
      medicineId: medicineId,
      status: { $in: ["pending", "approved"] },
    })

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You have already requested this medicine",
      })
    }

    // Find the most recent prescription search for this medicine
    const recentSearch = await PrescriptionSearch.findOne({
      needyId: req.user._id,
      medicine: { $regex: medicine.name, $options: "i" },
    }).sort({ createdAt: -1 })

    // Create new request
    const donationRequest = new DonationRequest({
      needyId: req.user._id,
      donorId: donorId,
      medicineId: medicineId,
      medicineName: medicine.name,
      quantity: medicine.quantity,
      message: message || "",
      prescriptionUrl: recentSearch ? recentSearch.prescriptionUrl : null,
    })

    await donationRequest.save()

    res.status(201).json({
      success: true,
      message: "Request sent successfully",
      data: donationRequest,
    })
  } catch (error) {
    console.error("Create donation request error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get user's donation requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await DonationRequest.find({ needyId: req.user._id })
      .populate("donorId", "name email phone city state address")
      .populate("medicineId", "name category description")
      .sort({ createdAt: -1 })

    const formattedRequests = requests.map((request) => ({
      _id: request._id,
      donorName: request.donorId.name,
      medicineName: request.medicineName,
      quantity: request.quantity,
      status: request.status,
      message: request.message,
      donorContact: request.donorContact,
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
    console.error("Get my requests error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Rate a donor
exports.rateDonor = async (req, res) => {
  try {
    const { requestId, rating, comment } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      })
    }

    const request = await DonationRequest.findOne({
      _id: requestId,
      needyId: req.user._id,
      status: "completed",
    })

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found or not completed",
      })
    }

    if (request.rating) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this donor",
      })
    }

    request.rating = rating
    request.ratingComment = comment || ""
    request.updatedAt = Date.now()

    await request.save()

    res.json({
      success: true,
      message: "Rating submitted successfully",
    })
  } catch (error) {
    console.error("Rate donor error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get recent searches
exports.getRecentSearches = async (req, res) => {
  try {
    const recentSearches = await PrescriptionSearch.find({ needyId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("medicine region createdAt")

    const formattedSearches = recentSearches.map((search) => ({
      medicine: search.medicine,
      region: search.region,
      date: search.createdAt,
    }))

    res.json({
      success: true,
      data: formattedSearches,
    })
  } catch (error) {
    console.error("Get recent searches error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Change password
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
