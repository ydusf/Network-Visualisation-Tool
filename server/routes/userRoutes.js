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
router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
