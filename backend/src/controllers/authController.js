// backend/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Ensure this path is correct

exports.register = async (req, res) => {
  const { name, email, password, contact_information } = req.body; // Use snake_case from DB
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }
  try {
    // Check if user already exists using the model method, which queries the DB
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Create user (model handles hashing)
    const newUser = await User.create({ name, email, password, contactInformation: contact_information });

    // Generate token
    const token = jwt.sign(
      { userId: newUser.customer_id, email: newUser.email }, // Payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respond with token and user info (excluding password)
    res.status(201).json({
      token,
      userId: newUser.customer_id,
      name: newUser.name,
      email: newUser.email,
      contact_information: newUser.contact_information
    });
  } catch (error) {
    // Handle specific error from User.create (e.g., unique email constraint)
    if (error.message === 'User with this email already exists.') {
      return res.status(400).json({ message: error.message });
    }
    // Generic server error
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials (user not found).' });
    }

    // user.password here is the hashed password from the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials (password mismatch).' });
    }

    const token = jwt.sign(
      { userId: user.customer_id, email: user.email }, // Payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      userId: user.customer_id,
      name: user.name,
      email: user.email,
      contact_information: user.contact_information
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
