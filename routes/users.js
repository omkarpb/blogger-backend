const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // For creating tokens (optional, but common for authentication)
const User = require('../schema/user'); // Assuming your User model is in '../models/User.js'

// Registration Route (POST /api/register)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    // Hash the password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    // Save the user
    const savedUser = await newUser.save();

    // Respond with success (you might want to generate a token here as well)
    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user.', error: error.message });
  }
});

// Login Route (POST /login)
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // Identifier can be username or email

    // Find user by username or email
    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    
    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // If credentials are valid, you can generate a JWT token (optional, but common)
    const token = jwt.sign(
      { userId: user._id },
      'your-secret-key', // Replace with a strong, environment-specific secret key
      { expiresIn: '1h' } // Token expiration time
    );

    // Respond with success and the token
    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Failed to login.', error: error.message });
  }
});

module.exports = router;