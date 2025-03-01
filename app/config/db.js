const mongoose = require('mongoose');
const { mongo_uri } = require('../config/config');
const logger = require('../middleware/logger');

mongoose
  .connect(mongo_uri)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error);
  });
