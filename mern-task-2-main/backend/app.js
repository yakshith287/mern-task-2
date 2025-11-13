const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('./db');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'myth_secret_code'; // can be any secret string

// ------------------------------------
// SIGNUP
// ------------------------------------
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ err: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ err: 'Server error during signup' });
  }
});

// ------------------------------------
// LOGIN
// ------------------------------------
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ err: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ err: 'Invalid password' });
    }

    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ err: 'Server error during login' });
  }
});

// ------------------------------------
// JWT Middleware
// ------------------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ err: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ err: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// ------------------------------------
// HOME (Protected Route)
// ------------------------------------
app.get('/home', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to Home Page', user: req.user });
});

app.listen(5000, () => console.log(' Server running on port 5000'));
