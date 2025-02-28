const Movie = require('../model/Movie');
const logger = require('../middleware/logger');

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    logger.info('Getting all movies');
    res.status(200).json(movies);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Internal error', error });
  }
};
