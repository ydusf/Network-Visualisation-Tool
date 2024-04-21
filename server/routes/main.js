const express = require('express');
const router = express.Router();

const authValidator = require('../middleware/authValidator');

// GET - HOME PAGE
router.get('/', async (req, res) => {
  res.render('index');
});

router.get('/documentation', authValidator, async (req, res) => {
  res.render('documentation')
});

module.exports = router;
