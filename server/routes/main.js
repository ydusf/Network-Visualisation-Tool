const express = require("express");
const router = express.Router();
//const Post = require('../models/Post');

router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/network", async (req, res) => {
  res.render("network");
});

router.get("/login", async (req, res) => {
  res.render("login");
});

module.exports = router;
