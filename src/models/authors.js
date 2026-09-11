import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
  const db = getDb();
  const collection = db.collection('authors');
  const authors = await collection.find({}).toArray();

  return authors;
};

const getAuthorById = async (authorId) => {
  const db = getDb();
  const collection = db.collection('author');
  const author = await collection.findOne({ id: authorId });
  return author;
};

const createAuthor = async (authorData) => {
  const db = getDb();
  const collection = db.collection('authors');
  const result = await collection.insertOne(authorData);
  return { _id: result.insertedId, ...authorData };
};

const updateAuthor = async (id, updatedData) => {
  const db = getDb();
  const collection = db.collection('authors');
  
  const { id: bodyId, ...fieldsToUpdate } = updatedData;

  const result = await collection.findOneAndUpdate(
    { id },
    { $set: fieldsToUpdate },
    { returnDocument: 'after' }
  );
  return result;
};

const deleteAuthor = async (id) => {
  const db = getDb();
  
  const booksCollection = db.collection('books');
  const linkedBooksCount = await booksCollection.countDocuments({ authorId: id });
  
  if (linkedBooksCount > 0) {
    const error = new Error('Cannot delete author linked to existing books. Remove or reassign books first.');
    error.statusCode = 400;
    throw error;
  }

  const authorsCollection = db.collection('authors');
  const result = await authorsCollection.deleteOne({ id });
  return result.deletedCount > 0;
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};