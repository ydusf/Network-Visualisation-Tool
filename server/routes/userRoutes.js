const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const authValidator = require('../middleware/authValidator');
const jwtSecret = process.env.JWT_SECRET_KEY;

// POST - USER REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashPass = await bcrypt.hash(password, 10);

    try {
      await User.create({ username, password: hashPass });
      res.redirect('/login');
    } catch (error) {
      if (error.code === 11000) {
        res.status(200).redirect('/login');
      }
      res.status(302).redirect('/register');
    }
  } catch (error) {
    console.error(error);
  }
});

// GET - USER REGISTER
router.get('/register', async (req, res) => {
  res.render('register');
});

//HOME PAGE
router.get('/index', async (req, res) => {
  res.render('index');
});

// POST - USER LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      res.status(302).redirect('/login?error=True');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(302).redirect('/login?error=True');
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: '1d',
    });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).redirect('/network');
  } catch (err) {
    console.error(err);
  }
});

// GET - USER LOGIN
router.get('/login', async (req, res) => {
  const errorMessage = req.query.error;
  let message = '';
  if (errorMessage === 'True') {
    message = 'Incorrect Username or Password';
  }
  // Pass the message to the template
  res.status(200).render('login', { errorMessage: message });
});

// GET - USER LOGOUT
router.get('/logout', authValidator, async (req, res) => {
  res.clearCookie('token');
  res.status(200).render('logoutPage');
});

module.exports = router;
