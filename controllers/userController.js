// controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/; // Allow specific file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: File type not supported');
  },
});

// Create a new user
exports.createUser = [
  upload.single('profilePicture'),
  async (req, res) => {
    const { username, password, email, role, department, shift, isAdmin } = req.body;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Get profile picture path
      const profilePicture = req.file ? req.file.path : null; // Store the file path if uploaded

      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        role,
        department,
        shift,
        isAdmin,
        profilePicture,
      });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];

// User login (support email and username)
exports.loginUser = async (req, res) => {
  const { identifier, password } = req.body; // Use "identifier" to handle either email or username

  try {
    // Find user by email or username
    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user
exports.updateUser = [
  upload.single('profilePicture'),
  async (req, res) => {
    const { username, password, email, role, department, shift, isAdmin } = req.body;

    // Get profile picture path
    const profilePicture = req.file ? req.file.path : null; // Store the file path if uploaded

    try {
      // Hash the new password if provided
      const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

      const updateData = {
        username,
        ...(hashedPassword && { password: hashedPassword }), // Update password only if it's provided
        email,
        role,
        department,
        shift,
        isAdmin,
        ...(profilePicture && { profilePicture }),
        updatedAt: Date.now(),
      };

      // Find user by ID and update
      const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
