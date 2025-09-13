const Movie = require('../model/Movie');
const logger = require('../middleware/logger');
const movieService = require('../service/movieSerivce');
const movieLogger = logger.setTopic('MOVIE_CONTROLLER');

exports.getAllGenres = async (req, res, next) => {
  movieLogger.info('Getting all genres');
  try {
    const genres = await movieService.getAllGenres();
    res.status(200).json(genres);
  } catch (error) {
    next(error);
  }
};

exports.getTopGenres = async (req, res, next) => {
  movieLogger.info('Getting top genres');
  try {
    const top = await movieService.getTopGenres();
    res.status(200).json(top);
  } catch (error) {
    next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  const { id } = req.params;
  movieLogger.info(`Getting movie by id ${id}`);
  try {
    const movie = await movieService.getMovieById(id);
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

exports.getMoviesByIds = async (req, res, next) => {
  const { ids } = req.body;
  movieLogger.info(`Getting movie by ids ${JSON.stringify(ids)}`);
  try {
    const movies = await movieService.getMoviesByIds(ids);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

exports.getMovieIdsByGenres = async (req, res, next) => {
  try {
    const { genres } = req.body;
    movieLogger.info(`Getting movie ids by genres=[${genres}]`);
    const ids = await movieService.getMovieIdsByGenres(genres);
    res.status(200).json(ids);
  } catch (error) {
    next(error);
  }
};

exports.getAllMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.size) || 10;
    const sortBy = req.query.sortBy || 'title';
    const order = req.query.order || 'ASC';
    movieLogger.info(
      `Getting all movies with query params: page=${page}&size=${limit}&sortBy=${sortBy}&order=${order}`
    );

    const movies = await movieService.getAllMovies(page, limit, sortBy, order);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

exports.getTop5By = async (req, res, next) => {
  const { type } = req.params;
  const allowedTypes = ['ratings', 'genres', 'third-party'];
  const normalizedType = type.trim().toLowerCase();

  if (!allowedTypes.includes(normalizedType)) {
    return res.status(400).json({
      message: `Invalid type parameter. It must be one of: ${allowedTypes.join(', ')}.`,
    });
  }

  movieLogger.info(`Getting top 5 movies by ${normalizedType}`);
  try {
    const topMovies = await movieService.getTop5By(normalizedType);
    res.status(200).json(topMovies);
  } catch (error) {
    next(error);
  }
};