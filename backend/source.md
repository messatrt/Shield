// Project structure:
// /app.js - Main application file
// /config/database.js - Database configuration
// /models/User.js - User model
// /routes/auth.js - Authentication routes
// /utils/otpUtil.js - OTP generation and verification utility

// Required packages:
// npm init -y
// npm install express sqlite3 bcryptjs nodemailer express-validator cookie-parser

// app.js - Main application file
const express = require('express');
const cookieParser = require('cookie-parser');
const { initializeDatabase } = require('./config/database');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize Database
initializeDatabase();

// Routes
app.use('/api/auth', require('./routes/auth'));

// Home route
app.get('/', (req, res) => {
  res.send('Authentication API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// config/database.js - Database configuration
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  db.serialize(() => {
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        wallet_id TEXT,
        investments TEXT,
        otp TEXT,
        otp_expires_at DATETIME,
        is_verified BOOLEAN DEFAULT 0,
        session_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database initialized');
  });
}

function getDatabase() {
  return db;
}

module.exports = { initializeDatabase, getDatabase };

// models/User.js - User model
const { getDatabase } = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = getDatabase();

class User {
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, name, email, wallet_id, investments, is_verified, created_at FROM users WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static findBySessionId(sessionId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, name, email, wallet_id, investments, is_verified, created_at FROM users WHERE session_id = ?', [sessionId], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static async create(userData) {
    const { name, email, password, wallet_id = null, investments = null } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email, password, wallet_id, investments) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, wallet_id, investments],
        function(err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  }

  static storeOtp(email, otp) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes
    
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET otp = ?, otp_expires_at = ? WHERE email = ?',
        [otp, expiresAt.toISOString(), email],
        function(err) {
          if (err) return reject(err);
          resolve({ success: this.changes > 0 });
        }
      );
    });
  }

  static verifyOtp(email, otp) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ? AND otp = ? AND otp_expires_at > ?',
        [email, otp, new Date().toISOString()],
        (err, row) => {
          if (err) return reject(err);
          if (!row) return resolve({ verified: false });
          
          // Clear OTP and mark as verified
          db.run(
            'UPDATE users SET otp = NULL, otp_expires_at = NULL, is_verified = 1 WHERE id = ?',
            [row.id],
            (err) => {
              if (err) return reject(err);
              resolve({ verified: true, userId: row.id });
            }
          );
        }
      );
    });
  }

  static createSession(userId) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET session_id = ? WHERE id = ?',
        [sessionId, userId],
        function(err) {
          if (err) return reject(err);
          resolve({ sessionId, success: this.changes > 0 });
        }
      );
    });
  }

  static clearSession(sessionId) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET session_id = NULL WHERE session_id = ?',
        [sessionId],
        function(err) {
          if (err) return reject(err);
          resolve({ success: this.changes > 0 });
        }
      );
    });
  }

  static updateUser(id, userData) {
    const { name, wallet_id, investments } = userData;
    
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET name = ?, wallet_id = ?, investments = ? WHERE id = ?',
        [name, wallet_id, investments, id],
        function(err) {
          if (err) return reject(err);
          resolve({ success: this.changes > 0 });
        }
      );
    });
  }
}

module.exports = User;

// utils/otpUtil.js - OTP generation and verification utility
const nodemailer = require('nodemailer');

// Configure mail transporter (for production, use a proper email service)
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Replace with your SMTP server
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@example.com', // Replace with your email
    pass: 'your-password' // Replace with your password
  }
});

function generateOTP() {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPByEmail(email, otp) {
  const mailOptions = {
    from: 'your-email@example.com', // Replace with your email
    to: email,
    subject: 'Your One-Time Password',
    text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    html: `<p>Your OTP is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

module.exports = { generateOTP, sendOTPByEmail };

// middleware/auth.js - Authentication middleware
const User = require('../models/User');

function auth(req, res, next) {
  // Get session ID from cookies
  const sessionId = req.cookies.sessionId;
  
  // Check if session ID exists
  if (!sessionId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // Find user by session ID
  User.findBySessionId(sessionId)
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Invalid session' });
      }
      
      // Add user to request object
      req.user = {
        id: user.id
      };
      
      next();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    });
}

module.exports = auth;

// routes/auth.js - Authentication routes
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { generateOTP, sendOTPByEmail } = require('../utils/otpUtil');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findByEmail(email);
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user
      const userData = {
        name,
        email,
        password
      };
      const result = await User.create(userData);

      // Generate and store OTP
      const otp = generateOTP();
      await User.storeOtp(email, otp);

      // Send OTP via email
      await sendOTPByEmail(email, otp);

      res.status(201).json({ 
        message: 'User registered successfully. Please verify your email with the OTP sent.',
        userId: result.id 
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/verify-otp
// @desc    Verify user with OTP
// @access  Public
router.post(
  '/verify-otp',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('otp', 'OTP is required').not().isEmpty()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    try {
      const verification = await User.verifyOtp(email, otp);
      
      if (!verification.verified) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      // Create session
      const session = await User.createSession(verification.userId);
      
      // Set session cookie
      res.cookie('sessionId', session.sessionId, { 
        httpOnly: true,
        maxAge: 3600000 // 1 hour
      });
      
      res.json({ message: 'Email verified successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check if user is verified
      if (!user.is_verified) {
        // Generate new OTP for unverified user
        const otp = generateOTP();
        await User.storeOtp(email, otp);
        await sendOTPByEmail(email, otp);
        
        return res.status(401).json({ 
          message: 'Account not verified. A new OTP has been sent to your email.' 
        });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create session
      const session = await User.createSession(user.id);
      
      // Set session cookie
      res.cookie('sessionId', session.sessionId, { 
        httpOnly: true,
        maxAge: 3600000 // 1 hour
      });
      
      res.json({ message: 'Logged in successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/request-otp
// @desc    Request new OTP for verification
// @access  Public
router.post(
  '/request-otp',
  [
    check('email', 'Please include a valid email').isEmail()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      // Generate and store OTP
      const otp = generateOTP();
      await User.storeOtp(email, otp);

      // Send OTP via email
      await sendOTPByEmail(email, otp);

      res.json({ message: 'OTP sent successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/auth/me
// @desc    Get user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/auth/me
// @desc    Update user profile
// @access  Private
router.put(
  '/me',
  [
    auth,
    check('name', 'Name is required').not().isEmpty()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await User.updateUser(req.user.id, req.body);
      if (!result.success) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const updatedUser = await User.findById(req.user.id);
      res.json(updatedUser);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;
    await User.clearSession(sessionId);
    res.clearCookie('sessionId');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
