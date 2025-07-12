const mongoose = require("mongoose")

const donationRequestSchema = new mongoose.Schema({
  needyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true,
  },
  medicineName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  prescriptionUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending",
  },
  message: {
    type: String,
  },
  donorContact: {
    phone: String,
    address: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  ratingComment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("DonationRequest", donationRequestSchema)
