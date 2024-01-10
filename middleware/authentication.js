const jwt = require('jsonwebtoken');
const Author = require('../models/authorModel');

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ message: 'Access denied. Token not provided.' });

  jwt.verify(token, 'your-secret-key', async (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });

    // Additional logic to check if the author exists
    try {
      const existingAuthor = await Author.findById(user._id);
      if (!existingAuthor) return res.status(404).json({ message: 'Author not found.' });

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

module.exports = authenticateUser;
