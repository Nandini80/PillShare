const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      })
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "needy",
    })

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Registration successful",
    })
  } catch (err) {
    console.error("Registration error:", err)
    res.status(400).json({
      success: false,
      message: "Registration failed",
      error: err.message,
    })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Login successful",
    })
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: err.message,
    })
  }
}
