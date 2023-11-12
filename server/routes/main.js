const express = require("express");
const router = express.Router();
//const Post = require('../models/Post');

router.get("", async (req, res) => {
  res.render("index");
});

module.exports = router;
