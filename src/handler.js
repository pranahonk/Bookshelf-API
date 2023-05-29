// const {nanoid} = require('nanoid');
// const books = require('./books.json');
const fs = require('fs');
const path = require('path');


const showAllBook = (request, h) => {
  const filePath = path.join(__dirname, 'books.json');

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const books = JSON.parse(data);

    const allBooks = books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books: allBooks,
      },
    });
    response.statusCode = 200;
    return response;
  } catch (error) {
    // Handle any errors that occur during file reading or parsing
    console.error('Error reading books.json:', error);

    const response = h.response({
      status: 'error',
      message: 'Failed to retrieve books.',
    });
    response.statusCode = 500;
    return response;
  }
};

const getBookById = async ({params}, h) => {
  const {id} = params;
  const filePath = path.join(__dirname, 'books.json');

  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const books = JSON.parse(data);

    const book = books.find((book) => book.id.toString() === id);

    if (book === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Book not found',
      });
      response.statusCode = 404;
      return response;
    } else {
      const response = h.response({
        status: 'success',
        data: {book},
      });
      response.statusCode = 200;
      return response;
    }
  } catch (error) {
    // Handle any errors that occur during file reading or parsing
    console.error('Error reading books.json:', error);

    const response = h.response({
      status: 'error',
      message: 'Failed to retrieve book.',
    });
    response.statusCode = 500;
    return response;
  }
};


const postNewBook = async ({payload}, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = payload;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (typeof name === 'undefined') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.statusCode = 400;
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.statusCode = 400;
    return response;
  }

  try {
    const filePath = path.join(__dirname, 'books.json');
    const data = await fs.promises.readFile(filePath, 'utf8');
    const books = JSON.parse(data);
    const id = parseInt(books[books.length - 1]?.id) + 1;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };
    books.push(newBook);
    const updatedData = JSON.stringify(books, null, 2);

    fs.writeFileSync(filePath, updatedData, 'utf8');

    const response = h.response({
      status: 'success',
      message: 'Book successfully added',
      data: {
        bookId: newBook.id,
      },
    });
    response.statusCode = 201;
    return response;
  } catch (error) {
    console.error('Error adding book:', error);

    const response = h.response({
      status: 'error',
      message: 'Book failed added',
    });
    response.statusCode = 500;
    return response;
  }
};

const editBookById = async ({payload, params}, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = payload;
  const {id} = params;
  const updatedAt = new Date().toISOString();
  const filePath = path.join(__dirname, 'books.json');
  const data = await fs.promises.readFile(filePath, 'utf8');
  const books = JSON.parse(data);
  const bookIndex = books.findIndex((book) => book.id === parseInt(id));
  const finished = pageCount === readPage;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Fail to update the books, fill the name',
    });
    response.statusCode = 400;
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Fail to update the books, cannot have more read pages than the total page count',
    });
    response.statusCode = 400;
    return response;
  } else if (bookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Fail to update the books, book not found',
    });
    response.statusCode = 404;
    return response;
  }

  try {
    if (bookIndex !== -1) {
      books[bookIndex] = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
        finished,
      };

      const filePath = path.join(__dirname, 'books.json');
      const updatedData = JSON.stringify(books, null, 2);

      fs.writeFileSync(filePath, updatedData, 'utf8');

      const response = h.response({
        status: 'success',
        message: 'Book updated!',
      });
      response.statusCode = 200;
      return response;
    } else {
      const response = h.response({
        status: 'fail',
        message: 'Fail to update the books, id not found',
      });
      response.statusCode = 404;
      return response;
    }
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Failed to update the book',
    });
    response.statusCode = 500;
    return response;
  }
};


const deleteBookById = async ({params}, h) => {
  const {id} = params;
  const filePath = path.join(__dirname, 'books.json');
  const data = await fs.promises.readFile(filePath, 'utf8');
  const books = JSON.parse(data);
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Fail to remove book, id not found',
    });
    response.statusCode = 404;
    return response;
  }

  try {
    books.splice(bookIndex, 1);
    const filePath = path.join(__dirname, 'books.json');
    const updatedData = JSON.stringify(books, null, 2);

    fs.writeFileSync(filePath, updatedData, 'utf8');

    const response = h.response({
      status: 'success',
      message: 'Successfully removed book',
    });
    response.statusCode = 200;
    return response;
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Failed to remove the book',
    });
    response.statusCode = 500;
    return response;
  }
};

module.exports = {
  postNewBook,
  showAllBook,
  getBookById,
  editBookById,
  deleteBookById,
};
