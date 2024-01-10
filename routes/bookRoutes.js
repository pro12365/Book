const express = require('express');
const {
  getAllBooks,
  likeBook,
  unlikeBook,
} = require('../controllers/bookController');
const authenticateUser = require('../middleware/authentication');

const router = express.Router();

// Public API
router.get('/books', getAllBooks);

// Private APIs (require authentication)
router.use(authenticateUser);
router.put('/books/like/:id', likeBook);
router.put('/books/unlike/:id', unlikeBook);

module.exports = router;
