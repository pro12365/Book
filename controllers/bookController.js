const Book = require('../models/bookModel');

// Get all books with pagination and sorting parameters
const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'likes';

    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ [sortBy]: 1 })
      .skip(skip)
      .limit(limit);

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a book
const likeBook = async (req, res) => {
  const bookId = req.params.id;
  const loggedInAuthorId = req.user._id;

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    // Check if the author has already liked the book
    if (book.likes.includes(loggedInAuthorId)) {
      return res.status(400).json({ message: 'You have already liked this book.' });
    }

    // Add author's ID to the likes array
    book.likes.push(loggedInAuthorId);
    await book.save();

    res.json({ message: 'Book liked successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unlike a book
const unlikeBook = async (req, res) => {
  const bookId = req.params.id;
  const loggedInAuthorId = req.user._id;

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    // Check if the author has liked the book
    if (!book.likes.includes(loggedInAuthorId)) {
      return res.status(400).json({ message: 'You have not liked this book.' });
    }

    // Remove author's ID from the likes array
    book.likes = book.likes.filter((authorId) => authorId !== loggedInAuthorId);
    await book.save();

    res.json({ message: 'Book unliked successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Other Book APIs...

module.exports = {
  getAllBooks,
  likeBook,
  unlikeBook,
  // Other exports...
};
