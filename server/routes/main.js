const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const Network = require('../models/NetworkModel');
const Node = require('../models/NodeModel');
const Link = require('../models/LinkModel');

// GET - HOME PAGE
router.get('/', async (req, res) => {
  res.render('index');
});

module.exports = router;
