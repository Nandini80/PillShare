const User = require("../models/User")
const Medicine = require("../models/Medicine")
const bcrypt = require("bcryptjs")

// Get donor profile
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

// Update donor profile
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

// Get all medicines for donor
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

// Add new medicine
exports.addMedicine = async (req, res) => {
  try {
    const { name, quantity, expiryDate, category, description } = req.body

    // Get donor's location info
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

// Update medicine
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

// Delete medicine
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

// Delete expired medicines
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

// Get dashboard stats
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
