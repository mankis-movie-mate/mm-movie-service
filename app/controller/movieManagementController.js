const logger = require('../middleware/logger');
const movieService = require('../service/movieSerivce');
const mmLogger = logger.setTopic('MOVIE_MANAGEMENT_CONTROLLER');

exports.bulkSaveGenres = async (req, res, next) => {
  mmLogger.info('Genre bulk saving...');
  try {
    const { genres } = req.body;
    const savedGenres = await movieService.bulkSaveGenres(genres);
    res.status(201).json(savedGenres);
  } catch (error) {
    next(error);
  }
};

exports.deleteGenre = async (req, res, next) => {
  const { id } = req.params;
  mmLogger.info(`Deleting genre with id ${id}.`);
  try {
    await movieService.deleteGenre(id);
    res.status(200).json({
      message: `Successully deleted genre with id ${id}.`,
    });
  } catch (error) {
    next(error);
  }
};

exports.bulkSaveMovies = async (req, res, next) => {
  mmLogger.info('Movies bulk saving...');
  try {
    const { movies } = req.body;
    const savedMovies = await movieService.bulkSaveMovies(movies);
    res.status(201).json(savedMovies);
  } catch (error) {
    next(error);
  }
};

exports.updateMovie = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;
  mmLogger.info(`Updating movie with id ${id}`);
  try {
    const updatedMovie = await movieService.updateMovie(id, updateData);
    res.status(200).json(updatedMovie);
  } catch (error) {
    next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  const { id } = req.params;
  mmLogger.info(`Deleting movie with id ${id}.`);
  try {
    await movieService.deleteMovie(id);
    res.status(200).json({
      message: `Successully deleted movie with id ${id}.`,
    });
  } catch (error) {
    next(error);
  }
};
