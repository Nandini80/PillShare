const express = require("express")
const router = express.Router()
const needyController = require("../controllers/needyController")
const auth = require("../middleware/auth")
const multer = require("multer")
const path = require("path")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/prescriptions/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "prescription-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true)
    } else {
      cb(new Error("Only images and PDF files are allowed!"), false)
    }
  },
})

router.get("/profile", auth, needyController.getProfile)
router.put("/profile", auth, needyController.updateProfile)
router.get("/available-cities", auth, needyController.getAvailableCities)
router.get("/available-medicines", auth, needyController.getAvailableMedicines)
router.post("/search", auth, upload.single("prescription"), needyController.searchDonors)
router.get("/recent-searches", auth, needyController.getRecentSearches)
router.post("/request", auth, needyController.createDonationRequest)
router.get("/my-requests", auth, needyController.getMyRequests)
router.post("/rate-donor", auth, needyController.rateDonor)
router.put("/change-password", auth, needyController.changePassword)

module.exports = router
