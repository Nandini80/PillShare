const mongoose = require("mongoose")

const medicineSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Pain Relief", "Antibiotic", "Vitamin", "Other"],
  },
  description: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  location: {
    city: String,
    state: String,
    address: String,
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

// Index for search optimization
medicineSchema.index({ name: "text", category: "text" })
medicineSchema.index({ "location.city": 1, "location.state": 1 })
medicineSchema.index({ expiryDate: 1 })

module.exports = mongoose.model("Medicine", medicineSchema)
