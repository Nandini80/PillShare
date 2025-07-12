const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  city: { type: String },
  state: { type: String },
  address: { type: String },
  role: { type: String, enum: ["donor", "needy"], default: "needy" },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    this.updatedAt = Date.now()
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model("User", userSchema)
