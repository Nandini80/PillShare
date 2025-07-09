const PrescriptionSearchSchema = new mongoose.Schema({
  needyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicine: { type: String, required: true },
  region: { type: String, required: true },
  prescriptionUrl: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PrescriptionSearch', PrescriptionSearchSchema);