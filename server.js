const app = require('./app');
const { port, base_url, host } = require('./app/config/config');
const Consul = require('./app/config/consul');
require('./app/config/db.js');
const logger = require('./app/middleware/logger');

const consul = new Consul(logger);

const server = app.listen(port, async () => {
  logger.info(`Server started at: http://${host}:${port}${base_url}`);
  logger.info(
    `API documentation at: http://${host}:${port}${base_url}/docs/swagger`
  );
  await consul.register();
});

const shutdown = async () => {
  logger.info('[APP] Shutting down...');
  await consul.deregister();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
