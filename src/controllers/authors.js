import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorInDb,
  updateAuthor as updateAuthorInDb,
  deleteAuthor as deleteAuthorInDb
} from '../models/authors.js';

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve authors.' });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await getAuthorByIdFromDb(id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }
    return res.status(200).json(author);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve author.' });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { id, name, birthYear, nationality } = req.body;

    if (!id || !name || birthYear === undefined || !nationality) {
      return res.status(400).json({ message: 'Missing required fields: id, name, birthYear, nationality.' });
    }

    const currentYear = new Date().getFullYear();
    if (!Number.isInteger(birthYear) || birthYear < 0 || birthYear > currentYear) {
      return res.status(400).json({ message: `birthYear must be a valid integer less than or equal to ${currentYear}.` });
    }

    const existingAuthor = await getAuthorByIdFromDb(id);
    if (existingAuthor) {
      return res.status(400).json({ message: `Author with id '${id}' already exists.` });
    }

    const newAuthor = await createAuthorInDb({ id, name, birthYear, nationality });
    return res.status(201).json(newAuthor);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create author.' });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, birthYear, nationality } = req.body;

    if (!name || birthYear === undefined || !nationality) {
      return res.status(400).json({ message: 'Missing required fields: name, birthYear, nationality.' });
    }

    const currentYear = new Date().getFullYear();
    if (!Number.isInteger(birthYear) || birthYear < 0 || birthYear > currentYear) {
      return res.status(400).json({ message: `birthYear must be a valid integer less than or equal to ${currentYear}.` });
    }

    const existingAuthor = await getAuthorByIdFromDb(id);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    const updatedAuthor = await updateAuthorInDb(id, { name, birthYear, nationality });
    return res.status(200).json(updatedAuthor);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update author.' });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const existingAuthor = await getAuthorByIdFromDb(id);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    await deleteAuthorInDb(id);
    return res.status(204).send();
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Unable to delete author.' });
  }
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};