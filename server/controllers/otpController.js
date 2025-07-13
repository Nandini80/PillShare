const OTP = require("../models/OTP")
const User = require("../models/User")
const nodemailer = require("nodemailer")
const crypto = require("crypto")

// Configure email transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send Phone OTP
exports.sendPhoneOTP = async (req, res) => {
  const { phone } = req.body

  try {
    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits",
      })
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete any existing OTP for this phone
    await OTP.deleteMany({ identifier: phone, type: "phone" })

    // Save new OTP
    await OTP.create({
      identifier: phone,
      otp,
      type: "phone",
      expiresAt,
    })

    // In production, integrate with SMS service like Twilio
    // For now, we'll just log it (in development)
    console.log(`Phone OTP for ${phone}: ${otp}`)

    res.status(200).json({
      success: true,
      message: "OTP sent to your phone number",
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === "development" && { otp }),
    })
  } catch (error) {
    console.error("Send phone OTP error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    })
  }
}

// Verify Phone OTP
exports.verifyPhoneOTP = async (req, res) => {
  const { phone, otp } = req.body

  try {
    // Find OTP record
    const otpRecord = await OTP.findOne({
      identifier: phone,
      type: "phone",
      verified: false,
    })

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or already verified",
      })
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id })
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      })
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id })
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP",
      })
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1
      await otpRecord.save()
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      })
    }

    // Mark as verified
    otpRecord.verified = true
    await otpRecord.save()

    // Update user's phone verification status
    await User.findByIdAndUpdate(req.user.id, {
      phoneVerified: true,
    })

    res.status(200).json({
      success: true,
      message: "Phone number verified successfully",
    })
  } catch (error) {
    console.error("Verify phone OTP error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    })
  }
}

// Send Email OTP
exports.sendEmailOTP = async (req, res) => {
  const { email } = req.body

  try {
    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete any existing OTP for this email
    await OTP.deleteMany({ identifier: email, type: "email" })

    // Save new OTP
    await OTP.create({
      identifier: email,
      otp,
      type: "email",
      expiresAt,
    })

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "PillShare - Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">PillShare Email Verification</h2>
          <p>Your OTP for email verification is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    res.status(200).json({
      success: true,
      message: "OTP sent to your email address",
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === "development" && { otp }),
    })
  } catch (error) {
    console.error("Send email OTP error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send email OTP",
    })
  }
}

// Verify Email OTP
exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body

  try {
    // Find OTP record
    const otpRecord = await OTP.findOne({
      identifier: email,
      type: "email",
      verified: false,
    })

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or already verified",
      })
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id })
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      })
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id })
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP",
      })
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1
      await otpRecord.save()
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      })
    }

    // Mark as verified
    otpRecord.verified = true
    await otpRecord.save()

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("Verify email OTP error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to verify email OTP",
    })
  }
}

// Send Forgot Password Email
exports.sendForgotPasswordEmail = async (req, res) => {
  const { email } = req.body

  try {
    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email address",
      })
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(8).toString("hex")

    // Update user's password
    user.password = tempPassword
    await user.save()

    // Send email with temporary password
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "PillShare - Temporary Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">PillShare - Temporary Password</h2>
          <p>Hello ${user.name},</p>
          <p>Your temporary password is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0;">
            ${tempPassword}
          </div>
          <p><strong>Important:</strong> Please change this password immediately after logging in for security reasons.</p>
          <p>If you didn't request this password reset, please contact our support team.</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    res.status(200).json({
      success: true,
      message: "Temporary password sent to your email address",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send temporary password",
    })
  }
}
