const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  port: process.env.MOVIE_MATE_MOVIE_SERVICE_PORT || '3000',
  mongo_uri: process.env.MOVIE_MATE_MOVIE_SERVICE_MONGO_URI,
  logger_level: process.env.MOVIE_MATE_MOVIE_SERVICE_LOGGER_LEVEL || 'info',
  base_url: process.env.MOVIE_MATE_MOVIE_SERVICE_BASE_URL,
};
