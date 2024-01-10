const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const faker = require('@faker-js/faker');
const Author = require('./models/authorModel');
const Book = require('./models/bookModel');
const {
  registerAuthor,
  loginAuthor,
  getAllAuthors,
  getAuthorById,
  getLoggedInAuthor,
} = require('./controllers/authController');
const {
  getAllBooks,
  likeBook,
  unlikeBook,
} = require('./controllers/bookController');
const authenticationMiddleware = require('./middleware/authentication');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to MongoDB

// Replace 'your-connection-string' with the actual connection string from MongoDB Atlas
const connectionString = 'mongodb+srv://subhrojitdutta02:bGD187j3RjBBvdch@ayna.hwxho1n.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error.message);
  });


// Generate mock data on server start
const generateMockData = async () => {
  try {
    // Clear existing data
    await Author.deleteMany({});
    await Book.deleteMany({});

    // Generate authors
    const authors = Array.from({ length: 5 }, () => ({
      name: faker.name.findName(),
      email: faker.internet.email(),
      phone_no: faker.phone.phoneNumber(),
    }));

    const createdAuthors = await Author.create(authors);

    // Generate books
    const books = Array.from({ length: 15 }, () => ({
      title: faker.lorem.words(faker.random.number({ min: 1, max: 3 })),
      likes: faker.random.number({ min: 0, max: 100 }),
      author: faker.random.arrayElement(createdAuthors)._id,
    }));

    await Book.create(books);

    console.log('Mock data generated successfully!');
  } catch (error) {
    console.error('Error generating mock data:', error.message);
  }
};

generateMockData();

// Authentication middleware
app.use(authenticationMiddleware);

// Auth APIs
app.post('/register', registerAuthor);
app.post('/login', loginAuthor);
app.get('/authors', getAllAuthors);
app.get('/authors/:id', getAuthorById);
app.get('/authors/me', getLoggedInAuthor);

// Book APIs
app.get('/books', getAllBooks);
app.put('/books/like/:id', likeBook);
app.put('/books/unlike/:id', unlikeBook);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
