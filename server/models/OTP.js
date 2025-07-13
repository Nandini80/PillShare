const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true }, // email or phone
    otp: { type: String, required: true },
    type: { type: String, enum: ["email", "phone"], required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// Index for automatic deletion of expired documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model("OTP", otpSchema)
