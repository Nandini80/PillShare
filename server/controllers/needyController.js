const User = require("../models/User")
const Medicine = require("../models/Medicine")
const PrescriptionSearch = require("../models/PrescriptionSearch")
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
        {
          $or: [{ name: { $regex: searchQuery, $options: "i" } }, { category: { $regex: searchQuery, $options: "i" } }],
        },
        {
          $or: [
            { "location.city": { $regex: region, $options: "i" } },
            { "location.state": { $regex: region, $options: "i" } },
          ],
        },
        { expiryDate: { $gte: new Date() } },
        { isAvailable: true },
      ],
    }).populate("donorId", "name email phone city state address")

    // Format the results
    const searchResults = medicines.map((medicine) => ({
      _id: medicine._id,
      donorName: medicine.donorId.name,
      donorEmail: medicine.donorId.email,
      donorPhone: medicine.donorId.phone,
      medicine: medicine.name,
      quantity: medicine.quantity,
      category: medicine.category,
      description: medicine.description,
      expiry: medicine.expiryDate.toLocaleDateString(),
      address: `${medicine.location.city}, ${medicine.location.state}`,
      distance: "2.5 km", // This would be calculated based on actual coordinates
      verified: true, // This would be based on donor verification status
      rating: 4.5, // This would come from a ratings system
      donations: 12, // This would be calculated from donation history
    }))

    // Save the search to database
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
