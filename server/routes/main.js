const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const Network = require("../models/NetworkModel");
const Node = require("../models/NodeModel");
const Link = require("../models/LinkModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET_KEY;
const authValidator = require("../middleware/authValidator");

// POST - USER REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashPass = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashPass });
      res.redirect("/network");
    } catch (error) {
      if (error.code === 11000) {
        res.redirect("/login");
      }
      res.redirect("/register");
    }
  } catch (error) {
    console.log(error);
  }
});

// GET - USER REGISTER
router.get("/register", (req, res) => {
  res.render("register");
});

// POST - USER LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      res.redirect("/register");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.redirect("/register");
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/network");
  } catch (err) {
    console.error(err);
  }
});

// GET - USER LOGIN
router.get("/login", (req, res) => {
  res.render("login");
});

// GET - USER LOGOUT
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// GET - HOME PAGE
router.get("/", (req, res) => {
  res.render("index");
});

// GET - NETWORK VISUALISATION
router.get("/network", (req, res) => {
  res.render("network");
});

// POST - NETWORK UPLOAD
router.post("/upload", authValidator, async (req, res) => {
  try {
    if (req.files) {
      const files = req.files;
      console.log(files);
    }
  } catch (error) {
    console.error(error);
  }

  res.redirect("network");
});

module.exports = router;
