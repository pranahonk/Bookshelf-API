// const {nanoid} = require('nanoid');
// const books = require('./books.json');
// const fs = require('fs');
// const path = require('path');
const books = require('./database');

const showAllBook = (request, h) => {
  // const filePath = path.join(__dirname, 'books.json');

  try {
    // const data = fs.readFileSync(filePath, 'utf8');
    // const books = JSON.parse(data);

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
  // const filePath = path.join(__dirname, 'books.json');

  try {
    // const data = await fs.promises.readFile(filePath, 'utf8');
    // const books = JSON.parse(data);

    const book = books.find((book) => book.id.toString() === id);

    if (book === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
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
    // const filePath = path.join(__dirname, 'books.json');
    // const data = await fs.promises.readFile(filePath, 'utf8');
    // const books = JSON.parse(data);
    const id = parseInt((books[books.length - 1]?.id) ?? 0) + 1;

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
    // const updatedData = JSON.stringify(books, null, 2);
    //
    // fs.writeFileSync(filePath, updatedData, 'utf8');

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
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
  // const filePath = path.join(__dirname, 'books.json');
  // const data = await fs.promises.readFile(filePath, 'utf8');
  // const books = JSON.parse(data);
  const bookIndex = books.findIndex((book) => book.id === parseInt(id));
  const finished = pageCount === readPage;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.statusCode = 400;
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.statusCode = 400;
    return response;
  } else if (bookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
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

      // const filePath = path.join(__dirname, 'books.json');
      // const updatedData = JSON.stringify(books, null, 2);
      //
      // fs.writeFileSync(filePath, updatedData, 'utf8');

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.statusCode = 200;
      return response;
    } else {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.statusCode = 404;
      return response;
    }
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Gagal memperbarui buku',
    });
    response.statusCode = 500;
    return response;
  }
};


const deleteBookById = async ({params}, h) => {
  const {id} = params;
  // const filePath = path.join(__dirname, 'books.json');
  // const data = await fs.promises.readFile(filePath, 'utf8');
  // const books = JSON.parse(data);
  const bookIndex = books.findIndex((book) =>book.id === parseInt(id));

  if (bookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.statusCode = 404;
    return response;
  }

  try {
    books.splice(bookIndex, 1);
    // const filePath = path.join(__dirname, 'books.json');
    // const updatedData = JSON.stringify(books, null, 2);
    //
    // fs.writeFileSync(filePath, updatedData, 'utf8');

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.statusCode = 200;
    return response;
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Berhasil menghapus Buku',
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
