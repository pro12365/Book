const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Author = require('../models/authorModel');

// Register a new author
const registerAuthor = async (req, res) => {
  const { name, email, phone_no, password } = req.body;

  // Hash the password before saving to the database
  const hashedPassword = await bcrypt.hash(password, 10);

  const author = new Author({ name, email, phone_no, password: hashedPassword });
  try {
    const savedAuthor = await author.save();
    res.json({ authorId: savedAuthor._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login an existing author
const loginAuthor = async (req, res) => {
  const { email, password } = req.body;

  const author = await Author.findOne({ email });
  if (!author) return res.status(404).json({ message: 'Author not found.' });

  const validPassword = await bcrypt.compare(password, author.password);
  if (!validPassword) return res.status(401).json({ message: 'Invalid password.' });

  const token = jwt.sign({ _id: author._id, email: author.email }, 'your-secret-key');
  res.json({ token });
};

// Get all authors with the number of books published by each author
const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: 'author',
          as: 'books',
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone_no: 1,
          totalBooks: { $size: '$books' },
        },
      },
    ]);
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get details of the author with the given author id and list of books
const getAuthorById = async (req, res) => {
  const authorId = req.params.id;
  try {
    const author = await Author.findById(authorId);
    if (!author) return res.status(404).json({ message: 'Author not found.' });

    const books = await Book.find({ author: authorId });
    res.json({ author, books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get details of the logged-in author
const getLoggedInAuthor = async (req, res) => {
  const loggedInAuthorId = req.user._id;
  try {
    const loggedInAuthor = await Author.findById(loggedInAuthorId);
    if (!loggedInAuthor) return res.status(404).json({ message: 'Author not found.' });

    const books = await Book.find({ author: loggedInAuthorId });
    res.json({ author: loggedInAuthor, books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Other Auth APIs...

module.exports = {
  registerAuthor,
  loginAuthor,
  getAllAuthors,
  getAuthorById,
  getLoggedInAuthor,
  // Other exports...
};
