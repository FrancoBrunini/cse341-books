import { getDb } from '../db/connect.js';

const authorExists = async (authorId) => {
  const db = getDb();
  const author = await db.collection('authors').findOne({ id: authorId });
  return Boolean(author);
};

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({}).toArray();
  return books;
};

const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id: bookId });
  return book;
};
const createBook = async (bookData) => {
  const db = getDb();
  const result = await db.collection('books').insertOne(bookData);
  return { _id: result.insertedId, ...bookData };
};

const updateBook = async (id, updatedData) => {
  const db = getDb();
  const { id: bodyId, ...fieldsToUpdate } = updatedData;

  return await db.collection('books').findOneAndUpdate(
    { id },
    { $set: fieldsToUpdate },
    { returnDocument: 'after' }
  );
};

const deleteBook = async (id) => {
  const db = getDb();
  const result = await db.collection('books').deleteOne({ id });
  return result.deletedCount > 0;
};

export {
  authorExists,
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};


