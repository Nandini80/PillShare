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

// Password change
router.put("/change-password", auth, donorController.changePassword)

// Dashboard stats
router.get("/stats", auth, donorController.getDashboardStats)

module.exports = router
