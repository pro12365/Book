const express = require('express');
const {
  registerAuthor,
  loginAuthor,
  getAllAuthors,
  getAuthorById,
  getLoggedInAuthor,
} = require('../controllers/authController');
const authenticateUser = require('../middleware/authentication');

const router = express.Router();

// Public APIs
router.post('/register', registerAuthor);
router.post('/login', loginAuthor);

// Private APIs (require authentication)
router.use(authenticateUser);
router.get('/authors', getAllAuthors);
router.get('/authors/:id', getAuthorById);
router.get('/authors/me', getLoggedInAuthor);

module.exports = router;
