const express = require("express")
const router = express.Router()
const donorController = require("../controllers/donorController")
const auth = require("../middleware/auth")

// Profile routes
router.get("/profile", auth, donorController.getProfile)
router.put("/profile", auth, donorController.updateProfile)

// Medicine routes
router.get("/medicines", auth, donorController.getMedicines)
router.post("/medicines", auth, donorController.addMedicine)
router.put("/medicines/:id", auth, donorController.updateMedicine)
router.delete("/medicines/:id", auth, donorController.deleteMedicine)

// Special route for deleting expired medicines (must come before the parameterized route)
router.delete("/medicines-expired", auth, donorController.deleteExpiredMedicines)

// Needy requests route
router.get("/needy-requests", auth, donorController.getNeedyRequests)

// Password change
router.put("/change-password", auth, donorController.changePassword)

// Dashboard stats
router.get("/stats", auth, donorController.getDashboardStats)

// Request management routes
router.get("/requests", auth, donorController.getAllRequests)
router.put("/requests/:requestId/approve", auth, donorController.approveDonationRequest)
router.put("/requests/:requestId/reject", auth, donorController.rejectDonationRequest)
router.put("/requests/:requestId/complete", auth, donorController.completeDonationRequest)

module.exports = router
