const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET_KEY;
const User = require('../models/UserModel');

const authValidator = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/register');
    // return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;

    // Fetch the user from the database based on userId
    const user = await User.findById(req.userId);

    if (!user) {
      return res.redirect('/register');
      // return res.status(401).json({ message: "Unauthorized" });
    }

    // Attach the user to the request object
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authValidator;
