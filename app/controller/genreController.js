const Genre = require('../model/Genre');
const logger = require('../middleware/logger');

exports.getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    logger.info('Getting all genres');
    res.status(200).json(genres);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Internal error', error });
  }
};

exports.saveGenre = async (req, res) => {
  try {
    const { name } = req.body;
    const newGenre = new Genre({
      name,
    });

    await newGenre.save();
    res.status(201).json({
      message: `Genre ${name} created successfully!`,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: 'Error creating genre',
      error: error.message,
    });
  }
};
