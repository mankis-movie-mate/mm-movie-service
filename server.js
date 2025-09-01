const app = require('./app');
const { port, base_url, host } = require('./app/config/config');
require('./app/config/db.js');
const logger = require('./app/middleware/logger');

app.listen(port, () => {
  logger.info(`Server started at: http://${host}:${port}${base_url}`);
  logger.info(
    `API documentation at: http://${host}:${port}${base_url}/docs`
  );
});
