const os = require('os');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

function getInternalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const isProd = process.env.NODE_ENV === 'production';

const host = isProd
  ? getInternalIPAddress()
  : process.env.MOVIE_MATE_MOVIE_SERVICE_HOST || 'localhost';

module.exports = {
  host,
  port: process.env.MOVIE_MATE_MOVIE_SERVICE_PORT || '3000',
  mongo_uri: process.env.MOVIE_MATE_MOVIE_SERVICE_MONGO_URI,
  ds_host: process.env.MOVIE_MATE_DISCOVERY_SERVER_HOST || 'localhost',
  ds_port: process.env.MOVIE_MATE_DISCOVERY_SERVER_PORT || '8500',
  logger_level: process.env.MOVIE_MATE_MOVIE_SERVICE_LOGGER_LEVEL || 'info',
  base_url: process.env.MOVIE_MATE_MOVIE_SERVICE_BASE_URL,
};
