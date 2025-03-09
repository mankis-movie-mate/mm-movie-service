const { logger_level } = require('../config/config');
const winston = require('winston');
const { combine, timestamp, colorize, align, printf } = winston.format;

const logFormat = printf(({ level, message, topic, timestamp }) => {
  const t = topic ? `[${topic}]` : '[ ]';
  return `[${timestamp}] ${t} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: logger_level,
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize({ all: true }), logFormat),
    }),
  ],
});

logger.setTopic = (topic) => {
  return {
    info: (message) => logger.info({ message, topic }),
    warn: (message) => logger.warn({ message, topic }),
    error: (message) => logger.error({ message, topic }),
    debug: (message) => logger.debug({ message, topic }),
  };
};

module.exports = logger;
