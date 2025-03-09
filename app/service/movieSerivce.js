const mongoose = require('mongoose');
const logger = require('../middleware/logger');
const NotFoundError = require('../error/NotFoundError');
const InvalidInputError = require('../error/InvalidInputError');
const Genre = require('../model/Genre');
const Movie = require('../model/Movie');
const DuplicateError = require('../error/DuplicateError');
const movieLogger = logger.setTopic('MOVIE_SERVICE');

const getGenreById = async (id) => {
  const genre = await Genre.findById({ _id: id });
  if (!genre) {
    movieLogger.error(`Genre with id ${id} not found.`);
    throw new NotFoundError(`Genre with id ${id} not found.`);
  }

  return genre;
};

const getMovieById = async (id) => {
  const movie = await Movie.findById({ _id: id });
  if (!movie) {
    movieLogger.error(`Movie with id ${id} not found.`);
    throw new NotFoundError(`Movie with id ${id} not found.`);
  }

  return movie;
};

const isMovieExistsByTitle = async (title) => {
  const movie = await Movie.findOne({ title });
  return movie !== null;
};

exports.bulkSaveGenres = async (genres) => {
  if (!Array.isArray(genres) || genres.length === 0) {
    movieLogger.error('The genres list cannot be null.');
    throw new InvalidInputError('The genres list cannot be null.');
  }

  const existingGenres = await Genre.find({
    name: { $in: genres.map((g) => g.name) },
  })
    .select('name')
    .lean();
  const existingGenreNames = new Set(existingGenres.map((g) => g.name));

  const genresToSave = genres
    .filter((d) => {
      if (existingGenreNames.has(d.name)) {
        movieLogger.warn(
          `Genre with name '${d.name}' already exists. Skipping...`
        );
        return false;
      }
      return true;
    })
    .map((d) => ({
      _id: d.name.toLowerCase().replace(/\s+/g, '-'),
      name: d.name,
    }));

  const savedGenres = await Genre.insertMany(genresToSave);
  return savedGenres;
};

exports.getAllGenres = async () => {
  const genres = Genre.find().sort({ name: 1 });
  return genres;
};

exports.getTopGenres = async () => {
  return await Movie.aggregate([
    { $unwind: '$genres' },
    {
      $group: {
        _id: '$genres',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $project: { _id: 1 } },
  ]);
};

exports.deleteGenre = async (id) => {
  const genre = await getGenreById(id);
  const { deletedCount } = await Genre.deleteOne({ _id: genre._id });

  if (deletedCount === 1) {
    await Movie.updateMany(
      { genres: genre._id },
      { $pull: { genres: genre._id } }
    );
  } else {
    movieLogger.error(`Failed to delete the genre '${id}.'`);
    throw new Error(`Failed to delete the genre '${id}'.`);
  }
};

exports.bulkSaveMovies = async (movies) => {
  if (!Array.isArray(movies) || movies.length === 0) {
    movieLogger.error('The movies list cannot be null.');
    throw new InvalidInputError('The movies list cannot be null.');
  }

  const existingMovies = await Movie.find({
    title: { $in: movies.map((m) => m.title) },
  })
    .select('title')
    .lean();
  const existingTitles = new Set(existingMovies.map((m) => m.title));

  const moviesToSave = movies.filter((d) => {
    if (existingTitles.has(d.title)) {
      movieLogger.warn(
        `Movie with title '${d.title}' already exists. Skipping...`
      );
      return false;
    }
    return true;
  });

  const savedMovies = await Movie.insertMany(moviesToSave);
  return savedMovies;
};

exports.getMovieById = async (id) => {
  return await getMovieById(id);
};

exports.getMoviesByIds = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new InvalidInputError(
      'The list of movie IDs must be a non-empty array.'
    );
  }
  const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

  return await Movie.find({ _id: { $in: objectIds } }).lean();
};

exports.updateMovie = async (id, updateData) => {
  const movie = await getMovieById(id);
  if (updateData.title && (await isMovieExistsByTitle(updateData.title))) {
    throw new DuplicateError(
      `Movie with title '${updateData.title}' already exists.`
    );
  }

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return updatedMovie;
  } catch (error) {
    movieLogger.error(
      `Failed to update the movie with id ${id}. ${error.message}`
    );
    throw new Error(`Failed to update the movie with id ${id}`);
  }
};

exports.getMovieIdsByGenres = async (genres) => {};

exports.deleteMovie = async (id) => {
  const { deletedCount } = await Movie.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  if (deletedCount !== 1) {
    movieLogger.error(`Failed to delete the movie '${id}.'`);
    throw new Error(`Failed to delete the movie '${id}'.`);
  }
};

exports.getAllMovies = async (
  page = 1,
  limit = 10,
  sortBy = 'title',
  order = 'ASC'
) => {
  const o = order === 'ASC' ? 1 : -1;

  const skip = (page - 1) * limit;
  const movies = await Movie.find()
    .sort({ [sortBy]: o })
    .skip(skip)
    .limit(limit);
  const total = await Movie.countDocuments();
  const totalPages = Math.ceil(total / limit);
  const isLast = page >= totalPages;

  return {
    elements: movies,
    pageNo: page,
    pageSize: limit,
    totalElements: total,
    totalPages: totalPages,
    isLast: isLast,
  };
};
