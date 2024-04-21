const express = require('express');
const router = express.Router();

const authValidator = require('../middleware/authValidator');

const User = require('../models/UserModel');
const Network = require('../models/NetworkModel');
const Node = require('../models/NodeModel');
const Link = require('../models/LinkModel');

// GET - HOME PAGE
router.get('/', async (req, res) => {
  res.render('index');
});

router.get('/documentation', authValidator, async (req, res) => {
  res.render('documentation')
});

module.exports = router;
