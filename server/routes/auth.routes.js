const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER A NEW USER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required." });
    }

    // Check if user already exists by username or email
    const userExists = await User.findOne({ 
      $or: [{ username: username }, { email: email }] 
    });
    
    if (userExists) {
      if (userExists.username === username) {
        return res.status(400).json({ message: "Username already exists." });
      }
      if (userExists.email === email) {
        return res.status(400).json({ message: "Email already exists." });
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    
    // Create JWT token immediately after registration
    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      message: "User created successfully!", 
      token: token,
      user: { 
        id: savedUser._id, 
        username: savedUser.username, 
        email: savedUser.email 
      } 
    });

  } catch (err) {
    if (err.code === 11000) {
      // Handle duplicate key error
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists.` });
    }
    res.status(500).json({ message: err.message });
  }
});

// 2. LOGIN A USER
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username or email
    const user = await User.findOne({ 
      $or: [{ username: username }, { email: username }] 
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid username/email or password." });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username/email or password." });
    }

    // Create and send a "digital ID card" (JWT)
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET, // You must add this secret key
      { expiresIn: '1d' } // Token expires in 1 day
    );

    res.json({ 
      message: "Logged in successfully!",
      token: token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;