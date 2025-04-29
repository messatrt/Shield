// Required packages
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Initialize SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database');

    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      wallet_address TEXT
    )`);

    // Create OTP table
    db.run(`CREATE TABLE IF NOT EXISTS otps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      otp TEXT NOT NULL,
      expiry DATETIME NOT NULL,
      used INTEGER DEFAULT 0
    )`);
  }
});

// Create Ethereal test account for email
let transporter;
(async () => {
  let testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
})();

// Step 1: Request login OTP
router.post('/request-otp', [
  body('email').isEmail().normalizeEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate 6-digit OTP
      const otp = crypto.randomInt(100000, 999999).toString();

      // Set expiry time (5 minutes)
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 5);

      // Store plain OTP
      db.run('INSERT INTO otps (email, otp, expiry) VALUES (?, ?, ?)', 
        [email, otp, expiryTime.toISOString()], 
        async (err) => {
          if (err) {
            console.error('Error storing OTP:', err);
            return res.status(500).json({ error: 'Failed to generate OTP' });
          }

          // Send OTP via email
          const mailOptions = {
            from: '"Your App" <no-reply@example.com>',
            to: email,
            subject: 'Your Login OTP',
            text: `Your OTP for login is: ${otp}. It will expire in 5 minutes.`
          };

          const info = await transporter.sendMail(mailOptions);
          console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info)); // <-- IMPORTANT

          res.status(200).json({ message: 'OTP sent to your email (development preview)' });
        }
      );
    });
  } catch (error) {
    console.error('Error in OTP generation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Step 2: Verify OTP and login
router.post('/verify-otp', [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, otp } = req.body;

  db.get(`SELECT * FROM otps 
          WHERE email = ? 
          AND used = 0 
          AND expiry > datetime('now') 
          ORDER BY id DESC LIMIT 1`, 
    [email], 
    (err, otpRecord) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!otpRecord) {
        return res.status(401).json({ error: 'Invalid or expired OTP' });
      }

      if (otpRecord.otp !== otp) {
        return res.status(401).json({ error: 'Invalid OTP' });
      }

      // Mark OTP as used
      db.run('UPDATE otps SET used = 1 WHERE id = ?', [otpRecord.id]);

      // Get user information
      db.get('SELECT name, wallet_address FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
          name: user.name,
          wallet_address: user.wallet_address
        });
      });
    }
  );
});

// Registration endpoint
router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  body('wallet_address').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, wallet_address } = req.body;

  try {
    db.get('SELECT id FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (user) {
        return res.status(409).json({ error: 'User already exists' });
      }

      db.run(
        'INSERT INTO users (name, email, password, wallet_address) VALUES (?, ?, ?, ?)',
        [name, email, password, wallet_address],
        function(err) {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Failed to register user' });
          }

          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
