const { logger_level } = require('../config/config');
const winston = require('winston');
const { combine, timestamp, colorize, align, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: logger_level,
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    logFormat
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
