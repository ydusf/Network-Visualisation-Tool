const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const jwtSecret = process.env.JWT_SECRET_KEY;

// POST - USER REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashPass = await bcrypt.hash(password, 10);

    try {
      await User.create({ username, password: hashPass });
      res.redirect("/login");
    } catch (error) {
      if (error.code === 11000) {
        res.redirect("/register");
      }
      res.redirect("/register");
    }
  } catch (error) {
    console.log(error);
  }
});

// GET - USER REGISTER
router.get("/register", async (req, res) => {
  res.render("register");
});

// POST - USER LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      res.redirect("/login");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.redirect("/login");
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/network");
  } catch (err) {
    console.error(err);
  }
});

// GET - USER LOGIN
router.get("/login", async (req, res) => {
  res.render("login");
});

// GET - USER LOGOUT
router.get("/logout", isAuthenticated, async (req, res) => {
  res.clearCookie("token");
  res.render("logoutPage");
});

function isAuthenticated(req, res, next) {
  // Check for authentication credentials, such as tokens or session data
  const token = req.cookies.token; // Assuming you're using cookies for token-based authentication
  
  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded; // Attach the decoded user information to the request object
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      // If token verification fails, redirect the user to the login page or handle the error accordingly
      res.redirect("/");
    }
  } else {
    // If no token is present, redirect the user to the login page
    res.redirect("/");
  }
}


module.exports = router;

module.exports = router;
