import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
  const db = getDb();
  return await db.collection('authors').find({}).toArray();
};

const getAuthorById = async (id) => {
  const db = getDb();
  return await db.collection('authors').findOne({ id });
};

const createAuthor = async (authorData) => {
  const db = getDb();
  const result = await db.collection('authors').insertOne(authorData);
  return { _id: result.insertedId, ...authorData };
};

const updateAuthor = async (id, updatedData) => {
  const db = getDb();
  const { id: bodyId, ...fieldsToUpdate } = updatedData;

  return await db.collection('authors').findOneAndUpdate(
    { id },
    { $set: fieldsToUpdate },
    { returnDocument: 'after' }
  );
};

const authorHasBooks = async (id) => {
  const db = getDb();
  const count = await db.collection('books').countDocuments({ authorId: id });
  return count > 0;
};

const deleteAuthor = async (id) => {
  const db = getDb();
  const result = await db.collection('authors').deleteOne({ id });
  return result.deletedCount > 0;
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  authorHasBooks,
  deleteAuthor
};