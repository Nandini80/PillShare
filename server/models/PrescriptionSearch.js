const mongoose = require("mongoose")

const prescriptionSearchSchema = new mongoose.Schema({
  needyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  medicine: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  prescriptionUrl: {
    type: String,
  },
  searchResults: [
    {
      donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
      contacted: { type: Boolean, default: false },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("PrescriptionSearch", prescriptionSearchSchema)
