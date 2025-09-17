const mongoose = require('mongoose');
const logger = require('../middleware/logger');
const NotFoundError = require('../error/NotFoundError');
const InvalidInputError = require('../error/InvalidInputError');
const Genre = require('../model/Genre');
const Movie = require('../model/Movie');
const DuplicateError = require('../error/DuplicateError');
const tmdbService = require('./tmdbService');

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
  try {
    const movie = await Movie.findById({ _id: id });
    if (!movie) {
      return await getTmdbMovieExistsById(id);
    }
    return movie;
  } catch (error) {
    return await getTmdbMovieExistsById(id);
  }
};

const getTmdbMovieExistsById = async (id) => {
  movieLogger.warn(
    `Movie with id ${id} not found in movie service. Trying to fetch from TMDB...`
  );
  return await tmdbService.getMovieById(id);
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

  const movies = await Promise.all(ids.map((id) => getMovieById(id)));
  return movies;
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

exports.getMovieIdsByGenres = async (genres) => {
  if (!Array.isArray(genres) || genres.length === 0) {
    throw new InvalidInputError(
      'Genres should be an array and cannot be empty.'
    );
  }
  try {
    const movies = await Movie.find({ genres: { $in: genres } }).select('_id');
    return movies.map((m) => m._id);
  } catch (error) {
    throw new Error(`Failed to retrieve movie ids by genres ${genres}`);
  }
};

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

const getTop5ByUserRatings = async () => {
  try {
    const topMovies = await Movie.find()
      .sort({ 'rating.average': -1 })
      .limit(5)
      .lean();
    return topMovies;
  } catch (error) {
    movieLogger.error(
      `Failed to get top 5 movies by user ratings. ${error.message}`
    );
    throw new Error(`Failed to get top 5 movies by user ratings.`);
  }
};

const getTop5ByTopGenres = async () => {
  const topGenresAgg = await getTopGenres();

  const topGenreIds = topGenresAgg.map((g) => g._id);
  const movies = await Movie.find({ genres: { $in: topGenreIds } })
    .sort({ 'rating.average': -1 })
    .limit(5)
    .lean();

  return movies;
};

exports.getTop5By = async (type) => {
  switch (type) {
    case 'ratings':
      return await getTop5ByUserRatings();
    case 'genres':
      return await getTop5ByTopGenres();
    case 'third-party':
      return await tmdbService.getTop5Movies();
  }
};


exports.searchMovies = async (query, opts = {}) => {
    if (typeof query !== 'string' || query.trim().length < 2) {
        throw new Error('Query must be at least 2 characters.');
    }

    const q = query.trim();
    const page = Number(opts.page) || 1;
    const limit = Number(opts.limit) || 20;

    // Case-insensitive regex search on title and synopsis
    const rx = new RegExp(q, 'i');
    const filter = { $or: [{ title: rx }, { synopsis: rx }] };

    const [dbResults, total] = await Promise.all([
        Movie.find(filter)
            .sort({ 'rating.average': -1, title: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        Movie.countDocuments(filter),
    ]);

    if (total > 0) {
        const totalPages = Math.ceil(total / limit);
        return {
            elements: dbResults,
            pageNo: page,
            pageSize: limit,
            totalElements: total,
            totalPages: totalPages,
            isLast: page >= totalPages,
            source: 'db'
        };
    }

    // Fallback to TMDB with clean opts
    movieLogger.info(`[searchMovies] No local results for "${q}", searching TMDB...`);

    // Always sanitize opts for TMDB!
    const tmdbOpts = {
        ...opts,
        page,    // ensure it's an integer, not string!
        limit    // pass limit as well, if your TMDB service slices the results
    };

    return await tmdbService.searchMovies(q, tmdbOpts);
};