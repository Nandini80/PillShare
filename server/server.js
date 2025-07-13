const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const path = require("path")
const fs = require("fs")
const authRoutes = require("./routes/authRoutes")
const needyRoutes = require("./routes/needyRoutes")
const donorRoutes = require("./routes/donorRoutes")

const app = express()

dotenv.config()

// to run locally, comment out the cors ke andr ka part
app.use(cors({
  origin: "https://pillshare.vercel.app",
  credentials: true
}))

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
const uploadsDir = path.join(__dirname, "uploads")
const prescriptionsDir = path.join(__dirname, "uploads", "prescriptions")

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}
if (!fs.existsSync(prescriptionsDir)) {
  fs.mkdirSync(prescriptionsDir, { recursive: true })
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PillShare API is running",
    timestamp: new Date().toISOString(),
  })
})

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  })
})

app.use("/api/auth", authRoutes)
app.use("/api/needy", needyRoutes)
app.use("/api/donor", donorRoutes)

app.use((err, req, res, next) => {
  console.error("Error:", err)

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    })
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    })
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value",
    })
  }

  if (err.message.includes("Only images and PDF files are allowed")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    })
  }

  res.status(500).json({
    success: false,
    message: "Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`MongoDB URI: ${process.env.MONGO_URI ? "Connected" : "Not configured"}`)
})
