// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'manager'], // Define roles as per your application
    default: 'user',
  },
  department: {
    type: String,
    required: true,
  },
  shift: {
    type: String,
    // enum: ['day', 'night', 'evening'], // Adjust shifts as per your needs
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  profilePicture: { // New field for profile picture
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
