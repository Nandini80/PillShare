const User = require('../models/User');
const PrescriptionSearch = require('../models/PrescriptionSearch');
const bcrypt = require('bcryptjs');

exports.updateProfile = async (req, res) => {
  const { name, email, phone, city, address } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.name = name;
  user.email = email;
  user.phone = phone;
  user.city = city;
  user.address = address;
  await user.save();
  res.json({ message: 'Profile updated successfully' });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password changed successfully' });
};

exports.uploadSearch = async (req, res) => {
  const { medicine, region } = req.body;
  const prescriptionUrl = req.file.path;
  const newSearch = new PrescriptionSearch({
    needyId: req.user._id,
    medicine,
    region,
    prescriptionUrl
  });
  await newSearch.save();
  res.json({ message: 'Search uploaded successfully' });
};
