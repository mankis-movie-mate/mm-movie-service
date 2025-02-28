const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  port: process.env.PORT || '3000',
  mongo_uri: process.env.MONGO_URI,
  logger_level: process.env.LOGGER_LEVEL || 'info',
  base_url: process.env.BASE_URL,
};
